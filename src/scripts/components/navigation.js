// Navigation Component - Replaces jQuery navigation logic

import { DOM } from '../utils/dom.js'

export class Navigation {
  constructor() {
    this.isOpen = false
    this.menuToggle = null
    this.body = document.body
    this.sidebar = null
    
    this.init()
  }

  init() {
    // Look for new Bootstrap 5 structure elements with correct IDs
    this.menuToggle = document.getElementById('sidebarToggleDesktop') || 
                     document.getElementById('sidebarToggle') ||
                     document.getElementById('sidebarToggleMobile')
    this.sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar')
    
    if (!this.menuToggle || !this.sidebar) {
      // Elements not found, but don't warn since app.js handles sidebar toggles now
      return
    }

    // Convert Bootstrap collapse attributes to custom ones
    this.convertCollapseAttributes()
    this.setupEventListeners()
    this.initializeSubMenus()
    this.handleResponsiveBreakpoints()
  }

  convertCollapseAttributes() {
    // Convert Bootstrap collapse data attributes to custom ones to prevent conflicts
    const sidebarCollapses = document.querySelectorAll('.sidebar [data-bs-toggle="collapse"]')
    sidebarCollapses.forEach(element => {
      const target = element.getAttribute('data-bs-target')
      if (target) {
        element.setAttribute('data-custom-collapse-target', target)
        element.removeAttribute('data-bs-toggle')
        element.removeAttribute('data-bs-target')
      }
    })
  }

  setupEventListeners() {
    // Main menu toggle
    this.menuToggle.addEventListener('click', (e) => {
      e.preventDefault()
      this.toggleSidebar()
    })

    // Custom collapse toggles (using data-custom-collapse-target to avoid Bootstrap conflicts)
    const collapseToggles = document.querySelectorAll('[data-custom-collapse-target]')
    
    collapseToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Get target collapse element using custom attribute
        const targetSelector = toggle.getAttribute('data-custom-collapse-target')
        const targetElement = document.querySelector(targetSelector)
        
        if (targetElement) {
          this.toggleCollapse(targetElement)
        }
      })
    })

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && this.isOpen) {
        if (!this.sidebar.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.closeSidebar()
        }
      }
    })

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResponsiveBreakpoints()
    })
  }

  toggleSidebar() {
    if (this.isOpen) {
      this.closeSidebar()
    } else {
      this.openSidebar()
    }
  }

  openSidebar() {
    this.body.classList.add('open')
    this.isOpen = true
    
    // Update menu toggle icon
    const icon = this.menuToggle.querySelector('i')
    if (icon) {
      icon.className = 'fa fa-times'
    }

    // Emit custom event
    this.dispatchEvent('sidebar:opened')
  }

  closeSidebar() {
    this.body.classList.remove('open')
    this.isOpen = false
    
    // Update menu toggle icon
    const icon = this.menuToggle.querySelector('i')
    if (icon) {
      icon.className = 'fa fa-bars'
    }

    // Emit custom event
    this.dispatchEvent('sidebar:closed')
  }

  toggleCollapse(collapseElement) {
    const isOpen = collapseElement.classList.contains('show')
    
    // Close all other collapses at the same level (accordion behavior)
    const parentNav = collapseElement.closest('.sidebar-nav')
    if (parentNav) {
      const allCollapses = parentNav.querySelectorAll('.collapse.show')
      allCollapses.forEach(collapse => {
        if (collapse !== collapseElement) {
          this.closeCollapse(collapse)
        }
      })
    }

    if (isOpen) {
      this.closeCollapse(collapseElement)
    } else {
      this.openCollapse(collapseElement)
    }
  }

  openCollapse(collapseElement) {
    // Show element first, then trigger animation with slight delay
    collapseElement.style.display = 'block'
    
    // Force reflow to ensure display:block is applied before adding .show class
    collapseElement.offsetHeight
    
    // Add show class to trigger CSS animation
    collapseElement.classList.add('show')
    
    // Update aria-expanded attribute on the toggle button
    const toggle = document.querySelector(`[data-custom-collapse-target="#${collapseElement.id}"]`)
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true')
    }

    // Emit custom event
    this.dispatchEvent('submenu:opened', { collapseElement })
  }

  closeCollapse(collapseElement) {
    // Remove show class to trigger CSS animation
    collapseElement.classList.remove('show')
    
    // Hide element after animation completes (250ms)
    setTimeout(() => {
      if (!collapseElement.classList.contains('show')) {
        collapseElement.style.display = 'none'
      }
    }, 250)
    
    // Update aria-expanded attribute on the toggle button
    const toggle = document.querySelector(`[data-custom-collapse-target="#${collapseElement.id}"]`)
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false')
    }

    // Emit custom event
    this.dispatchEvent('submenu:closed', { collapseElement })
  }

  initializeSubMenus() {
    // Pre-calculate and fix heights for all collapse elements to prevent jumping
    const collapses = document.querySelectorAll('.collapse')
    collapses.forEach(collapse => {
      // Get the nav inside the collapse
      const nav = collapse.querySelector('.nav')
      if (nav) {
        // Count the nav items and calculate exact height
        const navItems = nav.querySelectorAll('.nav-item')
        const exactHeight = navItems.length * 32 + 8 // 32px per item + 8px top margin
        
        // Pre-set the exact dimensions to prevent any layout calculation
        collapse.style.setProperty('--calculated-height', `${exactHeight}px`)
        nav.style.height = `${exactHeight - 8}px` // Subtract top margin
        nav.style.minHeight = `${exactHeight - 8}px`
        nav.style.maxHeight = `${exactHeight - 8}px`
      }
      
      // Ensure all collapses start in the closed state
      if (!collapse.classList.contains('show')) {
        collapse.style.display = 'none'
      }
      
      // Set proper aria-expanded state
      const toggle = document.querySelector(`[data-custom-collapse-target="#${collapse.id}"]`)
      if (toggle) {
        const isExpanded = collapse.classList.contains('show')
        toggle.setAttribute('aria-expanded', isExpanded.toString())
      }
    })
  }

  handleResponsiveBreakpoints() {
    const windowWidth = window.innerWidth
    
    if (windowWidth <= 768) {
      // Mobile behavior
      this.sidebar.classList.add('mobile')
      if (this.isOpen) {
        this.body.classList.add('sidebar-overlay')
      }
    } else {
      // Desktop behavior
      this.sidebar.classList.remove('mobile')
      this.body.classList.remove('sidebar-overlay')
    }
  }

  // Set active menu item
  setActiveMenuItem(path) {
    // Remove existing active classes
    const activeItems = document.querySelectorAll('.navbar-nav li.active')
    activeItems.forEach(item => item.classList.remove('active'))

    // Find and set new active item
    const menuLinks = document.querySelectorAll('.navbar-nav a')
    menuLinks.forEach(link => {
      if (link.getAttribute('href') === path || link.getAttribute('href') === `.${path}`) {
        const menuItem = link.closest('li')
        menuItem.classList.add('active')

        // If it's a sub-menu item, open the parent menu
        const parentSubMenu = link.closest('.sub-menu')
        if (parentSubMenu) {
          const parentMenuItem = parentSubMenu.closest('.menu-item-has-children')
          this.openSubMenu(parentMenuItem)
        }
      }
    })
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

  // Public API
  getState() {
    return {
      isOpen: this.isOpen,
      isMobile: window.innerWidth <= 768
    }
  }

  // Cleanup method
  destroy() {
    // Remove event listeners and cleanup
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggleSidebar)
    }
    
    this.body.classList.remove('open', 'sidebar-overlay')
    this.isOpen = false
  }
}