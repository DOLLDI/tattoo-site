import {
  PRESENTATION_POSTER_URL,
  PRESENTATION_VIDEO_URL,
  TOTAL_FRAMES,
  VIDEO_DURATION_SECONDS,
  VIDEO_FPS,
  clamp,
} from './timeline';

export interface FrameProvider {
  readonly id: string;
  isReady(): boolean;
  drawFrameAtTime(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeSeconds: number,
  ): boolean;
  dispose(): void;
}

export interface VideoControllerCallbacks {
  onReady?: () => void;
  onBufferProgress?: (bufferedRatio: number) => void;
  onError?: (message: string) => void;
}

export interface FrameValidationState {
  readyState: number;
  videoWidth: number;
  seeking: boolean;
  mediaTime: number;
  targetTime: number;
  hasDrawnFirstVideoFrame: boolean;
}

type VideoWithVfc = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (now: DOMHighResTimeStamp, metadata: { mediaTime: number }) => void,
  ) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * Pure guard preventing blank/unready video states or spurious frame-0 resets
 * when the browser flushes HTTP 206 range buffers during rapid scrubbing.
 */
export function canCommitVideoFrame(state: FrameValidationState): boolean {
  if (state.readyState < 2 || state.videoWidth <= 0 || state.seeking) {
    return false;
  }
  if (state.hasDrawnFirstVideoFrame && state.targetTime > 0.12 && state.mediaTime < 0.03) {
    return false;
  }
  if (!state.hasDrawnFirstVideoFrame && state.targetTime > 0.25 && state.mediaTime < 0.03) {
    return false;
  }
  return true;
}

/**
 * Computes object-cover draw rectangle so a 16:9 frame fills any viewport aspect cleanly.
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): void {
  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return;
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  let drawWidth = targetWidth;
  let drawHeight = targetHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (targetRatio > sourceRatio) {
    drawWidth = targetWidth;
    drawHeight = targetWidth / sourceRatio;
    offsetY = (targetHeight - drawHeight) / 2;
  } else {
    drawHeight = targetHeight;
    drawWidth = targetHeight * sourceRatio;
    offsetX = (targetWidth - drawWidth) / 2;
  }

  ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Scrub-optimized VideoController with flicker-free frame retention:
 * - Draws poster still ONLY before the first genuine video frame is decoded.
 * - Maintains an offscreen backup canvas so resize / seek stalls never flash frame 0 or black.
 * - Rejects spurious frame-0 readbacks if the browser temporarily drops readyState during HTTP 206 seeks.
 * - Background-preloads the MP4 into an in-memory Blob URL and swaps cleanly once ready so every
 *   frame in 0..2352 scrubs from RAM at readyState === 4 with zero network stalls.
 */
export class VideoScrubController {
  private video: VideoWithVfc;
  private sourceUrl: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private backupCanvas: HTMLCanvasElement | null;
  private backupCtx: CanvasRenderingContext2D | null;
  private callbacks: VideoControllerCallbacks;

  private posterImage: HTMLImageElement | null = null;
  private posterLoaded = false;
  private videoReady = false;
  private hasDrawnFirstVideoFrame = false;
  private hasCommittedBackupFrame = false;

  private targetTime = 0;
  private lastCommittedTime = -1;
  private lastPaintedMediaTime = -1;
  private pendingSeekTime: number | null = null;
  private externalProvider: FrameProvider | null = null;
  private destroyed = false;

  private vfcHandle: number | null = null;
  private abortController: AbortController | null = null;
  private blobPreloadStarted = false;
  private blobUrl: string | null = null;
  private standbyVideo: VideoWithVfc | null = null;

  private width = 1280;
  private height = 720;

  constructor(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    callbacks: VideoControllerCallbacks = {},
  ) {
    this.video = video as VideoWithVfc;
    this.sourceUrl =
      video.getAttribute('src') || video.currentSrc || PRESENTATION_VIDEO_URL;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.callbacks = callbacks;

    this.backupCanvas =
      typeof document !== 'undefined' ? document.createElement('canvas') : null;
    this.backupCtx =
      this.backupCanvas?.getContext('2d', { alpha: false }) ?? null;

    this.handleLoadedData = this.handleLoadedData.bind(this);
    this.handleCanPlay = this.handleCanPlay.bind(this);
    this.handleSeeked = this.handleSeeked.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleVideoFrame = this.handleVideoFrame.bind(this);
    this.resize = this.resize.bind(this);

    this.initPosterFallback();
    this.bindVideoEvents(this.video);
    this.resize();
  }

