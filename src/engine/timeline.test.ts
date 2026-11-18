import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRESENTATION_SCENES,
  TOTAL_FRAMES,
  VIDEO_DURATION_SECONDS,
  frameToTime,
  timeToFrame,
  progressToFrame,
  getSceneOpacityAtFrame,
  getSceneStatesAtFrame,
  getActiveSceneIndex,
} from './timeline';

test('video timeline constants match 60fps 39s12f specification', () => {
  assert.equal(TOTAL_FRAMES, 2352);
  assert.ok(Math.abs(VIDEO_DURATION_SECONDS - 39.2) < 1e-6);
  assert.ok(Math.abs(frameToTime(2352) - 39.2) < 1e-6);
  assert.equal(Math.round(timeToFrame(39.2)), 2352);
});

test('progressToFrame clamps and maps linearly across 0..2352', () => {
  assert.equal(progressToFrame(-0.5), 0);
  assert.equal(progressToFrame(0), 0);
  assert.equal(progressToFrame(0.5), 1176);
  assert.equal(progressToFrame(1), 2352);
  assert.equal(progressToFrame(1.4), 2352);
});

test('all 8 scenes reach full opacity=1 during their exact editorial plateaus', () => {
  for (const scene of PRESENTATION_SCENES) {
    const midFrame = (scene.startFrame + scene.endFrame) / 2;
    assert.equal(
      getSceneOpacityAtFrame(scene, midFrame),
      1,
      `Expected scene ${scene.id} to be opacity 1 at frame ${midFrame}`,
    );
  }
});

test('no two scenes overlap in visibility at any frame from 0 to 2352', () => {
  for (let f = 0; f <= TOTAL_FRAMES; f++) {
    const states = getSceneStatesAtFrame(f);
    const visible = states.filter((s) => s.opacity > 0.001);
    assert.ok(
      visible.length <= 1,
      `Frame ${f} has overlapping scenes: ${visible.map((v) => v.id).join(', ')}`,
    );
  }
});

test('getActiveSceneIndex tracks scene progression accurately', () => {
  assert.equal(getActiveSceneIndex(0), 0);
  assert.equal(getActiveSceneIndex(452), 1);
  assert.equal(getActiveSceneIndex(814), 2);
  assert.equal(getActiveSceneIndex(1176), 3);
  assert.equal(getActiveSceneIndex(1339), 4);
  assert.equal(getActiveSceneIndex(1598), 5);
  assert.equal(getActiveSceneIndex(1960), 6);
  assert.equal(getActiveSceneIndex(2320), 7);
});
