// Main Application Class - Modern Sufee Admin Dashboard

import { UserMenu } from './components/user-menu.js'
import { ThemeManager } from './components/theme-manager.js'
import { DOM } from './utils/dom.js'

export class App {
  constructor() {
    this.components = new Map()
    this.initialized = false
    this.isCollapsed = false
    this.isMobile = window.innerWidth <= 991.98
    this.sidebarControlsInitialized = false
  }

  init() {
    if (this.initialized) {
      return
    }

    this.initializeComponents()
    this.setupEventListeners()
    this.handleResponsive()
    this.initialized = true

    // Listen for header loaded to setup sidebar controls
    document.addEventListener('partialLoaded', (event) => {
      if (event.detail.partialName === 'header') {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
          this.setupSidebarControlsOnce()
        }, 100)
      }
    })
  }

  initializeComponents() {
    // Initialize user menu and theme (these don't depend on partials)
    this.components.set('userMenu', new UserMenu())
    this.components.set('theme', new ThemeManager())

    // Initialize Bootstrap tooltips and popovers globally
    this.initializeBootstrapComponents()

    // Load page-specific components
    this.loadPageComponents()

    // Note: Navigation and Search functionality is handled by partials-loader.js
    // after the partials are loaded to prevent timing conflicts
  }

  initializeBootstrapComponents() {
    // Wait for Bootstrap to be available
    if (typeof window.bootstrap === 'undefined') {
      return
    }

    // Note: Bootstrap collapse disabling is handled by Navigation component

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new window.bootstrap.Tooltip(tooltipTriggerEl)
    })

    // Initialize popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    popoverTriggerList.forEach(popoverTriggerEl => {
      new window.bootstrap.Popover(popoverTriggerEl)
    })
  }


  loadPageComponents() {
    const body = document.body
    const pageType = body.dataset.page || 'default'

    // Dynamically load components based on page type
    switch (pageType) {
      case 'dashboard':
        this.loadDashboardComponents()
        break
      case 'charts':
        this.loadChartComponents()
        break
      case 'tables':
        this.loadTableComponents()
        break
      case 'forms':
        this.loadFormComponents()
        break
      default:
        // Load basic components for all pages
        break
    }
  }

  async loadDashboardComponents() {
    try {
      const { WidgetManager } = await import('./components/widgets.js')
      this.components.set('widgets', new WidgetManager())
    } catch (error) {
      // Silently fail
    }
  }

  async loadChartComponents() {
    try {
      const { ChartManager } = await import('./components/charts.js')
      this.components.set('charts', new ChartManager())
    } catch (error) {
      // Silently fail
    }
  }

  async loadTableComponents() {
    try {
      const { DataTable } = await import('./components/datatable.js')
      
      // Initialize all data tables on the page
      const tables = document.querySelectorAll('[data-table]')
      tables.forEach((table, index) => {
        this.components.set(`table-${index}`, new DataTable(table))
      })
    } catch (error) {
      // Silently fail
    }
  }

  async loadFormComponents() {
    try {
      const { FormValidator } = await import('./components/validation.js')
      
      // Initialize forms with validation
      const forms = document.querySelectorAll('form[data-validate]')
      forms.forEach((form, index) => {
        this.components.set(`form-${index}`, new FormValidator(form))
      })
    } catch (error) {
      // Silently fail
    }
  }

  setupEventListeners() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this))

    // Window resize handler
    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.handleResize()
      }, 150)
    })

    // Handle browser back/forward
    window.addEventListener('popstate', this.handlePopState.bind(this))
  }

  setupSidebarControlsOnce() {
    // Prevent multiple event listener attachment
    if (this.sidebarControlsInitialized) {
      return
    }

    // Desktop sidebar toggle (collapse/expand)
    const sidebarToggleDesktop = document.getElementById('sidebarToggleDesktop')
    if (sidebarToggleDesktop) {
      // Remove any existing listeners first
      sidebarToggleDesktop.replaceWith(sidebarToggleDesktop.cloneNode(true))
      const newDesktopToggle = document.getElementById('sidebarToggleDesktop')
      
      newDesktopToggle.addEventListener('click', (e) => {
        e.preventDefault()
        this.toggleSidebarCollapse()
      })
    }

    // Mobile sidebar toggle (show/hide)
    const sidebarToggleMobile = document.getElementById('sidebarToggleMobile')
    if (sidebarToggleMobile) {
      // Remove any existing listeners first
      sidebarToggleMobile.replaceWith(sidebarToggleMobile.cloneNode(true))
      const newMobileToggle = document.getElementById('sidebarToggleMobile')
      
      newMobileToggle.addEventListener('click', (e) => {
        e.preventDefault()
        this.toggleMobileSidebar()
      })
    }

    // Mark as initialized
    this.sidebarControlsInitialized = true

    // Search toggle functionality
    this.setupSearchToggle()

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (this.isMobile) {
        const sidebar = document.getElementById('sidebar')
        const sidebarToggleMobile = document.getElementById('sidebarToggleMobile')
        
        if (sidebar && sidebar.classList.contains('show')) {
          if (!sidebar.contains(e.target) && !sidebarToggleMobile?.contains(e.target)) {
            this.closeMobileSidebar()
          }
        }
      }
    })

    // Restore sidebar state from localStorage
    this.restoreSidebarState()
  }

  setupSearchToggle() {
    const searchToggle = document.getElementById('searchToggle')
    const searchClose = document.getElementById('searchClose')
    const searchForm = document.querySelector('.search-form')
    
    if (searchToggle && searchForm) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault()
        searchForm.classList.remove('d-none')
        const input = searchForm.querySelector('input')
        if (input) {
          setTimeout(() => input.focus(), 100)
        }
      })
    }
    
    if (searchClose && searchForm) {
      searchClose.addEventListener('click', (e) => {
        e.preventDefault()
        searchForm.classList.add('d-none')
      })
    }
  }

  toggleSidebarCollapse() {
    if (this.isMobile) return
    
    const body = document.body
    this.isCollapsed = !this.isCollapsed
    
    if (this.isCollapsed) {
      body.classList.add('sidebar-collapsed')
      localStorage.setItem('sufee-sidebar-collapsed', 'true')
    } else {
      body.classList.remove('sidebar-collapsed')
      localStorage.setItem('sufee-sidebar-collapsed', 'false')
    }
    
    // Dispatch custom event for components that need to know
    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { collapsed: this.isCollapsed }
    }))
  }

  toggleMobileSidebar() {
    if (!this.isMobile) {
      return
    }
    
    const sidebar = document.getElementById('sidebar')
    if (!sidebar) {
      return
    }
    
    if (sidebar.classList.contains('show')) {
      this.closeMobileSidebar()
    } else {
      this.openMobileSidebar()
    }
  }

  openMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const backdrop = this.getOrCreateBackdrop()
    
    if (sidebar) {
      sidebar.classList.add('show')
      // Force the transform style directly
      sidebar.style.transform = 'translateX(0)'
      sidebar.style.position = 'fixed'
      sidebar.style.top = '0'
      sidebar.style.left = '0'
      sidebar.style.zIndex = '1050'
    }
    
    if (backdrop) {
      backdrop.classList.add('show')
    }
    
    document.body.style.overflow = 'hidden'
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const backdrop = document.querySelector('.sidebar-backdrop')
    
    if (sidebar) {
      sidebar.classList.remove('show')
      // Force the transform style directly for close
      sidebar.style.transform = 'translateX(-100%)'
    }
    
    if (backdrop) {
      backdrop.classList.remove('show')
    }
    
    document.body.style.overflow = ''
  }

  getOrCreateBackdrop() {
    let backdrop = document.querySelector('.sidebar-backdrop')
    
    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.className = 'sidebar-backdrop'
      backdrop.addEventListener('click', () => {
        this.closeMobileSidebar()
      })
      document.body.appendChild(backdrop)
    }
    
    return backdrop
  }

  restoreSidebarState() {
    if (!this.isMobile) {
      const wasCollapsed = localStorage.getItem('sufee-sidebar-collapsed') === 'true'
      if (wasCollapsed) {
        document.body.classList.add('sidebar-collapsed')
        this.isCollapsed = true
      }
    }
  }

  handleResponsive() {
    const wasMobile = this.isMobile
    this.isMobile = window.innerWidth <= 991.98
    
    // If switching from desktop to mobile
    if (!wasMobile && this.isMobile) {
      document.body.classList.remove('sidebar-collapsed')
      this.closeMobileSidebar()
    }
    
    // If switching from mobile to desktop
    if (wasMobile && !this.isMobile) {
      this.closeMobileSidebar()
      this.restoreSidebarState()
    }
  }

  handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      const search = this.components.get('search')
      if (search) {
        search.focus()
      }
    }

    // Escape key handlers
    if (event.key === 'Escape') {
      // Close mobile sidebar
      if (this.isMobile && document.getElementById('sidebar')?.classList.contains('show')) {
        this.closeMobileSidebar()
      }
      
      // Close search form
      const searchForm = document.querySelector('.search-form')
      if (searchForm && !searchForm.classList.contains('d-none')) {
        searchForm.classList.add('d-none')
      }
    }

    // Sidebar toggle shortcut (Ctrl + \)
    if (event.ctrlKey && event.key === '\\') {
      event.preventDefault()
      if (this.isMobile) {
        this.toggleMobileSidebar()
      } else {
        this.toggleSidebarCollapse()
      }
    }
  }

  handleResize() {
    this.handleResponsive()
    
    // Notify components of resize
    this.components.forEach(component => {
      if (typeof component.handleResize === 'function') {
        component.handleResize()
      }
    })
  }

  handlePopState(event) {
    // Handle browser navigation if needed
  }

  // Public API methods
  getComponent(name) {
    return this.components.get(name)
  }

  addComponent(name, component) {
    this.components.set(name, component)
  }

  removeComponent(name) {
    const component = this.components.get(name)
    if (component && typeof component.destroy === 'function') {
      component.destroy()
    }
    return this.components.delete(name)
  }

  // Utility methods
  showNotification(message, type = 'success') {
    const notification = document.createElement('div')
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;'
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    
    document.body.appendChild(notification)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  destroy() {
    // Clean up all components
    this.components.forEach(component => {
      if (typeof component.destroy === 'function') {
        component.destroy()
      }
    })
    this.components.clear()
    this.initialized = false
  }
}