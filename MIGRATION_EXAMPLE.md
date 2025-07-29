# Migration Example: ui-grids.html

This document demonstrates the step-by-step process for migrating a page to the new structure.

## Migration Steps

### 1. Create New File Structure
```html
<!DOCTYPE html>
<html lang="en" data-bs-theme="light">
<head>
    <meta charset="utf-8">
    <title>Grid System - Sufee Admin</title>
    <meta name="description" content="Bootstrap 5 Grid System Examples">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <div data-partial="head-common"></div>
</head>

<body class="sufee-dashboard" data-page="ui-grids">
    <div class="d-flex min-vh-100">
        <!-- Sidebar -->
        <div data-partial="sidebar" data-partial-replace="true"></div>

        <!-- Main Content Area -->
        <div class="main-content flex-grow-1">
            <!-- Header -->
            <div data-partial="header" data-partial-replace="true"></div>

            <!-- Breadcrumb -->
            <div data-breadcrumb 
                 data-breadcrumb-title="Grid System" 
                 data-breadcrumb-path="UI Elements|Layout|Grid System"></div>

            <!-- Content -->
            <main class="content-area p-4">
                <!-- Page content here -->
            </main>
        </div>
    </div>

    <!-- Scripts -->
    <script type="module" src="/main.js"></script>
</body>
</html>
```

### 2. Update Bootstrap 4 to Bootstrap 5 Classes

**Bootstrap 4 → Bootstrap 5 Changes:**
- `no-gutters` → `g-0`
- `ml-*` → `ms-*`
- `mr-*` → `me-*`
- `pl-*` → `ps-*`
- `pr-*` → `pe-*`
- `float-left` → `float-start`
- `float-right` → `float-end`
- `font-weight-*` → `fw-*`
- `font-italic` → `fst-italic`
- `text-monospace` → `font-monospace`
- `rounded-sm/lg` → `rounded-1/3`
- `badge-*` → `bg-*`
- `close` → `btn-close`
- `custom-control` → `form-check`
- `custom-select` → `form-select`
- `form-group` → removed (not needed)
- `input-group-append/prepend` → removed (direct children)

### 3. Remove jQuery Dependencies

**jQuery Code:**
```javascript
$('.toggle-button').click(function() {
    $(this).toggleClass('active');
    $('#sidebar').toggleClass('collapsed');
});
```

**Vanilla JavaScript:**
```javascript
document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
});
```

### 4. Update Chart Integration

**Old (with CDN):**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, { ... });
</script>
```

**New (with Vite):**
```javascript
// In component file
import Chart from 'chart.js/auto';

export function initChart(elementId, config) {
    const ctx = document.getElementById(elementId);
    return new Chart(ctx, config);
}
```

### 5. Content Structure Example

```html
<main class="content-area p-4">
    <div class="container-fluid">
        <!-- Page Header -->
        <div class="row mb-4">
            <div class="col-12">
                <h1 class="h3 mb-3">Grid System</h1>
                <p class="text-muted">Examples and usage guidelines for Bootstrap's powerful grid system.</p>
            </div>
        </div>

        <!-- Basic Grid -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Basic Grid</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="p-3 bg-light border rounded">Column 1</div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 bg-light border rounded">Column 2</div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 bg-light border rounded">Column 3</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Responsive Grid -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Responsive Grid</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div class="p-3 bg-primary text-white rounded">
                                    Responsive Column
                                </div>
                            </div>
                            <!-- More columns... -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
```

### 6. Add to Vite Configuration

Update `vite.config.js`:
```javascript
input: {
    main: resolve(__dirname, 'src/index.html'),
    'ui-grids': resolve(__dirname, 'src/ui-grids.html'),
    // ... other entries
}
```

### 7. Testing Process

1. **Start dev server:** `npm run dev`
2. **Navigate to:** `http://localhost:3001/ui-grids.html`
3. **Check all sections load properly**
4. **Test responsive behavior**
5. **Verify no console errors**
6. **Test interactive elements**
7. **Check dark mode toggle**

### 8. Common Issues and Solutions

**Issue:** Styles not loading
**Solution:** Ensure `<div data-partial="head-common"></div>` is present

**Issue:** Scripts not working
**Solution:** Check module imports and ensure no jQuery dependencies

**Issue:** Layout broken
**Solution:** Update Bootstrap 4 classes to Bootstrap 5

**Issue:** Charts not rendering
**Solution:** Import Chart.js properly and initialize after DOM ready

### 9. Quality Checklist

- [ ] All partials load correctly
- [ ] Page title and meta description updated
- [ ] Breadcrumb path accurate
- [ ] No CDN dependencies
- [ ] No jQuery code
- [ ] Bootstrap 5 classes used
- [ ] Responsive on all devices
- [ ] Dark mode works
- [ ] No console errors
- [ ] Loading performance good
- [ ] Accessibility standards met
- [ ] Code well-commented
- [ ] Example data realistic
- [ ] Interactive elements smooth
- [ ] Page looks professional