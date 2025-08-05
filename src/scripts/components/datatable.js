// DataTable Component - Vanilla JS replacement for jQuery DataTables

export class DataTable {
  constructor(table, options = {}) {
    this.table = typeof table === 'string' ? document.querySelector(table) : table;
    this.options = {
      sortable: true,
      searchable: true,
      pagination: true,
      pageSize: 10,
      ...options
    };

    this.data = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';

    if (this.table) {
      this.init();
    }
  }

  init() {
    this.extractData();
    this.createWrapper();
    this.createControls();
    this.render();
    this.setupEventListeners();
  }

  extractData() {
    const rows = this.table.querySelectorAll('tbody tr');
    this.data = Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).map(cell => cell.innerHTML);
    });
    this.filteredData = [...this.data];
  }

  createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'datatable-wrapper';
    wrapper.innerHTML = `
      <div class="datatable-top">
        ${this.options.searchable ? '<div class="datatable-search"><input type="text" placeholder="Search..." class="form-control"></div>' : ''}
      </div>
      <div class="datatable-container"></div>
      ${this.options.pagination ? '<div class="datatable-bottom"><div class="datatable-info"></div><div class="datatable-pagination"></div></div>' : ''}
    `;

    this.table.parentNode.insertBefore(wrapper, this.table);
    wrapper.querySelector('.datatable-container').appendChild(this.table);
    this.wrapper = wrapper;
  }

  createControls() {
    if (this.options.searchable) {
      this.searchInput = this.wrapper.querySelector('.datatable-search input');
    }

    if (this.options.pagination) {
      this.infoElement = this.wrapper.querySelector('.datatable-info');
      this.paginationElement = this.wrapper.querySelector('.datatable-pagination');
    }
  }

  setupEventListeners() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', e => {
        this.search(e.target.value);
      });
    }

    // Sorting functionality
    if (this.options.sortable) {
      const headers = this.table.querySelectorAll('thead th');
      headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          this.sort(index);
        });
      });
    }
  }

  search(query) {
    if (!query) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(row =>
        row.some(cell => cell.toLowerCase().includes(query.toLowerCase()))
      );
    }

    this.currentPage = 1;
    this.render();
  }

  sort(columnIndex) {
    if (this.sortColumn === columnIndex) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnIndex;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];

      // Try to parse as numbers
      const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        comparison = aVal.localeCompare(bVal);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.updateSortIndicators();
    this.render();
  }

  updateSortIndicators() {
    const headers = this.table.querySelectorAll('thead th');
    headers.forEach((header, index) => {
      header.classList.remove('sort-asc', 'sort-desc');
      if (index === this.sortColumn) {
        header.classList.add(`sort-${this.sortDirection}`);
      }
    });
  }

  render() {
    this.renderTable();
    if (this.options.pagination) {
      this.renderPagination();
      this.renderInfo();
    }
  }

  renderTable() {
    const tbody = this.table.querySelector('tbody');
    const startIndex = (this.currentPage - 1) * this.options.pageSize;
    const endIndex = startIndex + this.options.pageSize;
    const pageData = this.options.pagination
      ? this.filteredData.slice(startIndex, endIndex)
      : this.filteredData;

    tbody.innerHTML = pageData
      .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
      .join('');
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);

    if (totalPages <= 1) {
      this.paginationElement.innerHTML = '';
      return;
    }

    const pagination = document.createElement('nav');
    pagination.innerHTML = `
      <ul class="pagination">
        <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="prev">Previous</a>
        </li>
        ${Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => this.shouldShowPage(page, totalPages))
          .map(
            page => `
            <li class="page-item ${page === this.currentPage ? 'active' : ''}">
              <a class="page-link" href="#" data-page="${page}">${page}</a>
            </li>
          `
          )
          .join('')}
        <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="next">Next</a>
        </li>
      </ul>
    `;

    // Add event listeners to pagination links
    pagination.addEventListener('click', e => {
      e.preventDefault();
      const page = e.target.dataset.page;

      if (page === 'prev' && this.currentPage > 1) {
        this.currentPage--;
      } else if (page === 'next' && this.currentPage < totalPages) {
        this.currentPage++;
      } else if (!isNaN(page)) {
        this.currentPage = parseInt(page);
      }

      this.render();
    });

    this.paginationElement.innerHTML = '';
    this.paginationElement.appendChild(pagination);
  }

  shouldShowPage(page, totalPages) {
    // Show first page, last page, current page, and 2 pages around current
    return page === 1 || page === totalPages || Math.abs(page - this.currentPage) <= 2;
  }

  renderInfo() {
    const start = (this.currentPage - 1) * this.options.pageSize + 1;
    const end = Math.min(start + this.options.pageSize - 1, this.filteredData.length);
    const total = this.filteredData.length;

    this.infoElement.textContent = `Showing ${start} to ${end} of ${total} entries`;
  }

  // Public API methods
  refresh() {
    this.extractData();
    this.filteredData = [...this.data];
    this.currentPage = 1;
    this.render();
  }

  destroy() {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.insertBefore(this.table, this.wrapper);
      this.wrapper.remove();
    }
  }
}
