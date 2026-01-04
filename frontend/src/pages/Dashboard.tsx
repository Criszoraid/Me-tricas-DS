import { Link, useNavigate } from 'react-router-dom';
import { DashboardData } from '../types';
import { ArrowUp, TrendingUp, Package, Clock, AlertTriangle, Accessibility } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ROIIndicator } from '../components/ROIIndicator';
import { TrendChart } from '../components/TrendChart';
import './Dashboard.css';

interface DashboardProps {
  data: DashboardData;
  onRefresh: () => void;
}

export default function Dashboard({ data }: DashboardProps) {
  const navigate = useNavigate();
  // Calcular métricas
  const adoptionRate = data.designMetrics.length > 0
    ? data.designMetrics[data.designMetrics.length - 1].adoptionPercentage
    : 73;

  const componentReuse = data.developmentMetrics.length > 0
    ? data.developmentMetrics[data.developmentMetrics.length - 1].reposUsingDS > 0
      ? Math.round((data.developmentMetrics[data.developmentMetrics.length - 1].reposUsingDS / 
          (data.developmentMetrics[data.developmentMetrics.length - 1].reposUsingDS + 
           data.developmentMetrics[data.developmentMetrics.length - 1].customComponentsCount)) * 100)
      : 89
    : 89;

  const deviations = data.designMetrics.length > 0
    ? data.designMetrics[data.designMetrics.length - 1].detachedComponents
    : 24;

  // Accesibilidad
  const latestDesign = data.designMetrics.length > 0
    ? data.designMetrics[data.designMetrics.length - 1]
    : null;
  const accessibilityScore = latestDesign?.accessibilityScore || 90;
  const accessibilityIssues = latestDesign?.accessibilityIssues || 2;

  // ROI
  const roi = data.roi;
  const roiValue = roi ? roi.roi : 247;
  const roiStatus = roi ? roi.status : 'high';

  // Tiempo ahorrado mensual
  const monthlyTimeSaved = roi 
    ? Math.round((roi.benefits.developmentTimeSaved || 0) + (roi.benefits.designTimeSaved || 0))
    : 802;

  // Datos para gráficos - Adoption Trend
  const adoptionTrend = data.designMetrics.slice(-6).map((metric, index) => {
    const baseValue = 45 + index * 5;
    return {
      month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][index] || `Mes ${index + 1}`,
      value: metric.adoptionPercentage || baseValue,
    };
  });

  // Datos para gráficos - Time Saved Trend
  const timeSavedTrend = data.designMetrics.slice(-6).map((_, index) => {
    const baseDesign = 120 + index * 25;
    const baseDev = 340 + index * 40;
    return {
      month: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][index] || `Mes ${index + 1}`,
      design: roi ? Math.round((roi.benefits.designTimeSaved || 0) / 6) : baseDesign,
      dev: roi ? Math.round((roi.benefits.developmentTimeSaved || 0) / 6) : baseDev,
    };
  });

  return (
    <div className="dashboard-container">
      {/* Header con navegación */}
      <header className="dashboard-header-with-nav">
        <div className="dashboard-header-content">
          <div className="dashboard-header-text">
            <h1 className="dashboard-title">Rendimiento del Design System</h1>
            <p className="dashboard-subtitle">Resumen de métricas clave y retorno de inversión</p>
          </div>
          <nav className="dashboard-top-nav">
            <Link to="/" className="nav-link active">Dashboard</Link>
            <Link to="/producto" className="nav-link">Métricas</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
          </nav>
        </div>
      </header>

      {/* Primary ROI Metric */}
      <div className="roi-primary-card">
        <div className="roi-primary-header">
          <div className="roi-primary-left">
            <div className="roi-primary-label">Retorno de Inversión</div>
            <div className="roi-primary-value-container">
              <span className="roi-primary-value">{roiValue.toFixed(0)}%</span>
              <div className="roi-change-badge">
                <ArrowUp className="roi-change-icon" />
                <span className="roi-change-text">+12% vs Q1</span>
              </div>
            </div>
          </div>
          <ROIIndicator status={roiStatus} />
        </div>
        <div className="roi-description-container">
          <p className="roi-description">
            Por cada 1€ invertido en el design system, obtenemos {(roiValue / 100 + 1).toFixed(2)}€ en valor a través del ahorro de tiempo, reducción de errores y mejora de la consistencia.
          </p>
        </div>
      </div>

          {/* KPI Summary Cards */}
          <div className="kpi-cards-grid">
            <MetricCard
              label="Tasa de Adopción"
              value={`${adoptionRate.toFixed(0)}%`}
              change="+6%"
              trend="up"
              icon={Package}
              tooltip="Porcentaje de productos que utilizan el design system"
              source="Figma"
              onClick={() => navigate('/producto')}
            />
            <MetricCard
              label="Reutilización de Componentes"
              value={`${componentReuse}%`}
              change="+3%"
              trend="up"
              icon={TrendingUp}
              tooltip="Porcentaje de UI construido con componentes DS vs personalizados"
              source="GitHub"
              onClick={() => navigate('/desarrollo')}
            />
            <MetricCard
              label="Tiempo Ahorrado (mensual)"
              value={`${monthlyTimeSaved}h`}
              change="+58h"
              trend="up"
              icon={Clock}
              tooltip="Tiempo combinado ahorrado en diseño y desarrollo"
              source="Manual"
              onClick={() => navigate('/kpis')}
            />
            <MetricCard
              label="Desviaciones"
              value={deviations.toString()}
              change="-8"
              trend="down"
              icon={AlertTriangle}
              tooltip="Instancias desconectadas y personalizaciones"
              source="Figma"
              onClick={() => navigate('/producto')}
            />
            <MetricCard
              label="Accesibilidad"
              value={`${accessibilityScore.toFixed(0)}%`}
              change={`${accessibilityIssues} issues`}
              trend={accessibilityIssues <= 2 ? "up" : "down"}
              icon={Accessibility}
              tooltip={`Puntuación de accesibilidad: ${accessibilityScore.toFixed(0)}%. ${accessibilityIssues} issues críticos detectados.`}
              source="Figma"
              onClick={() => navigate('/producto')}
            />
          </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tendencia de Adopción</h3>
            <p className="chart-subtitle">Adopción del design system a lo largo del tiempo</p>
          </div>
          <TrendChart data={adoptionTrend} dataKey="value" color="#3b82f6" height={240} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tiempo Ahorrado</h3>
            <p className="chart-subtitle">Horas ahorradas por mes (Diseño + Desarrollo)</p>
          </div>
          <TrendChart 
            data={timeSavedTrend} 
            dataKey={['design', 'dev']} 
            color={['#a78bfa', '#3b82f6']}
            height={240}
            stacked
          />
        </div>
      </div>

      {/* Key Insights */}
      <div className="insights-card">
        <h3 className="insights-title">Insights Clave</h3>
        <div className="insights-list">
          <InsightRow
            label="Componente de mayor impacto"
            value="Button"
            detail="Utilizado 1.247 veces en 23 productos"
          />
          <InsightRow
            label="Desviación más común"
            value="Espaciado personalizado"
            detail="18 instancias en Marketing Dashboard"
          />
          <InsightRow
            label="Puntuación de consistencia"
            value="94%"
            detail="Por encima del objetivo del 90%"
          />
        </div>
      </div>
    </div>
  );
}

interface InsightRowProps {
  label: string;
  value: string;
  detail: string;
}

function InsightRow({ label, value, detail }: InsightRowProps) {
  return (
    <div className="insight-row">
      <div className="insight-row-left">
        <div className="insight-label">{label}</div>
        <div className="insight-value">{value}</div>
      </div>
      <div className="insight-detail">{detail}</div>
    </div>
  );
}
