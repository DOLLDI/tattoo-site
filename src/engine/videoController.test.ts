import test from 'node:test';
import assert from 'node:assert/strict';
import { canCommitVideoFrame } from './videoController';

test('canCommitVideoFrame allows frame 0 on initial load at targetTime=0', () => {
  assert.equal(
    canCommitVideoFrame({
      readyState: 4,
      videoWidth: 1280,
      seeking: false,
      mediaTime: 0,
      targetTime: 0,
      hasDrawnFirstVideoFrame: false,
    }),
    true,
  );
});

test('canCommitVideoFrame rejects unready or actively seeking video states', () => {
  assert.equal(
    canCommitVideoFrame({
      readyState: 1,
      videoWidth: 1280,
      seeking: false,
      mediaTime: 10,
      targetTime: 10,
      hasDrawnFirstVideoFrame: true,
    }),
    false,
  );

  assert.equal(
    canCommitVideoFrame({
      readyState: 4,
      videoWidth: 1280,
      seeking: true,
      mediaTime: 10,
      targetTime: 10,
      hasDrawnFirstVideoFrame: true,
    }),
    false,
  );
});

test('canCommitVideoFrame blocks spurious frame-0 reset when scrolled forward', () => {
  assert.equal(
    canCommitVideoFrame({
      readyState: 2,
      videoWidth: 1280,
      seeking: false,
      mediaTime: 0,
      targetTime: 8.5,
      hasDrawnFirstVideoFrame: true,
    }),
    false,
  );

  assert.equal(
    canCommitVideoFrame({
      readyState: 2,
      videoWidth: 1280,
      seeking: false,
      mediaTime: 0.01,
      targetTime: 4.2,
      hasDrawnFirstVideoFrame: false,
    }),
    false,
  );
});

test('canCommitVideoFrame allows returning cleanly to frame 0 when user scrolls back to top', () => {
  assert.equal(
    canCommitVideoFrame({
      readyState: 4,
      videoWidth: 1280,
      seeking: false,
      mediaTime: 0,
      targetTime: 0.02,
      hasDrawnFirstVideoFrame: true,
    }),
    true,
  );
});
