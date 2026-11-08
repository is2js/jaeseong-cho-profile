import Alpine from 'alpinejs';
import profile from '../data/profile.json';
import './styles.css';
import './section-visuals.css';
import { mountMedicalMotions } from './medical-motions.js';
import { mountAmbientMotion } from './ambient-motion.js';
import './ambient-motion.css';

Alpine.data('profileApp', () => ({
  profile,
  menuOpen: false,
  init() {
    this._escape = event => {
      if (event.key === 'Escape' && this.menuOpen) {
        this.menuOpen = false;
        this.$nextTick(() => document.querySelector('.mobile-menu')?.focus());
      }
    };
    window.addEventListener('keydown', this._escape);
  },
  destroy() { window.removeEventListener('keydown', this._escape); },
}));
Alpine.start();
mountAmbientMotion();

mountMedicalMotions().catch(error => {
  document.documentElement.dataset.motionState = 'off';
  console.warn('장식용 캐릭터를 표시하지 못했습니다.', error.message);
});
