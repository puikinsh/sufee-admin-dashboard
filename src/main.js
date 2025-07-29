// Modern Sufee Admin Dashboard - Main Entry Point
import './styles/main.scss'

// Bootstrap 5 JavaScript imports
import { Dropdown, Collapse, Modal, Tooltip, Popover, Alert } from 'bootstrap'

// Make Bootstrap available globally for our components
window.bootstrap = {
  Dropdown,
  Collapse, 
  Modal,
  Tooltip,
  Popover,
  Alert
}

// Core application components
import { App } from './scripts/app.js'

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App()
  app.init()

  // Global app instance for debugging
  if (import.meta.env.DEV) {
    window.sufeeApp = app
  }
})