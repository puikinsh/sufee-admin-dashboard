/**
 * Error Handler — minimal global error reporter for the dashboard template.
 *
 * Logs uncaught errors and unhandled promise rejections to the console.
 * If a real backend is added later, wire reporting (Sentry, BugSnag, etc.)
 * into the two listeners below.
 *
 * The static error pages (error-404.html, error-500.html) are intended for
 * the host platform's error routing (e.g. Vercel/Netlify rewrites), not
 * runtime client-side redirects. The previous fetch interceptor was removed
 * because the dashboard ships no API and aggressively redirecting on any
 * non-2xx response (including 404s for missing optional resources) caused
 * worse UX than letting the failure propagate.
 */

export class ErrorHandler {
  constructor() {
    window.addEventListener('error', event => {
      console.error('Uncaught error:', event.error ?? event.message, {
        filename: event.filename,
        lineno: event.lineno
      });
    });

    window.addEventListener('unhandledrejection', event => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }
}

export const errorHandler = new ErrorHandler();
