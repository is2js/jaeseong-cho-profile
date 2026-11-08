import Alpine from 'alpinejs';
import profile from '../data/profile.json';
import './styles.css';

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
