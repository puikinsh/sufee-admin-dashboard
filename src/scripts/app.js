// Main Application Class - Modern Sufee Admin Dashboard

import { UserMenu } from './components/user-menu.js';
import { ThemeManager } from './components/theme-manager.js';

export class App {
  constructor() {
    this.components = new Map();
    this.initialized = false;
    this.isCollapsed = false;
    this.isMobile = window.innerWidth <= 991.98;
    this.sidebarControlsInitialized = false;
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.initializeComponents();
    this.setupEventListeners();
    this.handleResponsive();
    this.initialized = true;
  }

  // Called by main.js after `partialsLoader.loadAllPartials()` resolves.
  // The header DOM (#sidebarToggleDesktop, #sidebarToggleMobile, etc.) is
  // guaranteed to exist by the time we get here — no setTimeout needed.
  onPartialsReady() {
    this.setupSidebarControlsOnce();
    this.components.get('theme')?.bindToggle();
  }

  initializeComponents() {
    // Initialize user menu and theme (these don't depend on partials)
    this.components.set('userMenu', new UserMenu());
    this.components.set('theme', new ThemeManager());

    // Initialize Bootstrap tooltips and popovers globally
    this.initializeBootstrapComponents();

    // Load page-specific components
    this.loadPageComponents();
  }

  initializeBootstrapComponents() {
    if (typeof window.bootstrap === 'undefined') {
      return;
    }

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach(popoverTriggerEl => {
      new window.bootstrap.Popover(popoverTriggerEl);
    });
  }

  // Component registry: each entry is matched against the DOM. If any element
  // matching `selector` exists, the loader runs. Adding a new component =
  // append a single entry; no central switch statement to maintain.
  static COMPONENT_REGISTRY = [
    {
      name: 'widgets',
      selector: '[id^="widgetChart"], #trafficChart, #worldMap',
      load: async app => {
        const { WidgetManager } = await import('./components/widgets.js');
        app.components.set('widgets', new WidgetManager());
      }
    },
    {
      name: 'charts',
      selector: '[data-chart]',
      load: async app => {
        const { ChartManager } = await import('./components/charts.js');
        app.components.set('charts', new ChartManager());
      }
    },
    {
      name: 'tables',
      selector: '[data-table]',
      load: async app => {
        const { DataTable } = await import('./components/datatable.js');
        document.querySelectorAll('[data-table]').forEach((table, i) => {
          app.components.set(`table-${i}`, new DataTable(table));
        });
      }
    },
    {
      name: 'forms',
      selector: 'form[data-validate]',
      load: async app => {
        const { FormValidator } = await import('./components/validation.js');
        document.querySelectorAll('form[data-validate]').forEach((form, i) => {
          app.components.set(`form-${i}`, new FormValidator(form));
        });
      }
    }
  ];

  loadPageComponents() {
    for (const entry of App.COMPONENT_REGISTRY) {
      if (document.querySelector(entry.selector)) {
        entry.load(this).catch(() => {
          // Component failed to load — page degrades gracefully.
        });
      }
    }
  }

