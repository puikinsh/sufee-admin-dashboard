// Search Component - Replaces jQuery search functionality

export class Search {
  constructor() {
    this.searchTrigger = null
    this.searchClose = null
    this.headerLeft = null
    this.searchForm = null
    this.searchInput = null
    this.isOpen = false
    
    this.init()
  }

  init() {
    // Look for new Bootstrap 5 structure elements
    this.searchTrigger = document.getElementById('searchToggle')
    this.searchClose = document.getElementById('searchClose')
    this.searchForm = document.querySelector('.search-form')
    this.searchInput = document.querySelector('.search-form input[type="search"]') || document.querySelector('.search-form input[type="text"]')
    
    if (!this.searchTrigger || !this.searchForm) {
      // Search elements not found - search functionality may be limited
      return
    }

    this.setupEventListeners()
  }

  setupEventListeners() {
    // Open search
    this.searchTrigger.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.openSearch()
    })

    // Close search
    if (this.searchClose) {
      this.searchClose.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.closeSearch()
      })
    }

    // Close search on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && this.searchForm && !this.searchForm.contains(e.target) && !this.searchTrigger.contains(e.target)) {
        this.closeSearch()
      }
    })

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeSearch()
      }
    })

    // Handle search form submission
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
        this.performSearch()
      })
    }

    // Handle search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearchInput(e.target.value)
      })
    }
  }

  openSearch() {
    if (this.searchForm) {
      this.searchForm.classList.remove('d-none')
    }
    
    // Hide the search trigger icon when form is open
    if (this.searchTrigger) {
      this.searchTrigger.classList.add('d-none')
    }
    
    this.isOpen = true
    
    // Focus on search input
    if (this.searchInput) {
      setTimeout(() => {
        this.searchInput.focus()
      }, 100)
    }

    // Emit custom event
    this.dispatchEvent('search:opened')
  }

  closeSearch() {
    if (this.searchForm) {
      this.searchForm.classList.add('d-none')
    }
    
    // Show the search trigger icon when form is closed
    if (this.searchTrigger) {
      this.searchTrigger.classList.remove('d-none')
    }
    
    this.isOpen = false
    
    // Clear search input
    if (this.searchInput) {
      this.searchInput.value = ''
    }

    // Emit custom event
    this.dispatchEvent('search:closed')
  }

  performSearch() {
    const query = this.searchInput?.value.trim()
    
    if (!query) {
      return
    }

    // Emit search event with query
    this.dispatchEvent('search:performed', { query })

    // You can implement actual search logic here
    // For now, we'll just show a simple alert
    // Searching for: query
    
    // Example: Redirect to search results page
    // window.location.href = `/search?q=${encodeURIComponent(query)}`
  }

  handleSearchInput(value) {
    // Handle real-time search suggestions
    if (value.length >= 2) {
      this.showSearchSuggestions(value)
    } else {
      this.hideSearchSuggestions()
    }
  }

  showSearchSuggestions(query) {
    // Implement search suggestions logic
    // This could make an API call or search through local data
    
    // Example implementation:
    const suggestions = this.generateSuggestions(query)
    this.renderSuggestions(suggestions)
  }

  hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions')
    if (suggestionsContainer) {
      suggestionsContainer.remove()
    }
  }

  generateSuggestions(query) {
    // Mock suggestions - in a real app, this would come from an API or database
    const mockData = [
      'Dashboard',
      'Charts - Chart.js',
      'Charts - Flot',
      'Forms - Basic',
      'Forms - Advanced',
      'Tables - Basic',
      'Tables - Data',
      'UI Elements - Buttons',
      'UI Elements - Cards',
      'UI Elements - Alerts',
      'Widgets'
    ]

    return mockData.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) // Limit to 5 suggestions
  }

  renderSuggestions(suggestions) {
    this.hideSearchSuggestions() // Remove existing suggestions

    if (suggestions.length === 0) {
      return
    }

    const suggestionsContainer = document.createElement('div')
    suggestionsContainer.className = 'search-suggestions'
    suggestionsContainer.innerHTML = `
      <ul class="list-unstyled mb-0">
        ${suggestions.map(suggestion => `
          <li>
            <a href="#" class="d-block px-3 py-2 text-decoration-none" data-suggestion="${suggestion}">
              <i class="fa fa-search me-2"></i>
              ${suggestion}
            </a>
          </li>
        `).join('')}
      </ul>
    `

    // Style the suggestions container
    Object.assign(suggestionsContainer.style, {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderTop: 'none',
      borderRadius: '0 0 4px 4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: '1000'
    })

    // Add click handlers for suggestions
    suggestionsContainer.addEventListener('click', (e) => {
      e.preventDefault()
      const suggestion = e.target.closest('[data-suggestion]')
      if (suggestion) {
        const suggestionText = suggestion.dataset.suggestion
        this.searchInput.value = suggestionText
        this.hideSearchSuggestions()
        this.performSearch()
      }
    })

    // Append to search form
    if (this.searchForm) {
      this.searchForm.style.position = 'relative'
      this.searchForm.appendChild(suggestionsContainer)
    }
  }

  // Public API methods
  focus() {
    if (!this.isOpen) {
      this.openSearch()
    } else if (this.searchInput) {
      this.searchInput.focus()
    }
  }

  getState() {
    return {
      isOpen: this.isOpen,
      query: this.searchInput?.value || ''
    }
  }

  // Utility method to dispatch custom events
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { 
      detail,
      bubbles: true,
      cancelable: true
    })
    document.dispatchEvent(event)
  }

  // Cleanup method
  destroy() {
    this.closeSearch()
    this.hideSearchSuggestions()
  }
}