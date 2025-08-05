# Sufee Admin Dashboard Documentation

Welcome to the official documentation for Sufee Admin Dashboard v2.0 - a responsive Bootstrap 5 admin template with modern build tools.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Dependencies](#dependencies)
5. [Core Concepts](#core-concepts)
6. [Available Pages](#available-pages)
7. [Layout Components](#layout-components)
8. [UI Components](#ui-components)
9. [Charts Integration](#charts-integration)
10. [Maps Integration](#maps-integration)
11. [Forms](#forms)
12. [Tables](#tables)
13. [Authentication Pages](#authentication-pages)
14. [Styling & Theming](#styling--theming)
15. [JavaScript Architecture](#javascript-architecture)
16. [Build & Deployment](#build--deployment)
17. [Best Practices](#best-practices)

---

## Introduction

Sufee Admin Dashboard is a modern, responsive admin template built with Bootstrap 5.3.7 and Vite. Originally created with Bootstrap 4, version 2.0 brings a complete modernization with contemporary build tools and a component-based architecture.

### Key Features

- **Bootstrap 5.3.7**: Latest Bootstrap framework
- **Vite Build System**: Lightning-fast development with HMR
- **Dynamic Partials**: Reusable HTML components system
- **Chart.js 4.5.0**: Modern charting library
- **Leaflet Maps**: Interactive map integration
- **Font Awesome 6**: Comprehensive icon library
- **Themify Icons**: Additional icon set
- **SCSS Architecture**: Modular styling system
- **ES6 Modules**: Modern JavaScript architecture
- **No jQuery Required**: Pure JavaScript implementation

### What's New in v2.0

- Complete migration from Bootstrap 4 to Bootstrap 5
- Replaced Grunt/Bower with Vite
- Introduced dynamic partials system
- Removed jQuery dependency from core functionality
- Modernized all JavaScript to ES6 modules
- Improved performance with code splitting

---

## Getting Started

### Requirements

- Node.js 14.x or higher
- NPM 6.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/sarangaem/sufee-admin-dashboard.git
cd sufee-admin-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server runs at `http://localhost:3001`

---

## Project Structure

```
sufee-admin-dashboard/
├── src/                        # Source files
│   ├── partials/              # Reusable HTML components
│   │   ├── head-common.html   # Common head elements
│   │   ├── header.html        # Top navigation bar
│   │   ├── sidebar.html       # Left navigation menu
│   │   └── scripts-common.html # Common scripts
│   ├── scripts/               # JavaScript modules
│   │   ├── app.js            # Main application controller
│   │   ├── partials-loader.js # Partials loading system
│   │   ├── breadcrumb-helper.js # Breadcrumb generator
│   │   ├── components/       # UI component modules
│   │   │   ├── charts.js     # Chart.js integration
│   │   │   ├── datatable.js  # Table enhancements
│   │   │   ├── gmaps.js      # Google Maps wrapper
│   │   │   ├── navigation.js # Sidebar navigation
│   │   │   ├── search.js     # Search functionality
│   │   │   ├── theme-manager.js # Theme switching
│   │   │   ├── user-menu.js  # User dropdown
│   │   │   ├── validation.js # Form validation
│   │   │   ├── widgets.js    # Dashboard widgets
│   │   │   └── world-map.js  # Vector maps
│   │   └── utils/            # Utility functions
│   │       └── dom.js        # DOM helpers
│   ├── styles/               # SCSS files
│   │   ├── main.scss         # Main stylesheet
│   │   ├── variables.scss    # Theme variables
│   │   └── components/       # Component styles
│   │       ├── buttons.scss
│   │       ├── cards.scss
│   │       ├── charts.scss
│   │       ├── forms.scss
│   │       ├── header.scss
│   │       ├── leaflet-overrides.scss
│   │       ├── sidebar.scss
│   │       ├── tables.scss
│   │       └── widgets.scss
│   ├── *.html                # Page templates (30 pages)
│   └── main.js               # JavaScript entry point
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── images/               # Images and logos
│   └── themify-icons/        # Themify icon fonts
├── dist/                      # Production build output
├── package.json              # NPM configuration
├── vite.config.js           # Vite configuration
└── CLAUDE.md                # AI assistant instructions
```

---

## Dependencies

### Production Dependencies

All dependencies are managed through NPM (package.json):

| Package | Version | Purpose |
|---------|---------|---------|
| `bootstrap` | ^5.3.7 | UI framework |
| `@fortawesome/fontawesome-free` | ^6.7.2 | Icon library |
| `chart.js` | ^4.5.0 | Charting library |
| `leaflet` | ^1.9.4 | Interactive maps |
| `flag-icons` | ^7.2.3 | Country flag icons |
| `themify-icons` | ^1.0.0 | Additional icons |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.0.6 | Build tool |
| `sass` | ^1.89.2 | SCSS compiler |
| `@vitejs/plugin-legacy` | ^7.1.0 | Legacy browser support |
| `vite-plugin-static-copy` | ^3.1.1 | Copy static files |

---

## Core Concepts

### Partials System

The partials system allows you to reuse common HTML components across pages, eliminating code duplication.

#### How It Works

1. HTML snippets are stored in `src/partials/`
2. Partials are loaded dynamically via fetch API
3. Loaded partials are cached for performance
4. Custom events are fired when partials load

#### Available Partials

- **head-common.html**: Meta tags, CSS imports, favicon
- **sidebar.html**: Complete sidebar navigation
- **header.html**: Top navigation bar with search
- **scripts-common.html**: Common JavaScript imports

#### Using Partials

```html
<!-- Basic usage - content inserted inside div -->
<div data-partial="head-common"></div>

<!-- Replace entire element -->
<div data-partial="sidebar" data-partial-replace="true"></div>

<!-- Header with replacement -->
<div data-partial="header" data-partial-replace="true"></div>
```

### Page Structure

Every Sufee page follows this structure:

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <title>Page Title - Sufee Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <div data-partial="head-common"></div>
</head>

<body class="sufee-dashboard" data-page="unique-page-id">
    <div class="d-flex min-vh-100">
        <!-- Sidebar -->
        <div data-partial="sidebar" data-partial-replace="true"></div>

        <!-- Main Content -->
        <div class="main-content flex-grow-1">
            <!-- Header -->
            <div data-partial="header" data-partial-replace="true"></div>

            <!-- Breadcrumb -->
            <div data-breadcrumb 
                 data-breadcrumb-title="Page Title" 
                 data-breadcrumb-path="Section|Subsection|Page">
            </div>

            <!-- Content -->
            <section class="content-area p-4">
                <div class="container-fluid">
                    <!-- Your content here -->
                </div>
            </section>
        </div>
    </div>

    <script type="module" src="/main.js"></script>
</body>
</html>
```

### Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-page` | Page identifier for active state | `data-page="dashboard"` |
| `data-partial` | Load HTML partial | `data-partial="sidebar"` |
| `data-partial-replace` | Replace element with partial | `data-partial-replace="true"` |
| `data-breadcrumb` | Enable breadcrumb | `data-breadcrumb` |
| `data-breadcrumb-title` | Breadcrumb title | `data-breadcrumb-title="Dashboard"` |
| `data-breadcrumb-path` | Breadcrumb path | `data-breadcrumb-path="Home|Dashboard"` |

---

## Available Pages

Sufee includes 30 pre-built pages:

### Dashboards
- `index.html` - Main dashboard
- `dashboard-crm.html` - CRM focused dashboard

### UI Components
- `ui-buttons.html` - Button variations
- `ui-badges.html` - Badge components
- `ui-cards.html` - Card layouts
- `ui-alerts.html` - Alert messages
- `ui-progressbar.html` - Progress indicators
- `ui-modals.html` - Modal dialogs
- `ui-switches.html` - Toggle switches
- `ui-grids.html` - Grid system
- `ui-typography.html` - Typography examples
- `ui-tabs.html` - Tab navigation
- `ui-social-buttons.html` - Social media buttons

### Forms
- `forms-basic.html` - Basic form elements
- `forms-advanced.html` - Advanced form components

### Tables
- `tables-basic.html` - Basic table styles
- `tables-data.html` - DataTable integration

### Charts
- `charts-chartjs.html` - Chart.js examples
- `charts-flot.html` - Flot charts (legacy)
- `charts-peity.html` - Inline sparklines

### Maps
- `maps-gmap.html` - Google Maps integration
- `maps-vector.html` - Vector maps with Leaflet

### Icons
- `font-fontawesome.html` - Font Awesome 6 showcase
- `font-themify.html` - Themify icons showcase

### Authentication
- `page-login.html` - Login page
- `page-register.html` - Registration page
- `pages-forget.html` - Password reset

### Others
- `widgets.html` - Dashboard widgets showcase
- `frame.html` - Iframe integration example

---

## Layout Components

### Sidebar

The sidebar is the main navigation component located in `src/partials/sidebar.html`.

#### Features

- Collapsible menu sections
- Active state management
- Smooth animations
- Icon support (Font Awesome & Themify)
- Mobile responsive
- Mini sidebar mode when collapsed

#### Structure Example

```html
<nav class="sidebar bg-dark text-white position-fixed d-flex flex-column" id="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-brand">
        <img src="./images/sufee-logo.svg" alt="Sufee Admin" class="logo-full">
        <img src="./images/sufee-logo-mini.svg" alt="SA" class="logo-mini">
    </div>

    <!-- Navigation -->
    <div class="sidebar-nav flex-grow-1 overflow-auto py-3">
        <ul class="nav flex-column">
            <!-- Simple Link -->
            <li class="nav-item">
                <a class="nav-link" href="index.html" data-page="dashboard">
                    <i class="fas fa-home"></i>
                    <span class="nav-text ms-2">Dashboard</span>
                </a>
            </li>

            <!-- Dropdown Menu -->
            <li class="nav-item">
                <a class="nav-link" href="#" data-bs-toggle="collapse" 
                   data-bs-target="#uiSubmenu" aria-expanded="false">
                    <i class="fas fa-laptop"></i>
                    <span class="nav-text ms-2">UI Elements</span>
                    <i class="fas fa-chevron-down ms-auto nav-arrow"></i>
                </a>
                <div class="collapse" id="uiSubmenu">
                    <ul class="nav flex-column ms-3">
                        <li class="nav-item">
                            <a class="nav-link" href="ui-buttons.html" data-page="ui-buttons">
                                <i class="fas fa-puzzle-piece"></i>
                                <span class="nav-text ms-2">Buttons</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</nav>
```

### Header

The header component (`src/partials/header.html`) provides:

- Desktop/Mobile sidebar toggle
- Search functionality
- User menu
- Responsive design

#### Key Elements

```html
<!-- Desktop sidebar toggle -->
<button class="btn btn-sm btn-danger" id="sidebarToggleDesktop">
    <i class="fas fa-bars"></i>
</button>

<!-- Search form -->
<form class="search-form d-none d-lg-flex">
    <input type="search" class="form-control" placeholder="Search...">
</form>

<!-- User menu -->
<div class="dropdown">
    <button class="btn btn-link" data-bs-toggle="dropdown">
        <img src="./images/admin.jpg" class="rounded-circle" width="32">
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><a class="dropdown-item" href="#">Settings</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Logout</a></li>
    </ul>
</div>
```

### Breadcrumbs

Dynamic breadcrumbs are generated automatically:

```html
<div data-breadcrumb 
     data-breadcrumb-title="Dashboard" 
     data-breadcrumb-path="Home|Dashboard">
</div>
```

This generates:
```html
<div class="breadcrumb-section bg-light py-2 px-3">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item active">Dashboard</li>
        </ol>
    </nav>
    <h6 class="mb-0">Dashboard</h6>
</div>
```

---

## UI Components

### Color System

Sufee uses custom theme colors defined in `variables.scss`:

```scss
// Primary Colors (CSS Variables)
--bs-primary: #20a8d8;
--bs-secondary: #6c757d;
--bs-success: #4dbd74;
--bs-info: #63c2de;
--bs-warning: #ffc107;
--bs-danger: #f86c6b;
--bs-light: #f8f9fa;
--bs-dark: #272c33;

// Custom Theme Colors
--color-flat-1: #20a8d8;
--color-flat-2: #63c2de;
--color-flat-3: #ffc107;
--color-flat-4: #f86c6b;
--color-flat-5: #4dbd74;
```

### Buttons

Standard Bootstrap 5 buttons with Sufee color scheme:

```html
<!-- Basic Buttons -->
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-danger">Danger</button>
<button type="button" class="btn btn-warning">Warning</button>
<button type="button" class="btn btn-info">Info</button>

<!-- Outline Buttons -->
<button type="button" class="btn btn-outline-primary">Primary</button>

<!-- Sizes -->
<button type="button" class="btn btn-primary btn-lg">Large</button>
<button type="button" class="btn btn-primary btn-sm">Small</button>

<!-- With Icons -->
<button type="button" class="btn btn-success">
    <i class="fas fa-check me-2"></i>Save
</button>

<!-- Social Buttons (from ui-social-buttons.html) -->
<button type="button" class="btn btn-social btn-facebook">
    <i class="fab fa-facebook-f me-2"></i>Facebook
</button>
```

### Cards

Sufee provides various card styles:

```html
<!-- Basic Card -->
<div class="card">
    <div class="card-header">
        <h5 class="card-title mb-0">Card Title</h5>
    </div>
    <div class="card-body">
        <p class="card-text">Card content goes here.</p>
    </div>
</div>

<!-- Widget Card -->
<div class="card text-white bg-primary">
    <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="mb-0">1,234</h4>
                <p class="mb-0">Total Users</p>
            </div>
            <div class="icon-circle bg-white bg-opacity-25">
                <i class="fas fa-users text-white"></i>
            </div>
        </div>
    </div>
</div>
```

### Alerts

Standard Bootstrap alerts with Sufee styling:

```html
<div class="alert alert-primary" role="alert">
    Primary alert message
</div>

<!-- Dismissible Alert -->
<div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>Warning!</strong> Please check your input.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

<!-- Alert with Icon -->
<div class="alert alert-success" role="alert">
    <i class="fas fa-check-circle me-2"></i>
    Operation completed successfully!
</div>
```

### Progress Bars

```html
<!-- Basic Progress -->
<div class="progress">
    <div class="progress-bar" style="width: 25%">25%</div>
</div>

<!-- Colored Progress -->
<div class="progress">
    <div class="progress-bar bg-success" style="width: 40%"></div>
</div>

<!-- Striped & Animated -->
<div class="progress">
    <div class="progress-bar progress-bar-striped progress-bar-animated" 
         style="width: 60%"></div>
</div>
```

---

## Charts Integration

Sufee uses Chart.js 4.5.0 for data visualization.

### Chart.js Setup

Charts are initialized through the `ChartManager` component:

```javascript
// Charts are automatically initialized on pages with data-chart attributes
<canvas id="myChart" data-chart="line"></canvas>

// Or manually:
import { Chart } from 'chart.js'

const ctx = document.getElementById('myChart').getContext('2d')
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#20a8d8',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
})
```

### Available Chart Types

From `charts-chartjs.html`:
- Line Charts
- Bar Charts
- Pie/Doughnut Charts
- Mixed Charts
- Area Charts

---

## Maps Integration

### Leaflet Maps

Sufee includes Leaflet 1.9.4 for interactive maps:

```html
<div id="leafletMap" style="height: 400px;"></div>

<script type="module">
import L from 'leaflet'

const map = L.map('leafletMap').setView([51.505, -0.09], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map)

// Add marker
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.')
    .openPopup()
</script>
```

The `leaflet-overrides.scss` file provides Sufee-specific styling for Leaflet maps.

---

## Forms

### Basic Form Elements

From `forms-basic.html`:

```html
<!-- Text Input -->
<div class="mb-3">
    <label for="textInput" class="form-label">Text Input</label>
    <input type="text" class="form-control" id="textInput">
</div>

<!-- Select -->
<div class="mb-3">
    <label for="selectInput" class="form-label">Select</label>
    <select class="form-select" id="selectInput">
        <option selected>Choose...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
    </select>
</div>

<!-- Checkbox -->
<div class="form-check">
    <input class="form-check-input" type="checkbox" id="checkInput">
    <label class="form-check-label" for="checkInput">
        Check me out
    </label>
</div>

<!-- Switch -->
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="switchInput">
    <label class="form-check-label" for="switchInput">
        Toggle switch
    </label>
</div>
```

### Form Validation

The `validation.js` component handles form validation:

```javascript
// Forms with data-validate are automatically initialized
<form data-validate>
    <input type="email" required>
    <button type="submit">Submit</button>
</form>
```

---

## Tables

### Basic Tables

From `tables-basic.html`:

```html
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Salary</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tiger Nixon</td>
            <td>System Architect</td>
            <td>Edinburgh</td>
            <td>$320,800</td>
        </tr>
    </tbody>
</table>

<!-- Table Variations -->
<table class="table table-striped">...</table>
<table class="table table-bordered">...</table>
<table class="table table-hover">...</table>
```

### Data Tables

The `tables-data.html` page demonstrates enhanced table functionality through the `datatable.js` component.

---

## Authentication Pages

### Login Page

`page-login.html` features:
- Floating labels
- Form validation
- Social login buttons
- Remember me functionality
- Link to registration and password reset

### Registration Page

`page-register.html` includes:
- Multi-field form
- Password confirmation
- Terms acceptance
- Form validation

### Password Reset

`pages-forget.html` provides:
- Email input for reset link
- Simple, focused layout

---

## Styling & Theming

### SCSS Architecture

```
src/styles/
├── main.scss              # Main entry point
├── variables.scss         # Theme variables
└── components/           # Component styles
    ├── buttons.scss      # Button customizations
    ├── cards.scss        # Card styles
    ├── charts.scss       # Chart container styles
    ├── forms.scss        # Form enhancements
    ├── header.scss       # Header specific styles
    ├── leaflet-overrides.scss # Leaflet customizations
    ├── sidebar.scss      # Sidebar styles
    ├── tables.scss       # Table styles
    └── widgets.scss      # Widget components
```

### Theme Variables

Key variables from `variables.scss`:

```scss
// Layout dimensions
--sidebar-width: 280px;
--sidebar-collapsed-width: 70px;
--header-height: 70px;

// Colors
--menu-bg: #272c33;
--menu-color: #c8c9ce;
--header-bg: #ffffff;
--container-bg: #f1f2f7;

// Typography
$font-family-sans-serif: 'Open Sans', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;
```

### Customizing Colors

To change the color scheme, edit the CSS variables in `variables.scss`:

```scss
:root {
  --bs-primary: #your-color;
  --bs-success: #your-color;
  // etc...
}
```

---

## JavaScript Architecture

### Main App Class

The `App` class (`src/scripts/app.js`) manages the application:

```javascript
class App {
  constructor() {
    this.components = new Map()
    this.initialized = false
    this.isCollapsed = false
    this.isMobile = window.innerWidth <= 991.98
  }

  init() {
    this.initializeComponents()
    this.setupEventListeners()
    this.handleResponsive()
  }

  // Component management
  addComponent(name, component) {
    this.components.set(name, component)
  }

  // Sidebar control
  toggleSidebarCollapse() {
    // Toggle collapsed state
  }

  // Notifications
  showNotification(message, type = 'success') {
    // Show notification
  }
}
```

### Component System

Components are loaded dynamically based on page needs:

```javascript
// Charts loaded on chart pages
if (document.querySelector('[data-chart]')) {
  const { ChartManager } = await import('./components/charts.js')
  app.addComponent('charts', new ChartManager())
}
```

### Available Components

- `ChartManager` - Chart.js integration
- `DataTable` - Table enhancements
- `Navigation` - Sidebar navigation logic
- `Search` - Search functionality
- `ThemeManager` - Theme switching
- `UserMenu` - User dropdown
- `FormValidator` - Form validation
- `WidgetManager` - Dashboard widgets

---

## Build & Deployment

### Development

```bash
# Start dev server with hot reload
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Files are output to dist/
# Preview production build
npm run preview
```

### Vite Configuration

From `vite.config.js`:

```javascript
export default defineConfig({
  root: 'src',
  base: './', // Relative paths for subfolder deployment
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3001,
    open: true
  },
  plugins: [
    legacy({ targets: ['defaults', 'not IE 11'] }),
    viteStaticCopy({
      targets: [{ src: 'partials', dest: '' }]
    })
  ]
})
```

### Deployment

Deploy the `dist/` folder to any static hosting:

1. **GitHub Pages**
2. **Netlify**
3. **Vercel**
4. **Traditional web hosting**

For subfolder deployment, the `base: './'` configuration ensures all assets use relative paths.

---

## Best Practices

### Adding New Pages

1. Create HTML file in `src/` following the standard structure
2. Add menu item to `src/partials/sidebar.html`
3. Use appropriate `data-page` attribute for active state
4. Include partials for consistent layout

### Component Development

1. Create module in `src/scripts/components/`
2. Export as ES6 class
3. Import dynamically when needed
4. Add destroy method for cleanup

### Styling Guidelines

1. Use SCSS variables for consistency
2. Follow BEM naming for custom components
3. Leverage Bootstrap utilities
4. Keep component styles modular

### Performance Tips

1. Use dynamic imports for large components
2. Lazy load images with `loading="lazy"`
3. Minimize custom CSS
4. Leverage browser caching

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- No Internet Explorer support

---

## License

Sufee is licensed under The MIT License (MIT). You can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the final products. But you always need to state that Colorlib is the original author of this template.

## Credits

- Original template by [Colorlib](https://colorlib.com)
- Bootstrap 5 migration and modernization in v2.0
- Icons by Font Awesome and Themify
- Charts powered by Chart.js
- Maps powered by Leaflet