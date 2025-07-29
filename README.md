# Sufee HTML5 Admin Dashboard Template

**Sufee** is a responsive Bootstrap 5 Admin Dashboard Template (upgraded from Bootstrap 4). It provides you with a collection of ready to use code snippets and utilities, custom pages, a collection of applications and some useful widgets. The template has been modernized with Vite build tool and includes a dynamic partials system for component reusability.

**Key Features:**
- ✅ **Bootstrap 5** - Latest version with modern utilities
- ✅ **Vite Build System** - Fast development with HMR
- ✅ **Partials System** - Reusable components without code duplication
- ✅ **Modern ES Modules** - Clean JavaScript architecture
- ✅ **No IE Support** - Streamlined for modern browsers
- ✅ **Dynamic Navigation** - Auto-highlighting active states

# Preview

### Screenshot

![Sufee admin dashboard template preview](https://colorlib.com/wp/wp-content/uploads/sites/2/sufee-free-modern-admin-dashboard-template.jpg)

### Demo Site: [Here](https://colorlib.com/polygon/sufee/index.html)

### TOC
- [Quick Start](#quick-start)
- [Partials System](#partials-system)
- [Development](#development)
- [Built With](#built-with)
- [Changelog](#changelog)
- [Authors](#authors)
- [License](#license)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd sufee-admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Partials System

The template uses a modern partials system that eliminates code duplication across HTML files.

### Using Partials in Your HTML Files

Add these data attributes to load common components:

```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <title>Your Page - Sufee Admin</title>
    <meta name="description" content="Your page description">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Load common head elements -->
    <div data-partial="head-common"></div>
</head>

<body class="sufee-dashboard" data-page="your-page-name">
    <div class="d-flex min-vh-100">
        
        <!-- Load sidebar -->
        <div data-partial="sidebar" data-partial-replace="true"></div>

        <div class="main-content flex-grow-1">
            <!-- Load header -->
            <div data-partial="header" data-partial-replace="true"></div>

            <!-- Dynamic breadcrumbs -->
            <div data-breadcrumb data-breadcrumb-title="Your Page" data-breadcrumb-path="Section|Subsection|Your Page"></div>

            <!-- Your page content -->
            <main class="content-area p-4">
                <div class="container-fluid">
                    <!-- Your content here -->
                </div>
            </main>
        </div>
    </div>

    <!-- Load common scripts -->
    <script type="module" src="/main.js"></script>
</body>
</html>
```

### Available Partials

- **`head-common`** - Meta tags, Bootstrap CSS, Font Awesome, favicons
- **`sidebar`** - Left navigation with menu items and active states
- **`header`** - Top navigation with search, notifications, user menu
- **`scripts-common`** - Bootstrap JS and other common scripts

### Data Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-partial="name"` | Loads the specified partial | `data-partial="sidebar"` |
| `data-partial-replace="true"` | Replaces the div (default: appends) | `data-partial-replace="true"` |
| `data-page="name"` | Sets active sidebar item | `data-page="ui-buttons"` |
| `data-breadcrumb` | Generates dynamic breadcrumbs | `data-breadcrumb` |
| `data-breadcrumb-title` | Page title for breadcrumbs | `data-breadcrumb-title="Buttons"` |
| `data-breadcrumb-path` | Breadcrumb hierarchy | `data-breadcrumb-path="UI\|Components\|Buttons"` |

### Creating New Pages

1. **Copy an existing page** from `src/` directory
2. **Update the title and meta tags**
3. **Set the `data-page` attribute** to match your page name
4. **Update breadcrumbs** with appropriate title and path
5. **Add your content** in the main content area

The partials system will automatically handle navigation, header, and common elements.

## Development

### File Structure

```
sufee-admin-dashboard/
├── src/
│   ├── partials/          # Reusable HTML components
│   ├── scripts/           # JavaScript modules
│   ├── styles/            # SCSS stylesheets
│   ├── index.html         # Dashboard homepage
│   ├── ui-*.html          # UI component pages
│   └── main.js            # Main JavaScript entry point
├── public/                # Static assets
├── images/                # Image assets
├── dist/                  # Production build (generated)
└── vite.config.js         # Vite configuration
```

### Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run preview` - Preview production build locally

### Adding New Components

1. **Create SCSS partial** in `src/styles/components/`
2. **Import in main.scss**
3. **Add JavaScript** in `src/scripts/` if needed
4. **Create HTML example** page if desired

### Built With

**Core Framework:**
- [Vite](https://vitejs.dev/) - Modern build tool with HMR
- [Bootstrap 5](http://getbootstrap.com/) - Latest version
- [Sass/SCSS](http://sass-lang.com/) - CSS preprocessing

**JavaScript Libraries:**
- [Chart.js](http://www.chartjs.org/) - Modern charting library
- [jQuery](https://jquery.com/) - DOM manipulation (legacy components)
- [DataTables](https://datatables.net/) - Table enhancement
- [Chosen](https://harvesthq.github.io/chosen/) - Select enhancement
- [Flot Charts](http://www.flotcharts.org/) - Additional charting
- [gauge.js](http://bernii.github.io/gauge.js/) - Gauge charts
- [Peity](http://benpickles.github.io/peity/) - Inline charts
- [JQVMap](https://jqvmap.com/) - Vector maps
- [GMaps.js](https://hpneo.github.io/gmaps/) - Google Maps integration

**Icons & Fonts:**
- [Font Awesome 6](http://fontawesome.io/) - Icon library
- [Themify Icons](https://themify.me/themify-icons) - Additional icons
- [Flag Icons](https://flagicons.lipis.dev/) - Country flags

**Animation & UI:**
- [Animate.css](https://animate.style/) - CSS animations
- [jQuery Validation](https://jqueryvalidation.org/) - Form validation


### Changelog

#### V 2.0.0 (Bootstrap 5 + Vite Migration)
- **Major Update**: Migrated from Bootstrap 4 to Bootstrap 5
- **Build System**: Replaced Grunt with Vite for modern development
- **Partials System**: Added dynamic HTML partials for component reusability
- **Modern JavaScript**: Converted to ES6 modules with proper imports
- **IE Support Removed**: Dropped Internet Explorer compatibility
- **Performance**: Improved loading times with caching and modern bundling
- **Active Navigation**: Automatic sidebar highlighting based on current page
- **Dynamic Breadcrumbs**: Data-driven breadcrumb generation
- **Dependencies**: Updated all libraries to latest versions
- **File Structure**: Reorganized for better maintainability

#### V 1.0.0
Initial Release
### Authors
[Colorlib](https://colorlib.com)
### License

Sufee is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the final products. But you always need to state that Colorlib is the original author of this template.
