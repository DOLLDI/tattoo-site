import { useId } from 'react';

export interface MorphTextProps {
  words?: string[];
  interval?: number;
  subtext?: string;
  className?: string;
}

export function MorphText({
  words = ['СТЕРИЛЬНОСТЬ', 'АНАТОМИЯ', 'ГЕОМЕТРИЯ', 'ТИШИНА'],
  interval = 2800,
  subtext,
  className = '',
}: MorphTextProps) {
  const uid = useId().replace(/:/g, '');
  const filterId = `morph-threshold-${uid}`;

  const wordDuration = interval / 1000;
  const totalDuration = wordDuration * words.length;

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative select-none font-display font-medium tracking-[0.06em] text-[#F4F4F6]"
        style={{
          fontSize: 'clamp(1.85rem, 3.2vw, 3.1rem)',
          filter: `url(#${filterId})`,
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ height: '1.25em', minWidth: '13ch' }}
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="absolute whitespace-nowrap"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                animationName: 'morph-word-rotate',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationFillMode: 'both',
                animationDelay: `${i * wordDuration}s`,
                animationDuration: `${totalDuration}s`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {subtext && (
        <p className="mt-3 text-center text-xs tracking-[0.16em] text-[#8A8D94] uppercase">
          {subtext}
        </p>
      )}
    </div>
  );
}
