import { Link } from 'react-router-dom';
import { DashboardData } from '../types';
import './PageLayout.css';
import './KPIPage.css';

export default function AdoptionPage({ data }: { data: DashboardData; onRefresh: () => void }) {
  // Obtener KPIs principales
  const adoptionKPI = data.kpis.find(k => k.calculationMethod === 'component_adoption');
  const efficiencyKPI = data.kpis.find(k => k.calculationMethod === 'dev_efficiency');

  // Calcular KPIs adicionales basados en métricas
  const latestDesign = data.designMetrics.length > 0 ? data.designMetrics[data.designMetrics.length - 1] : null;
  const latestDev = data.developmentMetrics.length > 0 ? data.developmentMetrics[data.developmentMetrics.length - 1] : null;

  // Time to Implement (estimado basado en eficiencia)
  const timeToImplement = efficiencyKPI ? (5 - (efficiencyKPI.currentValue / 20)) : 2.3;
  
  // Developer Satisfaction (simulado)
  const developerSatisfaction = 42;

  // Component Reuse Rate
  const componentReuse = latestDev && latestDev.reposUsingDS > 0
    ? Math.round((latestDev.reposUsingDS / (latestDev.reposUsingDS + latestDev.customComponentsCount)) * 100)
    : 89;

  // Consistency Score
  const consistencyScore = latestDesign ? Math.round(latestDesign.adoptionPercentage) : 94;

  // Deviation Rate
  const deviationRate = latestDesign && latestDesign.totalComponents > 0
    ? ((latestDesign.detachedComponents / latestDesign.totalComponents) * 100).toFixed(1)
    : '1.8';

  const kpis = [
    {
      id: 'adoption',
      title: 'Adopción del Sistema de Diseño',
      description: 'Porcentaje de productos que utilizan activamente el sistema de diseño',
      value: adoptionKPI ? Math.round(adoptionKPI.currentValue) : 73,
      trend: '+6%',
      trendDirection: 'up' as const,
      progress: adoptionKPI ? Math.min(100, (adoptionKPI.currentValue / 80) * 100) : 91,
      progressColor: '#fd7e14',
    },
    {
      id: 'time',
      title: 'Tiempo de Implementación',
      description: 'Horas promedio para construir una funcionalidad usando componentes del DS',
      value: timeToImplement.toFixed(1),
      trend: '-0.2h',
      trendDirection: 'down' as const,
      progress: 100,
      progressColor: '#198754',
    },
    {
      id: 'satisfaction',
      title: 'Satisfacción de Desarrolladores',
      description: 'Puntuación NPS de la encuesta trimestral a desarrolladores',
      value: developerSatisfaction,
      trend: '+8',
      trendDirection: 'up' as const,
      progress: 84,
      progressColor: '#6c757d',
    },
    {
      id: 'reuse',
      title: 'Tasa de Reutilización de Componentes',
      description: 'Ratio de componentes del DS vs componentes personalizados en producción',
      value: componentReuse,
      trend: '+3%',
      trendDirection: 'up' as const,
      progress: 99,
      progressColor: '#fd7e14',
    },
    {
      id: 'consistency',
      title: 'Puntuación de Consistencia',
      description: 'Porcentaje de diseños que siguen las guías del DS',
      value: consistencyScore,
      trend: '+2%',
      trendDirection: 'up' as const,
      progress: 100,
      progressColor: '#198754',
    },
    {
      id: 'deviation',
      title: 'Tasa de Desviación',
      description: 'Porcentaje de instancias con personalizaciones o desconexiones',
      value: parseFloat(deviationRate),
      trend: '±0%',
      trendDirection: 'stable' as const,
      progress: 90,
      progressColor: '#fd7e14',
    },
  ];

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/" className="back-link">← Resumen</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">📊 Dashboard</Link>
            <Link to="/producto" className="nav-link">📦 Métricas de Producto</Link>
            <Link to="/desarrollo" className="nav-link">💻 Desarrollo</Link>
            <Link to="/kpis" className="nav-link active">🎯 KPIs</Link>
            <Link to="/okrs" className="nav-link">✅ OKRs</Link>
            <Link to="/roi" className="nav-link">💰 ROI</Link>
          </nav>
        </div>
        <h1>Indicadores Clave de Rendimiento</h1>
        <p className="page-subtitle">Métricas principales que responden: ¿Está funcionando el sistema de diseño?</p>
      </header>

      <main className="page-content kpi-page-content">
        <div className="kpi-grid">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="kpi-card-detailed">
              <div className="kpi-card-header">
                <h3 className="kpi-card-title">
                  {kpi.title}
                  <button className="info-button-small" aria-label="Info">ℹ️</button>
                </h3>
              </div>
              <p className="kpi-card-description">{kpi.description}</p>
              <div className="kpi-card-value-large">
                {typeof kpi.value === 'number' && kpi.value < 10 
                  ? kpi.value.toFixed(1) 
                  : kpi.value}
                {kpi.id === 'time' && 'h'}
                {kpi.id === 'satisfaction' && ' NPS'}
                {(kpi.id === 'adoption' || kpi.id === 'reuse' || kpi.id === 'consistency' || kpi.id === 'deviation') && '%'}
              </div>
              <div className={`kpi-card-trend kpi-trend-${kpi.trendDirection}`}>
                {kpi.trendDirection === 'up' && '↑ '}
                {kpi.trendDirection === 'down' && '↓ '}
                {kpi.trend}
              </div>
              <div className="kpi-progress-section">
                <div className="kpi-progress-label">PROGRESO AL OBJETIVO</div>
                <div className="kpi-progress-bar-container">
                  <div 
                    className="kpi-progress-bar" 
                    style={{ 
                      width: `${kpi.progress}%`,
                      backgroundColor: kpi.progressColor 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="kpi-about-section">
          <h3 className="about-title">Acerca de los KPIs</h3>
          <p className="about-text">
            Estos seis KPIs proporcionan una vista holística de la salud del sistema de diseño. Miden la adopción, 
            eficiencia, consistencia y satisfacción — los indicadores principales de si el sistema de diseño 
            está entregando valor a la organización.
          </p>
          <div className="about-categories">
            <div className="about-category">
              <strong>Indicadores Principales:</strong> Adopción, Tasa de Reutilización
            </div>
            <div className="about-category">
              <strong>Métricas de Eficiencia:</strong> Tiempo de Implementación, Tasa de Desviación
            </div>
            <div className="about-category">
              <strong>Métricas de Calidad:</strong> Consistencia, Satisfacción
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
