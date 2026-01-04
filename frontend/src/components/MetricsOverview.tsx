import { DesignMetrics, DevelopmentMetrics } from '../types';
import MetricsChart from './MetricsChart';
import './MetricsOverview.css';

interface MetricsOverviewProps {
  designMetrics: DesignMetrics[];
  developmentMetrics: DevelopmentMetrics[];
  onRefresh: () => void;
}

export default function MetricsOverview({
  designMetrics,
  developmentMetrics,
}: MetricsOverviewProps) {
  const latestDesign = designMetrics.length > 0 
    ? designMetrics[designMetrics.length - 1]
    : null;
  
  const latestDevelopment = developmentMetrics.length > 0
    ? developmentMetrics[developmentMetrics.length - 1]
    : null;

  return (
    <div className="metrics-overview">
      <div className="metrics-grid">
        {/* Design Metrics - Siempre mostrar */}
        <div className="metrics-section">
          <h3>Métricas de Diseño (Figma)</h3>
          {latestDesign ? (
            <>
              <div className="metrics-stats">
                <div className="metric-stat">
                  <span className="metric-stat-label">Componentes Totales</span>
                  <span className="metric-stat-value">{latestDesign.totalComponents}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Componentes Usados</span>
                  <span className="metric-stat-value">{latestDesign.usedComponents}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Adopción</span>
                  <span className="metric-stat-value">{latestDesign.adoptionPercentage.toFixed(1)}%</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Componentes Desconectados</span>
                  <span className="metric-stat-value">{latestDesign.detachedComponents}</span>
                </div>
              </div>
              {designMetrics.length > 1 && (
                <MetricsChart
                  data={designMetrics}
                  type="design"
                  title="Evolución de Métricas de Diseño"
                />
              )}
            </>
          ) : (
            <div className="metrics-stats">
              <div className="metric-stat">
                <span className="metric-stat-label">Componentes Totales</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Componentes Usados</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Adopción</span>
                <span className="metric-stat-value">0%</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Componentes Desconectados</span>
                <span className="metric-stat-value">0</span>
              </div>
            </div>
          )}
        </div>

        {/* Development Metrics - Siempre mostrar */}
        <div className="metrics-section">
          <h3>Métricas de Desarrollo (GitHub)</h3>
          {latestDevelopment ? (
            <>
              <div className="metrics-stats">
                <div className="metric-stat">
                  <span className="metric-stat-label">Repositorios usando DS</span>
                  <span className="metric-stat-value">{latestDevelopment.reposUsingDS}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Instalaciones del Paquete</span>
                  <span className="metric-stat-value">{latestDevelopment.dsPackageInstalls}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Componentes Personalizados</span>
                  <span className="metric-stat-value">{latestDevelopment.customComponentsCount}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Issues UI</span>
                  <span className="metric-stat-value">{latestDevelopment.uiRelatedIssues}</span>
                </div>
                <div className="metric-stat">
                  <span className="metric-stat-label">Issues Resueltos</span>
                  <span className="metric-stat-value">{latestDevelopment.resolvedIssues}</span>
                </div>
              </div>
              {developmentMetrics.length > 1 && (
                <MetricsChart
                  data={developmentMetrics}
                  type="development"
                  title="Evolución de Métricas de Desarrollo"
                />
              )}
            </>
          ) : (
            <div className="metrics-stats">
              <div className="metric-stat">
                <span className="metric-stat-label">Repositorios usando DS</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Instalaciones del Paquete</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Componentes Personalizados</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Issues UI</span>
                <span className="metric-stat-value">0</span>
              </div>
              <div className="metric-stat">
                <span className="metric-stat-label">Issues Resueltos</span>
                <span className="metric-stat-value">0</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

