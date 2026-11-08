import { createMotionTimeline } from './motion-timeline.js';

const PREFERENCE_KEY = 'jaeseong-profile-motion-v1';
const PAUSES = { greet: 1000, chuna: 900, acupuncture: 1000, examination: 1000, walk: 0 };

export async function mountMedicalMotions() {
  const manifestURL = new URL('assets/characters/300/motions.json', document.baseURI);
  const response = await fetch(manifestURL);
  if (!response.ok) throw new Error('의료 캐릭터 모션 파일을 불러오지 못했습니다.');
  const manifest = await response.json();
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let saved = null;
  try { saved = localStorage.getItem(PREFERENCE_KEY); } catch { /* Browser storage may be unavailable. */ }
  let enabled = saved === 'on' || (saved !== 'off' && !preference.matches);
  document.documentElement.dataset.motionState = enabled ? 'on' : 'off';
  const button = document.querySelector('[data-motion-toggle]');
  const players = [];
  for (const element of document.querySelectorAll('[data-medical-motion]')) {
    const key = element.dataset.medicalMotion;
    const motion = manifest.actions[key];
    if (!motion || !Number.isInteger(motion.frames) || motion.frames < 1 || motion.durations?.length !== motion.frames) {
      throw new Error(`캐릭터 모션 구성을 확인해 주세요: ${key}`);
    }
    const sheetURL = new URL(motion.sheet, manifestURL);
    if (sheetURL.origin !== location.origin) throw new Error('캐릭터 이미지는 사이트 내부 파일이어야 합니다.');
    const image = new Image();
    image.src = sheetURL.href;
    await image.decode();
    if (image.naturalWidth !== motion.frameWidth * motion.frames || image.naturalHeight !== motion.frameHeight) {
      throw new Error(`캐릭터 시트 크기를 확인해 주세요: ${key}`);
    }
    const posterURL = new URL(motion.poster, manifestURL);
    if (posterURL.origin !== location.origin) throw new Error('캐릭터 정지 이미지는 사이트 내부 파일이어야 합니다.');
    players.push({ element, motion, sheetURL, posterURL, timeline: createMotionTimeline(motion.durations, PAUSES[key]), elapsed: 0, visible: false, frame: 0 });
  }

  let raf = null;
  let lastTime = null;
  function stop() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    lastTime = null;
  }
  function canRun() { return enabled && !document.hidden && players.some(player => player.visible); }
  function schedule() { if (raf === null && canRun()) raf = requestAnimationFrame(tick); }
  function tick(time) {
    raf = null;
    if (!canRun()) { lastTime = null; return; }
    const delta = lastTime === null ? 0 : Math.min(100, Math.max(0, time - lastTime));
    lastTime = time;
    for (const player of players) {
      if (!player.visible) continue;
      player.elapsed += delta;
      const frame = player.timeline.frameAt(player.elapsed);
      if (frame === player.frame) continue;
      player.frame = frame;
      const position = player.motion.frames === 1 ? 0 : frame / (player.motion.frames - 1) * 100;
      player.element.style.backgroundPosition = `${position}% 0%`;
    }
    schedule();
  }
  function updateButton() {
    if (!button) return;
    button.hidden = false;
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = enabled ? '장식 움직임 끄기' : '장식 움직임 켜기';
  }
  function showMode() {
    for (const player of players) {
      player.element.style.backgroundImage = `url("${enabled ? player.sheetURL.href : player.posterURL.href}")`;
      player.element.style.backgroundSize = enabled ? `${player.motion.frames * 100}% 100%` : '100% 100%';
      player.element.style.backgroundPosition = '0% 0%';
      player.frame = 0;
      player.elapsed = 0;
    }
  }
  function setEnabled(value) {
    enabled = value;
    document.documentElement.dataset.motionState = enabled ? 'on' : 'off';
    showMode();
    updateButton();
    if (enabled) schedule(); else stop();
  }
  const onToggle = () => {
    saved = enabled ? 'off' : 'on';
    try { localStorage.setItem(PREFERENCE_KEY, saved); } catch { /* Keep the choice for this visit. */ }
    setEnabled(!enabled);
  };
  const onPreference = () => { if (saved !== 'on' && saved !== 'off') setEnabled(!preference.matches); };
  const onVisibility = () => { if (document.hidden) stop(); else schedule(); };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const player = players.find(item => item.element === entry.target);
      if (player) player.visible = entry.isIntersecting;
    }
    if (!canRun()) stop(); else schedule();
  }, { threshold: 0 });
  players.forEach(player => observer.observe(player.element));
  button?.addEventListener('click', onToggle);
  preference.addEventListener('change', onPreference);
  document.addEventListener('visibilitychange', onVisibility);
  showMode();
  updateButton();

  return () => {
    stop();
    observer.disconnect();
    button?.removeEventListener('click', onToggle);
    preference.removeEventListener('change', onPreference);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
