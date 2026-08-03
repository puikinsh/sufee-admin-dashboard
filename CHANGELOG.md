# Changelog

All notable changes to the Sufee Admin Dashboard Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2026-08-03

Design polish and accessibility pass. No layout changes, no markup restructuring, no new
dependencies — the look is intentionally the same, with contrast, dark mode and token
consistency brought up to standard.

### Changed

- **Every button, badge and stat card now meets WCAG AA (4.5:1).** Previously white labels sat
  on pale fills at 1.63:1–2.86:1. The fix is split deliberately:

  - `buttons.scss` forced `color: white !important` on six variants, which overrode Bootstrap's
    `button-variant()` mixin — the mixin already derives an accessible label from the fill via
    `color-contrast()`. Removing the override lets pale fills (success, info, warning, light)
    take dark text and darker fills keep white.
  - `$primary` `#20a8d8` → `#187ea2` (2.74:1 → 4.62:1) and `$danger` `#f86c6b` → `#c0504d`
    (2.86:1 → 4.67:1). Same hue and character, a few steps deeper, so the primary CTA and
    destructive actions keep their white labels rather than flipping to dark text.
  - `$min-contrast-ratio: 4.5` is now declared explicitly so the contract is visible in the
    palette rather than inherited silently.

  | Component | Before | After |
  | --- | --- | --- |
  | `btn`/`badge` info | 2.04:1 | 10.30:1 |
  | `btn`/`badge` success | 2.37:1 | 8.85:1 |
  | `btn`/`badge` primary | 2.74:1 | 4.62:1 |
  | `btn`/`badge` danger | 2.86:1 | 4.67:1 |
  | dashboard stat card (warning) | 1.63:1 | 12.88:1 |
  | dashboard stat card (success) | 2.37:1 | 8.85:1 |

- **New `styles/components/badges.scss`.** `.badge` ships a fixed white label and the `bg-*`
  utilities only set a background, so `badge bg-warning` rendered white-on-yellow. Individual
  pages had been patching this by hand with `text-body-emphasis` on some badges but not others
  — which is why the same badge looked different from page to page. Badge labels are now
  derived from the fill in one place.

- **Coloured cards use `.text-bg-*` instead of `text-white bg-*`** — the stat-card build-time
  partial plus 16 hand-written cards across four pages. `.text-bg-*` sets fill and label
  together; `text-white bg-*` pinned a white label onto yellow and green.

- **Chart colours are read from the `--bs-*` custom properties at runtime.**
  `charts.js` carried its own literal copy of the palette, which had already drifted — it still
  held `#20a8d8`/`#f86c6b`, so every chart would have been drawn off-brand after this release.
  The cache is dropped on `themeChanged` so charts follow light/dark.

### Fixed

- **Auth and error pages were unusable in dark mode.** `page-login`, `page-register`,
  `pages-forget`, `error-404` and `error-500` carried `data-bs-theme="light"` **on `<body>`**.
  `ThemeManager` only sets the attribute on `<html>`, so the body-level value always won and
  pinned every descendant to light. Combined with hard-coded `#fff`/`#f8f9fa`/`#e9ecef`
  surfaces in `auth.scss` and `error-page.scss`, dark mode produced a blinding white card —
  and on the 404 page the theme-aware text over that hard-coded white surface made the
  "Page Not Found" heading and "Things to try" panel effectively invisible.

  The body-level lock is removed (the `<html>` one is just the pre-JS default and is correct),
  and both stylesheets now use `--bs-body-bg` / `--bs-tertiary-bg` / `--bs-border-color` /
  `--bs-*-bg-subtle`, which `dark-theme.scss` already defined. This also fixed the washed-out
  Facebook/X/Google buttons on the login page as a side effect.

- **Invalid form fields used the wrong red.** `.is-invalid` and `.invalid-feedback` hard-coded
  Bootstrap's stock `#dc3545`, which is a different red from the theme's `$danger` — so an
  invalid field did not match `.btn-danger` or `.text-danger` next to it. Both now use
  `var(--bs-danger)`.

- **`.btn-light` was invisible on white cards.** Bootstrap sets its border to the fill itself
  (`#f8f9fa` on `#fff`), leaving no edge. It now takes `var(--bs-border-color)`.

- **Focus ring was frozen to the old brand colour.** `--focus-ring` hard-coded
  `rgba(32, 168, 216, …)`, so it would have kept the pre-3.1 hue after the palette moved. It is
  now derived from `$primary`. The red menu toggle's ring moved out of `header.scss` into a
  `--focus-ring-menu` token declared next to `--menu-toggle-bg`.

