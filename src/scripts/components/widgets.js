// Widget Manager Component - Dashboard widgets functionality
import { WorldMap } from './world-map.js';

export class WidgetManager {
  constructor() {
    this.widgets = new Map();
    this.charts = new Map();
    this.Chart = null;
    this.init();
  }

  async init() {
    // Widget Manager initialized

    // Load Chart.js first
    await this.loadChartJS();

    // Initialize components
    this.initializeCounters();
    await this.initializeWidgetCharts();
    await this.initializeTrafficChart();
    await this.initializeWorldMap();
  }

  async loadChartJS() {
    try {
      // Dynamically import Chart.js with all components
      const chartModule = await import('chart.js');
      this.Chart = chartModule.Chart;

      // Register all Chart.js components
      this.Chart.register(...chartModule.registerables);

      // Chart.js loaded successfully
    } catch (error) {
      // Failed to load Chart.js
      throw error;
    }
  }

  initializeCounters() {
    // Initialize animated counters
    const counters = document.querySelectorAll('.count, .card-title');
    counters.forEach(counter => {
      if (counter.textContent.match(/^\d/)) {
        this.animateCounter(counter);
      }
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent.replace(/,/g, ''));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps

    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  async initializeWidgetCharts() {
    if (!this.Chart) {
      // Chart.js not loaded, skipping widget charts
      return;
    }

    // Find all widget chart canvases
    const chartElements = document.querySelectorAll('[id^="widgetChart"]');

    // Found widget chart canvases

    chartElements.forEach((canvas, index) => {
      try {
        this.createWidgetChart(canvas, index + 1);
      } catch (error) {
        // Failed to create widget chart
      }
    });
  }

  createWidgetChart(canvas, index) {
    if (!canvas) {
      // Widget chart canvas not found
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Could not get context for widget chart
      return;
    }

    // Destroy existing chart if it exists
    if (this.charts.has(canvas.id)) {
      this.charts.get(canvas.id).destroy();
    }

    // Generate chart data
    const data = this.generateWidgetChartData(index);

    // Creating widget chart

    const chart = new this.Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            }
          }
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 0
          },
          line: {
            borderWidth: 2,
            tension: 0.4
          }
        },
        animation: {
          duration: 1000
        }
      }
    });

    // Store chart reference
    this.charts.set(canvas.id, chart);

    // Widget chart created successfully
  }

  generateWidgetChartData(index) {
    // Different datasets for each widget
    const datasets = [
      { data: [65, 59, 84, 84, 51, 55, 40, 65, 59, 84] }, // Primary widget
      { data: [28, 48, 40, 59, 86, 27, 90, 28, 48, 40] }, // Danger widget
      { data: [45, 25, 16, 36, 67, 18, 76, 45, 25, 16] }, // Warning widget
      { data: [12, 19, 27, 43, 52, 31, 48, 12, 19, 27] } // Success widget
    ];

    const selectedData = datasets[index - 1] || datasets[0];

    return {
      labels: Array(selectedData.data.length).fill(''),
      datasets: [
        {
          data: selectedData.data,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    };
  }

  async initializeTrafficChart() {
    const trafficCanvas = document.getElementById('trafficChart');
    if (!trafficCanvas || !this.Chart) {
      return;
    }

    try {
      const ctx = trafficCanvas.getContext('2d');

      // Destroy existing chart if it exists
      if (this.charts.has('trafficChart')) {
        this.charts.get('trafficChart').destroy();
      }

      const chart = new this.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Visits',
              data: [65, 59, 84, 84, 51, 55, 40, 58, 72, 69],
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Unique Visits',
              data: [28, 48, 40, 59, 86, 27, 90, 45, 62, 58],
              borderColor: '#28a745',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              ticks: {
                color: '#6c757d'
              }
            },
            y: {
              display: true,
              grid: {
                color: 'rgba(0,0,0,0.1)'
              },
              ticks: {
                color: '#6c757d'
              }
            }
          },
          elements: {
            line: {
              borderWidth: 2
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });

      this.charts.set('trafficChart', chart);
      // Traffic chart created successfully
    } catch (error) {
      // Failed to initialize traffic chart
    }
  }

  // Handle window resize
  handleResize() {
    this.charts.forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
      }
    });
  }

  async initializeWorldMap() {
    const worldMapContainer = document.getElementById('worldMap');
    if (!worldMapContainer) {
      // World map container not found
      return;
    }

    try {
      const worldMap = new WorldMap('worldMap', {
        height: 320,
        showCountryNames: true,
        backgroundColor: 'white'
      });

      this.widgets.set('worldMap', worldMap);
      // World map initialized successfully
    } catch (error) {
      // Failed to initialize world map
      // Show fallback content
      worldMapContainer.innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100 bg-light rounded">
          <div class="text-center text-muted">
            <i class="fas fa-globe fa-3x mb-3 opacity-50"></i>
            <div class="h6">Interactive World Map</div>
            <small>Global visitor statistics</small>
          </div>
        </div>
      `;
    }
  }

  destroy() {
    // Destroy all charts
    this.charts.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });

    // Destroy all widgets
    this.widgets.forEach(widget => {
      if (widget && typeof widget.destroy === 'function') {
        widget.destroy();
      }
    });

    this.charts.clear();
    this.widgets.clear();
  }
}
