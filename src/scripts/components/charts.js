// Chart Manager — data-attribute-driven Chart.js wrapper.
//
// Mark a canvas with `data-chart="<type>"` and the manager renders it.
// Supported types: line, bar, pie, doughnut, area (line + fill), radar,
// polarArea.
//
// Customize per-canvas via additional data attributes:
//   data-labels="Jan,Feb,Mar,Apr"        Comma-separated x-axis labels.
//   data-values="65,59,80,81"            Single dataset.
//                                        Multiple datasets: separate with `;`,
//                                        e.g. data-values="10,20;30,40".
//   data-datasets="Sales,Returns"        Optional dataset labels (matches `;` count).
//   data-colors="primary,success"        Optional theme colors per dataset.
//   data-title="Monthly Sales"           Optional chart title above the plot.
//   data-no-legend                       Hide the legend.
//   data-stacked                         (bar) Stack datasets on top of each other.
//   data-horizontal                      (bar) Render bars horizontally.
//
// For chart shapes that don't fit this attribute model (mixed bar/line,
// bubble, scatter), use Chart.js directly via `window.Chart`.

const THEME_COLORS = {
  primary: '#20a8d8',
  secondary: '#6c757d',
  success: '#4dbd74',
  info: '#63c2de',
  warning: '#ffc107',
  danger: '#f86c6b',
  dark: '#272c33'
};

const DEFAULT_COLOR_CYCLE = ['primary', 'success', 'warning', 'danger', 'info', 'secondary'];

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseNumberList(str) {
  return str
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => Number.isFinite(n));
}

function parseDatasets(canvas) {
  const valuesAttr = canvas.dataset.values || '';
  const labelsAttr = canvas.dataset.datasets || '';
  const colorsAttr = canvas.dataset.colors || '';

  const datasetGroups = valuesAttr.split(';').map(s => parseNumberList(s));
  const datasetLabels = labelsAttr ? labelsAttr.split(',').map(s => s.trim()) : [];
  const colorNames = colorsAttr ? colorsAttr.split(',').map(s => s.trim()) : DEFAULT_COLOR_CYCLE;

  return datasetGroups.map((data, i) => ({
    data,
    label: datasetLabels[i] ?? `Dataset ${i + 1}`,
    color: THEME_COLORS[colorNames[i % colorNames.length]] || THEME_COLORS.primary
  }));
}

export class ChartManager {
  constructor() {
    this.charts = new Map();
    this.init();
  }

  async init() {
    try {
      // Chart.js may already be loaded by main.js; either way this is cheap.
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      this.Chart = Chart;
      this.renderAll();
    } catch {
      // Chart.js failed to load; fail silently — charts just won't render.
    }
  }

  renderAll() {
    const canvases = document.querySelectorAll('[data-chart]');
    canvases.forEach(canvas => {
      const type = canvas.dataset.chart;
      const builder = ChartManager.BUILDERS[type];
      if (!builder) {
        return;
      }
      try {
        const config = builder(canvas);
        const chart = new this.Chart(canvas.getContext('2d'), config);
        this.charts.set(canvas.id || canvas, chart);
      } catch {
        // Skip individual canvas failures — don't break the page.
      }
    });
  }

  // Each builder returns a Chart.js config object. Add new chart types here.
  static BUILDERS = {
    line: canvas => buildAxisChart(canvas, 'line', { fill: false }),
    area: canvas => buildAxisChart(canvas, 'line', { fill: true, fillAlpha: 0.2 }),
    bar: canvas => buildAxisChart(canvas, 'bar'),
    radar: canvas => ({
      type: 'radar',
      data: buildPolarData(canvas),
      options: buildBaseOptions(canvas, { polar: true })
    }),
    polarArea: canvas => ({
      type: 'polarArea',
      data: buildSliceData(canvas, { alpha: 0.5 }),
      options: buildBaseOptions(canvas)
    }),
    pie: canvas => ({
      type: 'pie',
      data: buildSliceData(canvas),
      options: buildBaseOptions(canvas)
    }),
    doughnut: canvas => ({
      type: 'doughnut',
      data: buildSliceData(canvas),
      options: { ...buildBaseOptions(canvas), cutout: '60%' }
    })
  };

  getChart(id) {
    return this.charts.get(id);
  }

  destroy() {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }
}

// ---------- Builders ----------

function buildAxisChart(canvas, type, { fill = false, fillAlpha = 0 } = {}) {
  const labels = (canvas.dataset.labels || '').split(',').map(s => s.trim());
  const datasets = parseDatasets(canvas).map(ds => ({
    label: ds.label,
    data: ds.data,
    borderColor: ds.color,
    backgroundColor: fill || type === 'bar' ? hexToRgba(ds.color, fillAlpha || 0.7) : ds.color,
    fill,
    tension: type === 'line' ? 0.3 : 0,
    borderWidth: type === 'bar' ? 1 : 2
  }));

  const stacked = canvas.hasAttribute('data-stacked');
  const horizontal = canvas.hasAttribute('data-horizontal');
  const options = buildBaseOptions(canvas, { axes: true });

  if (type === 'bar') {
    if (horizontal) {
      options.indexAxis = 'y';
    }
    if (stacked) {
      options.scales = {
        ...options.scales,
        x: { ...(options.scales?.x || {}), stacked: true },
        y: { ...(options.scales?.y || {}), stacked: true }
      };
    }
  }

  return {
    type,
    data: { labels, datasets },
    options
  };
}

function buildPolarData(canvas) {
  const labels = (canvas.dataset.labels || '').split(',').map(s => s.trim());
  const datasets = parseDatasets(canvas).map(ds => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: hexToRgba(ds.color, 0.2),
    borderColor: ds.color,
    borderWidth: 2
  }));
  return { labels, datasets };
}

function buildSliceData(canvas, { alpha = 1 } = {}) {
  const labels = (canvas.dataset.labels || '').split(',').map(s => s.trim());
  // Pie/doughnut/polarArea: take only the first dataset; one slice per label.
  const [first] = parseDatasets(canvas);
  if (!first) {
    return { labels, datasets: [] };
  }
  const colorsAttr = canvas.dataset.colors || '';
  const colorNames = colorsAttr ? colorsAttr.split(',').map(s => s.trim()) : DEFAULT_COLOR_CYCLE;
  const sliceColors = first.data.map((_, i) => {
    const hex = THEME_COLORS[colorNames[i % colorNames.length]] || THEME_COLORS.primary;
    return alpha < 1 ? hexToRgba(hex, alpha) : hex;
  });
  return {
    labels,
    datasets: [
      {
        data: first.data,
        backgroundColor: sliceColors,
        borderWidth: 0
      }
    ]
  };
}

function buildBaseOptions(canvas, { axes = false, polar = false } = {}) {
  const title = canvas.dataset.title;
  const showLegend = !canvas.hasAttribute('data-no-legend');
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top'
      },
      title: {
        display: !!title,
        text: title || ''
      }
    },
    ...(axes && {
      scales: {
        y: { beginAtZero: true }
      }
    }),
    ...(polar && {
      scales: {
        r: { beginAtZero: true }
      }
    })
  };
}
