export function mountAmbientMotion() {
  const sections = [...document.querySelectorAll('.illustrated-section, .hero')];
  const onVisibility = () => { document.documentElement.dataset.pageVisible = String(!document.hidden); };
  onVisibility();
  document.addEventListener('visibilitychange', onVisibility);
  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => { section.dataset.visualInview = 'true'; });
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.dataset.visualInview = String(entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add('has-entered');
    });
  }, { threshold: 0, rootMargin: '-24px 0px' });
  sections.forEach(section => observer.observe(section));
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
