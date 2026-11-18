import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface GooeyTextRevealProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function GooeyTextReveal({
  children,
  className = '',
  duration = 1.15,
  delay = 0,
}: GooeyTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, '');
  const filterId = `gooey-reveal-${reactId}`;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { filter: 'blur(9px)', opacity: 0.2, y: 12 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [duration, delay]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={{ filter: `url(#${filterId})`, willChange: 'filter, opacity, transform' }}
      >
        {children}
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
