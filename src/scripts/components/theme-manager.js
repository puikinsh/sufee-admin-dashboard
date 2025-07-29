// Theme Manager Component - Handle dark/light mode

export class ThemeManager {
  constructor() {
    this.currentTheme = 'light'
    this.themeToggle = null
    
    this.init()
  }

  init() {
    // Load saved theme from localStorage
    this.currentTheme = localStorage.getItem('sufee-theme') || 'light'
    
    // Find theme toggle button
    this.themeToggle = document.querySelector('[data-theme-toggle]')
    
    // Apply initial theme
    this.applyTheme(this.currentTheme)
    
    this.setupEventListeners()
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme()
      })
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('sufee-theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light')
        }
      })
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  setTheme(theme) {
    this.currentTheme = theme
    this.applyTheme(theme)
    localStorage.setItem('sufee-theme', theme)
    
    // Emit theme change event
    this.dispatchEvent('theme:changed', { theme })
  }

  applyTheme(theme) {
    const html = document.documentElement
    
    if (theme === 'dark') {
      html.setAttribute('data-bs-theme', 'dark')
      html.classList.add('dark-theme')
    } else {
      html.setAttribute('data-bs-theme', 'light')
      html.classList.remove('dark-theme')
    }

    // Update theme toggle button
    this.updateThemeToggle(theme)
  }

  updateThemeToggle(theme) {
    if (!this.themeToggle) return

    const icon = this.themeToggle.querySelector('i')
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa fa-sun'
        this.themeToggle.setAttribute('title', 'Switch to light mode')
      } else {
        icon.className = 'fa fa-moon'
        this.themeToggle.setAttribute('title', 'Switch to dark mode')
      }
    }
  }

  getCurrentTheme() {
    return this.currentTheme
  }

  // Utility method to dispatch custom events
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { 
      detail,
      bubbles: true,
      cancelable: true
    })
    document.dispatchEvent(event)
  }

  destroy() {
    // Cleanup if needed
  }
}