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
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import Tooltip from '../components/Tooltip';
import FileUpload from '../components/FileUpload';
import EditMetricModal from '../components/EditMetricModal';
import { api } from '../services/api';
import './PageLayout.css';
import './ProductPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

type DataSource = 'manual' | 'file';

export default function ProductPage({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const [dataSource, setDataSource] = useState<DataSource>('file');
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const latestDesign = data.designMetrics.length > 0
    ? data.designMetrics[data.designMetrics.length - 1]
    : null;

  const handleEditSave = async (formData: any) => {
    await api.addManualMetrics({
      type: 'design',
      data: formData,
    });
    onRefresh();
  };

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    setUploadError(null);
    setTimeout(() => {
      setUploadSuccess(false);
      onRefresh();
    }, 2000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
  };

  // Gráfico de adopción
  const adoptionData = {
    labels: data.designMetrics.slice(-6).map((_, index) => {
      const date = new Date(data.designMetrics[data.designMetrics.length - 6 + index]?.timestamp || Date.now());
      return date.toLocaleDateString('es-ES', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Tasa de Adopción',
        data: data.designMetrics.slice(-6).map(m => m.adoptionPercentage),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

  // Component usage data (sample)
  const componentUsage = [
    { component: 'Button', instances: 1247, products: 23, detached: 3 },
    { component: 'Input', instances: 892, products: 21, detached: 5 },
    { component: 'Card', instances: 734, products: 19, detached: 2 },
    { component: 'Modal', instances: 456, products: 18, detached: 8 },
    { component: 'Dropdown', instances: 389, products: 16, detached: 4 },
    { component: 'Tabs', instances: 234, products: 14, detached: 2 },
  ];

  // Products by adoption (sample)
  const productsByAdoption = [
    { name: 'Analytics Dashboard', adoption: 98 },
    { name: 'Marketing Site', adoption: 89 },
    { name: 'Admin Panel', adoption: 85 },
    { name: 'Customer Portal', adoption: 76 },
    { name: 'Mobile App', adoption: 62 },
    { name: 'Internal Tools', adoption: 45 },
  ];

  // Top deviations (sample)
  const topDeviations = [
    { file: 'Marketing Dashboard', component: 'Custom spacing', instances: 18 },
    { file: 'Admin Panel', component: 'Modified Button colors', instances: 12 },
    { file: 'Customer Portal', component: 'Custom Modal sizes', instances: 8 },
    { file: 'Analytics Dashboard', component: 'Non-standard icons', instances: 6 },
  ];

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/" className="back-link">← Resumen</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">📊 Dashboard</Link>
            <Link to="/producto" className="nav-link active">📦 Métricas de Producto</Link>
            <Link to="/desarrollo" className="nav-link">💻 Desarrollo</Link>
            <Link to="/kpis" className="nav-link">🎯 KPIs</Link>
            <Link to="/okrs" className="nav-link">✅ OKRs</Link>
            <Link to="/roi" className="nav-link">💰 ROI</Link>
          </nav>
        </div>
        <div className="page-header-main">
          <div>
            <h1>Métricas de Producto</h1>
            <p className="page-subtitle">Adopción y uso del sistema de diseño en Figma</p>
          </div>

          {/* Data Source Toggle */}
          <div className="data-source-toggle">
            <button
              onClick={() => setDataSource('file')}
              className={`toggle-button ${dataSource === 'file' ? 'active' : ''}`}
            >
              📄 Desde archivo
            </button>
            <button
              onClick={() => setDataSource('manual')}
              className={`toggle-button ${dataSource === 'manual' ? 'active' : ''}`}
            >
              ✏️ Entrada manual
            </button>
            {dataSource === 'file' && (
              <FileUpload type="design" onSuccess={handleUploadSuccess} onError={handleUploadError} />
            )}
          </div>
          {uploadError && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
              ✅ Archivo importado correctamente
            </div>
          )}
        </div>
      </header>

      <main className="page-content product-page-content">
        {/* Key Metrics */}
        <div className="product-metrics-grid">
          <div className="product-metric-box">
            <div className="product-metric-header">
              <span className="product-metric-label">Tasa de Adopción en Figma</span>
              <div className="product-metric-actions">
                <Tooltip content="Porcentaje de archivos de diseño que usan componentes del DS">
                  <span className="metric-info-icon">ℹ️</span>
                </Tooltip>
                <button className="metric-edit-button" onClick={() => setShowEditModal(true)}>✏️</button>
              </div>
            </div>
            <div className="product-metric-value-large">
              {latestDesign ? latestDesign.adoptionPercentage.toFixed(0) : 73}%
            </div>
            <div className="product-metric-source">Fuente: {dataSource === 'file' ? 'Figma API' : 'Manual'}</div>
          </div>

          <div className="product-metric-box">
            <div className="product-metric-header">
              <span className="product-metric-label">Instancias Desconectadas Totales</span>
              <div className="product-metric-actions">
                <Tooltip content="Componentes desconectados de la biblioteca (posibles desviaciones)">
                  <span className="metric-info-icon">ℹ️</span>
                </Tooltip>
                <button className="metric-edit-button" onClick={() => setShowEditModal(true)}>✏️</button>
              </div>
            </div>
            <div className="product-metric-value-large">
              {latestDesign ? latestDesign.detachedComponents : 24}
            </div>
            <div className="product-metric-source">Fuente: {dataSource === 'file' ? 'Figma API' : 'Manual'}</div>
          </div>

          <div className="product-metric-box">
            <div className="product-metric-header">
              <span className="product-metric-label">Puntuación de Consistencia</span>
              <div className="product-metric-actions">
                <Tooltip content="Porcentaje de diseños que siguen las guías del DS">
                  <span className="metric-info-icon">ℹ️</span>
                </Tooltip>
                <button className="metric-edit-button" onClick={() => setShowEditModal(true)}>✏️</button>
              </div>
            </div>
            <div className="product-metric-value-large">
              {latestDesign ? Math.round(latestDesign.adoptionPercentage) : 94}%
            </div>
            <div className="product-metric-source">Fuente: Manual</div>
          </div>

          <div className="product-metric-box">
            <div className="product-metric-header">
              <span className="product-metric-label">Puntuación de Accesibilidad</span>
              <div className="product-metric-actions">
                <Tooltip content="Puntuación de accesibilidad del design system (0-100). Issues críticos detectados.">
                  <span className="metric-info-icon">ℹ️</span>
                </Tooltip>
                <button className="metric-edit-button" onClick={() => setShowEditModal(true)}>✏️</button>
              </div>
            </div>
            <div className="product-metric-value-large">
              {latestDesign?.accessibilityScore ? latestDesign.accessibilityScore.toFixed(0) : 90}%
            </div>
            <div className="product-metric-source">
              Fuente: {dataSource === 'file' ? 'Figma API' : 'Manual'}
              {latestDesign?.accessibilityIssues !== undefined && (
                <span style={{ marginLeft: '0.5rem', color: latestDesign.accessibilityIssues > 3 ? '#dc2626' : '#059669' }}>
                  ({latestDesign.accessibilityIssues} issues críticos)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Adoption Trend Chart */}
        <section className="product-chart-section">
          <div className="product-chart-container">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Adopción a lo Largo del Tiempo</h3>
                <p className="chart-subtitle">Tasa de adopción mensual en todos los productos</p>
              </div>
              <Tooltip content="Calculado a partir del número de archivos que usan componentes del DS dividido por el total de archivos de diseño">
                <span className="chart-info-icon">ℹ️</span>
              </Tooltip>
            </div>
            <div className="chart-wrapper">
              <Line data={adoptionData} options={chartOptions} />
            </div>
          </div>
        </section>

        {/* Component Usage Table */}
        <section className="product-table-section">
          <div className="product-table-container">
            <div className="table-header">
              <div>
                <h3 className="table-title">Uso de Componentes</h3>
                <p className="table-subtitle">Desglose por tipo de componente</p>
              </div>
              <button className="export-button">📤 Exportar CSV</button>
            </div>
            <div className="table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Componente</th>
                    <th className="text-right">Instancias Totales</th>
                    <th className="text-right">Productos Usando</th>
                    <th className="text-right">Desconectadas</th>
                    <th className="text-right">Desviación %</th>
                  </tr>
                </thead>
                <tbody>
                  {componentUsage.map((item) => {
                    const deviationRate = ((item.detached / item.instances) * 100).toFixed(1);
                    const isLowDeviation = parseFloat(deviationRate) < 1;
                    return (
                      <tr key={item.component}>
                        <td className="font-semibold">{item.component}</td>
                        <td className="text-right font-mono">{item.instances.toLocaleString()}</td>
                        <td className="text-right font-mono">{item.products}</td>
                        <td className="text-right font-mono">{item.detached}</td>
                        <td className={`text-right font-mono font-semibold ${isLowDeviation ? 'text-success' : 'text-warning'}`}>
                          {deviationRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="product-breakdown-section">
          <div className="product-breakdown-card">
            <h3 className="breakdown-title">Productos por Adopción</h3>
            <div className="breakdown-list">
              {productsByAdoption.map((product) => (
                <div key={product.name} className="breakdown-item-row">
                  <div className="breakdown-item-header">
                    <span className="breakdown-item-name">{product.name}</span>
                    <span className="breakdown-item-value">{product.adoption}%</span>
                  </div>
                  <div className="breakdown-bar-container">
                    <div 
                      className="breakdown-bar" 
                      style={{ width: `${product.adoption}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="product-breakdown-card">
            <h3 className="breakdown-title">Principales Desviaciones</h3>
            <div className="deviation-list">
              {topDeviations.map((deviation, index) => (
                <div key={index} className="deviation-item">
                  <div>
                    <div className="deviation-file">{deviation.file}</div>
                    <div className="deviation-component">{deviation.component}</div>
                  </div>
                  <div className="deviation-instances">{deviation.instances}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {showEditModal && (
        <EditMetricModal
          metrics={latestDesign}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
