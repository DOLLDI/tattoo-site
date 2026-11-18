import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export interface PerspectiveCarouselItem {
  id: string;
  src: string;
  title: string;
  subtitle?: string;
  meta?: string;
  alt?: string;
}

export interface PerspectiveCarouselProps {
  items: PerspectiveCarouselItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onInspectActive?: (index: number) => void;
  slideWidth?: number;
  rotationStep?: number;
  inactiveScale?: number;
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function PerspectiveCarousel({
  items,
  activeIndex,
  onActiveIndexChange,
  onInspectActive,
  slideWidth = 370,
  rotationStep = 32,
  inactiveScale = 0.8,
  className = '',
}: PerspectiveCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setUncontrolledIndex((prev) => clamp(prev, 0, maxIndex));
  }, [maxIndex]);

  const effectiveSlideWidth =
    viewportWidth < 640 ? Math.min(slideWidth, 276) : slideWidth;

  const selectSlide = useCallback(
    (nextIndex: number) => {
      if (!items.length) return;
      const resolved = clamp(nextIndex, 0, maxIndex);
      if (activeIndex === undefined) {
        setUncontrolledIndex(resolved);
      }
      onActiveIndexChange?.(resolved);
    },
    [activeIndex, items.length, maxIndex, onActiveIndexChange],
  );

  if (!items.length) return null;

  const isPreviousDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === maxIndex;
  const activeItem = items[currentIndex];
  const trackOffset = -(currentIndex * effectiveSlideWidth + effectiveSlideWidth / 2);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Галерея работ студии"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative isolate w-full overflow-hidden border border-white/10 bg-[#050506] outline-none focus-visible:border-[#C8CDD4]/60 ${className}`}
    >
      {/* Subtle architectural perspective viewport */}
      <div
        className="relative h-[280px] w-full overflow-hidden sm:h-[350px]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute left-1/2 top-1/2 flex w-fit items-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{
            transform: `translate3d(${trackOffset}px, -50%, 0)`,
          }}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const offset = currentIndex - index;

            return (
              <div
                key={item.id}
                className="shrink-0 px-2.5"
                style={{ width: effectiveSlideWidth, perspective: '1200px' }}
              >
                <div
                  className="flex w-full flex-col items-center transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                  style={{
                    transform: `rotateY(${offset * rotationStep}deg) scale(${isActive ? 1 : inactiveScale})`,
                    opacity: Math.abs(offset) > 2 ? 0.35 : isActive ? 1 : 0.72,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <button
                    type="button"
                    aria-label={
                      isActive
                        ? `Открыть работу: ${item.title}`
                        : `Выбрать работу: ${item.title}`
                    }
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => {
                      if (isActive) {
                        onInspectActive?.(index);
                      } else {
                        selectSlide(index);
                      }
                    }}
                    className={`group relative aspect-[4/3] w-full overflow-hidden border bg-[#141417] text-left transition-colors duration-300 cursor-pointer ${
                      isActive
                        ? 'border-[#C8CDD4]/55 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.95)]'
                        : 'border-white/12 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506]/90 via-transparent to-transparent"
                    />

                    {isActive && onInspectActive && (
                      <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center border border-white/25 bg-[#050506]/80 text-[#F4F4F6] opacity-85 transition-opacity group-hover:opacity-100">
                        <Expand className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <div className="absolute bottom-3.5 left-4 right-4">
                      {item.subtitle && (
                        <p className="text-[10px] tracking-[0.14em] text-[#C8CDD4]/85 uppercase">
                          {item.subtitle}
                        </p>
                      )}
                      <h3 className="mt-1 truncate font-display text-xl font-normal text-[#F4F4F6]">
                        {item.title}
                      </h3>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar: Active Slide Details + Controls */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 bg-[#08080A] px-5 py-4 sm:flex-row sm:px-7">
        <div className="min-w-0 text-center sm:text-left">
          <p className="truncate text-xs font-medium text-[#F4F4F6]">
            {activeItem.title}
          </p>
          {activeItem.meta && (
            <p className="mt-0.5 truncate text-[11px] text-[#8A8D94]">
              {activeItem.meta}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            aria-label="Предыдущая работа"
            disabled={isPreviousDisabled}
            onClick={() => selectSlide(currentIndex - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#050506] text-[#F4F4F6] transition-colors hover:border-[#C8CDD4] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Показать слайд ${index + 1}: ${item.title}`}
                aria-current={currentIndex === index ? 'true' : undefined}
                onClick={() => selectSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index
                    ? 'w-6 bg-[#F4F4F6]'
                    : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Следующая работа"
            disabled={isNextDisabled}
            onClick={() => selectSlide(currentIndex + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#050506] text-[#F4F4F6] transition-colors hover:border-[#C8CDD4] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {onInspectActive && (
            <button
              type="button"
              onClick={() => onInspectActive(currentIndex)}
              className="ml-1 hidden border border-white/15 bg-[#141417] px-3.5 py-2 text-[11px] font-medium tracking-[0.1em] text-[#C8CDD4] uppercase transition-colors hover:border-[#C8CDD4] hover:text-[#F4F4F6] sm:inline-flex cursor-pointer whitespace-nowrap"
            >
              Подробнее
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
