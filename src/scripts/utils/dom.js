// DOM Utility Functions - Replace jQuery functionality

export const DOM = {
  // Document ready replacement
  ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  },

  // Element selection
  $(selector, context = document) {
    if (typeof selector === 'string') {
      return context.querySelector(selector);
    }
    return selector; // Return element as-is if already an element
  },

  $$(selector, context = document) {
    if (typeof selector === 'string') {
      return Array.from(context.querySelectorAll(selector));
    }
    return [selector]; // Return array with single element
  },

  // Class manipulation
  addClass(element, className) {
    if (!element) {
      return;
    }
    element.classList.add(className);
  },

  removeClass(element, className) {
    if (!element) {
      return;
    }
    element.classList.remove(className);
  },

  toggleClass(element, className) {
    if (!element) {
      return;
    }
    element.classList.toggle(className);
    return element.classList.contains(className);
  },

  hasClass(element, className) {
    if (!element) {
      return false;
    }
    return element.classList.contains(className);
  },

  // Event handling
  on(element, events, handler, options = {}) {
    if (!element) {
      return;
    }

    if (typeof events === 'string') {
      events = events.split(' ');
    }

    events.forEach(event => {
      element.addEventListener(event, handler, options);
    });
  },

  off(element, events, handler) {
    if (!element) {
      return;
    }

    if (typeof events === 'string') {
      events = events.split(' ');
    }

    events.forEach(event => {
      element.removeEventListener(event, handler);
    });
  },

  // Trigger custom events
  trigger(element, eventName, detail = {}) {
    if (!element) {
      return;
    }

    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });

    element.dispatchEvent(event);
  },

  // Content manipulation
  html(element, content) {
    if (!element) {
      return;
    }

    if (content === undefined) {
      return element.innerHTML;
    }

    element.innerHTML = content;
  },

  text(element, content) {
    if (!element) {
      return;
    }

    if (content === undefined) {
      return element.textContent;
    }

    element.textContent = content;
  },

  // Attribute manipulation
  attr(element, name, value) {
    if (!element) {
      return;
    }

    if (value === undefined) {
      return element.getAttribute(name);
    }

    element.setAttribute(name, value);
  },

  removeAttr(element, name) {
    if (!element) {
      return;
    }
    element.removeAttribute(name);
  },

  // Data attributes
  data(element, key, value) {
    if (!element) {
      return;
    }

    if (value === undefined) {
      return element.dataset[key];
    }

    element.dataset[key] = value;
  },

  // CSS manipulation
  css(element, property, value) {
    if (!element) {
      return;
    }

    if (typeof property === 'object') {
      // Set multiple properties
      Object.assign(element.style, property);
      return;
    }

    if (value === undefined) {
      return getComputedStyle(element)[property];
    }

    element.style[property] = value;
  },

  // Show/hide elements
  show(element, display = 'block') {
    if (!element) {
      return;
    }
    element.style.display = display;
  },

  hide(element) {
    if (!element) {
      return;
    }
    element.style.display = 'none';
  },

  isVisible(element) {
    if (!element) {
      return false;
    }
    return element.offsetParent !== null;
  },

  // Animation helpers
  fadeIn(element, duration = 300) {
    if (!element) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.display = 'block';

      const start = performance.now();

      const animate = currentTime => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  },

  fadeOut(element, duration = 300) {
    if (!element) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const start = performance.now();
      const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;

      const animate = currentTime => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = initialOpacity * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = 'none';
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  },

  slideUp(element, duration = 300) {
    if (!element) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const height = element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.transition = `height ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.height = '0px';

        setTimeout(() => {
          element.style.display = 'none';
          element.style.height = '';
          element.style.overflow = '';
          element.style.transition = '';
          resolve();
        }, duration);
      });
    });
  },

  slideDown(element, duration = 300) {
    if (!element) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      element.style.display = 'block';
      const height = element.offsetHeight;
      element.style.height = '0px';
      element.style.overflow = 'hidden';
      element.style.transition = `height ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.height = `${height}px`;

        setTimeout(() => {
          element.style.height = '';
          element.style.overflow = '';
          element.style.transition = '';
          resolve();
        }, duration);
      });
    });
  },

  // Element manipulation
  append(parent, child) {
    if (!parent) {
      return;
    }

    if (typeof child === 'string') {
      parent.insertAdjacentHTML('beforeend', child);
    } else {
      parent.appendChild(child);
    }
  },

  prepend(parent, child) {
    if (!parent) {
      return;
    }

    if (typeof child === 'string') {
      parent.insertAdjacentHTML('afterbegin', child);
    } else {
      parent.insertBefore(child, parent.firstChild);
    }
  },

  remove(element) {
    if (!element) {
      return;
    }
    element.remove();
  },

  // Position and dimensions
  offset(element) {
    if (!element) {
      return { top: 0, left: 0 };
    }

    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  position(element) {
    if (!element) {
      return { top: 0, left: 0 };
    }

    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  },

  width(element, value) {
    if (!element) {
      return 0;
    }

    if (value === undefined) {
      return element.offsetWidth;
    }

    element.style.width = typeof value === 'number' ? `${value}px` : value;
  },

  height(element, value) {
    if (!element) {
      return 0;
    }

    if (value === undefined) {
      return element.offsetHeight;
    }

    element.style.height = typeof value === 'number' ? `${value}px` : value;
  },

  // Utility functions
  closest(element, selector) {
    if (!element) {
      return null;
    }
    return element.closest(selector);
  },

  siblings(element) {
    if (!element || !element.parentNode) {
      return [];
    }

    return Array.from(element.parentNode.children).filter(child => child !== element);
  },

  // AJAX helper (fetch wrapper)
  async ajax(url, options = {}) {
    const defaults = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const config = { ...defaults, ...options };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      // AJAX request failed
      throw error;
    }
  }
};

// Export individual functions for easier importing
export const {
  ready,
  $,
  $$,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  on,
  off,
  trigger,
  html,
  text,
  attr,
  removeAttr,
  data,
  css,
  show,
  hide,
  isVisible,
  fadeIn,
  fadeOut,
  slideUp,
  slideDown,
  append,
  prepend,
  remove,
  offset,
  position,
  width,
  height,
  closest,
  siblings,
  ajax
} = DOM;