- **Stray magic numbers** — `widgets.scss` used a bare `3px 3px 0 0` radius instead of the
  radius scale.

- **Documented colour values corrected** in the component catalog swatches, README theming
  sample, `DOCUMENTATION.md` variable reference and Chart.js example, and `CLAUDE.md`.

### Verified

Measured in Chromium against the production build rather than judged by eye — which mattered:
an early read of a screenshot suggested `btn-warning` was broken when measurement showed it at
9.46:1 and already correct, while the genuinely broken cases were the pale fills.

- Contrast measured programmatically for every button, badge and stat-card label; lowest value
  across the set is now 4.62:1.
- Auth and error pages confirmed rendering dark surfaces with `sufee-theme=dark`.
- 10 pages load with zero console, page or network errors; charts paint; fonts resolve; Leaflet
  initialises; runtime partials inject.

## [3.0.2] - 2026-08-03

### Fixed

- **Self-hosted Open Sans was never actually applied.** `@fontsource-variable/open-sans`
  registers its family as `Open Sans Variable`, but `variables.scss` and `main.scss` both asked
  for `'Open Sans'`. The name never matched, so the font was downloaded on every page load and
  then silently discarded — the entire template rendered in the system sans-serif fallback while
  still paying the bandwidth cost for 24 unused woff2 files.

  `$font-family-sans-serif` is now `'Open Sans Variable', 'Open Sans', sans-serif`, and
  `main.scss` references that variable instead of re-declaring the stack.

  Confirmed by measuring rendered text rather than trusting `document.fonts.check()`, which
  returns true for a family the browser is merely *willing* to fall back on. Before the fix, a
  string set in `Open Sans Variable` measured identical to the fallback (154px = 154px). After,
  it measures 257px against 249px for `sans-serif` and 234px for `serif` — three distinct
  widths, i.e. the real font is in use. `Open Sans Variable` now also appears in
  `document.fonts` with status `loaded`; previously only the Font Awesome faces did.

  Introduced in 3.0.0 with the Fontsource migration, so every 3.0.x release before this one is
  affected.

## [3.0.1] - 2026-08-03

Dependency maintenance release. Every package is now on its latest published version.
No breaking changes, no API changes, no markup changes — upgrading is a drop-in `npm install`.

### Changed

- **Dependencies updated to latest** — all nine outdated packages, all within their existing
  semver ranges (no major bumps were available):

  | Package                          | From   | To      |
  | -------------------------------- | ------ | ------- |
  | `vite`                           | 8.0.11 | 8.2.0   |
  | `sass`                           | 1.99.0 | 1.102.0 |
  | `eslint`                         | 10.3.0 | 10.8.0  |
  | `prettier`                       | 3.8.3  | 3.9.6   |
  | `@vitejs/plugin-legacy`          | 8.0.1  | 8.2.2   |
  | `vite-plugin-static-copy`        | 4.1.0  | 4.1.1   |
  | `eslint-plugin-prettier`         | 5.5.5  | 5.5.6   |
  | `@fortawesome/fontawesome-free`  | 7.2.0  | 7.3.1   |
  | `@fontsource-variable/open-sans` | 5.2.7  | 5.3.0   |

  Already on latest and untouched: `bootstrap` 5.3.8, `chart.js` 4.5.1, `leaflet` 1.9.4,
  `flag-icons` 7.5.0, `@eslint/js` 10.0.1, `eslint-config-prettier` 10.1.8,
  `vite-plugin-handlebars` 2.0.3. `npm audit` reports zero vulnerabilities.

- **`package.json` ranges bumped to match** — the declared floors now track the installed
  versions rather than lagging several releases behind.

- **README dependency table rewritten** — the old list claimed Vite 5.x, Font Awesome 6.x, and
  a `DataTables 1.13.x` dependency that was never in `package.json`. It now reflects actual
  installed versions and separates real npm packages from the static/CDN assets
  (Themify Icons, Google Maps) and from `datatable.js`, which is a custom vanilla component.

- **Sass build output is now warning-free** — the build previously printed 40 deprecation
  warnings. These came from two distinct sources and are handled differently:

  - **30 from inside Bootstrap** (`node_modules/bootstrap/scss/_functions.scss`) —
    `global-builtin`, `color-functions` and `if-function`. This is vendored code we cannot
    edit, and Bootstrap has deferred Sass module support to v6. Silenced with `quietDeps: true`,
    which mutes deprecations raised inside dependencies while still surfacing our own.
  - **10 `import` warnings** — Bootstrap 5.3's granular partials rely on shared global scope for
    variable overrides, so `main.scss` cannot move to `@use` while on Bootstrap 5. Silenced
    explicitly via `silenceDeprecations: ['import']`.

  Both are configured in `vite.config.js` with comments explaining the constraint and pointing
  at the Bootstrap 6 upgrade as the trigger to revisit. **CSS output is byte-for-byte identical**
  — the compiled bundle hash did not change.

