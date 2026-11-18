import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LiquidMetalButton } from './ui/LiquidMetalButton';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  isPastHero: boolean;
}

const NAV_ITEMS = [
  { id: 'studio', label: 'Студия' },
  { id: 'artists', label: 'Мастера' },
  { id: 'portfolio', label: 'Портфолио' },
  { id: 'contacts', label: 'Контакты' },
] as const;

export function Navbar({ onNavigate, isPastHero }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isPastHero
          ? 'bg-[#050506]/92 backdrop-blur-md border-b border-white/10'
          : 'bg-gradient-to-b from-[#050506]/85 via-[#050506]/40 to-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-12">
        <a
          href="#presentation"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('presentation');
          }}
          className="font-display text-xl font-medium tracking-[0.18em] text-[#F4F4F6] uppercase whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8CDD4]"
        >
          NOCTURNE
        </a>

        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-[0.06em] text-[#C8CDD4]/85"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="whitespace-nowrap shrink-0 py-1 transition-colors duration-200 hover:text-[#F4F4F6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8CDD4]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <LiquidMetalButton
            type="button"
            size="sm"
            borderWidth={1.5}
            onClick={() => handleLinkClick('booking')}
          >
            Записаться
          </LiquidMetalButton>

          <button
            type="button"
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-[#F4F4F6] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0B0B0D] px-6 py-5 md:hidden">
          <nav aria-label="Мобильная навигация" className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className="py-2 text-sm font-medium tracking-[0.06em] text-[#C8CDD4] border-b border-white/5 last:border-b-0 hover:text-[#F4F4F6]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
