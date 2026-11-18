export const VIDEO_FPS = 60;
export const TOTAL_FRAMES = 2352;
export const VIDEO_DURATION_SECONDS = TOTAL_FRAMES / VIDEO_FPS; // 39.2s (39s 12 frames)

export const PRESENTATION_VIDEO_URL =
  '/assets/aistudio/E1F294BF-2202-4885-80AD-492E0A3406A71118_193740_065fb278.mp4';
export const PRESENTATION_POSTER_URL = '/assets/stills/ink-flow.jpg';

export type SceneId =
  | 'ink-flow'
  | 'the-sketch'
  | 'living-sketch'
  | 'human-canvas'
  | 'the-craft'
  | 'the-technology'
  | 'vertical-machine'
  | 'finale';

export interface SceneDefinition {
  id: SceneId;
  index: number;
  chapterLabel: string;
  titleLines: string[];
  subtitle: string;
  /** Exact video editorial plateau start frame */
  startFrame: number;
  /** Exact video editorial plateau end frame */
  endFrame: number;
  /** Frame when text begins fading in (inside preceding transition or at 0) */
  revealStartFrame: number;
  /** Frame when text finishes fading out (strictly before next scene's revealStartFrame) */
  exitEndFrame: number;
  /** Visual alignment inside viewport */
  alignment: 'center' | 'left' | 'right' | 'bottom-left';
  /** Fallback still frame if video is still buffering */
  fallbackStill: string;
}

export const PRESENTATION_SCENES: readonly SceneDefinition[] = [
  {
    id: 'ink-flow',
    index: 0,
    chapterLabel: '01 / INK FLOW',
    titleLines: ['INK IS MORE THAN ART.', "IT'S AN IDENTITY."],
    subtitle:
      'Татуировка — это не украшение поверхности, а точный визуальный код характера, памяти и внутренней свободы.',
    startFrame: 0,
    endFrame: 60,
    revealStartFrame: 0,
    exitEndFrame: 145,
    alignment: 'center',
    fallbackStill: '/assets/stills/ink-flow.jpg',
  },
  {
    id: 'the-sketch',
    index: 1,
    chapterLabel: '02 / THE SKETCH',
    titleLines: ['EVERY MASTERPIECE', 'STARTS WITH AN IDEA.'],
    subtitle:
      'Каждый проект рождается с чистого листа: от глубокого поиска композиции и светотени до миллиметровой проработки штриха.',
    startFrame: 422,
    endFrame: 482,
    revealStartFrame: 350,
    exitEndFrame: 555,
    alignment: 'left',
    fallbackStill: '/assets/stills/statue-black-grey.jpg',
  },
  {
    id: 'living-sketch',
    index: 2,
    chapterLabel: '03 / LIVING SKETCH',
    titleLines: ['ART THAT LIVES', 'ON YOUR SKIN.'],
    subtitle:
      'Мы проектируем эскиз в движении — учитывая анатомию, пластику мышц, контраст кожи и ваш личный замысел.',
    startFrame: 784,
    endFrame: 844,
    revealStartFrame: 710,
    exitEndFrame: 915,
    alignment: 'right',
    fallbackStill: '/assets/stills/living-collage.jpg',
  },
  {
    id: 'human-canvas',
    index: 3,
    chapterLabel: '04 / HUMAN CANVAS',
    titleLines: ['YOUR BODY.', 'YOUR STORY.'],
    subtitle:
      'Персональная архитектура татуировки без шаблонных решений — только форма, которая становится частью вашей истории.',
    startFrame: 1146,
    endFrame: 1206,
    revealStartFrame: 1075,
    exitEndFrame: 1245,
    alignment: 'left',
    fallbackStill: '/assets/stills/biomech-sleeve.jpg',
  },
  {
    id: 'the-craft',
    index: 4,
    chapterLabel: '05 / THE CRAFT',
    titleLines: ['PRECISION IN', 'EVERY DETAIL.'],
    subtitle:
      'Уверенный контроль глубины иглы, чистые градиенты и безупречная геометрия линий от первого контура до заживления.',
    startFrame: 1309,
    endFrame: 1369,
    revealStartFrame: 1260,
    exitEndFrame: 1430,
    alignment: 'bottom-left',
    fallbackStill: '/assets/stills/craft-process.jpg',
  },
  {
    id: 'the-technology',
    index: 5,
    chapterLabel: '06 / THE TECHNOLOGY',
    titleLines: ['PROFESSIONAL TOOLS.', 'PERFECT EXECUTION.'],
    subtitle:
      'Сертифицированное оборудование, одноразовые стерильные модули и медицинский стандарт безопасности в каждом сеансе.',
    startFrame: 1568,
    endFrame: 1628,
    revealStartFrame: 1500,
    exitEndFrame: 1705,
    alignment: 'right',
    fallbackStill: '/assets/stills/stencil-detail.jpg',
  },
  {
    id: 'vertical-machine',
    index: 6,
    chapterLabel: '07 / INSTRUMENT',
    titleLines: ['SILENT BALANCE.'],
    subtitle: 'Точность инженерии в руках мастера.',
    startFrame: 1930,
    endFrame: 1990,
    revealStartFrame: 1860,
    exitEndFrame: 2065,
    alignment: 'left',
    fallbackStill: '/assets/stills/rotary-machine.jpg',
  },
  {
    id: 'finale',
    index: 7,
    chapterLabel: '08 / FINALE',
    titleLines: ['YOUR STORY STARTS HERE.'],
    subtitle: 'Закрытая студия авторской татуировки. Индивидуальные проекты по предварительной записи.',
    startFrame: 2292,
    endFrame: 2352,
    revealStartFrame: 2215,
    exitEndFrame: 2352,
    alignment: 'center',
    fallbackStill: '/assets/stills/rotary-machine.jpg',
  },
] as const;

