# Changelog

All notable changes to the Sufee Admin Dashboard Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-05-08

A major design-system and architecture release. The dashboard renders correctly in
both light and dark mode, every reusable pattern is now a build-time partial, and
the codebase shed roughly 1,800 lines of dead/legacy code.

### Added

- **Design tokens** in `src/styles/variables.scss` — `--radius-{sm,md,lg,xl,pill,circle}`,
  `--shadow-{xs,sm,md,lg,xl}`, `--transition-{fast,base,slow}`, `--focus-ring`. One canonical
  set referenced everywhere; no more magic numbers.
- **Dark mode that actually works.** Header toggle (`[data-theme-toggle]`) flips
  `data-bs-theme` on `<html>`, persists via `localStorage`, follows `prefers-color-scheme`
  by default. Custom layered slate palette (`#0f172a` body / `#1e293b` cards /
  `#334155` hover) replaces Bootstrap's flat default. Shadows become black-tinted on
  dark backgrounds; cards get a subtle border for elevation.
- **Build-time Handlebars partials** via `vite-plugin-handlebars` —
  `stat-card`, `social-card`, `icon-stat-card` accept props and inline at build time.
  See `src/components/`.
- **Component catalog page** (`/components-catalog.html`) — every reusable pattern with
  rendered preview, copy-paste markup, and props table. Sticky table of contents,
  dark-mode aware.
- **Auth shell** (`components/auth.scss`) — shared `.auth-page` / `.auth-card` /
  `.auth-hero` / `.auth-btn` / `.auth-divider` / `.auth-social-row` /
  `.auth-message.is-{success,error}` / `.auth-password-strength`. Login, register,
  and forgot-password pages all use it.
- **Error shell** (`components/error-page.scss`) — `.error-page` / `.error-card` /
  `.error-illustration` / `.error-number` / `.btn-error.btn-error-{primary,secondary}`.
- **Selector-based component registry** in `App.COMPONENT_REGISTRY` — components
  self-declare a CSS selector and lazy-load when matching DOM exists.
- **`data-chart` data-attribute API** — `<canvas data-chart="line" data-labels="..."
  data-values="..." data-datasets="..." data-colors="..." data-no-legend data-stacked
  data-horizontal>`. Supports line / area / bar / radar / pie / doughnut / polarArea.
- **Vite glob-discovered HTML entries** — drop a `.html` file in `src/`, it builds.
  No `vite.config.js` edit needed.
- **`partialsReady` event** dispatched after the runtime partials inject.
- **Theme-aware utility migration** across all pages: `bg-light` → `bg-body-tertiary`,
  `bg-white` → `bg-body`, `text-dark` → `text-body-emphasis` (66 swaps in 12 files).

### Changed

- **Dependencies bumped** — Bootstrap 5.3.8, Chart.js 4.5.1, Font Awesome 7.2.0,
  Vite 8.0.11, ESLint 10.3.0, Sass 1.99.0, Prettier 3.8.3, plus
  `@fontsource-variable/open-sans` 5.2.7 and `vite-plugin-handlebars` 2.0.3 added.
- **Self-hosted fonts via Fontsource** — replaced 10 manually-downloaded `.woff2` files
  (which had been overwritten with Google's HTML 404 pages and were silently failing
  with "OTS parsing error: invalid sfntVersion") with the npm-managed
  `@fontsource-variable/open-sans` package.
- **Single CSS variable namespace** — removed `--sufee-*`, `--color-flat-*`, and four
  parallel light/menu/header/container declarations. Theme colors come from Bootstrap's
  `--bs-*` (which our SCSS `$primary` etc. drive). Layout tokens use unprefixed names
  (`--sidebar-bg`, `--content-bg`, `--text-primary`).
- **Cards modernized** — rounded corners (`var(--radius-md)`), subtle shadow with hover
  lift, no hard 1px border. Border added in dark mode for elevation.
- **Buttons modernized** — `border-radius: 0` → `var(--radius-md)`, standardized
  `--focus-ring` on `:focus-visible`. The 215-line `.btn-social` block collapsed to a
  16-entry SCSS map with `@each` (60 lines).
- **Sidebar mobile fix** — toggling between mobile and desktop view no longer leaves
  inline `style.transform` overriding the CSS, which had caused the sidebar to
  disappear permanently after a single resize.
- **`charts-chartjs.html` rebuilt** — 9 of 12 demo charts now use `data-chart` data
  attributes (430 lines of inline JS replaced). Mixed/bubble/scatter kept inline as
  examples of when to use Chart.js directly.
