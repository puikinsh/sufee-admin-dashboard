// Navigation Component - Replaces jQuery navigation logic

import { DOM } from '../utils/dom.js';

export class Navigation {
  constructor() {
    this.isOpen = false;
    this.menuToggle = null;
    this.body = document.body;
    this.sidebar = null;

    this.init();
  }

  init() {
    // Look for new Bootstrap 5 structure elements with correct IDs
    this.menuToggle =
      document.getElementById('sidebarToggleDesktop') ||
      document.getElementById('sidebarToggle') ||
      document.getElementById('sidebarToggleMobile');
    this.sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');

    if (!this.menuToggle || !this.sidebar) {
      // Elements not found, but don't warn since app.js handles sidebar toggles now
      return;
    }

    // Don't convert attributes - let Bootstrap handle collapses natively
    this.setupEventListeners();
    this.handleResponsiveBreakpoints();
  }

  setupEventListeners() {
    // Main menu toggle
    this.menuToggle.addEventListener('click', e => {
      e.preventDefault();
      this.toggleSidebar();
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', e => {
      if (window.innerWidth <= 768 && this.isOpen) {
        if (!this.sidebar.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.closeSidebar();
        }
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResponsiveBreakpoints();
    });
  }

  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.body.classList.add('open');
    this.isOpen = true;

    // Update menu toggle icon
    const icon = this.menuToggle.querySelector('i');
    if (icon) {
      icon.className = 'fa fa-times';
    }

    // Emit custom event
    this.dispatchEvent('sidebar:opened');
  }

  closeSidebar() {
    this.body.classList.remove('open');
    this.isOpen = false;

    // Update menu toggle icon
    const icon = this.menuToggle.querySelector('i');
    if (icon) {
      icon.className = 'fa fa-bars';
    }

    // Emit custom event
    this.dispatchEvent('sidebar:closed');
  }

  handleResponsiveBreakpoints() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
      // Mobile behavior
      this.sidebar.classList.add('mobile');
      if (this.isOpen) {
        this.body.classList.add('sidebar-overlay');
      }
    } else {
      // Desktop behavior
      this.sidebar.classList.remove('mobile');
      this.body.classList.remove('sidebar-overlay');
    }
  }

  // Set active menu item
  setActiveMenuItem(path) {
    // Remove existing active classes
    const activeItems = document.querySelectorAll('.navbar-nav li.active');
    activeItems.forEach(item => item.classList.remove('active'));

    // Find and set new active item
    const menuLinks = document.querySelectorAll('.navbar-nav a');
    menuLinks.forEach(link => {
      if (link.getAttribute('href') === path || link.getAttribute('href') === `.${path}`) {
        const menuItem = link.closest('li');
        menuItem.classList.add('active');

        // If it's a sub-menu item, open the parent menu
        const parentSubMenu = link.closest('.sub-menu');
        if (parentSubMenu) {
          const parentMenuItem = parentSubMenu.closest('.menu-item-has-children');
          this.openSubMenu(parentMenuItem);
        }
      }
    });
  }

  // Utility method to dispatch custom events
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  // Public API
  getState() {
    return {
      isOpen: this.isOpen,
      isMobile: window.innerWidth <= 768
    };
  }

  // Cleanup method
  destroy() {
    // Remove event listeners and cleanup
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleSidebar);
    }

    this.body.classList.remove('open', 'sidebar-overlay');
    this.isOpen = false;
  }
}
