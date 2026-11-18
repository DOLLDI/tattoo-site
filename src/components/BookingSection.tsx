import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Paperclip, X } from 'lucide-react';
import { ARTISTS } from '../data/studio';
import { TATTOO_STYLES } from '../utils/portfolioFilter';
import {
  generateBookingReference,
  hasValidationErrors,
  validateBookingForm,
  type BookingFormValues,
  type BookingValidationErrors,
} from '../utils/bookingValidation';
import { GooeyTextReveal } from './ui/GooeyTextReveal';
import { LiquidMetalButton } from './ui/LiquidMetalButton';

interface BookingSectionProps {
  preselectedStyle: string;
  preselectedArtist: string;
}

interface SubmittedReceipt {
  referenceId: string;
  values: BookingFormValues;
  submittedAt: string;
}

const STYLE_OPTIONS = [...TATTOO_STYLES, 'Помощь с выбором'] as const;

export function BookingSection({
  preselectedStyle,
  preselectedArtist,
}: BookingSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<BookingFormValues>({
    name: '',
    contact: '',
    style: preselectedStyle || 'Black & Grey',
    artist: preselectedArtist || 'Любой свободный резидент',
    idea: '',
    preferredDate: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<BookingValidationErrors>({});
  const [receipt, setReceipt] = useState<SubmittedReceipt | null>(null);

  useEffect(() => {
    if (preselectedStyle) {
      setValues((prev) => ({ ...prev, style: preselectedStyle }));
      setReceipt(null);
    }
  }, [preselectedStyle]);

  useEffect(() => {
    if (preselectedArtist) {
      setValues((prev) => ({ ...prev, artist: preselectedArtist }));
      setReceipt(null);
    }
  }, [preselectedArtist]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFieldChange = (
    field: keyof BookingFormValues,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof BookingValidationErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof BookingValidationErrors];
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    setValues((prev) => ({
      ...prev,
      referenceFileName: file.name,
      referenceFileSize: file.size,
      referenceFileType: file.type,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.referenceFile;
      return next;
    });
  };

  const clearAttachment = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValues((prev) => ({
      ...prev,
      referenceFileName: undefined,
      referenceFileSize: undefined,
      referenceFileType: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayIso = new Date().toISOString().split('T')[0];
    const nextErrors = validateBookingForm(values, todayIso);

    if (hasValidationErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    const refCode = generateBookingReference(values.preferredDate);
    setReceipt({
      referenceId: refCode,
      values: { ...values },
      submittedAt: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const resetForNewRequest = () => {
    setReceipt(null);
    setErrors({});
    clearAttachment();
    setValues({
      name: '',
      contact: '',
      style: preselectedStyle || 'Black & Grey',
      artist: preselectedArtist || 'Любой свободный резидент',
      idea: '',
      preferredDate: '',
    });
  };

  const todayMin = new Date().toISOString().split('T')[0];

  return (
    <section
      id="booking"
      className="border-t border-white/10 bg-[#050506] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Editorial Summary */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-medium tracking-[0.24em] text-[#8A8D94] uppercase">
              04 · Индивидуальная консультация
            </p>
            <GooeyTextReveal>
              <h2
                className="mt-3 font-display text-4xl font-normal tracking-[-0.01em] text-[#F4F4F6] sm:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                Запись на сеанс
              </h2>
            </GooeyTextReveal>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#C8CDD4]/85 sm:text-base">
              Опишите концепцию, выберите направление и удобную дату. После отправки заявки
              администратор связывается с вами, уточняет масштаб и подбирает время для очной
              или онлайн-консультации.
            </p>

            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs text-[#8A8D94]">
              <div>
                <p className="font-medium text-[#F4F4F6]">01 · Обсуждение идеи</p>
                <p className="mt-1 leading-relaxed">
                  Оцениваем анатомическую зону, контраст и примерную продолжительность проекта.
                </p>
              </div>
              <div>
                <p className="font-medium text-[#F4F4F6]">02 · Индивидуальный эскиз</p>
                <p className="mt-1 leading-relaxed">
                  Мастер разрабатывает авторскую композицию специально под ваши параметры.
                </p>
              </div>
              <div>
                <p className="font-medium text-[#F4F4F6]">03 · Демонстрационный режим формы</p>
                <p className="mt-1 leading-relaxed">
                  Фронтенд-архитектура формы подготовлена для интеграции с CRM / Telegram-ботом
                  студии.
                </p>
              </div>
            </div>
          </div>

          {/* Right Form / Confirmation Card */}
          <div className="lg:col-span-7">
            {receipt ? (
              <div
                data-testid="booking-confirmation"
                className="border border-white/15 bg-[#050506] p-8 sm:p-10"
              >
                <div className="flex h-11 w-11 items-center justify-center border border-[#C8CDD4]/40 bg-[#141417] text-[#F4F4F6]">
                  <Check className="h-5 w-5" />
                </div>

                <p className="mt-6 text-[11px] tracking-[0.22em] text-[#8A8D94] uppercase">
                  Заявка сформирована (демонстрационное состояние)
                </p>
                <h3 className="mt-2 font-display text-3xl font-normal text-[#F4F4F6] sm:text-4xl">
                  Мы приняли ваш запрос
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#C8CDD4]/85">
                  Регистрационный номер:{' '}
                  <span className="font-semibold tabular-nums text-[#F4F4F6]">
                    {receipt.referenceId}
                  </span>{' '}
                  · Время фиксации: {receipt.submittedAt}. В рабочей версии сайта данные
                  передаются напрямую администратору студии.
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-4 border-y border-white/10 py-6 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#8A8D94]">Имя</dt>
                    <dd className="mt-1 text-sm text-[#F4F4F6]">{receipt.values.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8A8D94]">Контакт</dt>
                    <dd className="mt-1 text-sm text-[#F4F4F6]">{receipt.values.contact}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8A8D94]">Стиль</dt>
                    <dd className="mt-1 text-sm text-[#F4F4F6]">{receipt.values.style}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8A8D94]">Мастер</dt>
                    <dd className="mt-1 text-sm text-[#F4F4F6]">{receipt.values.artist}</dd>
                  </div>
                  <div>
                    <dt className="text-[#8A8D94]">Предпочтительная дата</dt>
                    <dd className="mt-1 text-sm tabular-nums text-[#F4F4F6]">
                      {receipt.values.preferredDate}
                    </dd>
                  </div>
                  {receipt.values.referenceFileName && (
                    <div>
                      <dt className="text-[#8A8D94]">Референс</dt>
                      <dd className="mt-1 truncate text-sm text-[#F4F4F6]">
                        {receipt.values.referenceFileName}
                      </dd>
                    </div>
                  )}
                </dl>

                <button
                  type="button"
                  onClick={resetForNewRequest}
                  className="mt-8 border border-white/25 bg-[#141417] px-6 py-3 text-xs font-medium tracking-[0.14em] text-[#F4F4F6] uppercase transition-colors hover:border-[#F4F4F6] cursor-pointer"
                >
                  Создать новую заявку
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border border-white/12 bg-[#050506] p-6 sm:p-10"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Имя *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={values.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Как к вам обращаться"
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4F4F6] placeholder-[#8A8D94]/60 focus:border-[#C8CDD4] focus:outline-none"
                    />
                    {errors.name && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone or Telegram */}
                  <div>
                    <label
                      htmlFor="booking-contact"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Телефон или Telegram *
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      value={values.contact}
                      onChange={(e) => handleFieldChange('contact', e.target.value)}
                      placeholder="+7 900 000 00 00 или @username"
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4F4F6] placeholder-[#8A8D94]/60 focus:border-[#C8CDD4] focus:outline-none"
                    />
                    {errors.contact && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.contact}
                      </p>
                    )}
                  </div>

                  {/* Style */}
                  <div>
                    <label
                      htmlFor="booking-style"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Желаемый стиль *
                    </label>
                    <select
                      id="booking-style"
                      value={values.style}
                      onChange={(e) => handleFieldChange('style', e.target.value)}
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4F4F6] focus:border-[#C8CDD4] focus:outline-none"
                    >
                      {STYLE_OPTIONS.map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                    {errors.style && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.style}
                      </p>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Предпочтительная дата *
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      min={todayMin}
                      value={values.preferredDate}
                      onChange={(e) =>
                        handleFieldChange('preferredDate', e.target.value)
                      }
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm tabular-nums text-[#F4F4F6] focus:border-[#C8CDD4] focus:outline-none"
                    />
                    {errors.preferredDate && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>

                  {/* Preferred Artist */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-artist"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Мастер (опционально)
                    </label>
                    <select
                      id="booking-artist"
                      value={values.artist}
                      onChange={(e) => handleFieldChange('artist', e.target.value)}
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4F4F6] focus:border-[#C8CDD4] focus:outline-none"
                    >
                      <option value="Любой свободный резидент">
                        Любой свободный резидент (подбор по стилю)
                      </option>
                      {ARTISTS.map((artist) => (
                        <option key={artist.id} value={artist.name}>
                          {artist.name} — {artist.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Idea Description */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-idea"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Описание идеи и зона нанесения *
                    </label>
                    <textarea
                      id="booking-idea"
                      rows={4}
                      value={values.idea}
                      onChange={(e) => handleFieldChange('idea', e.target.value)}
                      placeholder="Опишите сюжет, предполагаемый размер в сантиметрах и часть тела..."
                      className="mt-2 w-full border border-white/15 bg-[#0B0B0D] px-4 py-3 text-sm text-[#F4F4F6] placeholder-[#8A8D94]/60 focus:border-[#C8CDD4] focus:outline-none"
                    />
                    {errors.idea && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.idea}
                      </p>
                    )}
                  </div>

                  {/* Reference Attachment */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="booking-reference"
                      className="block text-xs font-medium tracking-[0.1em] text-[#C8CDD4] uppercase"
                    >
                      Приложить референс (необязательно)
                    </label>
                    <div className="mt-2 flex flex-wrap items-center gap-4 border border-dashed border-white/20 bg-[#0B0B0D] p-4">
                      <input
                        ref={fileInputRef}
                        id="booking-reference"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 border border-white/20 bg-[#141417] px-4 py-2 text-xs font-medium text-[#F4F4F6] hover:border-[#C8CDD4] cursor-pointer"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>Выбрать файл</span>
                      </button>

                      {values.referenceFileName ? (
                        <div className="flex items-center gap-3 text-xs text-[#C8CDD4]">
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Превью референса"
                              className="h-10 w-10 border border-white/15 object-cover"
                            />
                          )}
                          <span className="max-w-[220px] truncate">
                            {values.referenceFileName}
                          </span>
                          <button
                            type="button"
                            aria-label="Удалить приложенный референс"
                            onClick={clearAttachment}
                            className="text-[#8A8D94] hover:text-[#F4F4F6] cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#8A8D94]">
                          JPG, PNG, WEBP или PDF до 10 МБ
                        </span>
                      )}
                    </div>
                    {errors.referenceFile && (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errors.referenceFile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#8A8D94]">
                    Нажимая кнопку, вы формируете предварительный запрос на консультацию.
                  </p>
                  <LiquidMetalButton
                    type="submit"
                    size="md"
                    icon={<ArrowUpRight className="h-4 w-4" />}
                  >
                    Отправить заявку
                  </LiquidMetalButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