- **`nth()` → `list.nth()`** in `styles/components/buttons.scss` — the last 6 deprecation
  warnings were genuinely ours, not Bootstrap's. `nth()` as a global function is deprecated in
  favour of the `sass:list` module. Social-brand button colours verified unchanged in-browser.

### Fixed

- **Malformed data-attributes table in `DOCUMENTATION.md`** — the `data-breadcrumb-path` row
  contained an unescaped `|` inside its code span, which split the row into a phantom fourth
  column. Prettier 3.8.3 tolerated it; 3.9.6 no longer does and reflowed the entire table into
  an unreadable paragraph. The pipe is now escaped (`\|`) and the table has a correct
  three-column separator.

- **`__dirname` in `vite.config.js`** — replaced with `import.meta.dirname` in all three call
  sites. Vite 8.2 warns that `__dirname` is unsupported by `configLoader: 'native'`, which is
  planned to become the default in a future major. The build is now forward-compatible and the
  warning is gone.

- **Leaflet marker images 404'd on `maps-vector.html`** — Leaflet resolves its default
  `marker-icon.png` / `marker-shadow.png` relative to where it believes `leaflet.css` lives,
  which breaks once Vite hashes and relocates assets. The three marker images are now imported
  explicitly and passed to `L.Icon.Default.mergeOptions()`, so Vite rewrites them to real built
  paths. Pre-existing bug, unrelated to the version bumps (Leaflet itself was already current).

- **Dead placeholder avatars in `tables-basic.html`** — three `<img>` tags pointed at
  `https://via.placeholder.com/32`, a third-party service that no longer resolves, producing
  broken images and failed requests. Replaced with the bundled `images/avatar/{1,2,3}.jpg`
  already used elsewhere in the template. The template now makes **no external image requests**.

- **ESLint ignored `.mjs` files** — the flat config matched only `**/*.js`, so `scripts/*.mjs`
  fell through to `eslint:recommended` with no globals defined and reported every
  `process`/`console`/`document` reference as `no-undef` (11 errors). `.mjs` is now covered by
  the main rule block, with a dedicated `scripts/**` block supplying Node globals.

- **`no-unused-vars` didn't honour the `_` convention for catch bindings** — ESLint 9+ lints
  caught errors by default, so `catch (_e)` was reported despite the project's `^_` ignore
  pattern. Added `caughtErrorsIgnorePattern: '^_'`.

- **`npm run quality` now exits 0.** Both `lint:check` and `format:check` pass across the repo;
  previously the gate failed on the two items above plus unformatted Markdown.

- **Stale layout note in `CLAUDE.md`** — documented the sidebar as `aside.left-panel` +
  `.right-panel`. The actual markup is `nav#sidebar.sidebar` + `.main-content` inside a
  `div.d-flex.min-vh-100` shell.

### Verified

Checked in a real browser (Chromium, 1440×900) against the production build, not just the
bundler exit code:

- 10 representative pages load with **zero** console errors, page errors, or failed requests.
- Font Awesome 7 faces load and glyphs resolve to real dimensions. (The Open Sans check here
  used `document.fonts.check()`, which reports success for a family the browser is only willing
  to fall back on — it masked the bug fixed in 3.0.2. Superseded by a width-measurement check.)
- All 5 dashboard canvases actually paint pixels (Chart.js sparklines + traffic chart).
- `--bs-primary` computes to the brand `#20a8d8`, confirming Bootstrap is still compiled from
  source with our overrides rather than falling back to stock `#0d6efd`.
- Dark-mode toggle flips `data-bs-theme` and repaints (`#f1f2f7` → `#0f172a`).
- Runtime partials inject the sidebar and header (39 nav links present).
- Leaflet initialises with 181 tile/vector nodes.

### Known issues

- **Sass `@import` cannot be migrated while on Bootstrap 5.** The deprecation is silenced rather
  than resolved, deliberately and with the reasoning recorded in `vite.config.js`. Dart Sass
  3.0.0 will remove `@import` entirely; the fix is Bootstrap 6, which ships Sass module support.
  Builds are unaffected until then.

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
  `preview.colorlib.com/theme/sufee/` (Cloudflare R2).
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