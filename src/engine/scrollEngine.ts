import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollEngineInstance {
  lenis: Lenis | null;
  scrollToElement: (selectorOrId: string, offset?: number) => void;
  scrollToY: (y: number, immediate?: boolean) => void;
  destroy: () => void;
}

export function createUnifiedScrollEngine(): ScrollEngineInstance {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenis: Lenis | null = null;
  let tickCallback: ((time: number) => void) | null = null;

  if (!prefersReducedMotion) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.05,
    });

    lenis.on('scroll', ScrollTrigger.update);

    tickCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickCallback);
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToElement = (selectorOrId: string, offset = -64) => {
    const cleanId = selectorOrId.startsWith('#') ? selectorOrId.slice(1) : selectorOrId;
    const el =
      document.getElementById(cleanId) ??
      (document.querySelector(selectorOrId) as HTMLElement | null);

    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, {
        offset,
        duration: 1.25,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'auto' });
    }
  };

  const scrollToY = (y: number, immediate = false) => {
    if (lenis) {
      lenis.scrollTo(y, {
        immediate,
        duration: immediate ? 0 : 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top: y, behavior: 'auto' });
    }
  };

  const destroy = () => {
    if (tickCallback) {
      gsap.ticker.remove(tickCallback);
      tickCallback = null;
    }
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  };

  return {
    lenis,
    scrollToElement,
    scrollToY,
    destroy,
  };
}
