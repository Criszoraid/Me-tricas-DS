import { DashboardData } from '../types';
import ROICard from './ROICard';
import KPICards from './KPICards';
import OKRList from './OKRList';
import MetricsOverview from './MetricsOverview';
import './Dashboard.css';

interface DashboardProps {
  data: DashboardData;
  onRefresh: () => void;
}

export default function Dashboard({ data, onRefresh }: DashboardProps) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Métricas DS</h1>
        <p className="dashboard-subtitle">Plataforma de Análisis del Design System</p>
      </header>

      <main className="dashboard-content">
        {/* ROI Section - Siempre mostrar, incluso si es null */}
        <section className="dashboard-section">
          {data.roi ? (
            <ROICard roi={data.roi} />
          ) : (
            <div className="empty-state-card">
              <h2>Retorno de Inversión (ROI)</h2>
              <p>No hay datos de ROI disponibles. Calcula el ROI para comenzar.</p>
            </div>
          )}
        </section>

        {/* KPIs Section - Siempre mostrar */}
        <section className="dashboard-section">
          <h2 className="section-title">Indicadores Clave (KPIs)</h2>
          {data.kpis.length > 0 ? (
            <KPICards kpis={data.kpis} />
          ) : (
            <div className="empty-state-card">
              <p>No hay KPIs disponibles. Los KPIs se generan automáticamente al analizar métricas de Figma o GitHub.</p>
            </div>
          )}
        </section>

        {/* Metrics Overview - Siempre mostrar */}
        <section className="dashboard-section">
          <h2 className="section-title">Resumen de Métricas</h2>
          <MetricsOverview
            designMetrics={data.designMetrics}
            developmentMetrics={data.developmentMetrics}
            onRefresh={onRefresh}
          />
        </section>

        {/* OKRs Section - Siempre mostrar */}
        <section className="dashboard-section">
          <h2 className="section-title">Objetivos y Resultados Clave (OKRs)</h2>
          {data.okrs.length > 0 ? (
            <OKRList okrs={data.okrs} onRefresh={onRefresh} />
          ) : (
            <div className="empty-state-card">
              <p>No hay OKRs definidos. Crea tu primer OKR para comenzar a rastrear objetivos.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