export interface SceneTransitionSegment {
  label: string;
  startFrame: number;
  endFrame: number;
}

export const TRANSITION_SEGMENTS: readonly SceneTransitionSegment[] = [
  { label: 'Переход 1', startFrame: 60, endFrame: 422 },
  { label: 'Переход 2', startFrame: 482, endFrame: 784 },
  { label: 'Переход 3', startFrame: 844, endFrame: 1146 },
  { label: 'Переход 4', startFrame: 1206, endFrame: 1309 },
  { label: 'Переход 5', startFrame: 1369, endFrame: 1568 },
  { label: 'Переход 6', startFrame: 1628, endFrame: 1930 },
  { label: 'Переход 7', startFrame: 1990, endFrame: 2292 },
];

export interface SceneRenderState {
  id: SceneId;
  opacity: number;
  /** Vertical offset in pixels (compositor transform only) */
  translateY: number;
  /** Subtle scale factor around 1.0 */
  scale: number;
  isActive: boolean;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function smoothStep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function progressToFrame(progress: number): number {
  return clamp(progress, 0, 1) * TOTAL_FRAMES;
}

export function frameToProgress(frame: number): number {
  return clamp(frame / TOTAL_FRAMES, 0, 1);
}

export function frameToTime(frame: number): number {
  return clamp(frame, 0, TOTAL_FRAMES) / VIDEO_FPS;
}

export function timeToFrame(seconds: number): number {
  return clamp(seconds * VIDEO_FPS, 0, TOTAL_FRAMES);
}

export function progressToTime(progress: number): number {
  return clamp(progress, 0, 1) * VIDEO_DURATION_SECONDS;
}

export function getSceneOpacityAtFrame(scene: SceneDefinition, frame: number): number {
  const f = clamp(frame, 0, TOTAL_FRAMES);

  // Scene 1 starts visible immediately at frame 0
  if (scene.index === 0) {
    if (f <= scene.endFrame) return 1;
    if (f >= scene.exitEndFrame) return 0;
    return 1 - smoothStep(scene.endFrame, scene.exitEndFrame, f);
  }

  // Final scene remains visible through the end of the timeline (frame 2352)
  if (scene.index === PRESENTATION_SCENES.length - 1) {
    if (f <= scene.revealStartFrame) return 0;
    if (f >= scene.startFrame) return 1;
    return smoothStep(scene.revealStartFrame, scene.startFrame, f);
  }

  if (f <= scene.revealStartFrame || f >= scene.exitEndFrame) {
    return 0;
  }
  if (f < scene.startFrame) {
    return smoothStep(scene.revealStartFrame, scene.startFrame, f);
  }
  if (f > scene.endFrame) {
    return 1 - smoothStep(scene.endFrame, scene.exitEndFrame, f);
  }
  return 1;
}

export function getSceneStatesAtFrame(frame: number): SceneRenderState[] {
  const f = clamp(frame, 0, TOTAL_FRAMES);

  return PRESENTATION_SCENES.map((scene) => {
    const opacity = getSceneOpacityAtFrame(scene, f);
    let translateY = 0;
    let scale = 1;

    if (opacity > 0 && opacity < 1) {
      if (f < scene.startFrame && scene.index > 0) {
        // Entering upward glide
        translateY = (1 - opacity) * 22;
        scale = 0.985 + opacity * 0.015;
      } else if (f > scene.endFrame && scene.index < PRESENTATION_SCENES.length - 1) {
        // Exiting slight drift upward
        translateY = -(1 - opacity) * 16;
        scale = 1 + (1 - opacity) * 0.012;
      }
    }

    return {
      id: scene.id,
      opacity,
      translateY,
      scale,
      isActive: opacity > 0.02,
    };
  });
}

export function getActiveSceneIndex(frame: number): number {
  const f = clamp(frame, 0, TOTAL_FRAMES);
  let bestIndex = 0;
  let bestOpacity = -1;

  for (let i = 0; i < PRESENTATION_SCENES.length; i++) {
    const op = getSceneOpacityAtFrame(PRESENTATION_SCENES[i], f);
    if (op > bestOpacity) {
      bestOpacity = op;
      bestIndex = i;
    }
  }

  if (bestOpacity <= 0) {
    // Between transitions, highlight the nearest upcoming or most recent scene
    let minDistance = Infinity;
    for (let i = 0; i < PRESENTATION_SCENES.length; i++) {
      const s = PRESENTATION_SCENES[i];
      const mid = (s.startFrame + s.endFrame) / 2;
      const d = Math.abs(f - mid);
      if (d < minDistance) {
        minDistance = d;
        bestIndex = i;
      }
    }
  }

  return bestIndex;
}

export function getSceneTargetProgress(sceneId: SceneId): number {
  const scene = PRESENTATION_SCENES.find((s) => s.id === sceneId);
  if (!scene) return 0;
  const targetFrame = scene.index === 0 ? 0 : scene.index === 7 ? 2352 : (scene.startFrame + scene.endFrame) / 2;
  return frameToProgress(targetFrame);
}
