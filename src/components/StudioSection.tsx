import { ArrowUpRight, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { STUDIO_SPACES } from '../data/studio';
import { GooeyTextReveal } from './ui/GooeyTextReveal';
import { LiquidMetalButton } from './ui/LiquidMetalButton';
import { MorphText } from './ui/MorphText';

interface StudioSectionProps {
  onBookSession: () => void;
}

const STUDIO_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Стерильность класса B',
    text: 'Полный цикл автоклавной стерилизации, барьерная защита и строго одноразовые сертифицированные картриджи.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Архитектурный свет 5600K',
    text: 'Освещение CRI 98+ без мерцания для точного контроля глубины тени и полутонов.',
  },
  {
    icon: Sparkles,
    title: 'Приватные боксы',
    text: 'Закрытый формат ателье без случайных посетителей: акустическая изоляция и персональный комфорт.',
  },
] as const;

export function StudioSection({ onBookSession }: StudioSectionProps) {
  return (
    <section
      id="studio"
      className="relative border-t border-white/10 bg-[#050506] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Editorial Header Split + Morphing Principle Chamber */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium tracking-[0.24em] text-[#8A8D94] uppercase">
              01 · Пространство и атмосфера
            </p>
            <GooeyTextReveal>
              <h2
                className="mt-3 font-display text-4xl font-normal tracking-[-0.01em] text-[#F4F4F6] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]"
                style={{ textWrap: 'balance' }}
              >
                THE SPACE BEHIND THE ART.
              </h2>
            </GooeyTextReveal>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#C8CDD4]/85 sm:text-base">
              Закрытое архитектурное пространство на стыке галереи современного искусства и
              стерильной клинической лаборатории. Никакой суеты потока — только фокус на линии,
              форме и вашем сюжете.
            </p>
            <div className="mt-6">
              <LiquidMetalButton
                type="button"
                size="sm"
                icon={<ArrowUpRight className="h-3.5 w-3.5" />}
                onClick={onBookSession}
              >
                Назначить консультацию
              </LiquidMetalButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative flex flex-col items-center justify-center overflow-hidden border border-white/12 bg-[#0B0B0D] px-6 py-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-4 text-[10px] tracking-[0.22em] text-[#8A8D94]/70 uppercase"
              >
                <span>Кодекс ателье</span>
                <span>NOCTURNE</span>
              </div>
              <MorphText
                words={['СТЕРИЛЬНОСТЬ', 'АНАТОМИЯ', 'ГЕОМЕТРИЯ', 'ТИШИНА']}
                subtext="Четыре принципа каждого сеанса"
              />
            </div>
          </div>
        </div>

        {/* 3 Architectural Pillars */}
        <div className="mt-9 grid grid-cols-1 gap-6 border-y border-white/10 py-6 md:grid-cols-3 md:gap-10">
          {STUDIO_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 text-[#C8CDD4]">
                  <Icon className="h-4 w-4 text-[#C8CDD4]" />
                  <h3 className="font-sans text-sm font-semibold tracking-[0.04em] text-[#F4F4F6]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#8A8D94]">{pillar.text}</p>
              </div>
            );
          })}
        </div>

        {/* Compact Interior & Atmosphere Showcase */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STUDIO_SPACES.map((space, idx) => (
            <article
              key={space.id}
              className="group flex flex-col border border-white/10 bg-[#0B0B0D] transition-colors duration-300 hover:border-white/25"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#141417]">
                <img
                  src={space.image}
                  alt={space.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/85 via-transparent to-transparent"
                />
                <span className="absolute bottom-3 left-4 text-[11px] tracking-[0.18em] text-[#C8CDD4]/85 uppercase">
                  0{idx + 1} · Ателье
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-display text-2xl font-normal text-[#F4F4F6]">
                    {space.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A8D94]">
                    {space.caption}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
