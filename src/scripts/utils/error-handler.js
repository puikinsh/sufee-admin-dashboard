/**
 * Error Handler Utility
 * Provides centralized error handling and user-friendly error pages
 */

export class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandlers();
  }

  /**
   * Set up global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle unhandled JavaScript errors
    window.addEventListener('error', event => {
      this.handleJavaScriptError(event.error, event.filename, event.lineno);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.handlePromiseRejection(event.reason);
      event.preventDefault(); // Prevent console spam
    });

    // Handle fetch errors (network issues, 404s, 500s, etc.)
    this.interceptFetch();
  }

  /**
   * Handle JavaScript errors
   */
  handleJavaScriptError(error, filename, lineno) {
    console.error('JavaScript Error:', { error, filename, lineno });

    // In development, show more details
    if (this.isDevelopment()) {
      this.showDevelopmentError(error, filename, lineno);
    } else {
      // In production, redirect to error page after a delay
      this.showUserFriendlyError('javascript');
    }
  }

  /**
   * Handle promise rejections
   */
  handlePromiseRejection(reason) {
    console.error('Unhandled Promise Rejection:', reason);

    if (this.isDevelopment()) {
      this.showDevelopmentError(reason);
    } else {
      this.showUserFriendlyError('promise');
    }
  }

  /**
   * Intercept fetch requests to handle HTTP errors
   */
  interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // Handle HTTP error status codes
        if (!response.ok) {
          this.handleHttpError(response);
        }

        return response;
      } catch (error) {
        this.handleNetworkError(error);
        throw error;
      }
    };
  }

  /**
   * Handle HTTP errors (404, 500, etc.)
   */
  handleHttpError(response) {
    console.warn(`HTTP Error: ${response.status} ${response.statusText}`);

    switch (response.status) {
      case 404:
        // Don't redirect for API calls, only for page navigation
        if (!response.url.includes('/api/')) {
          this.redirectToErrorPage('404');
        }
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.redirectToErrorPage('500');
        break;
      default:
        if (response.status >= 500) {
          this.redirectToErrorPage('500');
        }
    }
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error) {
    console.error('Network Error:', error);

    if (!navigator.onLine) {
      this.showOfflineMessage();
    } else {
      this.showUserFriendlyError('network');
    }
  }

  /**
   * Redirect to appropriate error page
   */
  redirectToErrorPage(errorType) {
    // Avoid infinite redirects
    if (window.location.pathname.includes('error-')) {
      return;
    }

    // Add a small delay to avoid jarring redirects
    setTimeout(() => {
      window.location.href = `error-${errorType}.html`;
    }, 1000);
  }

  /**
   * Show user-friendly error message
   */
  showUserFriendlyError(type) {
    const messages = {
      javascript: 'Something went wrong. Please refresh the page.',
      promise: 'An operation failed. Please try again.',
      network: 'Network connection issue. Please check your internet connection.'
    };

    this.showToast(messages[type] || 'An unexpected error occurred.', 'error');
  }

  /**
   * Show development error details
   */
  showDevelopmentError(error, filename, lineno) {
    const errorDetails = {
      message: error?.message || error,
      stack: error?.stack,
      filename,
      lineno
    };

    console.group('🐛 Development Error Details');
    console.error('Error:', errorDetails);
    console.groupEnd();

    // Show a non-intrusive notification
    this.showToast(
      `Dev Error: ${errorDetails.message}`,
      'warning',
      { timeout: 10000 }
    );
  }

  /**
   * Show offline message
   */
  showOfflineMessage() {
    this.showToast(
      'You appear to be offline. Some features may not work.',
      'warning',
      { persistent: true }
    );

    // Listen for when connection is restored
    window.addEventListener('online', () => {
      this.showToast('Connection restored!', 'success');
    });
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', options = {}) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `error-toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="toast-icon fas fa-${this.getToastIcon(type)}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles if not already added
    this.addToastStyles();

    // Add to page
    document.body.appendChild(toast);

    // Auto-remove after timeout (unless persistent)
    if (!options.persistent) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, options.timeout || 5000);
    }
  }

  /**
   * Get appropriate icon for toast type
   */
  getToastIcon(type) {
    const icons = {
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      success: 'check-circle',
      info: 'info-circle'
    };
    return icons[type] || icons.info;
  }

  /**
   * Add toast notification styles
   */
  addToastStyles() {
    if (document.getElementById('error-toast-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'error-toast-styles';
    styles.textContent = `
      .error-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        gap: 12px;
      }
      
      .toast-icon {
        flex-shrink: 0;
        font-size: 1.1rem;
      }
      
      .toast-message {
        flex-grow: 1;
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      .toast-close {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        flex-shrink: 0;
      }
      
      .toast-close:hover {
        background: #f0f0f0;
      }
      
      .toast-error {
        border-left: 4px solid #dc3545;
      }
      
      .toast-error .toast-icon {
        color: #dc3545;
      }
      
      .toast-warning {
        border-left: 4px solid #ffc107;
      }
      
      .toast-warning .toast-icon {
        color: #ffc107;
      }
      
      .toast-success {
        border-left: 4px solid #28a745;
      }
      
      .toast-success .toast-icon {
        color: #28a745;
      }
      
      .toast-info {
        border-left: 4px solid #17a2b8;
      }
      
      .toast-info .toast-icon {
        color: #17a2b8;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 480px) {
        .error-toast {
          left: 20px;
          right: 20px;
          min-width: auto;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  /**
   * Check if running in development mode
   */
  isDevelopment() {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      window.location.protocol === 'file:'
    );
  }

  /**
   * Manually trigger error page redirect
   */
  static redirectTo404() {
    window.location.href = 'error-404.html';
  }

  static redirectTo500() {
    window.location.href = 'error-500.html';
  }
}

// Create global instance
export const errorHandler = new ErrorHandler();

// Make static methods available globally for convenience
window.redirectTo404 = ErrorHandler.redirectTo404;
window.redirectTo500 = ErrorHandler.redirectTo500;