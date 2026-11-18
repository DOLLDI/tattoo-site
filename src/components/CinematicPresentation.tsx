import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import {
  PRESENTATION_SCENES,
  PRESENTATION_VIDEO_URL,
  TOTAL_FRAMES,
  getActiveSceneIndex,
  getSceneStatesAtFrame,
  getSceneTargetProgress,
  progressToFrame,
  type SceneId,
} from '../engine/timeline';
import { VideoScrubController } from '../engine/videoController';

gsap.registerPlugin(ScrollTrigger);

interface CinematicPresentationProps {
  onBookSession: () => void;
  onExplorePortfolio: () => void;
  onSkipToStudio: () => void;
  onScrollToY: (y: number) => void;
  onPastHeroChange: (isPast: boolean) => void;
}

export function CinematicPresentation({
  onBookSession,
  onExplorePortfolio,
  onSkipToStudio,
  onScrollToY,
  onPastHeroChange,
}: CinematicPresentationProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const frameCounterRef = useRef<HTMLSpanElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [bufferRatio, setBufferRatio] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);

  const activeSceneIdxRef = useRef(0);
  const onPastHeroRef = useRef(onPastHeroChange);
  onPastHeroRef.current = onPastHeroChange;

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const stageEl = stageRef.current;
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;
    if (!triggerEl || !stageEl || !videoEl || !canvasEl) return;

    const videoController = new VideoScrubController(videoEl, canvasEl, {
      onReady: () => setVideoReady(true),
      onBufferProgress: (ratio) => setBufferRatio(ratio),
      onError: (msg) => setVideoError(msg),
    });

    const applySceneVisuals = (progress: number) => {
      const currentFrame = progressToFrame(progress);
      videoController.setProgress(progress);

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      if (frameCounterRef.current) {
        const padded = String(Math.round(currentFrame)).padStart(4, '0');
        frameCounterRef.current.textContent = `${padded} / ${TOTAL_FRAMES}`;
      }

      const states = getSceneStatesAtFrame(currentFrame);
      for (let i = 0; i < states.length; i++) {
        const el = sceneRefs.current[i];
        if (!el) continue;
        const st = states[i];
        el.style.opacity = String(st.opacity);
        el.style.transform = `translate3d(0, ${st.translateY.toFixed(2)}px, 0) scale(${st.scale.toFixed(4)})`;
        el.style.pointerEvents = st.opacity > 0.35 ? 'auto' : 'none';
        el.style.visibility = st.opacity > 0.01 ? 'visible' : 'hidden';
      }

      const nextActive = getActiveSceneIndex(currentFrame);
      if (nextActive !== activeSceneIdxRef.current) {
        activeSceneIdxRef.current = nextActive;
        setActiveSceneIdx(nextActive);
      }
    };

    // Initialize frame 0 immediately
    applySceneVisuals(0);

    const isMobile = window.innerWidth < 768;
    const scrollDistance = isMobile ? 5400 : 7800;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: stageEl,
        pinSpacing: true,
        scrub: 0.12,
        anticipatePin: 1,
        onUpdate: (self) => {
          applySceneVisuals(self.progress);
        },
        onLeave: () => {
          onPastHeroRef.current(true);
        },
        onEnterBack: () => {
          onPastHeroRef.current(false);
        },
      });
      scrollTriggerRef.current = st;
    }, triggerRef);

    const handleResize = () => {
      videoController.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollTriggerRef.current = null;
      ctx.revert();
      videoController.dispose();
    };
  }, []);

  const jumpToScene = (sceneId: SceneId) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const p = getSceneTargetProgress(sceneId);
    const targetScrollY = st.start + (st.end - st.start) * p;
    onScrollToY(targetScrollY);
  };

  return (
    <section
      id="presentation"
      ref={triggerRef}
      aria-label="Кинематографическая презентация студии"
      className="relative w-full bg-[#050506]"
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-[#050506]"
        data-testid="presentation-stage"
        data-active-scene={PRESENTATION_SCENES[activeSceneIdx]?.id}
      >
        {/* Backing hidden HTML5 video driven strictly by scroll position */}
        <video
          ref={videoRef}
          src={PRESENTATION_VIDEO_URL}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
        />

        {/* Persistent canvas buffer eliminates black frames & flicker during reverse/forward seeks */}
        <canvas
          ref={canvasRef}
          data-testid="presentation-video-canvas"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Measured cinematic vignette & scrims for 4.5:1+ typographic contrast across all frames */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050506]/70 via-transparent to-[#050506]/85"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,5,6,0.68)_100%)]"
        />

        {/* Subtle loading / buffer feedback if video is still hydrating */}
        {!videoReady && !videoError && (
          <div className="pointer-events-none absolute top-20 left-6 z-20 flex items-center gap-3 text-[11px] tracking-[0.16em] text-[#C8CDD4]/80 uppercase">
            <span>Буферизация видеопотока</span>
            <span className="tabular-nums text-[#F4F4F6]">
              {Math.round(bufferRatio * 100)}%
            </span>
          </div>
        )}

        {videoError && (
          <div className="pointer-events-none absolute top-20 left-6 z-20 text-xs text-[#C8CDD4]/80">
            {videoError}
          </div>
        )}

        {/* 8 Synchronized Scene Compositions */}
        <div className="relative z-10 mx-auto h-full w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
          {PRESENTATION_SCENES.map((scene, idx) => {
            const alignmentClasses =
              scene.alignment === 'center'
                ? 'items-center justify-center text-center'
                : scene.alignment === 'left'
                  ? 'items-center justify-start text-left'
                  : scene.alignment === 'right'
                    ? 'items-center justify-end text-left md:text-right'
                    : 'items-end justify-start text-left pb-24 sm:pb-28';

            const contentWidth =
              scene.alignment === 'center' ? 'max-w-3xl items-center' : 'max-w-xl';

            return (
              <div
                key={scene.id}
                ref={(el) => {
                  sceneRefs.current[idx] = el;
                }}
                data-scene-id={scene.id}
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  visibility: idx === 0 ? 'visible' : 'hidden',
                  willChange: 'transform, opacity',
                }}
                className={`absolute inset-0 flex px-6 sm:px-10 lg:px-16 ${alignmentClasses}`}
              >
                <div className={`flex flex-col ${contentWidth}`}>
                  <p className="mb-4 text-[11px] font-medium tracking-[0.26em] text-[#C8CDD4]/90 uppercase">
                    {scene.chapterLabel}
                  </p>

                  <h2
                    className="font-display text-4xl font-normal leading-[0.98] tracking-[-0.01em] text-[#F4F4F6] drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)] sm:text-6xl lg:text-7xl"
                    style={{ textWrap: 'balance' }}
                  >
                    {scene.titleLines.map((line, lineIdx) => (
                      <span key={lineIdx} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>

                  <p
                    className={`mt-5 max-w-md text-sm leading-relaxed text-[#C8CDD4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-base ${
                      scene.alignment === 'right' ? 'md:ml-auto' : ''
                    }`}
                  >
                    {scene.subtitle}
                  </p>

                  {/* Scene 1: Scroll Prompt */}
                  {scene.id === 'ink-flow' && (
                    <div className="mt-10 flex flex-col items-center gap-3 text-[#C8CDD4]/80">
                      <span className="text-[11px] tracking-[0.24em] uppercase">
                        Прокрутите для погружения
                      </span>
                      <div className="flex h-9 w-[1px] items-end overflow-hidden bg-white/15">
                        <div className="h-4 w-full bg-[#F4F4F6] animate-bounce" />
                      </div>
                    </div>
                  )}

                  {/* Scene 7: Minimalist Machine Spec Note */}
                  {scene.id === 'vertical-machine' && (
                    <div className="mt-6 flex items-center gap-4 border-t border-white/15 pt-4 text-xs tracking-[0.18em] text-[#C8CDD4]/80 uppercase">
                      <span>Бесщёточный привод</span>
                      <span aria-hidden="true">·</span>
                      <span>Контроль вибрации</span>
                    </div>
                  )}

                  {/* Scene 8: Final Composition CTAs */}
                  {scene.id === 'finale' && (
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={onBookSession}
                        className="inline-flex items-center gap-2.5 border border-[#F4F4F6] bg-[#F4F4F6] px-7 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#050506] uppercase transition-all duration-200 hover:bg-[#C8CDD4] hover:border-[#C8CDD4] cursor-pointer"
                      >
                        BOOK YOUR SESSION
                        <ArrowUpRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={onExplorePortfolio}
                        className="inline-flex items-center gap-2 border border-white/25 bg-[#0B0B0D]/80 px-6 py-3.5 text-xs font-medium tracking-[0.14em] text-[#F4F4F6] uppercase transition-colors duration-200 hover:border-[#C8CDD4] hover:text-[#C8CDD4] cursor-pointer"
                      >
                        Портфолио и мастера
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right-edge discrete Chapter Navigator (Desktop, scoped inside pinned stage) */}
        <aside
          aria-label="Навигация по главам презентации"
          className="hidden lg:flex absolute right-7 top-1/2 z-30 -translate-y-1/2 flex-col items-end gap-2.5"
        >
          {PRESENTATION_SCENES.map((scene, idx) => {
            const isActive = activeSceneIdx === idx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => jumpToScene(scene.id)}
                aria-label={`Перейти к сцене ${scene.chapterLabel}`}
                className="group flex items-center gap-2.5 py-0.5 text-right cursor-pointer"
              >
                <span
                  className={`text-[10px] tracking-[0.18em] uppercase transition-opacity duration-200 ${
                    isActive
                      ? 'opacity-100 text-[#F4F4F6]'
                      : 'opacity-0 group-hover:opacity-75 text-[#C8CDD4]'
                  }`}
                >
                  {scene.chapterLabel}
                </span>
                <span
                  className={`block h-[1px] transition-all duration-200 ${
                    isActive
                      ? 'w-7 bg-[#F4F4F6]'
                      : 'w-3 bg-white/30 group-hover:w-5 group-hover:bg-white/70'
                  }`}
                />
              </button>
            );
          })}
        </aside>

        {/* Bottom Cinema Scrub Timeline Bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 pb-5 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.16em] text-[#C8CDD4]/80 uppercase">
            <span>{PRESENTATION_SCENES[activeSceneIdx]?.chapterLabel}</span>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span ref={frameCounterRef} className="tabular-nums text-[#8A8D94]">
              0000 / {TOTAL_FRAMES}
            </span>
          </div>

          <button
            type="button"
            onClick={onSkipToStudio}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] text-[#C8CDD4]/80 uppercase transition-colors hover:text-[#F4F4F6] cursor-pointer"
          >
            <span>К студии</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Hairline Scrub Progress Track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/10"
        >
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-[#C8CDD4]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}
