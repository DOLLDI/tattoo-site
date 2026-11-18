import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidContact,
  validateBookingForm,
  hasValidationErrors,
} from './bookingValidation';

test('isValidContact accepts valid phone numbers and Telegram handles', () => {
  assert.equal(isValidContact('+7 900 123 45 67'), true);
  assert.equal(isValidContact('@nocturne_client'), true);
  assert.equal(isValidContact('123'), false);
  assert.equal(isValidContact('@ab'), false);
});

test('validateBookingForm rejects empty required fields and invalid dates', () => {
  const errors = validateBookingForm(
    {
      name: '',
      contact: 'abc',
      style: '',
      artist: '',
      idea: 'коротко',
      preferredDate: '2020-01-01',
    },
    '2026-11-18',
  );

  assert.equal(hasValidationErrors(errors), true);
  assert.ok(errors.name);
  assert.ok(errors.contact);
  assert.ok(errors.style);
  assert.ok(errors.idea);
  assert.ok(errors.preferredDate);
});

test('validateBookingForm validates optional reference file size and MIME type', () => {
  const errors = validateBookingForm(
    {
      name: 'Анна',
      contact: '@anna_art',
      style: 'Fine Line',
      artist: 'Любой мастер',
      idea: 'Ботанический минимализм вдоль предплечья около 15 см.',
      preferredDate: '2026-12-01',
      referenceFileName: 'huge.png',
      referenceFileSize: 12 * 1024 * 1024,
      referenceFileType: 'image/png',
    },
    '2026-11-18',
  );
  assert.ok(errors.referenceFile);

  const validErrors = validateBookingForm(
    {
      name: 'Анна',
      contact: '@anna_art',
      style: 'Fine Line',
      artist: 'Любой мастер',
      idea: 'Ботанический минимализм вдоль предплечья около 15 см.',
      preferredDate: '2026-12-01',
      referenceFileName: 'ref.jpg',
      referenceFileSize: 2 * 1024 * 1024,
      referenceFileType: 'image/jpeg',
    },
    '2026-11-18',
  );
  assert.equal(hasValidationErrors(validErrors), false);
});