  setupEventListeners() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 150);
    });

    // Handle browser back/forward
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  setupSidebarControlsOnce() {
    // Prevent multiple event listener attachment
    if (this.sidebarControlsInitialized) {
      return;
    }

    // Desktop sidebar toggle (collapse/expand)
    const sidebarToggleDesktop = document.getElementById('sidebarToggleDesktop');
    if (sidebarToggleDesktop) {
      // Remove any existing listeners first
      sidebarToggleDesktop.replaceWith(sidebarToggleDesktop.cloneNode(true));
      const newDesktopToggle = document.getElementById('sidebarToggleDesktop');

      newDesktopToggle.addEventListener('click', e => {
        e.preventDefault();
        this.toggleSidebarCollapse();
      });
    }

    // Mobile sidebar toggle (show/hide)
    const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
    if (sidebarToggleMobile) {
      // Remove any existing listeners first
      sidebarToggleMobile.replaceWith(sidebarToggleMobile.cloneNode(true));
      const newMobileToggle = document.getElementById('sidebarToggleMobile');

      newMobileToggle.addEventListener('click', e => {
        e.preventDefault();
        this.toggleMobileSidebar();
      });
    }

    // Mark as initialized
    this.sidebarControlsInitialized = true;

    // Search toggle functionality
    this.setupSearchToggle();

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', e => {
      if (this.isMobile) {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');

        if (sidebar && sidebar.classList.contains('show')) {
          if (!sidebar.contains(e.target) && !sidebarToggleMobile?.contains(e.target)) {
            this.closeMobileSidebar();
          }
        }
      }
    });

    // Restore sidebar state from localStorage
    this.restoreSidebarState();
  }

  setupSearchToggle() {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const searchForm = document.querySelector('.search-form');

    if (searchToggle && searchForm) {
      searchToggle.addEventListener('click', e => {
        e.preventDefault();
        searchForm.classList.remove('d-none');
        const input = searchForm.querySelector('input');
        if (input) {
          setTimeout(() => input.focus(), 100);
        }
      });
    }

    if (searchClose && searchForm) {
      searchClose.addEventListener('click', e => {
        e.preventDefault();
        searchForm.classList.add('d-none');
      });
    }
  }

  toggleSidebarCollapse() {
    if (this.isMobile) {
      return;
    }

    const body = document.body;
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      body.classList.add('sidebar-collapsed');
      localStorage.setItem('sufee-sidebar-collapsed', 'true');
      this.setupCollapsedSidebarHover();
    } else {
      body.classList.remove('sidebar-collapsed');
      localStorage.setItem('sufee-sidebar-collapsed', 'false');
      this.removeCollapsedSidebarHover();
    }

    // Dispatch custom event for components that need to know
    window.dispatchEvent(
      new CustomEvent('sidebarToggle', {
        detail: { collapsed: this.isCollapsed }
      })
    );
  }

  setupCollapsedSidebarHover() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return;
    }

    // Remove any existing handlers
    this.removeCollapsedSidebarHover();

    // Add hover handlers
    this.sidebarHoverEnter = () => {
      if (this.isCollapsed && !this.isMobile) {
        // Add hover class to sidebar
        sidebar.classList.add('hover');

        // Expand all currently active submenus when hovering
        const activeLink = sidebar.querySelector('.nav-link.active');
        if (activeLink) {
          const parentCollapse = activeLink.closest('.collapse');
          if (parentCollapse) {
            // Temporarily show the parent collapse
            parentCollapse.classList.add('show');

            // Update toggle button state
            const toggleBtn = sidebar.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
            if (toggleBtn) {
              toggleBtn.setAttribute('aria-expanded', 'true');
            }
          }
        }
      }
    };

    this.sidebarHoverLeave = () => {
      if (this.isCollapsed && !this.isMobile) {
        // Remove hover class from sidebar
        sidebar.classList.remove('hover');

        // Hide all collapses when not hovering
        const collapses = sidebar.querySelectorAll('.collapse.show');
        collapses.forEach(collapse => {
          collapse.classList.remove('show');

          // Update toggle button state
          const toggleBtn = sidebar.querySelector(`[data-bs-target="#${collapse.id}"]`);
          if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    };

    sidebar.addEventListener('mouseenter', this.sidebarHoverEnter);
    sidebar.addEventListener('mouseleave', this.sidebarHoverLeave);
  }

  removeCollapsedSidebarHover() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return;
    }

    if (this.sidebarHoverEnter) {
      sidebar.removeEventListener('mouseenter', this.sidebarHoverEnter);
      this.sidebarHoverEnter = null;
    }

    if (this.sidebarHoverLeave) {
      sidebar.removeEventListener('mouseleave', this.sidebarHoverLeave);
      this.sidebarHoverLeave = null;
    }
  }

  toggleMobileSidebar() {
    if (!this.isMobile) {
      return;
    }

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
      return;
    }

    if (sidebar.classList.contains('show')) {
      this.closeMobileSidebar();
    } else {
      this.openMobileSidebar();
    }
  }

  openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = this.getOrCreateBackdrop();

    // Class-only toggle — the mobile fixed-position + transform rules live in
    // components/sidebar.scss (@media max-width: 991.98px). Setting inline
    // styles here would survive the resize back to desktop and hide the
    // sidebar permanently.
    sidebar?.classList.add('show');
    backdrop?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    sidebar?.classList.remove('show');
    backdrop?.classList.remove('show');
    document.body.style.overflow = '';
  }

  getOrCreateBackdrop() {
    let backdrop = document.querySelector('.sidebar-backdrop');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      backdrop.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
      document.body.appendChild(backdrop);
    }

    return backdrop;
  }

  restoreSidebarState() {
    if (!this.isMobile) {
      const wasCollapsed = localStorage.getItem('sufee-sidebar-collapsed') === 'true';
      if (wasCollapsed) {
        document.body.classList.add('sidebar-collapsed');
        this.isCollapsed = true;
        this.setupCollapsedSidebarHover();
      }
    }
  }

  handleResponsive() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 991.98;

    // If switching from desktop to mobile
    if (!wasMobile && this.isMobile) {
      document.body.classList.remove('sidebar-collapsed');
      this.closeMobileSidebar();
    }

    // If switching from mobile to desktop, clear any inline styles a previous
    // version of the toggle code may have left on the sidebar — those would
    // outrank the desktop CSS rules and keep the sidebar off-screen.
    if (wasMobile && !this.isMobile) {
      this.closeMobileSidebar();
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.style.transform = '';
        sidebar.style.position = '';
        sidebar.style.top = '';
        sidebar.style.left = '';
        sidebar.style.zIndex = '';
      }
      this.restoreSidebarState();
    }
  }

  handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const search = this.components.get('search');
      if (search) {
        search.focus();
      }
    }

    // Escape key handlers
    if (event.key === 'Escape') {
      // Close mobile sidebar
      if (this.isMobile && document.getElementById('sidebar')?.classList.contains('show')) {
        this.closeMobileSidebar();
      }

      // Close search form
      const searchForm = document.querySelector('.search-form');
      if (searchForm && !searchForm.classList.contains('d-none')) {
        searchForm.classList.add('d-none');
      }
    }

    // Sidebar toggle shortcut (Ctrl + \)
    if (event.ctrlKey && event.key === '\\') {
      event.preventDefault();
      if (this.isMobile) {
        this.toggleMobileSidebar();
      } else {
        this.toggleSidebarCollapse();
      }
    }
  }

  handleResize() {
    this.handleResponsive();

    // Notify components of resize
    this.components.forEach(component => {
      if (typeof component.handleResize === 'function') {
        component.handleResize();
      }
    });
  }

  handlePopState(_event) {
    // Handle browser navigation if needed
  }

  // Public API methods
  getComponent(name) {
    return this.components.get(name);
  }

  addComponent(name, component) {
    this.components.set(name, component);
  }

  removeComponent(name) {
    const component = this.components.get(name);
    if (component && typeof component.destroy === 'function') {
      component.destroy();
    }
    return this.components.delete(name);
  }

  // Utility methods
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  destroy() {
    // Clean up all components
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
    this.initialized = false;
  }
}
