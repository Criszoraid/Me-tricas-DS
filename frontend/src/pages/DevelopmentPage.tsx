import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardData } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import Tooltip from '../components/Tooltip';
// import FileUpload from '../components/FileUpload'; // No usado actualmente
import EditMetricModal from '../components/EditMetricModal';
import NpmStatsCard from '../components/development/NpmStatsCard';
import { api } from '../services/api';
import './PageLayout.css';
import './DevelopmentPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

type DataSource = 'manual' | 'file';

export default function DevelopmentPage({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const [dataSource, setDataSource] = useState<DataSource>('file');
  const [showEditModal, setShowEditModal] = useState(false);
  // const [editField, setEditField] = useState<string | null>(null); // No usado actualmente
  // const [uploadError, setUploadError] = useState<string | null>(null); // No usado actualmente
  // const [uploadSuccess, setUploadSuccess] = useState(false); // No usado actualmente
  const latestDev = data.developmentMetrics.length > 0
    ? data.developmentMetrics[data.developmentMetrics.length - 1]
    : null;

  const handleEditSave = async (formData: any) => {
    await api.addManualMetrics({
      type: 'development',
      data: formData,
    });
    onRefresh();
  };

  // const handleUploadSuccess = () => {
  //   setUploadSuccess(true);
  //   setUploadError(null);
  //   setTimeout(() => {
  //     setUploadSuccess(false);
  //     onRefresh();
  //   }, 2000);
  // };

  // const handleUploadError = (error: string) => {
  //   setUploadError(error);
  //   setUploadSuccess(false);
  // };


  // Calcular métricas principales
  const dsComponentUsage = latestDev && (latestDev.reposUsingDS + latestDev.customComponentsCount) > 0
    ? Math.round((latestDev.reposUsingDS / (latestDev.reposUsingDS + latestDev.customComponentsCount)) * 100)
    : 89;

  const uiBugs = latestDev ? latestDev.uiRelatedIssues : 12;
  const avgImplementationTime = 2.3; // Estimado
  const bundleSizeImpact = -14; // Estimado

  // npm Stats (estimación a partir de installs)
  const prevDev = data.developmentMetrics.length > 1
    ? data.developmentMetrics[data.developmentMetrics.length - 2]
    : null;
  const installs = latestDev?.dsPackageInstalls ?? 11200;
  const prevInstalls = prevDev?.dsPackageInstalls ?? installs;
  const downloadsMonthly = installs;
  const downloadsWeekly = Math.round(downloadsMonthly / 4);
  const downloadsTrend = prevInstalls > 0 ? Math.round(((downloadsMonthly - prevInstalls) / prevInstalls) * 100) : 0;

  // Gráfico de uso de componentes
  const componentUsageData = {
    labels: data.developmentMetrics.slice(-6).map((_, index) => {
      const date = new Date(data.developmentMetrics[data.developmentMetrics.length - 6 + index]?.timestamp || Date.now());
      return date.toLocaleDateString('es-ES', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Componentes del DS',
        data: data.developmentMetrics.slice(-6).map(m => 
          (m.reposUsingDS + m.customComponentsCount) > 0
            ? Math.round((m.reposUsingDS / (m.reposUsingDS + m.customComponentsCount)) * 100)
            : 78 + Math.random() * 10
        ),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Componentes personalizados',
        data: data.developmentMetrics.slice(-6).map(m => 
          (m.reposUsingDS + m.customComponentsCount) > 0
            ? Math.round((m.customComponentsCount / (m.reposUsingDS + m.customComponentsCount)) * 100)
            : 22 - Math.random() * 10
        ),
        borderColor: '#6c757d',
        backgroundColor: 'rgba(108, 117, 125, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Repository breakdown
  const repositories = [
    { name: 'web-app', usage: 94, commits: 245 },
    { name: 'marketing-site', usage: 88, commits: 156 },
    { name: 'admin-dashboard', usage: 91, commits: 189 },
    { name: 'mobile-app', usage: 76, commits: 98 },
    { name: 'internal-tools', usage: 82, commits: 67 },
  ];

  // Recent activity
  const recentActivity = [
    { action: 'Added Button component', repo: 'web-app', time: '2 hours ago' },
    { action: 'Updated Input styles', repo: 'marketing-site', time: '5 hours ago' },
    { action: 'Fixed Modal accessibility', repo: 'admin-dashboard', time: '1 day ago' },
    { action: 'Migrated to new Card API', repo: 'web-app', time: '2 days ago' },
  ];


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
          <Link to="/" className="back-link">← Resumen</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/producto" className="nav-link">Producto</Link>
            <Link to="/desarrollo" className="nav-link active">Desarrollo</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
            <Link to="/data-sources" className="nav-link">Fuentes</Link>
          </nav>
        </div>
        <div className="page-header-main">
          <div>
            <h1>Métricas de Desarrollo</h1>
            <p className="page-subtitle">Uso del sistema de diseño en código de producción</p>
          </div>

          {/* Data Source Toggle */}
          <div className="data-source-toggle">
            <button
              onClick={() => setDataSource('file')}
              className={`toggle-button ${dataSource === 'file' ? 'active' : ''}`}
            >
              📄 GitHub
            </button>
            <button
              onClick={() => setDataSource('manual')}
              className={`toggle-button ${dataSource === 'manual' ? 'active' : ''}`}
            >
              ✏️ Entrada manual
            </button>
          </div>
        </div>
      </header>

      <main className="page-content dev-page-content">
        {/* Key Metrics Cards */}
        <section className="dev-metrics-cards">
          <div className="dev-metric-card">
            <div className="dev-metric-header">
              <h3 className="dev-metric-title">
                Uso de Componentes del DS
                <Tooltip content="Porcentaje de componentes UI del sistema de diseño vs componentes personalizados">
                  <button className="info-button-small" aria-label="Info">ℹ️</button>
                </Tooltip>
              </h3>
            </div>
            <div className="dev-metric-value">{dsComponentUsage}%</div>
            <div className="dev-metric-source">Fuente: {dataSource === 'file' ? 'GitHub' : 'Manual'}</div>
          </div>

          <div className="dev-metric-card">
            <div className="dev-metric-header">
              <h3 className="dev-metric-title">
                Bugs Relacionados con UI
                <Tooltip content="Bugs abiertos relacionados con implementación inconsistente de UI">
                  <button className="info-button-small" aria-label="Info">ℹ️</button>
                </Tooltip>
              </h3>
            </div>
            <div className="dev-metric-value">{uiBugs}</div>
            <div className="dev-metric-source">Fuente: Jira</div>
          </div>

          <div className="dev-metric-card">
            <div className="dev-metric-header">
              <h3 className="dev-metric-title">
                Tiempo Promedio de Implementación
                <Tooltip content="Tiempo promedio para implementar una funcionalidad usando componentes del DS">
                  <button className="info-button-small" aria-label="Info">ℹ️</button>
                </Tooltip>
              </h3>
            </div>
            <div className="dev-metric-value">{avgImplementationTime}h</div>
            <div className="dev-metric-source">Fuente: Manual</div>
          </div>

          <div className="dev-metric-card">
            <div className="dev-metric-header">
              <h3 className="dev-metric-title">
                Impacto en Tamaño del Bundle
                <Tooltip content="Reducción en el tamaño del bundle al usar componentes compartidos del DS">
                  <button className="info-button-small" aria-label="Info">ℹ️</button>
                </Tooltip>
              </h3>
            </div>
            <div className="dev-metric-value">{bundleSizeImpact}%</div>
            <div className="dev-metric-source">Fuente: {dataSource === 'file' ? 'GitHub' : 'Manual'}</div>
          </div>
        </section>

        {/* Component Usage Chart */}
        <section className="dev-chart-section">
          <div className="dev-chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Uso de Componentes a lo Largo del Tiempo</h3>
                <p className="chart-subtitle">Componentes del DS vs componentes personalizados</p>
              </div>
              <Tooltip content="Rastreado mediante análisis de imports en el código">
                <span className="chart-info-icon">ℹ️</span>
              </Tooltip>
            </div>
            <div className="chart-wrapper">
              <Line data={componentUsageData} options={chartOptions} />
            </div>
          </div>
        </section>

        {/* npm Stats */}
        <section className="dev-chart-section">
          <NpmStatsCard
            inferred={{
              packageName: '@acme/design-system',
              downloadsWeekly,
              downloadsMonthly,
              downloadsTrend,
              dependentRepos: latestDev?.reposUsingDS ?? 19,
            }}
          />
        </section>

        {/* Repository Breakdown and Recent Activity */}
        <section className="dev-details-section">
          <div className="dev-repository-section">
            <h3 className="dev-section-title">Desglose por Repositorio</h3>
            <div className="repository-list">
              {repositories.map((repo) => (
                <div key={repo.name} className="repository-item">
                  <div className="repository-header">
                    <span className="repository-name">{repo.name}</span>
                    <span className="repository-usage">{repo.usage}%</span>
                  </div>
                  <div className="repository-bar-container">
                    <div 
                      className="repository-bar" 
                      style={{ width: `${repo.usage}%` }}
                    ></div>
                  </div>
                  <div className="repository-commits">{repo.commits} commits</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dev-activity-section">
            <h3 className="dev-section-title">Actividad Reciente</h3>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-meta">
                    <span className="activity-repo">{activity.repo}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {showEditModal && (
        <EditMetricModal
          metrics={latestDev}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
