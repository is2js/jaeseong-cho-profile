import test from 'node:test';
import assert from 'node:assert/strict';
import { createMotionTimeline } from '../src/motion-timeline.js';

test('원본의 서로 다른 프레임 시간을 유지하고 마지막 프레임에서 다음 루프를 기다린다', () => {
  const timeline = createMotionTimeline([100, 200, 50], 500);
  assert.equal(timeline.frameAt(0), 0);
  assert.equal(timeline.frameAt(99), 0);
  assert.equal(timeline.frameAt(100), 1);
  assert.equal(timeline.frameAt(299), 1);
  assert.equal(timeline.frameAt(300), 2);
  assert.equal(timeline.frameAt(849), 2);
  assert.equal(timeline.frameAt(850), 0);
  assert.equal(timeline.frameAt(850 * 100000 + 100), 1);
});

test('걷기는 추가 정지 없이 순환하며 유효하지 않은 프레임 시간을 거부한다', () => {
  const walk = createMotionTimeline([70, 70, 70, 70, 70, 70]);
  assert.equal(walk.cycleDuration, 420);
  assert.equal(walk.frameAt(419), 5);
  assert.equal(walk.frameAt(420), 0);
  assert.equal(walk.frameAt(-1), 0);
  assert.throws(() => createMotionTimeline([0]), /양수/);
  assert.throws(() => createMotionTimeline([]), /양수/);
});
