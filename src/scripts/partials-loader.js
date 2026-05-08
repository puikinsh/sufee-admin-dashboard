/**
 * Partials Loader Module
 * Dynamically loads and injects HTML partials into the page
 */

import { initializeBreadcrumb } from './breadcrumb-helper.js';

export class PartialsLoader {
  constructor() {
    this.cache = new Map();
    // Use relative path to support subfolder deployments
    this.basePath = './partials/';
  }

  /**
   * Load a partial from the server or cache
   * @param {string} name - Name of the partial (without .html extension)
   * @returns {Promise<string>} - The HTML content
   */
  async loadPartial(name) {
    // Check cache first
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }

    try {
      const response = await fetch(`${this.basePath}${name}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load partial: ${name}`);
      }

      const html = await response.text();
      this.cache.set(name, html);
      return html;
    } catch {
      return '';
    }
  }

  /**
   * Insert a partial into a container element
   * @param {string} partialName - Name of the partial
   * @param {string} selector - CSS selector for the container
   * @param {Object} options - Options for insertion
   */
  async insertPartial(partialName, selector, options = {}) {
    const container = document.querySelector(selector);
    if (!container) {
      return;
    }

    const html = await this.loadPartial(partialName);

    if (options.replace) {
      // Check if element has a parent before trying to replace
      if (container.parentNode) {
        container.outerHTML = html;
      } else {
        // Fallback to innerHTML replacement
        container.innerHTML = html;
      }
    } else if (options.prepend) {
      container.insertAdjacentHTML('afterbegin', html);
    } else if (options.append) {
      container.insertAdjacentHTML('beforeend', html);
    } else {
      container.innerHTML = html;
    }

    // Trigger custom event after insertion
    document.dispatchEvent(
      new CustomEvent('partialLoaded', {
        detail: { partialName, selector }
      })
    );
  }

  /**
   * Insert a partial directly into an element
   * @param {string} partialName - Name of the partial
   * @param {Element} element - The DOM element to update
   * @param {Object} options - Options for insertion
   */
  async insertPartialElement(partialName, element, options = {}) {
    if (!element) {
      return;
    }

    const html = await this.loadPartial(partialName);

    if (options.replace) {
      // Check if element has a parent before trying to replace
      if (element.parentNode) {
        element.outerHTML = html;
      } else {
        // Fallback to innerHTML replacement
        element.innerHTML = html;
      }
    } else if (options.prepend) {
      element.insertAdjacentHTML('afterbegin', html);
    } else if (options.append) {
      element.insertAdjacentHTML('beforeend', html);
    } else {
      element.innerHTML = html;
    }

    // Trigger custom event after insertion
    document.dispatchEvent(
      new CustomEvent('partialLoaded', {
        detail: { partialName, element }
      })
    );
  }

  /**
   * Load multiple partials based on data attributes
   * Elements with data-partial attribute will have their content replaced
   */
  async loadAllPartials() {
    const elements = document.querySelectorAll('[data-partial]');
    const promises = [];

    elements.forEach((element, index) => {
      const partialName = element.dataset.partial;
      const options = {
        replace: element.dataset.partialReplace === 'true',
        prepend: element.dataset.partialPrepend === 'true',
        append: element.dataset.partialAppend === 'true'
      };

      // Add unique identifier to avoid selector conflicts
      element.setAttribute('data-partial-id', index);

      promises.push(this.insertPartialElement(partialName, element, options));
    });

    await Promise.all(promises);

    // Initialize breadcrumbs after partials are loaded
    initializeBreadcrumb();
  }

  /**
   * Highlight the active sidebar link for the current page.
   * Must be called after `loadAllPartials()` resolves — the sidebar partial
   * is guaranteed to be in the DOM by then.
   */
  initializeSidebarActiveState() {
    const currentPage = document.body.dataset.page;
    if (!currentPage) {
      return;
    }

    const activeLink = document.querySelector(`.sidebar .nav-link[data-page="${currentPage}"]`);
    if (!activeLink) {
      return;
    }

    activeLink.classList.add('active');

    // Expand the parent collapse if the active link is in a submenu
    const parentCollapse = activeLink.closest('.collapse');
    if (!parentCollapse) {
      return;
    }
    parentCollapse.classList.add('show');

    const toggleButton = document.querySelector(`[data-bs-target="#${parentCollapse.id}"]`);
    if (!toggleButton) {
      return;
    }
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.classList.remove('collapsed');

    const arrow = toggleButton.querySelector('.nav-arrow');
    if (arrow) {
      arrow.classList.remove('fa-chevron-right');
      arrow.classList.add('fa-chevron-down');
    }
  }

  /**
   * Wire up header search toggle (opens/closes the inline search input).
   * Must be called after `loadAllPartials()` resolves — sidebar toggle is
   * handled separately by app.js to avoid duplicate listeners.
   */
  initializeHeader() {
    const searchToggle = document.getElementById('searchToggle');
    const searchForm = document.querySelector('.search-form');
    const searchClose = document.getElementById('searchClose');
    if (!searchToggle || !searchForm) {
      return;
    }

    searchToggle.addEventListener('click', () => {
      searchForm.classList.remove('d-none');
      searchToggle.classList.add('d-none');
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchForm.classList.add('d-none');
        searchToggle.classList.remove('d-none');
      });
    }
  }
}

// Export a singleton instance
export const partialsLoader = new PartialsLoader();

// Note: Initialization is handled by main.js to avoid conflicts
