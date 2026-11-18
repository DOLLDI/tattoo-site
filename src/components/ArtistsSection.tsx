import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { ARTISTS, PORTFOLIO_WORKS, type ArtistProfile } from '../data/studio';
import type { PortfolioWork } from '../utils/portfolioFilter';
import { GooeyTextReveal } from './ui/GooeyTextReveal';
import { LiquidMetalButton } from './ui/LiquidMetalButton';

interface ArtistsSectionProps {
  onSelectArtistPortfolio: (artistId: string) => void;
  onBookWithArtist: (artistName: string, style: string) => void;
}

export function ArtistsSection({
  onSelectArtistPortfolio,
  onBookWithArtist,
}: ArtistsSectionProps) {
  const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);

  const artistWorks: PortfolioWork[] = selectedArtist
    ? PORTFOLIO_WORKS.filter((w) => w.artistId === selectedArtist.id)
    : [];

  return (
    <section
      id="artists"
      className="border-t border-white/10 bg-[#050506] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.24em] text-[#8A8D94] uppercase">
              02 · Резиденты ателье
            </p>
            <GooeyTextReveal>
              <h2
                className="mt-3 font-display text-4xl font-normal tracking-[-0.01em] text-[#F4F4F6] sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                Мастера студии
              </h2>
            </GooeyTextReveal>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#8A8D94]">
            Резиденты с авторским почерком — от скульптурного Black &amp; Grey и реализма
            до монументального блэкворка и каллиграфии.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTISTS.map((artist) => (
            <article
              key={artist.id}
              className="group flex flex-col border border-white/10 bg-[#0B0B0D] transition-colors duration-300 hover:border-white/25"
            >
              <div className="relative aspect-[4/4.3] overflow-hidden bg-[#141417]">
                <img
                  src={artist.image}
                  alt={`${artist.name} — ${artist.specialization}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover grayscale contrast-115 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/20 to-transparent"
                />
                <div className="absolute bottom-3.5 left-5 right-5">
                  <p className="text-[11px] tracking-[0.14em] text-[#C8CDD4]/80 uppercase">
                    {artist.experience}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-normal text-[#F4F4F6]">
                    {artist.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs font-medium text-[#C8CDD4]">
                    {artist.specialization}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#8A8D94]">
                    {artist.bio}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedArtist(artist)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.12em] text-[#F4F4F6] uppercase transition-colors hover:text-[#C8CDD4] cursor-pointer whitespace-nowrap"
                  >
                    <span>Портфолио</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onBookWithArtist(artist.name, artist.primaryStyle)
                    }
                    className="text-xs tracking-[0.08em] text-[#8A8D94] transition-colors hover:text-[#F4F4F6] cursor-pointer whitespace-nowrap"
                  >
                    Записаться
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Профиль мастера ${selectedArtist.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={() => setSelectedArtist(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/15 bg-[#0B0B0D] p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Закрыть профиль мастера"
              onClick={() => setSelectedArtist(null)}
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center border border-white/15 text-[#F4F4F6] hover:border-[#C8CDD4] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[11px] tracking-[0.2em] text-[#8A8D94] uppercase">
              {selectedArtist.role}
            </p>
            <h3 className="mt-2 font-display text-4xl font-normal text-[#F4F4F6]">
              {selectedArtist.name}
            </h3>
            <p className="mt-2 text-sm text-[#C8CDD4]">
              {selectedArtist.specialization} · {selectedArtist.experience}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#8A8D94]">
              {selectedArtist.bio}
            </p>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-medium tracking-[0.16em] text-[#C8CDD4] uppercase">
                  Избранные работы ({artistWorks.length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedArtist.id;
                    setSelectedArtist(null);
                    onSelectArtistPortfolio(id);
                  }}
                  className="text-xs text-[#C8CDD4] underline underline-offset-4 hover:text-[#F4F4F6] cursor-pointer"
                >
                  Открыть в общей галерее
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {artistWorks.map((work) => (
                  <div
                    key={work.id}
                    className="border border-white/10 bg-[#050506]"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#141417]">
                      <img
                        src={work.image}
                        alt={work.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3.5">
                      <p className="text-sm font-medium text-[#F4F4F6]">
                        {work.title}
                      </p>
                      <p className="mt-1 text-xs text-[#8A8D94]">
                        {work.style} · {work.placement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
              <LiquidMetalButton
                type="button"
                size="md"
                onClick={() => {
                  const { name, primaryStyle } = selectedArtist;
                  setSelectedArtist(null);
                  onBookWithArtist(name, primaryStyle);
                }}
              >
                Записаться к мастеру
              </LiquidMetalButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