- **`widgets.html` rewritten** — 1,337 → 480 lines. 9 inconsistent widget patterns
  reduced to 6 cohesive sections using design tokens, brand colors, and partials.
  Progress bars are visible again.
- **`tables-data.html`** — added `data-table` attributes; broken jQuery `$.fn.DataTable`
  inline init removed (jQuery isn't a dependency).
- **README** — replaced architecture-heavy content with a focused "Build a New Dashboard
  Page" walkthrough; added customization recipe.

### Fixed

- **Brand colors weren't actually applied.** `main.js` was importing
  `bootstrap/dist/css/bootstrap.min.css` (prebuilt defaults) AFTER the themed SCSS,
  so `--bs-primary` was `#0d6efd` instead of `#20a8d8`. Removed the prebuilt import.
- **Sidebar disappears after mobile/desktop resize.** Inline styles on the sidebar
  element from `openMobileSidebar`/`closeMobileSidebar` outranked the desktop CSS.
  Fixed by using class-only toggles and clearing leftover inline styles in
  `handleResponsive()`.
- **Logo missing on auth pages.** `<img src="/images/logo.png">` referenced a file
  that doesn't exist; switched to the actual `./images/sufee-logo.svg`.
- **Three setTimeout-based race condition workarounds** replaced with a single
  `await partialsLoader.loadAllPartials()` chain.
- **45+ ESLint and pre-existing code-quality issues** resolved (unused `error` catch
  parameters, unused imports, `no-loss-of-precision` in coordinate literals,
  `no-case-declarations` in switch blocks, `no-useless-catch`, `no-useless-assignment`).
- **Counter animation** uses `requestAnimationFrame` + `IntersectionObserver` and
  honors `prefers-reduced-motion`. No more `setInterval` jank on 120Hz monitors.
- **Logout `confirm()` prompt** replaced with a Bootstrap modal.
- **Breadcrumb `bg-light` baked into `breadcrumb-helper.js`** (which was overriding
  the themed `.breadcrumb-section` rule); removed the utility class.

### Removed

- **`src/scripts/components/navigation.js`** (156 lines) — never imported anywhere.
- **`src/scripts/components/search.js`** (280 lines) — never imported anywhere.
- **`src/scripts/utils/dom.js`** (464 lines) — jQuery-flavored helpers, never imported.
- **`src/scripts/utils/error-handler.js` toast/fetch-interception bloat** — 365 lines
  trimmed to 31. Two simple `window.addEventListener` listeners.
- **`themify-icons` NPM package** — duplicated the manually-served `public/themify-icons/`
  copy. Demo page still works via the public copy.
- **Bootstrap-prebuilt CSS double-import** — see "Fixed" above.
- **Unused Vite path aliases** (`@scripts`, `@styles`, `@assets`) — never referenced.
- **`rel="shortcut icon"`** → `rel="icon"` (IE-era attribute).

### Breaking changes

- **SCSS variable rename.** Anyone customizing the source had `--sufee-brand-primary`,
  `--menu-bg`, etc. — these are gone. Migrate to `--bs-primary` and `--sidebar-bg`.
- **`auth-*` and `error-*` class APIs** for login/register/forget/error-404/error-500
  pages. Old class names (`.login-container`, `.error-number`, etc. as page-scoped
  inline styles) replaced with the shared `.auth-page` / `.error-page` shells.
- **`bg-light` → `bg-body-tertiary`** across all dashboard markup. Anyone forking
  templates with `bg-light` should run the same swap or accept the visual difference
  in dark mode (`.bg-light` is color-fixed in BS 5.3, not theme-aware).
- **Demo Google Maps API key** in `maps-gmap.html` is restricted to colorlib.com.
  Replace with your own for production use.

### Notes

- Preview moved from `colorlib.com/polygon/sufee/` (Hetzner) to
  `preview.colorlib.com/theme/sufee-admin-dashboard/` (Cloudflare R2).
- `dist/` is no longer tracked in git — `npm run build` produces it locally / in CI.

---

## [2.2.0] - 2025-10-02

### Updated
- **Dependencies**: Updated all dependencies to their latest versions
  - **Bootstrap**: 5.3.7 → 5.3.8 (latest stable release)
  - **Font Awesome**: 6.7.2 → 7.1.0 (major version upgrade with new icons and features)
  - **ESLint**: 9.32.0 → 9.36.0 (improved JavaScript linting)
  - **Vite**: 7.0.6 → 7.1.8 (enhanced build performance)
  - **Sass**: 1.89.2 → 1.93.2 (updated SCSS compiler)
  - **@vitejs/plugin-legacy**: 7.1.0 → 7.2.1 (improved browser compatibility)
  - **eslint-plugin-prettier**: 5.5.3 → 5.5.4 (better formatting integration)
  - **vite-plugin-static-copy**: 3.1.2 → 3.1.3 (enhanced static file handling)

### Performance
- **Build System**: Latest Vite version provides faster builds and improved HMR
- **SCSS Compilation**: Updated Sass compiler for better performance
- **Code Quality**: Latest ESLint version with improved rule performance

### Security
- **Zero Vulnerabilities**: All dependency updates maintain zero security vulnerabilities
- **Latest Patches**: All packages updated to include latest security fixes

### Notes
- Font Awesome 7.x introduces new icon library structure - all existing icons remain compatible
- Bootstrap 5.3.8 includes minor bug fixes and improvements from 5.3.7
- All breaking changes tested and verified - no code changes required

## [2.1.0] - 2025-08-05

### Added
- **ESLint & Prettier Integration**: Comprehensive code quality and formatting setup
  - ESLint 9 with modern flat configuration format
  - Prettier with customized formatting rules for HTML, SCSS, JS, and Markdown
  - Integrated ESLint-Prettier workflow preventing conflicts
  - NPM scripts for linting (`npm run lint`, `npm run format`, `npm run quality:fix`)
  - Development and production-ready code quality standards
- **Professional Error Pages**: User-friendly error handling system
  - Custom 404 "Page Not Found" page with helpful navigation suggestions
  - Custom 500 "Internal Server Error" page with status monitoring
  - Consistent Sufee theme styling and branding
  - Interactive elements (back buttons, home links, error reporting)
  - Accessibility features (keyboard navigation, screen reader support)
- **Global Error Handler Utility**: Centralized error management system
  - Automatic JavaScript error and promise rejection handling
  - HTTP error interception and routing (404, 500, network errors)
  - Toast notification system for user-friendly error messages
  - Development vs production error display modes
  - Offline detection and connection restoration notifications
- **Self-Hosted Font System**: Privacy-focused local font hosting
  - Complete Open Sans font family (300, 400, 600, 700, 800 + italics)
  - WOFF2 format for optimal performance and compression
  - @font-face declarations with `font-display: swap` for better loading
  - Eliminated Google Fonts CDN dependency for GDPR compliance
  - Improved performance with reduced external DNS lookups

### Changed
- **Build Process Improvements**: Enhanced Vite configuration
  - Error pages included in production build pipeline
  - Updated Vite input configuration for new error pages
  - Optimized bundle splitting and code organization
- **Main Application Entry**: Enhanced error handling integration
  - Global error handler initialization
  - Development debugging tools exposure
  - Improved error boundary implementation
- **Font Loading Strategy**: Migrated from CDN to local fonts
  - Removed Google Fonts CDN links from all HTML templates
  - Integrated local fonts into SCSS build process
  - Updated `main.scss` with proper font import structure
- **Code Quality Standards**: Enforced consistent formatting
  - All JavaScript files formatted with Prettier
  - Consistent quote style, semicolon usage, and indentation
  - Modern ES6+ syntax enforcement with ESLint rules

### Fixed
- **CDN Dependencies**: Eliminated external CDN usage
  - Removed Google Fonts CDN from `head-common.html`
  - Removed Leaflet CDN from `maps-vector.html`, using local npm package
  - Converted all external script/style dependencies to local imports
- **HTML Template Consistency**: Standardized partials usage
  - Fixed `ui-progressbar.html` to use proper partials system
  - Corrected inconsistent `main.js` import paths across templates
  - Converted inline `<script>` tags to `type="module"` for consistency
- **SCSS Import Structure**: Organized style imports
  - Added proper fonts directory structure in SCSS architecture
  - Updated documentation to reflect new font system organization

### Developer Experience
- **Code Quality Tools**: Comprehensive development workflow
  - Real-time error detection and automatic fixes
  - Consistent code formatting across the entire codebase
  - Pre-configured rules for modern JavaScript and web standards
- **Error Debugging**: Enhanced development experience
  - Detailed error logging and stack traces in development mode
  - Toast notifications for non-critical errors
  - Global error handler accessible via browser console
- **Documentation Updates**: Comprehensive font system documentation
  - Detailed instructions for using different font weights
  - Guide for adding custom fonts to the system
  - Benefits and implementation details of local font hosting

### Security & Privacy
- **GDPR Compliance**: Eliminated third-party data collection
  - No external font loading from Google servers
  - Removed all CDN dependencies that could track users
  - Self-hosted assets ensure no data leakage to external services
- **Error Handling Security**: Safe error information disclosure
  - Different error detail levels for development vs production
  - Secure error ID generation for support ticket correlation
  - No sensitive information exposed in client-side error messages

### Performance
- **Font Loading Optimization**: Improved page load performance
  - WOFF2 format reduces font file sizes by ~30% vs WOFF
  - Local hosting eliminates external DNS lookups and requests
  - `font-display: swap` prevents invisible text during font load
- **Bundle Optimization**: Enhanced build output
  - Error pages included in optimized production build
  - Proper code splitting for error handling utilities
  - Reduced main bundle size through better module organization

## [2.0.0] - 2025-07-31

### Added
- **Vite Build System**: Modern development experience with Hot Module Replacement
- **Partials System**: Dynamic HTML component loading to eliminate code duplication
- **ES6 Modules**: Proper JavaScript module imports and exports
- **Breadcrumb Component**: Dynamic breadcrumb generation via data attributes
- **Active Navigation**: Automatic sidebar highlighting based on current page
- **Collapsed Sidebar**: Proper mini logo display when sidebar is collapsed
- **Smooth Animations**: Fixed submenu animations with proper timing functions
- **TypeScript Support**: Ready for TypeScript integration (optional)
- **Source Maps**: Enhanced debugging experience in development

### Changed
- **Bootstrap 5**: Complete migration from Bootstrap 4 to Bootstrap 5
  - Updated all utility classes (spacing, text, display, etc.)
  - Migrated data attributes (`data-toggle` → `data-bs-toggle`)
  - Updated form controls to Bootstrap 5 syntax
  - Replaced deprecated components
- **Build System**: Migrated from Grunt/Bower to Vite/NPM
  - Removed Bower dependencies
  - Consolidated all packages in package.json
  - Modern SCSS compilation with dart-sass
- **File Structure**: Reorganized for better maintainability
  - Source files now in `src/` directory
  - Public assets in `public/` directory
  - Build output in `dist/` directory
- **JavaScript Architecture**: Modular component-based approach
  - Main App class for application lifecycle
  - Individual component classes
  - Utility functions separated
- **Sidebar Navigation**: Complete rewrite for Bootstrap 5
  - Native Bootstrap collapse functionality
  - Smooth animations using CSS transitions
  - Proper active state management
- **Dependencies**: Updated all libraries to latest versions
  - Chart.js 4.x (from 2.x)
  - Removed jQuery completely (100% vanilla JavaScript)
  - Font Awesome 6.x (from 4.x)
  - DataTables 1.13.x with Bootstrap 5 integration

### Removed
- **Internet Explorer Support**: Dropped IE 11 compatibility
- **Legacy Files**: Cleaned up old build artifacts
  - Removed `vendors/` directory
  - Removed `assets/` directory
  - Removed duplicate HTML files
- **Console Logging**: Removed all debug console statements
- **Grunt/Bower**: Replaced with modern tooling
- **jQuery**: Completely removed - all code now uses vanilla JavaScript
- **jQuery UI**: Removed in favor of Bootstrap 5 components
- **Redundant Code**: Eliminated duplicate headers/sidebars across pages

### Fixed
- **Sidebar Animation**: Resolved submenu jumping issues
- **Active Menu Items**: Fixed blue dot indicator removal
- **Icon Spacing**: Improved menu icon alignment and spacing
- **Collapsed State**: Fixed logo display and centering in collapsed sidebar
- **Responsive Behavior**: Enhanced mobile navigation experience
- **Build Warnings**: Resolved SCSS deprecation warnings

### Security
- **Dependencies**: Updated all packages to latest secure versions
- **Build Process**: Modern build tools with security updates

## [1.1.0] - Previous Release

### Changed
- Minor bug fixes and improvements
- Updated documentation

## [1.0.0] - Initial Release

### Added
- Bootstrap 4 Admin Dashboard Template
- Multiple dashboard variations
- UI Components and widgets
- Chart integrations
- Form components
- Authentication pages
- Grunt build system
- SCSS styling
- jQuery-based functionality