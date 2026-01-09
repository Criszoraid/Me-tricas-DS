import { Link, useParams } from 'react-router-dom';
import { DashboardData } from '../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import './PageLayout.css';
import './ComponentDetailPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface ComponentDetailPageProps {
  data: DashboardData;
}

export default function ComponentDetailPage({ data }: ComponentDetailPageProps) {
  const params = useParams();
  const componentName = params.componentName || '';

  // Datos de ejemplo para el componente (en producción, esto vendría de la API)
  // Por ahora usamos datos hardcodeados basados en el nombre del componente
  const componentData = {
    name: componentName,
    totalInstances: 1247,
    productsUsing: 23,
    detachedInstances: 3,
    detachRate: (3 / 1247 * 100).toFixed(2),
    figmaFileId: 'sample-figma-id',
    codeComponentPath: '/components/Button.tsx',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
  };

  // Top productos usando este componente (ejemplo)
  const productsUsing = [
    { name: 'Marketing Site', instances: 245, detached: 0, adoption: 100 },
    { name: 'Admin Panel', instances: 189, detached: 1, adoption: 99.5 },
    { name: 'Analytics Dashboard', instances: 156, detached: 0, adoption: 100 },
    { name: 'Customer Portal', instances: 142, detached: 1, adoption: 99.3 },
    { name: 'Mobile App', instances: 98, detached: 1, adoption: 99.0 },
  ];

  // Top desviaciones (ejemplo)
  const topDeviations = [
    { file: 'Marketing Dashboard', reason: 'Custom spacing', instances: 2 },
    { file: 'Admin Panel', reason: 'Modified colors', instances: 1 },
  ];

  // Datos para gráfico de uso por producto
  const usageByProductData = {
    labels: productsUsing.map(p => p.name),
    datasets: [{
      label: 'Instancias',
      data: productsUsing.map(p => p.instances),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }],
  };

  // Datos para donut chart (usado vs detached)
  const usageDonutData = {
    labels: ['Usado correctamente', 'Desconectado'],
    datasets: [{
      data: [
        componentData.totalInstances - componentData.detachedInstances,
        componentData.detachedInstances,
      ],
      backgroundColor: ['#059669', '#dc2626'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e9ecef',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/producto" className="back-link">← Métricas de Producto</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/producto" className="nav-link">Métricas</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
          </nav>
        </div>
        <div className="page-header-main">
          <div>
            <h1>Componente: {componentName}</h1>
            <p className="page-subtitle">Detalles de uso y adopción del componente</p>
          </div>
        </div>
      </header>

      <main className="page-content component-detail-content">
        {/* Métricas principales */}
        <div className="component-metrics-grid">
          <div className="component-metric-card">
            <div className="component-metric-label">Instancias Totales</div>
            <div className="component-metric-value">{componentData.totalInstances.toLocaleString('es-ES')}</div>
          </div>
          <div className="component-metric-card">
            <div className="component-metric-label">Productos Usando</div>
            <div className="component-metric-value">{componentData.productsUsing}</div>
          </div>
          <div className="component-metric-card">
            <div className="component-metric-label">Instancias Desconectadas</div>
            <div className="component-metric-value error">{componentData.detachedInstances}</div>
          </div>
          <div className="component-metric-card">
            <div className="component-metric-label">Tasa de Desviación</div>
            <div className="component-metric-value">{componentData.detachRate}%</div>
          </div>
        </div>

        {/* Visualización de uso */}
        <div className="component-visualization-section">
          <div className="component-chart-container">
            <h2 className="section-title">Uso por Producto</h2>
            <div className="chart-wrapper">
              <Bar data={usageByProductData} options={chartOptions} />
            </div>
          </div>
          <div className="component-chart-container">
            <h2 className="section-title">Estado de Uso</h2>
            <div className="chart-wrapper-donut">
              <Doughnut
                data={usageDonutData}
                options={{
                  cutout: '60%',
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                    tooltip: { enabled: true },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Productos usando el componente */}
        <div className="component-section">
          <h2 className="section-title">Productos Usando Este Componente</h2>
          <div className="component-table-container">
            <table className="component-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-right">Instancias</th>
                  <th className="text-right">Desconectadas</th>
                  <th className="text-right">Adopción</th>
                </tr>
              </thead>
              <tbody>
                {productsUsing.map((product, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{product.name}</td>
                    <td className="text-right font-mono">{product.instances.toLocaleString('es-ES')}</td>
                    <td className="text-right font-mono">{product.detached}</td>
                    <td className="text-right">
                      <span className={product.adoption >= 99 ? 'text-success' : 'text-warning'}>
                        {product.adoption.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top desviaciones */}
        {topDeviations.length > 0 && (
          <div className="component-section">
            <h2 className="section-title">Principales Desviaciones</h2>
            <div className="deviation-list">
              {topDeviations.map((deviation, index) => (
                <div key={index} className="deviation-item">
                  <div>
                    <div className="deviation-file">{deviation.file}</div>
                    <div className="deviation-component">{deviation.reason}</div>
                  </div>
                  <div className="deviation-instances">{deviation.instances} instancias</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links y recursos */}
        <div className="component-section">
          <h2 className="section-title">Recursos</h2>
          <div className="component-links">
            <a 
              href={`https://www.figma.com/file/${componentData.figmaFileId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="component-link"
            >
              📐 Ver en Figma
            </a>
            <a 
              href={`https://github.com/your-org/design-system/blob/main${componentData.codeComponentPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="component-link"
            >
              💻 Ver código
            </a>
            <a 
              href={`https://github.com/your-org/design-system/issues?q=is:issue+label:${componentName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="component-link"
            >
              🐛 Issues relacionados
            </a>
          </div>
          <div className="component-meta">
            <span className="component-meta-label">Última actualización:</span>
            <span className="component-meta-value">
              {componentData.lastUpdated.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="component-actions">
          <Link to="/producto" className="button-secondary">
            Volver a Métricas de Producto
          </Link>
        </div>
      </main>
    </div>
  );
}


