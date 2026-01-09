import { Link, useNavigate } from 'react-router-dom';
import { DashboardData } from '../types';
import { ArrowUp, TrendingUp, Package, Clock, AlertTriangle, Accessibility } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import { ROIIndicator } from '../components/ROIIndicator';
import { TrendChart } from '../components/TrendChart';
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import { calculateHealthScore } from '../utils/calculations/healthScore';
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
  const accessibilityIssues = latestDesign?.criticalAccessibilityIssues || 2;

  // ROI
  const roi = data.roi;
  const roiValue = roi ? roi.roi : 247;
  const roiStatus = roi ? roi.status : 'high';

  // Tiempo ahorrado mensual
  const monthlyTimeSaved = roi 
    ? Math.round((roi.benefits.developmentTimeSaved || 0) + (roi.benefits.designTimeSaved || 0))
    : 802;

  // Health Score (global)
  const latestDev = data.developmentMetrics.length > 0 ? data.developmentMetrics[data.developmentMetrics.length - 1] : null;
  const bugCount = latestDev?.uiRelatedIssues ?? 12;
  const totalComponents = latestDesign?.totalComponents ?? 150;
  const detachedComponents = latestDesign?.detachedComponents ?? 5;
  const deviationRate = totalComponents > 0 ? (detachedComponents / totalComponents) * 100 : 0;
  const governanceScore = Math.max(0, 100 - deviationRate);
  const npsDefault = 42;

  const healthInputs = {
    adoptionRate,
    bugCount,
    timeSavedHours: monthlyTimeSaved,
    nps: npsDefault,
    consistencyScore: governanceScore,
  };
  const health = calculateHealthScore(healthInputs);

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

  // Datos para Chart Cards
  // 1. Adopción DS (donut)
  const adoptionDonutData = {
    labels: ['Adoptado', 'No adoptado'],
    datasets: [{
      data: [adoptionRate, 100 - adoptionRate],
      backgroundColor: ['#3b82f6', '#e5e7eb'],
      borderWidth: 0,
    }],
  };

  // 2. Reutilización (stacked bar)
  const reuseBarData = {
    labels: [''],
    datasets: [
      {
        label: 'DS',
        data: [componentReuse],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Custom',
        data: [100 - componentReuse],
        backgroundColor: '#e5e7eb',
      },
    ],
  };

  // 3. Desviaciones (sparkline)
  const deviationsSparklineData = {
    labels: adoptionTrend.map(d => d.month),
    datasets: [{
      data: data.designMetrics.slice(-6).map(m => m.detachedComponents),
      borderColor: '#dc2626',
      backgroundColor: 'transparent',
    }],
  };

  // 4. Accesibilidad (gauge/donut)
  const accessibilityGaugeData = {
    labels: ['Accesible', 'Issues'],
    datasets: [{
      data: [accessibilityScore, 100 - accessibilityScore],
      backgroundColor: [accessibilityScore >= 90 ? '#059669' : accessibilityScore >= 70 ? '#f59e0b' : '#dc2626', '#e5e7eb'],
      borderWidth: 0,
    }],
  };

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
            <Link to="/producto" className="nav-link">Producto</Link>
            <Link to="/desarrollo" className="nav-link">Desarrollo</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
            <Link to="/data-sources" className="nav-link">Fuentes</Link>
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

      {/* Health Score Global */}
      <HealthScoreCard inputs={healthInputs} />

          {/* Visual Summary Grid - Chart Cards */}
          <div className="chart-cards-grid">
            <ChartCard
              title="Adopción DS"
              value={`${adoptionRate.toFixed(0)}%`}
              subtitle="Adopción en productos"
              chartType="donut"
              chartData={adoptionDonutData}
              icon={Package}
              navigateTo="/metrics/product/adoption"
              trend="up"
              trendValue="+6%"
              color="#3b82f6"
            />
            <ChartCard
              title="Tiempo Ahorrado"
              value={`${monthlyTimeSaved}h`}
              subtitle="Horas mensuales"
              chartType="sparkline"
              chartData={{
                labels: timeSavedTrend.map(d => d.month),
                datasets: [{
                  data: timeSavedTrend.map(d => d.design + d.dev),
                  borderColor: '#059669',
                }],
              }}
              icon={Clock}
              navigateTo="/roi"
              queryParams={{ section: 'benefits', metric: 'time-saved' }}
              trend="up"
              trendValue="+58h"
              color="#059669"
            />
            <ChartCard
              title="Accesibilidad"
              value={`${accessibilityScore.toFixed(0)}%`}
              subtitle={`${accessibilityIssues} issues críticos`}
              chartType="donut"
              chartData={accessibilityGaugeData}
              icon={Accessibility}
              navigateTo="/metrics/product/accessibility"
              trend={accessibilityIssues <= 2 ? "up" : "down"}
              trendValue={`${accessibilityIssues} issues`}
              color={accessibilityScore >= 90 ? "#059669" : "#f59e0b"}
            />
            <ChartCard
              title="Consistencia diseño-código"
              value={`${latestDesign ? Math.round(latestDesign.adoptionPercentage) : 94}%`}
              subtitle="Score de consistencia"
              chartType="sparkline"
              chartData={{
                labels: adoptionTrend.map(d => d.month),
                datasets: [{
                  data: data.designMetrics.slice(-6).map(m => m.adoptionPercentage),
                  borderColor: '#8b5cf6',
                }],
              }}
              icon={TrendingUp}
              navigateTo="/kpis"
              trend="up"
              trendValue="+2%"
              color="#8b5cf6"
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
