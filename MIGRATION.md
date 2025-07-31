# Migration Guide: v1.x to v2.0

This guide helps you migrate from Sufee Admin Dashboard v1.x (Bootstrap 4) to v2.0 (Bootstrap 5).

## Overview

Version 2.0 is a major release with breaking changes. The template has been completely modernized with:
- Bootstrap 5 (from Bootstrap 4)
- Vite build system (from Grunt/Bower)
- Dynamic partials system
- ES6 modules

## Step-by-Step Migration

### 1. Backup Your Project

Before starting, create a complete backup of your current project.

### 2. Install New Version

```bash
# Clone or download v2.0
git clone -b v2.0 https://github.com/your-repo/sufee-admin-dashboard.git sufee-v2

# Install dependencies
cd sufee-v2
npm install
```

### 3. Update HTML Structure

#### Old Structure (v1.x):
```html
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sufee Admin</title>
    <!-- Manual CSS imports -->
    <link rel="stylesheet" href="vendors/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="vendors/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Inline sidebar code -->
    <aside id="left-panel" class="left-panel">
        <!-- Full sidebar HTML -->
    </aside>
    
    <!-- Inline header code -->
    <div id="right-panel" class="right-panel">
        <header id="header" class="header">
            <!-- Full header HTML -->
        </header>
        
        <!-- Content -->
    </div>
    
    <!-- Manual script imports -->
    <script src="vendors/jquery/dist/jquery.min.js"></script>
    <script src="vendors/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
```

#### New Structure (v2.0):
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <title>Your Page - Sufee Admin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Partials load all common styles -->
    <div data-partial="head-common"></div>
</head>

<body class="sufee-dashboard" data-page="your-page-id">
    <div class="d-flex min-vh-100">
        <!-- Sidebar loaded via partial -->
        <div data-partial="sidebar" data-partial-replace="true"></div>

        <div class="main-content flex-grow-1">
            <!-- Header loaded via partial -->
            <div data-partial="header" data-partial-replace="true"></div>

            <!-- Dynamic breadcrumbs -->
            <div data-breadcrumb 
                 data-breadcrumb-title="Page Title" 
                 data-breadcrumb-path="Section|Page Title">
            </div>

            <!-- Your content -->
            <section class="content-area p-4">
                <div class="container-fluid">
                    <!-- Content here -->
                </div>
            </section>
        </div>
    </div>

    <!-- Single script import -->
    <script type="module" src="/main.js"></script>
</body>
</html>
```

### 4. Update Bootstrap Classes

#### Utilities
| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `.ml-*` | `.ms-*` |
| `.mr-*` | `.me-*` |
| `.pl-*` | `.ps-*` |
| `.pr-*` | `.pe-*` |
| `.text-left` | `.text-start` |
| `.text-right` | `.text-end` |
| `.font-weight-*` | `.fw-*` |
| `.badge-*` | `.bg-*` |

#### Components
| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `.custom-control` | `.form-check` |
| `.custom-control-input` | `.form-check-input` |
| `.custom-control-label` | `.form-check-label` |
| `.custom-select` | `.form-select` |
| `.form-group` | Not needed |
| `.input-group-append` | Not needed |
| `.input-group-prepend` | Not needed |

#### Data Attributes
| Bootstrap 4 | Bootstrap 5 |
|-------------|-------------|
| `data-toggle` | `data-bs-toggle` |
| `data-target` | `data-bs-target` |
| `data-dismiss` | `data-bs-dismiss` |
| `data-placement` | `data-bs-placement` |

### 5. Update JavaScript

#### Old jQuery Code:
```javascript
// Toggle sidebar
$('#menuToggle').on('click', function(event) {
    $('body').toggleClass('open');
});

// Initialize tooltip
$('[data-toggle="tooltip"]').tooltip();

// Chart initialization
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {...});
```

#### New ES6 Code:
```javascript
// Import what you need
import { Chart } from 'chart.js/auto';

// Use vanilla JavaScript
document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('open');
});

// Bootstrap 5 tooltips
const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltips.forEach(el => new bootstrap.Tooltip(el));

// Chart.js is globally available
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {...});
```

### 6. File Structure Changes

Move your custom files to the new structure:

```
Old:
├── assets/
│   ├── css/
│   │   └── custom.css
│   └── js/
│       └── custom.js
├── vendors/
└── *.html

New:
├── src/
│   ├── styles/
│   │   └── custom.scss
│   ├── scripts/
│   │   └── custom.js
│   └── *.html
├── public/
│   └── images/
└── package.json
```

### 7. Update Build Process

#### Old (Grunt):
```bash
grunt build
grunt watch
```

#### New (NPM/Vite):
```bash
npm run build
npm run dev
```

### 8. Common Issues and Solutions

#### Issue: jQuery plugins not working
**Solution**: Many jQuery plugins have vanilla JS alternatives in Bootstrap 5. For legacy plugins, ensure jQuery is loaded before the plugin.

#### Issue: Icons not showing
**Solution**: Font Awesome has been updated from v4 to v6. Update icon classes:
- `fa fa-home` → `fas fa-home`
- `fa fa-user` → `fas fa-user`

#### Issue: Forms look different
**Solution**: Bootstrap 5 has redesigned forms. Update form classes and structure according to Bootstrap 5 documentation.

#### Issue: JavaScript errors
**Solution**: Check browser console for specific errors. Most likely due to jQuery syntax - convert to vanilla JavaScript.

## Features No Longer Supported

1. **Internet Explorer**: v2.0 does not support IE 11
2. **Bower**: All dependencies now managed through NPM
3. **Grunt**: Replaced with Vite

## New Features to Leverage

1. **Partials System**: Reduce code duplication
2. **Hot Module Replacement**: Instant updates during development
3. **ES6 Modules**: Better code organization
4. **CSS Custom Properties**: Easy theming
5. **Bootstrap 5 Utilities**: More powerful utility classes

## Getting Help

1. Check the [README.md](README.md) for detailed documentation
2. Review [CHANGELOG.md](CHANGELOG.md) for all changes
3. Look at example pages in `src/` directory
4. Open an issue on GitHub for specific problems

## Quick Reference

### Project Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### File Locations
- HTML pages: `src/*.html`
- Styles: `src/styles/`
- Scripts: `src/scripts/`
- Images: `public/images/`
- Build output: `dist/`

### Adding a New Page
1. Copy existing HTML file from `src/`
2. Update `data-page` attribute
3. Modify content area
4. Add to sidebar navigation if needed