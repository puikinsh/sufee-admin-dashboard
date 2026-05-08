// Theme Manager — toggles light/dark via Bootstrap 5.3's `data-bs-theme`.
//
// Lifecycle:
//   constructor() runs immediately and applies the saved/system theme to
//     <html> so the page paints correctly from first frame.
//   bindToggle() wires up the header button, called from
//     App.onPartialsReady() once the partial is in the DOM.

const STORAGE_KEY = 'sufee-theme';

export class ThemeManager {
  constructor() {
    this.currentTheme = this.resolveInitialTheme();
    this.applyTheme(this.currentTheme);
    this.watchSystemPreference();
  }

  resolveInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  watchSystemPreference() {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) {
      return;
    }
    mq.addEventListener('change', e => {
      // Only follow the system if the user hasn't picked a theme manually.
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Called by App.onPartialsReady() after the header partial is injected.
  bindToggle() {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) {
      return;
    }
    this.updateToggleAppearance(button, this.currentTheme);
    button.addEventListener('click', () => {
      const next = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(next);
      this.updateToggleAppearance(button, next);
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  updateToggleAppearance(button, theme) {
    const icon = button.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon';
    }
    button.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
