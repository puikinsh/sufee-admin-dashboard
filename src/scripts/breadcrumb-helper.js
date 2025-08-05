/**
 * Breadcrumb Helper Module
 * Dynamically generates breadcrumb based on data attributes
 */

export function initializeBreadcrumb() {
  const breadcrumbSection = document.querySelector('[data-breadcrumb]');
  if (!breadcrumbSection) {
    return;
  }

  const pageTitle = breadcrumbSection.dataset.breadcrumbTitle || 'Page';
  const pagePath = breadcrumbSection.dataset.breadcrumbPath || '';

  // Parse the path (format: "Section|Page|Subpage")
  const pathParts = pagePath.split('|').filter(Boolean);

  // Build breadcrumb items
  let breadcrumbItems = '<li class="breadcrumb-item"><a href="index.html">Home</a></li>';

  pathParts.forEach((part, index) => {
    if (index === pathParts.length - 1) {
      // Last item is active
      breadcrumbItems += `<li class="breadcrumb-item active" aria-current="page">${part}</li>`;
    } else {
      // Other items are just text (could be links if needed)
      breadcrumbItems += `<li class="breadcrumb-item">${part}</li>`;
    }
  });

  const html = `
        <!-- Breadcrumbs -->
        <div class="breadcrumb-section bg-light border-bottom py-3">
            <div class="container-fluid">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h1 class="h4 mb-0">${pageTitle}</h1>
                    </div>
                    <div class="col-md-6">
                        <nav aria-label="breadcrumb" class="float-md-end">
                            <ol class="breadcrumb mb-0">
                                ${breadcrumbItems}
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    `;

  breadcrumbSection.outerHTML = html;
}
