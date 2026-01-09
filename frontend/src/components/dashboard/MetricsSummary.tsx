import { DesignMetrics, DevelopmentMetrics } from '../../types';
import { useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './MetricsSummary.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricsSummaryProps {
  designMetrics: DesignMetrics[];
  developmentMetrics: DevelopmentMetrics[];
}

export default function MetricsSummary({ designMetrics, developmentMetrics }: MetricsSummaryProps) {
  const latestDesign = designMetrics.length > 0 
    ? designMetrics[designMetrics.length - 1]
    : null;
  
  const latestDev = developmentMetrics.length > 0
    ? developmentMetrics[developmentMetrics.length - 1]
    : null;

  // Gráfico de evolución de adopción
  const adoptionChartData = useMemo(() => {
    if (designMetrics.length === 0) return null;

    const sorted = [...designMetrics].sort((a, b) => a.timestamp - b.timestamp);
    const labels = sorted.map((_, index) => {
      const date = new Date(sorted[index].timestamp);
      return date.toLocaleDateString('es-ES', { month: 'short' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Adopción (%)',
          data: sorted.map(d => d.adoptionPercentage),
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [designMetrics]);

  // Gráfico de donut: Componentes usados vs no usados
  const componentsDonutData = useMemo(() => {
    if (!latestDesign) return null;

    const used = latestDesign.usedComponents;
    const unused = latestDesign.totalComponents - used;

    return {
      labels: ['Usados', 'No usados'],
      datasets: [
        {
          data: [used, unused],
          backgroundColor: ['#198754', '#e9ecef'],
          borderWidth: 0,
        },
      ],
    };
  }, [latestDesign]);

  // Gráfico de repos usando DS
  const reposChartData = useMemo(() => {
    if (developmentMetrics.length === 0) return null;

    const sorted = [...developmentMetrics].sort((a, b) => a.timestamp - b.timestamp);
    const labels = sorted.map((_, index) => {
      const date = new Date(sorted[index].timestamp);
      return date.toLocaleDateString('es-ES', { month: 'short' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Repos usando DS',
          data: sorted.map(d => d.reposUsingDS),
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [developmentMetrics]);

  return (
    <div className="metrics-summary">
      <div className="metrics-summary-grid">
        {/* Métricas de Diseño */}
        <div className="metric-card-large">
          <h3 className="metric-card-title">📦 Diseño (Figma)</h3>
          {latestDesign ? (
            <>
              <div className="metric-stats-row">
                <div className="metric-stat-item">
                  <span className="metric-stat-label">Adopción</span>
                  <span className="metric-stat-value-large">{latestDesign.adoptionPercentage.toFixed(1)}%</span>
                </div>
                <div className="metric-stat-item">
                  <span className="metric-stat-label">Componentes</span>
                  <span className="metric-stat-value-large">{latestDesign.usedComponents}/{latestDesign.totalComponents}</span>
                </div>
              </div>
              {adoptionChartData && (
                <div className="metric-chart-container">
                  <Line
                    data={adoptionChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true },
                      },
                      scales: {
                        x: { display: true, grid: { display: false } },
                        y: { display: true, beginAtZero: true, max: 100 },
                      },
                    }}
                  />
                </div>
              )}
              {componentsDonutData && (
                <div className="metric-donut-container">
                  <Doughnut
                    data={componentsDonutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                        tooltip: { enabled: true },
                      },
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="metric-empty">No hay datos disponibles</div>
          )}
        </div>

        {/* Métricas de Desarrollo */}
        <div className="metric-card-large">
          <h3 className="metric-card-title">🧑‍💻 Desarrollo (GitHub)</h3>
          {latestDev ? (
            <>
              <div className="metric-stats-row">
                <div className="metric-stat-item">
                  <span className="metric-stat-label">Repos usando DS</span>
                  <span className="metric-stat-value-large">{latestDev.reposUsingDS}</span>
                </div>
                <div className="metric-stat-item">
                  <span className="metric-stat-label">Issues UI</span>
                  <span className="metric-stat-value-large">{latestDev.uiRelatedIssues}</span>
                </div>
              </div>
              {reposChartData && (
                <div className="metric-chart-container">
                  <Line
                    data={reposChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true },
                      },
                      scales: {
                        x: { display: true, grid: { display: false } },
                        y: { display: true, beginAtZero: true },
                      },
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="metric-empty">No hay datos disponibles</div>
          )}
        </div>
      </div>
    </div>
  );
}


