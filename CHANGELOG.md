# Changelog

All notable changes to the Sufee Admin Dashboard Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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