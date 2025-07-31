// Chart Manager Component - Handle Chart.js initialization

export class ChartManager {
  constructor() {
    this.charts = new Map()
    this.init()
  }

  async init() {
    try {
      // Dynamically import Chart.js
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      
      // Chart Manager initialized
      this.initializePageCharts()
    } catch (error) {
      // Failed to load Chart.js
    }
  }

  initializePageCharts() {
    // Initialize charts based on page content
    this.initializeLineCharts()
    this.initializeBarCharts()
    this.initializePieCharts()
  }

  initializeLineCharts() {
    const lineCharts = document.querySelectorAll('[data-chart="line"]')
    lineCharts.forEach(canvas => {
      this.createLineChart(canvas)
    })
  }

  initializeBarCharts() {
    const barCharts = document.querySelectorAll('[data-chart="bar"]')
    barCharts.forEach(canvas => {
      this.createBarChart(canvas)
    })
  }

  initializePieCharts() {
    const pieCharts = document.querySelectorAll('[data-chart="pie"]')
    pieCharts.forEach(canvas => {
      this.createPieChart(canvas)
    })
  }

  createLineChart(canvas) {
    const ctx = canvas.getContext('2d')
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Line Chart'
          }
        }
      }
    })

    this.charts.set(canvas.id, chart)
  }

  createBarChart(canvas) {
    const ctx = canvas.getContext('2d')
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    this.charts.set(canvas.id, chart)
  }

  createPieChart(canvas) {
    const ctx = canvas.getContext('2d')
    
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    this.charts.set(canvas.id, chart)
  }

  // Public API methods
  getChart(id) {
    return this.charts.get(id)
  }

  destroyChart(id) {
    const chart = this.charts.get(id)
    if (chart) {
      chart.destroy()
      this.charts.delete(id)
    }
  }

  destroy() {
    // Destroy all charts
    this.charts.forEach(chart => chart.destroy())
    this.charts.clear()
  }
}