  public static isWebCodecsSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'VideoDecoder' in window &&
      'EncodedVideoChunk' in window
    );
  }

  public registerFrameProvider(provider: FrameProvider): void {
    this.externalProvider?.dispose();
    this.externalProvider = provider;
  }

  private initPosterFallback(): void {
    const img = new Image();
    img.src = PRESENTATION_POSTER_URL;
    img.onload = () => {
      if (this.destroyed) return;
      this.posterLoaded = true;
      if (!this.hasDrawnFirstVideoFrame && !this.hasCommittedBackupFrame) {
        this.paintPoster();
      }
    };
    this.posterImage = img;
  }

  private bindVideoEvents(target: VideoWithVfc): void {
    target.pause();
    target.muted = true;
    target.playsInline = true;
    target.preload = 'auto';

    target.addEventListener('loadeddata', this.handleLoadedData);
    target.addEventListener('canplay', this.handleCanPlay);
    target.addEventListener('seeked', this.handleSeeked);
    target.addEventListener('progress', this.handleProgress);
    target.addEventListener('error', this.handleError);

    this.scheduleVideoFrameCallback(target);

    if (target.readyState >= 2) {
      this.handleLoadedData();
    }
  }

  private unbindVideoEvents(target: VideoWithVfc): void {
    this.cancelVideoFrameCallback(target);
    target.removeEventListener('loadeddata', this.handleLoadedData);
    target.removeEventListener('canplay', this.handleCanPlay);
    target.removeEventListener('seeked', this.handleSeeked);
    target.removeEventListener('progress', this.handleProgress);
    target.removeEventListener('error', this.handleError);
  }

  private scheduleVideoFrameCallback(target: VideoWithVfc = this.video): void {
    if (this.destroyed || typeof target.requestVideoFrameCallback !== 'function') {
      return;
    }
    this.cancelVideoFrameCallback(target);
    this.vfcHandle = target.requestVideoFrameCallback((_now, metadata) => {
      this.vfcHandle = null;
      this.handleVideoFrame(metadata.mediaTime);
      if (!this.destroyed && target === this.video) {
        this.scheduleVideoFrameCallback(target);
      }
    });
  }

  private cancelVideoFrameCallback(target: VideoWithVfc = this.video): void {
    if (
      this.vfcHandle !== null &&
      typeof target.cancelVideoFrameCallback === 'function'
    ) {
      target.cancelVideoFrameCallback(this.vfcHandle);
    }
    this.vfcHandle = null;
  }

  private handleVideoFrame(mediaTime: number): void {
    if (this.destroyed) return;
    if (
      !canCommitVideoFrame({
        readyState: this.video.readyState,
        videoWidth: this.video.videoWidth,
        seeking: this.video.seeking,
        mediaTime,
        targetTime: this.targetTime,
        hasDrawnFirstVideoFrame: this.hasDrawnFirstVideoFrame,
      })
    ) {
      return;
    }

    if (
      this.hasCommittedBackupFrame &&
      Math.abs(mediaTime - this.lastPaintedMediaTime) < 0.004
    ) {
      return;
    }

    this.commitCurrentVideoFrame(mediaTime);
  }

  private handleLoadedData(): void {
    if (this.destroyed) return;
    this.videoReady = true;
    this.callbacks.onReady?.();
    this.handleProgress();
    this.startBackgroundBlobPreload();

    // Never draw frame 0 over the active canvas if the user has already scrubbed forward.
    if (this.targetTime > 0.04 || this.hasDrawnFirstVideoFrame) {
      if (Math.abs(this.targetTime - this.video.currentTime) > 0.02) {
        this.dispatchSeek(this.targetTime);
        return;
      }
    }

    this.paintVideoFrame();
  }

  private handleCanPlay(): void {
    if (this.destroyed) return;
    if (!this.videoReady) {
      this.videoReady = true;
      this.callbacks.onReady?.();
    }
    this.handleProgress();
  }

  private handleProgress(): void {
    if (this.destroyed) return;
    const duration = this.video.duration || VIDEO_DURATION_SECONDS;
    if (this.video.buffered.length > 0 && duration > 0) {
      let maxEnd = 0;
      for (let i = 0; i < this.video.buffered.length; i++) {
        maxEnd = Math.max(maxEnd, this.video.buffered.end(i));
      }
      this.callbacks.onBufferProgress?.(clamp(maxEnd / duration, 0, 1));
    }
  }

  private handleSeeked(): void {
    if (this.destroyed) return;

    const current = this.video.currentTime;
    const valid = canCommitVideoFrame({
      readyState: this.video.readyState,
      videoWidth: this.video.videoWidth,
      seeking: this.video.seeking,
      mediaTime: current,
      targetTime: this.targetTime,
      hasDrawnFirstVideoFrame: this.hasDrawnFirstVideoFrame,
    });

    if (valid) {
      this.commitCurrentVideoFrame(current);
    } else if (
      this.targetTime > 0.12 &&
      current < 0.03 &&
      this.video.readyState >= 2 &&
      !this.video.seeking
    ) {
      // Browser reset stream position to 0 during unbuffered seek; re-seek to targetTime without drawing frame 0.
      this.pendingSeekTime = this.targetTime;
    }

    if (this.pendingSeekTime !== null) {
      const nextTime = this.pendingSeekTime;
      this.pendingSeekTime = null;
      if (Math.abs(nextTime - this.lastCommittedTime) >= 1 / VIDEO_FPS / 2) {
        this.dispatchSeek(nextTime);
      }
    }
  }

  private handleError(): void {
    if (this.destroyed) return;
    if (!this.hasDrawnFirstVideoFrame && !this.hasCommittedBackupFrame) {
      this.paintPoster();
    } else {
      this.paintFromBackup();
    }
    this.callbacks.onError?.(
      'Видеофайл недоступен или ещё загружается. Показан резервный кадр сцены.',
    );
  }

  private async startBackgroundBlobPreload(): Promise<void> {
    if (
      this.blobPreloadStarted ||
      this.destroyed ||
      typeof fetch !== 'function' ||
      typeof URL === 'undefined' ||
      typeof URL.createObjectURL !== 'function'
    ) {
      return;
    }
    this.blobPreloadStarted = true;
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.sourceUrl, {
        signal: this.abortController.signal,
      });
      if (!response.ok || this.destroyed) return;

      const contentLength = Number(response.headers.get('content-length') || 0);
      let blob: Blob;

      if (response.body) {
        const reader = response.body.getReader();
        const chunks: BlobPart[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (this.destroyed) {
            await reader.cancel();
            return;
          }
          if (value) {
            chunks.push(value);
            received += value.byteLength;
            if (contentLength > 0) {
              this.callbacks.onBufferProgress?.(clamp(received / contentLength, 0, 1));
            }
          }
        }
        blob = new Blob(chunks, { type: 'video/mp4' });
      } else {
        blob = await response.blob();
      }

      if (this.destroyed) return;

      const objectUrl = URL.createObjectURL(blob);
      this.blobUrl = objectUrl;
      this.callbacks.onBufferProgress?.(1);

      const standby = document.createElement('video') as VideoWithVfc;
      standby.muted = true;
      standby.playsInline = true;
      standby.preload = 'auto';
      standby.src = objectUrl;
      this.standbyVideo = standby;

      const onStandbyLoaded = () => {
        if (this.destroyed || this.standbyVideo !== standby) return;
        const duration =
          Number.isFinite(standby.duration) && standby.duration > 0
            ? standby.duration
            : VIDEO_DURATION_SECONDS;
        const initialSeek = clamp(this.targetTime, 0, Math.max(0, duration - 0.017));

        const finalizeSwap = () => {
          standby.removeEventListener('seeked', finalizeSwap);
          if (this.destroyed || this.standbyVideo !== standby) return;

          this.unbindVideoEvents(this.video);
          this.video.pause();
          this.video = standby;
          this.standbyVideo = null;
          this.lastCommittedTime = standby.currentTime;
          this.bindVideoEvents(standby);

          if (Math.abs(this.targetTime - standby.currentTime) >= 1 / VIDEO_FPS / 2) {
            this.dispatchSeek(this.targetTime);
          }
        };

        if (initialSeek <= 0.02) {
          finalizeSwap();
        } else {
          standby.addEventListener('seeked', finalizeSwap, { once: true });
          standby.currentTime = initialSeek;
        }
      };

      standby.addEventListener('loadeddata', onStandbyLoaded, { once: true });
      standby.load();
    } catch {
      // If background preload is aborted or unavailable, keep using streaming <video> + backupCanvas.
    }
  }

  private paintPoster(): void {
    if (!this.ctx || !this.posterImage || !this.posterLoaded) return;
    // Never overwrite a genuine decoded video frame with the frame-0 poster.
    if (this.hasDrawnFirstVideoFrame || this.hasCommittedBackupFrame) return;

    drawCoverImage(
      this.ctx,
      this.posterImage,
      this.posterImage.naturalWidth || 1280,
      this.posterImage.naturalHeight || 720,
      this.width,
      this.height,
    );
  }

  private paintFromBackup(): boolean {
    if (!this.ctx || !this.backupCanvas || !this.hasCommittedBackupFrame) {
      return false;
    }
    drawCoverImage(
      this.ctx,
      this.backupCanvas,
      this.backupCanvas.width,
      this.backupCanvas.height,
      this.width,
      this.height,
    );
    return true;
  }

  private commitCurrentVideoFrame(mediaTime: number): void {
    if (!this.ctx) return;

    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    if (vw <= 0 || vh <= 0) return;

    if (this.backupCanvas && this.backupCtx) {
      if (this.backupCanvas.width !== vw || this.backupCanvas.height !== vh) {
        this.backupCanvas.width = vw;
        this.backupCanvas.height = vh;
      }
      this.backupCtx.drawImage(this.video, 0, 0, vw, vh);
      this.hasCommittedBackupFrame = true;
      drawCoverImage(this.ctx, this.backupCanvas, vw, vh, this.width, this.height);
    } else {
      drawCoverImage(this.ctx, this.video, vw, vh, this.width, this.height);
    }

    this.hasDrawnFirstVideoFrame = true;
    this.lastPaintedMediaTime = mediaTime;
  }

  private paintVideoFrame(): void {
    if (!this.ctx) return;

    if (this.externalProvider?.isReady()) {
      const ok = this.externalProvider.drawFrameAtTime(
        this.ctx,
        this.width,
        this.height,
        this.targetTime,
      );
      if (ok) {
        this.hasDrawnFirstVideoFrame = true;
        return;
      }
    }

    const current = this.video.currentTime;
    if (
      canCommitVideoFrame({
        readyState: this.video.readyState,
        videoWidth: this.video.videoWidth,
        seeking: this.video.seeking,
        mediaTime: current,
        targetTime: this.targetTime,
        hasDrawnFirstVideoFrame: this.hasDrawnFirstVideoFrame,
      })
    ) {
      this.commitCurrentVideoFrame(current);
      return;
    }

    // Preserve the last valid frame instead of ever falling back to frame-0 poster once playing.
    if (this.paintFromBackup()) {
      return;
    }

    if (!this.hasDrawnFirstVideoFrame && this.posterLoaded) {
      this.paintPoster();
    }
  }

  private dispatchSeek(seconds: number): void {
    const duration =
      Number.isFinite(this.video.duration) && this.video.duration > 0
        ? this.video.duration
        : VIDEO_DURATION_SECONDS;

    // Clamp slightly inside duration to avoid end-of-stream blank frame in some browsers
    const safeTime = clamp(seconds, 0, Math.max(0, duration - 0.017));

    if (this.video.seeking) {
      this.pendingSeekTime = safeTime;
      return;
    }

    this.lastCommittedTime = safeTime;
    try {
      this.video.currentTime = safeTime;
    } catch {
      // Ignore transient InvalidStateError if media metadata resets
    }
  }

  public setProgress(progress: number): number {
    const clamped = clamp(progress, 0, 1);
    const frame = Math.round(clamped * TOTAL_FRAMES);
    const exactTime = (frame / TOTAL_FRAMES) * VIDEO_DURATION_SECONDS;
    this.targetTime = exactTime;

    if (this.externalProvider?.isReady() && this.ctx) {
      this.externalProvider.drawFrameAtTime(this.ctx, this.width, this.height, exactTime);
      return frame;
    }

    if (!this.videoReady) {
      return frame;
    }

    // Half-frame threshold prevents redundant seeks when scroll settles
    if (Math.abs(exactTime - this.lastCommittedTime) >= 1 / VIDEO_FPS / 2) {
      this.dispatchSeek(exactTime);
    }

    return frame;
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const nextW = Math.max(1, Math.round((rect.width || window.innerWidth) * dpr));
    const nextH = Math.max(1, Math.round((rect.height || window.innerHeight) * dpr));

    if (this.canvas.width !== nextW || this.canvas.height !== nextH) {
      this.canvas.width = nextW;
      this.canvas.height = nextH;
      this.width = nextW;
      this.height = nextH;

      // Immediately restore backup frame first so clearing canvas dimensions never flickers
      if (!this.paintFromBackup()) {
        this.paintVideoFrame();
      }
    }
  }

  public dispose(): void {
    this.destroyed = true;
    this.abortController?.abort();
    this.abortController = null;
    this.unbindVideoEvents(this.video);

    if (this.standbyVideo) {
      this.standbyVideo.pause();
      this.standbyVideo.removeAttribute('src');
      this.standbyVideo.load();
      this.standbyVideo = null;
    }

    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }

    this.externalProvider?.dispose();
    this.externalProvider = null;
    this.posterImage = null;
    this.backupCanvas = null;
    this.backupCtx = null;
  }
}
