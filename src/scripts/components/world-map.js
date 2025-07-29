// World Map Component - Lightweight Alternative
// Modern, jQuery-free, country statistics visualization

export class WorldMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId
    this.container = document.getElementById(containerId)
    
    this.options = {
      showCountryNames: true,
      showVisitorCount: true,
      height: 300,
      backgroundColor: 'white',
      ...options
    }
    
    this.data = null
    
    this.init()
  }

  async init() {
    if (!this.container) {
      console.error(`World map container with ID '${this.containerId}' not found`)
      return
    }

    try {
      // Generate sample data
      this.generateSampleData()
      
      // Create the country statistics view
      this.createCountryStats()
      
    } catch (error) {
      console.error('Failed to initialize world map:', error)
      this.showFallback()
    }
  }

  generateSampleData() {
    // Sample data showing visitor/user statistics by country
    const countries = [
      { name: 'United States', code: 'us', visitors: 4250, percentage: 35.2 },
      { name: 'United Kingdom', code: 'gb', visitors: 1890, percentage: 15.7 },
      { name: 'Germany', code: 'de', visitors: 1420, percentage: 11.8 },
      { name: 'France', code: 'fr', visitors: 980, percentage: 8.1 },
      { name: 'Canada', code: 'ca', visitors: 760, percentage: 6.3 },
      { name: 'Australia', code: 'au', visitors: 650, percentage: 5.4 },
      { name: 'Japan', code: 'jp', visitors: 540, percentage: 4.5 },
      { name: 'Netherlands', code: 'nl', visitors: 420, percentage: 3.5 },
      { name: 'Italy', code: 'it', visitors: 380, percentage: 3.2 },
      { name: 'Spain', code: 'es', visitors: 320, percentage: 2.7 }
    ]

    this.data = countries
  }

  createMap() {
    const mapData = [{
      type: 'choropleth',
      locationmode: 'ISO-3',
      locations: this.data.map(d => d.code),
      z: this.data.map(d => d.value),
      text: this.data.map(d => `${d.country}<br>Visitors: ${d.value.toLocaleString()}<br>Users: ${d.users.toLocaleString()}`),
      hovertemplate: '%{text}<extra></extra>',
      colorscale: [
        [0, '#e3f2fd'],
        [0.2, '#90caf9'], 
        [0.4, '#42a5f5'],
        [0.6, '#1e88e5'],
        [0.8, '#1565c0'],
        [1, '#0d47a1']
      ],
      colorbar: {
        title: {
          text: 'Visitors',
          font: { size: 12 }
        },
        thickness: 10,
        len: 0.7,
        x: 1.02
      }
    }]

    const layout = {
      geo: {
        showframe: false,
        showcoastlines: true,
        showland: true,
        landcolor: '#f8f9fa',
        showocean: true,
        oceancolor: '#e3f2fd',
        showcountries: true,
        countrycolor: '#dee2e6',
        countrywidth: 0.5,
        projection: {
          type: 'natural earth'
        }
      },
      height: this.options.height,
      margin: { t: 0, b: 0, l: 0, r: 0 },
      paper_bgcolor: this.options.backgroundColor,
      plot_bgcolor: this.options.backgroundColor,
      font: {
        family: "'Open Sans', sans-serif",
        size: 11,
        color: '#495057'
      }
    }

    const config = {
      displayModeBar: false,
      responsive: true,
      displaylogo: false
    }

    window.Plotly.newPlot(this.containerId, mapData, layout, config)
  }

  setupResponsive() {
    // Handle window resize
    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (this.container && window.Plotly) {
          window.Plotly.Plots.resize(this.containerId)
        }
      }, 100)
    })
  }

  showFallback() {
    this.container.innerHTML = `
      <div class="d-flex align-items-center justify-content-center h-100 bg-light rounded">
        <div class="text-center text-muted">
          <i class="fas fa-globe fa-3x mb-3 opacity-50"></i>
          <div class="h6">World Map</div>
          <small>Interactive world map visualization</small>
        </div>
      </div>
    `
  }

  // Update map data
  updateData(newData) {
    if (!this.plotlyLoaded || !window.Plotly) return

    this.data = newData
    this.createMap()
  }

  // Destroy the map
  destroy() {
    if (this.container && window.Plotly) {
      window.Plotly.purge(this.containerId)
    }
  }

  // Get current map data
  getData() {
    return this.data
  }
}