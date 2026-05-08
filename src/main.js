// Modern Sufee Admin Dashboard - Main Entry Point
// Bootstrap SCSS source is imported via styles/main.scss (themed).
// Don't also import bootstrap/dist/css/bootstrap.min.css — its compiled
// defaults would override the themed values.
import './styles/main.scss';

// Vendor icon CSS (kept as prebuilt CSS — no theming needed)
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flag-icons/css/flag-icons.min.css';
// Themify icons are loaded via link tag in head-common.html partial

// Self-hosted Open Sans (variable font, all weights in one file)
import '@fontsource-variable/open-sans/wght.css';
import '@fontsource-variable/open-sans/wght-italic.css';

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

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App();
  app.init();

  // Wait for sidebar/header/etc. to be injected before kicking off the
  // post-partial setup (sidebar controls, active-state highlighting). This
  // replaces the setTimeout-based polling in earlier versions.
  await partialsLoader.loadAllPartials();

  partialsLoader.initializeSidebarActiveState();
  partialsLoader.initializeHeader();
  app.onPartialsReady();

  // Signal to anything listening (e.g. in user code) that the chrome is in.
  document.dispatchEvent(new CustomEvent('partialsReady'));

  // Globals for debugging in dev only
  if (import.meta.env.DEV) {
    window.sufeeApp = app;
    window.partialsLoader = partialsLoader;
    window.errorHandler = errorHandler;
  }
});
