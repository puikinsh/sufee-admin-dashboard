// Modern Sufee Admin Dashboard - Main Entry Point
import './styles/main.scss';

// Import vendor styles
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flag-icons/css/flag-icons.min.css';
// Themify icons are loaded via link tag in head-common.html partial

// Bootstrap 5 JavaScript imports
import * as bootstrap from 'bootstrap';

// Make Bootstrap available globally for our components
window.bootstrap = bootstrap;

// Import Chart.js
import Chart from 'chart.js/auto';
window.Chart = Chart;

// Core application components
import { App } from './scripts/app.js';
import { partialsLoader } from './scripts/partials-loader.js';
import { errorHandler } from './scripts/utils/error-handler.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();

  // Initialize partials loader
  partialsLoader.loadAllPartials();
  partialsLoader.initializeSidebarActiveState();
  partialsLoader.initializeHeader();

  // Global app instance for debugging
  if (import.meta.env.DEV) {
    window.sufeeApp = app;
    window.partialsLoader = partialsLoader;
    window.errorHandler = errorHandler;
  }
});
