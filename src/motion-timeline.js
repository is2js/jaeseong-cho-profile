export function createMotionTimeline(durations, pauseMs = 0) {
  if (!Array.isArray(durations) || !durations.length || durations.some(ms => !Number.isFinite(ms) || ms <= 0)) {
    throw new Error('모션 프레임 시간은 양수여야 합니다.');
  }
  if (!Number.isFinite(pauseMs) || pauseMs < 0) throw new Error('모션 대기 시간을 확인해 주세요.');
  const motionDuration = durations.reduce((sum, ms) => sum + ms, 0);
  const cycleDuration = motionDuration + pauseMs;
  return {
    cycleDuration,
    frameAt(elapsedMs) {
      const time = Math.max(0, Number.isFinite(elapsedMs) ? elapsedMs : 0) % cycleDuration;
      if (time >= motionDuration) return durations.length - 1;
      let end = 0;
      for (let frame = 0; frame < durations.length; frame++) {
        end += durations[frame];
        if (time < end) return frame;
      }
      return durations.length - 1;
    },
  };
}
