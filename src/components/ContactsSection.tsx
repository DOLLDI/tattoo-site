import { useState } from 'react';
import { MapPin, Clock, Phone, Send, Instagram } from 'lucide-react';
import { STUDIO_CONTACTS } from '../data/studio';

interface ContactsSectionProps {
  onNavigate: (sectionId: string) => void;
}

export function ContactsSection({ onNavigate }: ContactsSectionProps) {
  const [mapPinActive, setMapPinActive] = useState(true);

  return (
    <footer
      id="contacts"
      className="border-t border-white/10 bg-[#0B0B0D] pt-12 pb-8"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-medium tracking-[0.24em] text-[#8A8D94] uppercase">
              05 · Локация и связь
            </p>
            <h2
              className="mt-3 font-display text-4xl font-normal tracking-[-0.01em] text-[#F4F4F6] sm:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              Контакты
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#8A8D94]">
              Контактные данные ниже оформлены как нейтральные слоты и легко заменяются
              реальным адресом, телефоном и картой перед публикацией.
            </p>

            <dl className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8CDD4]" />
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[#8A8D94] uppercase">
                    Адрес
                  </dt>
                  <dd className="mt-1 font-medium text-[#F4F4F6]">
                    {STUDIO_CONTACTS.addressLabel}
                  </dd>
                  <dd className="mt-1 text-xs text-[#8A8D94]">
                    {STUDIO_CONTACTS.addressDetail}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C8CDD4]" />
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[#8A8D94] uppercase">
                    Телефон
                  </dt>
                  <dd className="mt-1 tabular-nums text-[#F4F4F6]">
                    {STUDIO_CONTACTS.phoneDisplay}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Send className="mt-0.5 h-4 w-4 shrink-0 text-[#C8CDD4]" />
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[#8A8D94] uppercase">
                    Telegram
                  </dt>
                  <dd className="mt-1 text-[#F4F4F6]">
                    {STUDIO_CONTACTS.telegramHandle}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-[#C8CDD4]" />
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[#8A8D94] uppercase">
                    Instagram
                  </dt>
                  <dd className="mt-1 text-[#F4F4F6]">
                    {STUDIO_CONTACTS.instagramHandle}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#C8CDD4]" />
                <div>
                  <dt className="text-xs tracking-[0.12em] text-[#8A8D94] uppercase">
                    Время работы
                  </dt>
                  <dd className="mt-1 text-[#F4F4F6]">{STUDIO_CONTACTS.hours}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Architectural Map Slot */}
          <div className="lg:col-span-7">
            <div className="relative flex h-[320px] flex-col justify-between overflow-hidden border border-white/12 bg-[#0B0B0D] p-6 sm:h-[380px]">
              {/* Subtle Architectural Grid SVG Map Placeholder */}
              <svg
                aria-hidden="true"
                viewBox="0 0 800 480"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="studio-map-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#2b2d34"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="480" fill="url(#studio-map-grid)" />
                {/* Stylized urban blocks & arterial avenues */}
                <path
                  d="M -20 140 L 820 180 M -20 330 L 820 290 M 240 -10 L 210 490 M 540 -10 L 580 490"
                  stroke="#3f434e"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 320 90 L 490 90 L 490 250 L 320 250 Z"
                  fill="#14161a"
                  stroke="#525764"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="border border-white/15 bg-[#050506]/90 px-3 py-1.5 text-[11px] tracking-[0.14em] text-[#C8CDD4] uppercase">
                  Слот карты местоположения
                </span>
                <span className="text-[11px] tabular-nums text-[#8A8D94]">
                  {STUDIO_CONTACTS.mapCoordinatesPlaceholder}
                </span>
              </div>

              {/* Interactive Studio Pin */}
              <div className="relative z-10 flex flex-1 items-center justify-center">
                <button
                  type="button"
                  onClick={() => setMapPinActive((prev) => !prev)}
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <span className="flex h-11 w-11 items-center justify-center border border-[#F4F4F6] bg-[#050506] text-[#F4F4F6] transition-transform duration-200 group-hover:scale-105">
                    <MapPin className="h-5 w-5" />
                  </span>
                  {mapPinActive && (
                    <span className="mt-3 border border-white/15 bg-[#050506]/95 px-4 py-2 text-center">
                      <span className="block text-xs font-medium tracking-[0.14em] text-[#F4F4F6] uppercase">
                        {STUDIO_CONTACTS.brandName}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[#8A8D94]">
                        Точка студии · Подключается к Яндекс / Google Maps
                      </span>
                    </span>
                  )}
                </button>
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#050506]/85 px-4 py-3 text-xs text-[#8A8D94]">
                <span>Приём гостей по предварительной записи</span>
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="font-medium text-[#F4F4F6] underline underline-offset-4 hover:text-[#C8CDD4] cursor-pointer"
                >
                  Запросить адрес и визит
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer Bottom */}
        <div className="mt-9 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#8A8D94] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} NOCTURNE ATELIER. Авторская тату-студия.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('presentation')}
              className="hover:text-[#F4F4F6] cursor-pointer"
            >
              Наверх к презентации
            </button>
            <button
              type="button"
              onClick={() => onNavigate('artists')}
              className="hover:text-[#F4F4F6] cursor-pointer"
            >
              Мастера
            </button>
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="hover:text-[#F4F4F6] cursor-pointer"
            >
              Портфолио
            </button>
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className="hover:text-[#F4F4F6] cursor-pointer"
            >
              Запись
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
