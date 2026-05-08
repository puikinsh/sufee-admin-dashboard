// User Menu Component

export class UserMenu {
  constructor() {
    this.userToggle = null;
    this.userMenu = null;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.userToggle = document.querySelector('.user-area .dropdown-toggle');
    this.userMenu = document.querySelector('.user-menu');

    if (!this.userToggle) {
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Toggle user menu
    this.userToggle.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (
        this.isOpen &&
        !this.userToggle.contains(e.target) &&
        !this.userMenu?.contains(e.target)
      ) {
        this.close();
      }
    });

    // Handle menu item clicks
    if (this.userMenu) {
      this.userMenu.addEventListener('click', e => {
        const link = e.target.closest('.nav-link');
        if (link) {
          this.handleMenuItemClick(link, e);
        }
      });
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.userToggle.classList.add('show');
    if (this.userMenu) {
      this.userMenu.classList.add('show');
    }
    this.isOpen = true;
  }

  close() {
    this.userToggle.classList.remove('show');
    if (this.userMenu) {
      this.userMenu.classList.remove('show');
    }
    this.isOpen = false;
  }

  handleMenuItemClick(link, event) {
    const action = link.dataset.action;

    switch (action) {
      case 'profile':
        this.navigateToProfile();
        break;
      case 'settings':
        this.navigateToSettings();
        break;
      case 'logout':
        event.preventDefault();
        this.handleLogout();
        break;
      default:
        // Let default navigation happen
        break;
    }

    this.close();
  }

  navigateToProfile() {
    window.location.href = '/profile';
  }

  navigateToSettings() {
    window.location.href = '/settings';
  }

  handleLogout() {
    // Lazy-create the confirmation modal once; reuse on subsequent clicks.
    let modalEl = document.getElementById('logoutConfirmModal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'logoutConfirmModal';
      modalEl.className = 'modal fade';
      modalEl.tabIndex = -1;
      modalEl.setAttribute('aria-hidden', 'true');
      modalEl.setAttribute('aria-labelledby', 'logoutConfirmTitle');
      modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="logoutConfirmTitle">Sign out</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">Are you sure you want to log out?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" data-action="confirm-logout">Log out</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);

      modalEl.querySelector('[data-action="confirm-logout"]').addEventListener('click', () => {
        window.location.href = '/logout';
      });
    }

    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  destroy() {
    this.close();
  }
}
