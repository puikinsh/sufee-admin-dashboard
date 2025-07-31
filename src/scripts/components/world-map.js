// World Map Component using Leaflet
// Modern, interactive world map with data visualization

export class WorldMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId
    this.container = document.getElementById(containerId)
    
    this.options = {
      height: 300,
      ...options
    }
    
    this.map = null
    this.markers = []
    this.data = null
    
    this.init()
  }

  async init() {
    if (!this.container) {
      // World map container not found
      return
    }

    try {
      // Load Leaflet CSS and JS
      await this.loadLeaflet()
      
      // Generate sample data
      this.generateSampleData()
      
      // Create the actual map
      this.createMap()
      
    } catch (error) {
      // Failed to initialize world map
      this.showFallback()
    }
  }

  async loadLeaflet() {
    // Import Leaflet CSS
    const leafletCSS = document.createElement('link')
    leafletCSS.rel = 'stylesheet'
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(leafletCSS)
    
    // Import Leaflet JS
    const L = await import('leaflet')
    this.L = L.default || L
    
    // Leaflet loaded successfully
  }

  generateSampleData() {
    // Sample data with geographic coordinates for map visualization
    this.data = [
      { name: 'United States', code: 'us', visitors: 4250, percentage: 35.2, lat: 39.8283, lng: -98.5795 },
      { name: 'United Kingdom', code: 'gb', visitors: 1890, percentage: 15.7, lat: 55.3781, lng: -3.4360 },
      { name: 'Germany', code: 'de', visitors: 1420, percentage: 11.8, lat: 51.1657, lng: 10.4515 },
      { name: 'France', code: 'fr', visitors: 980, percentage: 8.1, lat: 46.2276, lng: 2.2137 },
      { name: 'Canada', code: 'ca', visitors: 760, percentage: 6.3, lat: 56.1304, lng: -106.3468 },
      { name: 'Australia', code: 'au', visitors: 650, percentage: 5.4, lat: -25.2744, lng: 133.7751 },
      { name: 'Japan', code: 'jp', visitors: 540, percentage: 4.5, lat: 36.2048, lng: 138.2529 },
      { name: 'Netherlands', code: 'nl', visitors: 420, percentage: 3.5, lat: 52.1326, lng: 5.2913 },
      { name: 'Italy', code: 'it', visitors: 380, percentage: 3.2, lat: 41.8719, lng: 12.5674 },
      { name: 'Spain', code: 'es', visitors: 320, percentage: 2.7, lat: 40.4637, lng: -3.7492 }
    ]
  }

  createMap() {
    // Check if we're inside a card body - if so, we need to work within the card structure
    const cardBody = this.container.closest('.card-body')
    const card = this.container.closest('.card')
    
    if (card) {
      // We're inside a card, so let's update the card footer with our data
      const cardFooter = card.querySelector('.card-footer')
      
      // First, clear the container and set explicit dimensions
      this.container.innerHTML = ''
      this.container.style.height = `${this.options.height}px`
      this.container.style.width = '100%'
      this.container.style.position = 'relative'
      this.container.classList.remove('d-flex', 'align-items-center', 'justify-content-center', 'bg-light')
      
      // Initialize Leaflet map directly in the container
      this.map = this.L.map(this.container, {
        center: [20, 0], // Center on world
        zoom: 2,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: true
      })
      
      // Add OpenStreetMap tile layer
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map)
      
      // Add data points to the map
      this.addDataPoints()
      
      // Update the card footer with our data if it exists
      if (cardFooter) {
        cardFooter.innerHTML = `
          <div class="row g-2 text-center">
            <div class="col-6 col-sm-3">
              <div class="text-primary fw-bold">${this.data.length}</div>
              <small class="text-muted d-block text-nowrap">Countries</small>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-success fw-bold">${this.data.reduce((sum, country) => sum + country.visitors, 0).toLocaleString()}</div>
              <small class="text-muted d-block text-nowrap">Visitors</small>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-warning fw-bold text-truncate">${this.data[0].name}</div>
              <small class="text-muted d-block text-nowrap">Top Country</small>
            </div>
            <div class="col-6 col-sm-3">
              <div class="text-info fw-bold">${this.data[0].percentage}%</div>
              <small class="text-muted d-block text-nowrap">Top Share</small>
            </div>
          </div>
        `
      }
      
    } else {
      // Fallback - create our own structure if not in a card
      this.container.innerHTML = ''
      this.container.style.height = `${this.options.height}px`
      this.container.style.width = '100%'
      this.container.style.position = 'relative'
      this.container.classList.remove('d-flex', 'align-items-center', 'justify-content-center', 'bg-light')
      
      this.map = this.L.map(this.container, {
        center: [20, 0],
        zoom: 2,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        zoomControl: true
      })
      
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map)
      
      this.addDataPoints()
    }
    
    // Leaflet map created successfully
    
    // Force map to properly size itself after a short delay
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize()
      }
    }, 100)
  }
  
  addDataPoints() {
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker))
    this.markers = []
    
    // Add markers for each country
    this.data.forEach(country => {
      // Calculate marker size based on visitor count
      const maxVisitors = Math.max(...this.data.map(d => d.visitors))
      const minSize = 8
      const maxSize = 25
      const size = minSize + (country.visitors / maxVisitors) * (maxSize - minSize)
      
      // Create custom icon with size based on visitor count
      const customIcon = this.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: #0d6efd;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${Math.max(8, size * 0.4)}px;
            font-weight: bold;
          ">
            <span class="fi fi-${country.code}" style="font-size: ${Math.max(6, size * 0.6)}px;"></span>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      })
      
      // Create marker
      const marker = this.L.marker([country.lat, country.lng], {
        icon: customIcon
      }).addTo(this.map)
      
      // Add popup with country information  
      marker.bindPopup(`
        <div class="p-2">
          <div class="d-flex align-items-center mb-2">
            <span class="fi fi-${country.code} me-2"></span>
            <strong>${country.name}</strong>
          </div>
          <div><strong>${country.visitors.toLocaleString()}</strong> visitors</div>
          <div class="text-muted">${country.percentage}% of total traffic</div>
        </div>
      `)
      
      this.markers.push(marker)
    })
  }

  setupInteractions() {
    // Find the card that contains our map
    const card = this.container.closest('.card')
    if (!card) return
    
    // Add click handlers for mini country cards in the footer
    const countryMinis = card.querySelectorAll('.country-mini')
    countryMinis.forEach(mini => {
      mini.addEventListener('click', (e) => {
        const countryCode = mini.dataset.country
        const country = this.data.find(c => c.code === countryCode)
        if (country) {
          // Pan and zoom to country
          this.map.setView([country.lat, country.lng], 5, {
            animate: true,
            duration: 1
          })
          
          // Find and open the marker popup
          const marker = this.markers.find(m => 
            m.getLatLng().lat === country.lat && m.getLatLng().lng === country.lng
          )
          if (marker) {
            marker.openPopup()
          }
          
          // Highlight effect
          mini.style.backgroundColor = 'rgba(13, 110, 253, 0.1)'
          mini.style.borderRadius = '8px'
          mini.style.transition = 'background-color 0.3s ease'
          setTimeout(() => {
            mini.style.backgroundColor = ''
          }, 300)
        }
      })
      
      // Add hover effects
      mini.addEventListener('mouseenter', () => {
        mini.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
        mini.style.borderRadius = '8px'
        mini.style.transition = 'background-color 0.2s ease'
      })
      
      mini.addEventListener('mouseleave', () => {
        mini.style.backgroundColor = ''
      })
    })
  }

  // Update data and refresh map
  updateData(newData) {
    this.data = newData
    if (this.map) {
      // Recreate the entire component with new data
      this.createMap()
    }
  }
  
  // Resize map when container changes
  handleResize() {
    if (this.map) {
      this.map.invalidateSize()
    }
  }

  showFallback() {
    this.container.innerHTML = `
      <div class="d-flex align-items-center justify-content-center h-100 bg-light rounded">
        <div class="text-center text-muted">
          <i class="fas fa-globe fa-3x mb-3 opacity-50"></i>
          <div class="h6">World Map Unavailable</div>
          <small>Unable to load map visualization</small>
        </div>
      </div>
    `
  }

  // Destroy the component
  destroy() {
    if (this.map) {
      this.map.remove()
      this.map = null
    }
    this.markers = []
    if (this.container) {
      this.container.innerHTML = ''
    }
  }

  // Get current data
  getData() {
    return this.data
  }
}