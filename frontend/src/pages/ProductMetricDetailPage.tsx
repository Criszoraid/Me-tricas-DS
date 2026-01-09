import { Link, useParams, useSearchParams } from 'react-router-dom';
import { DashboardData } from '../types';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import Tooltip from '../components/Tooltip';
import './PageLayout.css';
import './ProductMetricDetailPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface ProductMetricDetailPageProps {
  data: DashboardData;
}

export default function ProductMetricDetailPage({ data }: ProductMetricDetailPageProps) {
  const params = useParams();
  
  // Determinar el tipo de métrica desde la URL
  const metricType = (params.metricType || 'adoption') as 'adoption' | 'accessibility' | 'consistency' | 'detachments';
  
  const latestDesign = data.designMetrics.length > 0
    ? data.designMetrics[data.designMetrics.length - 1]
    : null;

  // Títulos y datos según el tipo de métrica
  const metricConfig = {
    adoption: {
      title: 'Adopción del Design System',
      subtitle: 'Porcentaje de productos y archivos que utilizan componentes del DS',
      value: latestDesign ? latestDesign.adoptionPercentage.toFixed(1) : '0',
      unit: '%',
      color: '#3b82f6',
    },
    accessibility: {
      title: 'Accesibilidad',
      subtitle: 'Puntuación de accesibilidad y issues críticos detectados',
      value: latestDesign?.accessibilityScore ? latestDesign.accessibilityScore.toFixed(0) : '0',
      unit: '%',
      color: latestDesign?.accessibilityScore && latestDesign.accessibilityScore >= 90 ? '#059669' : '#f59e0b',
      issues: latestDesign?.criticalAccessibilityIssues || 0,
    },
    consistency: {
      title: 'Consistencia Diseño-Código',
      subtitle: 'Grado de alineación entre diseño y implementación',
      value: latestDesign ? latestDesign.adoptionPercentage.toFixed(0) : '0',
      unit: '%',
      color: '#8b5cf6',
    },
    detachments: {
      title: 'Desviaciones y Detachments',
      subtitle: 'Componentes desconectados de la biblioteca del DS',
      value: latestDesign ? latestDesign.detachedComponents.toString() : '0',
      unit: '',
      color: '#dc2626',
    },
  };

  const config = metricConfig[metricType];

  // Datos para el gráfico de tendencia
  const trendData = {
    labels: data.designMetrics.slice(-6).map((_, index) => {
      const date = new Date(data.designMetrics[data.designMetrics.length - 6 + index]?.timestamp || Date.now());
      return date.toLocaleDateString('es-ES', { month: 'short' });
    }),
    datasets: [
      {
        label: config.title,
        data: data.designMetrics.slice(-6).map(m => {
          switch (metricType) {
            case 'adoption':
              return m.adoptionPercentage;
            case 'accessibility':
              return m.accessibilityScore || 0;
            case 'consistency':
              return m.adoptionPercentage; // Aproximación
            case 'detachments':
              return m.detachedComponents;
            default:
              return 0;
          }
        }),
        borderColor: config.color,
        backgroundColor: `${config.color}20`,
        fill: true,
        tension: 0.4,
      },
    ],
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
        max: metricType === 'adoption' || metricType === 'accessibility' || metricType === 'consistency' ? 100 : undefined,
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

  // Datos para donut chart (solo para adoption y accessibility)
  const donutData = metricType === 'adoption' || metricType === 'accessibility' ? {
    labels: ['Usado', 'No usado'],
    datasets: [{
      data: metricType === 'adoption' 
        ? [
            latestDesign ? latestDesign.usedComponents : 0,
            latestDesign ? (latestDesign.totalComponents - latestDesign.usedComponents) : 0,
          ]
        : [
            latestDesign?.accessibilityScore || 0,
            100 - (latestDesign?.accessibilityScore || 0),
          ],
      backgroundColor: [config.color, '#e5e7eb'],
      borderWidth: 0,
    }],
  } : null;

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
            <h1>{config.title}</h1>
            <p className="page-subtitle">{config.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="page-content product-page-content">
        {/* Valor principal */}
        <div className="metric-detail-hero">
          <div className="metric-detail-value-container">
            <div className="metric-detail-value">
              {config.value}
              {config.unit && <span className="metric-detail-unit">{config.unit}</span>}
            </div>
            {metricType === 'accessibility' && config.issues !== undefined && (
              <div className="metric-detail-issues">
                {config.issues} {config.issues === 1 ? 'issue crítico' : 'issues críticos'}
              </div>
            )}
          </div>
          {donutData && (
            <div className="metric-detail-chart-mini">
              <Doughnut
                data={donutData}
                options={{
                  cutout: '70%',
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Gráfico de tendencia */}
        <div className="metric-detail-section">
          <h2 className="section-title">Evolución en el tiempo</h2>
          <div className="metric-detail-chart-container">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>

        {/* Información adicional */}
        <div className="metric-detail-section">
          <h2 className="section-title">Información detallada</h2>
          <div className="metric-detail-info-grid">
            {metricType === 'adoption' && latestDesign && (
              <>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Componentes Totales</div>
                  <div className="metric-detail-info-value">{latestDesign.totalComponents}</div>
                </div>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Componentes Usados</div>
                  <div className="metric-detail-info-value">{latestDesign.usedComponents}</div>
                </div>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Tasa de Adopción</div>
                  <div className="metric-detail-info-value">{latestDesign.adoptionPercentage.toFixed(1)}%</div>
                </div>
              </>
            )}
            {metricType === 'accessibility' && latestDesign && (
              <>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Puntuación de Accesibilidad</div>
                  <div className="metric-detail-info-value">
                    {latestDesign.accessibilityScore?.toFixed(0) || 'N/A'}%
                  </div>
                </div>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Issues Críticos</div>
                  <div className="metric-detail-info-value">
                    {latestDesign.criticalAccessibilityIssues || 0}
                  </div>
                </div>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Estado</div>
                  <div className="metric-detail-info-value">
                    {latestDesign.accessibilityScore && latestDesign.accessibilityScore >= 90 
                      ? '✅ Excelente' 
                      : latestDesign.accessibilityScore && latestDesign.accessibilityScore >= 70
                      ? '⚠️ Mejorable'
                      : '❌ Necesita atención'}
                  </div>
                </div>
              </>
            )}
            {metricType === 'detachments' && latestDesign && (
              <>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Total Detachments</div>
                  <div className="metric-detail-info-value">{latestDesign.detachedComponents}</div>
                </div>
                <div className="metric-detail-info-card">
                  <div className="metric-detail-info-label">Tasa de Desviación</div>
                  <div className="metric-detail-info-value">
                    {latestDesign.totalComponents > 0
                      ? ((latestDesign.detachedComponents / latestDesign.totalComponents) * 100).toFixed(1)
                      : '0'}%
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="metric-detail-actions">
          <Link to="/producto" className="button-secondary">
            Volver a Métricas de Producto
          </Link>
        </div>
      </main>
    </div>
  );
}

