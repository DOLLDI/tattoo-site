import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ARTISTS, PORTFOLIO_WORKS } from '../data/studio';
import {
  TATTOO_STYLES,
  filterPortfolioWorks,
  getStyleCounts,
  type PortfolioWork,
  type StyleFilter,
} from '../utils/portfolioFilter';
import { GooeyTextReveal } from './ui/GooeyTextReveal';
import { LiquidMetalButton } from './ui/LiquidMetalButton';
import { PerspectiveCarousel } from './ui/PerspectiveCarousel';

interface PortfolioSectionProps {
  activeArtistFilter: string | null;
  onClearArtistFilter: () => void;
  onBookSimilar: (style: string, artistName: string) => void;
}

const FILTER_OPTIONS: readonly StyleFilter[] = ['Все', ...TATTOO_STYLES];

export function PortfolioSection({
  activeArtistFilter,
  onClearArtistFilter,
  onBookSimilar,
}: PortfolioSectionProps) {
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('Все');
  const [activeSlide, setActiveSlide] = useState(1);
  const [lightboxWork, setLightboxWork] = useState<PortfolioWork | null>(null);

  const counts = getStyleCounts(PORTFOLIO_WORKS);
  const filteredWorks = filterPortfolioWorks(
    PORTFOLIO_WORKS,
    styleFilter,
    activeArtistFilter,
  );

  const activeArtistObj = activeArtistFilter
    ? ARTISTS.find((a) => a.id === activeArtistFilter)
    : null;

  // Center the carousel symmetrically when >= 3 works match the active filter
  useEffect(() => {
    setActiveSlide(filteredWorks.length >= 3 ? 1 : 0);
  }, [styleFilter, activeArtistFilter, filteredWorks.length]);

  useEffect(() => {
    if (!lightboxWork) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxWork(null);
      } else if (e.key === 'ArrowRight') {
        const idx = filteredWorks.findIndex((w) => w.id === lightboxWork.id);
        if (idx >= 0 && filteredWorks.length > 1) {
          setLightboxWork(filteredWorks[(idx + 1) % filteredWorks.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const idx = filteredWorks.findIndex((w) => w.id === lightboxWork.id);
        if (idx >= 0 && filteredWorks.length > 1) {
          setLightboxWork(
            filteredWorks[
              (idx - 1 + filteredWorks.length) % filteredWorks.length
            ],
          );
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxWork, filteredWorks]);

  const navigateLightbox = (dir: 1 | -1) => {
    if (!lightboxWork || filteredWorks.length < 2) return;
    const idx = filteredWorks.findIndex((w) => w.id === lightboxWork.id);
    if (idx < 0) return;
    const nextIdx = (idx + dir + filteredWorks.length) % filteredWorks.length;
    setLightboxWork(filteredWorks[nextIdx]);
  };

  const carouselItems = filteredWorks.map((work) => ({
    id: work.id,
    src: work.image,
    title: work.title,
    subtitle: `${work.style} · ${work.placement}`,
    meta: `${work.artistName} · ${work.sessionNote}`,
  }));

  return (
    <section
      id="portfolio"
      className="border-t border-white/10 bg-[#0B0B0D] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.24em] text-[#8A8D94] uppercase">
              03 · Избранные работы
            </p>
            <GooeyTextReveal>
              <h2
                className="mt-3 font-display text-4xl font-normal tracking-[-0.01em] text-[#F4F4F6] sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                Портфолио
              </h2>
            </GooeyTextReveal>
          </div>

          {activeArtistObj && (
            <div className="flex items-center gap-3 border border-white/15 bg-[#050506] px-4 py-2 text-xs text-[#C8CDD4] self-start lg:self-auto">
              <span>Мастер: {activeArtistObj.name}</span>
              <button
                type="button"
                onClick={onClearArtistFilter}
                aria-label="Сбросить фильтр по мастеру"
                className="text-[#8A8D94] hover:text-[#F4F4F6] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Style Filter Controls */}
        <div
          role="group"
          aria-label="Фильтр портфолио по стилям"
          className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4"
        >
          {FILTER_OPTIONS.map((style) => {
            const isSelected = styleFilter === style;
            const count = counts[style] ?? 0;
            return (
              <button
                key={style}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setStyleFilter(style)}
                className={`whitespace-nowrap shrink-0 border px-4 py-2 text-xs font-medium tracking-[0.08em] transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#F4F4F6] bg-[#F4F4F6] text-[#050506]'
                    : 'border-white/12 bg-[#050506] text-[#C8CDD4] hover:border-white/35 hover:text-[#F4F4F6]'
                }`}
              >
                <span>{style}</span>
                <span className="ml-2 tabular-nums opacity-65">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sculptural Perspective Gallery */}
        {filteredWorks.length === 0 ? (
          <div className="mt-6 border border-white/10 bg-[#050506] px-8 py-12 text-center">
            <p className="font-display text-2xl text-[#F4F4F6]">
              Работы по выбранному фильтру пока не добавлены
            </p>
            <p className="mt-2 text-sm text-[#8A8D94]">
              Попробуйте выбрать «Все» или сбросить фильтр мастера.
            </p>
            <button
              type="button"
              onClick={() => {
                setStyleFilter('Все');
                onClearArtistFilter();
              }}
              className="mt-6 border border-white/25 px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-[#F4F4F6] hover:border-[#F4F4F6] cursor-pointer"
            >
              Показать все работы
            </button>
          </div>
        ) : (
          <div className="mt-6" data-testid="portfolio-grid">
            <PerspectiveCarousel
              items={carouselItems}
              activeIndex={activeSlide}
              onActiveIndexChange={setActiveSlide}
              onInspectActive={(idx) => setLightboxWork(filteredWorks[idx] ?? null)}
              slideWidth={370}
              rotationStep={30}
              inactiveScale={0.82}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Viewer */}
      {lightboxWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр работы ${lightboxWork.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8"
          onClick={() => setLightboxWork(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-white/15 bg-[#0B0B0D] lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Закрыть просмотр"
              onClick={() => setLightboxWork(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-[#050506]/85 text-[#F4F4F6] hover:border-[#F4F4F6] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex-1 bg-[#050506]">
              <img
                src={lightboxWork.image}
                alt={lightboxWork.title}
                referrerPolicy="no-referrer"
                className="h-full max-h-[60vh] w-full object-contain lg:max-h-[85vh]"
              />

              {filteredWorks.length > 1 && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Предыдущая работа"
                    onClick={() => navigateLightbox(-1)}
                    className="flex h-10 w-10 items-center justify-center border border-white/20 bg-[#050506]/85 text-[#F4F4F6] hover:border-[#F4F4F6] cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующая работа"
                    onClick={() => navigateLightbox(1)}
                    className="flex h-10 w-10 items-center justify-center border border-white/20 bg-[#050506]/85 text-[#F4F4F6] hover:border-[#F4F4F6] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex w-full flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:w-88 lg:border-t-0 lg:border-l">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#8A8D94] uppercase">
                  {lightboxWork.style}
                </p>
                <h3 className="mt-2 font-display text-3xl font-normal text-[#F4F4F6]">
                  {lightboxWork.title}
                </h3>

                <dl className="mt-6 space-y-3 border-y border-white/10 py-5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8A8D94]">Мастер</dt>
                    <dd className="text-[#F4F4F6]">{lightboxWork.artistName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8A8D94]">Зона</dt>
                    <dd className="text-[#F4F4F6]">{lightboxWork.placement}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8A8D94]">Формат</dt>
                    <dd className="text-[#F4F4F6]">{lightboxWork.sessionNote}</dd>
                  </div>
                </dl>

                <p className="mt-5 text-sm leading-relaxed text-[#C8CDD4]/85">
                  {lightboxWork.description}
                </p>
              </div>

              <div className="mt-8">
                <LiquidMetalButton
                  type="button"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    const { style, artistName } = lightboxWork;
                    setLightboxWork(null);
                    onBookSimilar(style, artistName);
                  }}
                >
                  Обсудить похожий проект
                </LiquidMetalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
