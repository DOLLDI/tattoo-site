export interface BookingFormValues {
  name: string;
  contact: string;
  style: string;
  artist: string;
  idea: string;
  preferredDate: string;
  referenceFileName?: string;
  referenceFileSize?: number;
  referenceFileType?: string;
}

export interface BookingValidationErrors {
  name?: string;
  contact?: string;
  style?: string;
  idea?: string;
  preferredDate?: string;
  referenceFile?: string;
}

const MAX_REFERENCE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_REFERENCE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function isValidContact(contact: string): boolean {
  const trimmed = contact.trim();
  if (trimmed.length < 4) return false;

  // Telegram handle: @username (min 4 chars after @)
  if (trimmed.startsWith('@')) {
    return /^@[a-zA-Z0-9_]{4,32}$/.test(trimmed);
  }

  // Phone number: at least 7 digits
  const digitsOnly = trimmed.replace(/[^\d]/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function validateBookingForm(
  values: BookingFormValues,
  todayIso?: string,
): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Укажите ваше имя (минимум 2 символа).';
  }

  if (!isValidContact(values.contact)) {
    errors.contact = 'Введите корректный номер телефона или Telegram (@username).';
  }

  if (!values.style || values.style.trim().length === 0) {
    errors.style = 'Выберите интересующий стиль татуировки.';
  }

  if (!values.idea || values.idea.trim().length < 10) {
    errors.idea = 'Опишите идею, примерный размер и зону нанесения (от 10 символов).';
  }

  if (!values.preferredDate) {
    errors.preferredDate = 'Выберите желаемую дату консультации или сеанса.';
  } else if (todayIso && values.preferredDate < todayIso) {
    errors.preferredDate = 'Дата не может быть в прошлом.';
  }

  if (values.referenceFileName) {
    if (
      values.referenceFileSize !== undefined &&
      values.referenceFileSize > MAX_REFERENCE_BYTES
    ) {
      errors.referenceFile = 'Размер файла референса не должен превышать 10 МБ.';
    } else if (
      values.referenceFileType &&
      !ALLOWED_REFERENCE_TYPES.includes(values.referenceFileType)
    ) {
      errors.referenceFile = 'Допустимые форматы референса: JPG, PNG, WEBP или PDF.';
    }
  }

  return errors;
}

export function hasValidationErrors(errors: BookingValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function generateBookingReference(dateStr: string): string {
  const clean = dateStr.replace(/-/g, '').slice(-4) || '0000';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NA-${clean}-${rand}`;
}
