import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DashboardData } from '../types';
import Tooltip from '../components/Tooltip';
import EditKPIModal from '../components/EditKPIModal';
import FileUpload from '../components/FileUpload';
import { api } from '../services/api';
import './PageLayout.css';
import './KPIPage.css';

export default function AdoptionPage({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const [searchParams] = useSearchParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<{ id: string; name: string; description: string; current: number; target: number; trend: 'up' | 'down' | 'stable'; change: string; unit: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Leer filtros de URL para deep linking
  const metricFilter = searchParams.get('metric'); // 'consistency', etc.
  
  // Scroll automático a la sección correspondiente si viene de un ChartCard
  useEffect(() => {
    if (metricFilter) {
      setTimeout(() => {
        const element = document.getElementById(`kpi-${metricFilter}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [metricFilter]);
  
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
    ? ((latestDesign.detachedComponents / latestDesign.totalComponents) * 100)
    : 1.8;

  const kpis = [
    {
      id: 'adoption',
      name: 'Adopción del Sistema de Diseño',
      description: 'Porcentaje de productos que utilizan activamente el sistema de diseño',
      current: adoptionKPI ? Math.round(adoptionKPI.currentValue) : 73,
      target: 80,
      trend: 'up' as const,
      change: '+6%',
      unit: '%',
    },
    {
      id: 'reuse',
      name: 'Tasa de Reutilización de Componentes',
      description: 'Ratio de componentes del DS vs componentes personalizados en producción',
      current: componentReuse,
      target: 90,
      trend: 'up' as const,
      change: '+3%',
      unit: '%',
    },
    {
      id: 'time',
      name: 'Tiempo de Implementación',
      description: 'Horas promedio para construir una funcionalidad usando componentes del DS',
      current: parseFloat(timeToImplement.toFixed(1)),
      target: 2.0,
      trend: 'down' as const,
      change: '-0.2h',
      unit: 'h',
    },
    {
      id: 'consistency',
      name: 'Puntuación de Consistencia',
      description: 'Porcentaje de diseños que siguen las guías del DS',
      current: consistencyScore,
      target: 90,
      trend: 'up' as const,
      change: '+2%',
      unit: '%',
    },
    {
      id: 'satisfaction',
      name: 'Satisfacción de Desarrolladores',
      description: 'Puntuación NPS de la encuesta trimestral a desarrolladores',
      current: developerSatisfaction,
      target: 50,
      trend: 'up' as const,
      change: '+8',
      unit: 'NPS',
    },
    {
      id: 'deviation',
      name: 'Tasa de Desviación',
      description: 'Porcentaje de instancias con personalizaciones o desconexiones',
      current: parseFloat(deviationRate.toFixed(1)),
      target: 2.0,
      trend: 'stable' as const,
      change: '±0%',
      unit: '%',
    },
  ];

  const handleEditKPI = (kpi: typeof kpis[0]) => {
    const kpiData = data.kpis.find(k => {
      if (kpi.id === 'adoption') return k.calculationMethod === 'component_adoption';
      if (kpi.id === 'time') return k.calculationMethod === 'dev_efficiency';
      return false;
    });
    
    if (kpiData) {
      setSelectedKPI({
        ...kpi,
        current: kpi.current,
        target: kpi.target,
      });
      setShowEditModal(true);
    } else {
      // Crear nuevo KPI
      setSelectedKPI(kpi);
      setShowEditModal(true);
    }
  };

  const handleSaveKPI = async (kpiData: any) => {
    try {
      const kpiFromData = data.kpis.find(k => {
        if (selectedKPI?.id === 'adoption') return k.calculationMethod === 'component_adoption';
        if (selectedKPI?.id === 'time') return k.calculationMethod === 'dev_efficiency';
        return false;
      });

      if (kpiFromData) {
        await api.updateKPI(kpiFromData.id, kpiData);
      } else {
        await api.createKPI({
          ...kpiData,
          calculationMethod: 'manual',
        });
      }
      onRefresh();
      setShowEditModal(false);
      setSelectedKPI(null);
    } catch (error: any) {
      console.error('Error guardando KPI:', error);
      throw error;
    }
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

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/" className="back-link">← Resumen</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/producto" className="nav-link">Producto</Link>
            <Link to="/desarrollo" className="nav-link">Desarrollo</Link>
            <Link to="/kpis" className="nav-link active">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link">ROI</Link>
            <Link to="/data-sources" className="nav-link">Fuentes</Link>
          </nav>
        </div>
        <div className="page-header-main">
          <div>
            <h1>Indicadores Clave de Rendimiento</h1>
            <p className="page-subtitle">Métricas principales que responden: ¿Está funcionando el sistema de diseño?</p>
          </div>
          <div className="page-header-actions">
            <div className="data-source-toggle">
              <button
                onClick={() => setShowEditModal(true)}
                className="toggle-button active"
              >
                ✏️ Entrada manual
              </button>
              <FileUpload type="kpi" onSuccess={handleUploadSuccess} onError={handleUploadError} />
            </div>
          </div>
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
      </header>

      <main className="page-content kpi-page-content">
        {/* KPI Grid */}
        <div className="kpi-grid-modern">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} {...kpi} onEdit={() => handleEditKPI(kpi)} />
          ))}
        </div>

        {/* Explanation */}
        <section className="kpi-about-section-modern">
          <h3 className="about-title-modern">Acerca de los KPIs</h3>
          <p className="about-text-modern">
            Estos seis KPIs proporcionan una vista holística de la salud del sistema de diseño. Miden la adopción, 
            eficiencia, consistencia y satisfacción — los indicadores principales de si el sistema de diseño 
            está entregando valor a la organización.
          </p>
          <div className="about-categories-modern">
            <div className="about-category-item">
              <div className="about-category-title">Indicadores Principales</div>
              <div className="about-category-desc">Adopción, Tasa de Reutilización</div>
            </div>
            <div className="about-category-item">
              <div className="about-category-title">Métricas de Eficiencia</div>
              <div className="about-category-desc">Tiempo de Implementación, Tasa de Desviación</div>
            </div>
            <div className="about-category-item">
              <div className="about-category-title">Métricas de Calidad</div>
              <div className="about-category-desc">Consistencia, Satisfacción</div>
            </div>
          </div>
        </section>
      </main>

      {showEditModal && selectedKPI && (
        <EditKPIModal
          kpi={data.kpis.find(k => {
            if (selectedKPI.id === 'adoption') return k.calculationMethod === 'component_adoption';
            if (selectedKPI.id === 'time') return k.calculationMethod === 'dev_efficiency';
            return false;
          }) || null}
          onSave={handleSaveKPI}
          onClose={() => {
            setShowEditModal(false);
            setSelectedKPI(null);
          }}
        />
      )}
    </div>
  );
}

interface KPICardProps {
  id: string;
  name: string;
  description: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  unit: string;
  onEdit?: () => void;
}

function KPICard({ name, description, current, target, trend, change, unit, onEdit }: KPICardProps) {
  const progress = (current / target) * 100;
  const isOnTarget = current >= target;
  const isCloseToTarget = progress >= 90;

  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  const trendColor = 
    trend === 'up' ? 'kpi-trend-up-modern' : 
    trend === 'down' ? 'kpi-trend-down-modern' : 
    'kpi-trend-stable-modern';

  return (
    <div className="kpi-card-modern">
      {/* Header */}
      <div className="kpi-card-header-modern">
        <div className="kpi-card-header-left">
          <h3 className="kpi-card-name">{name}</h3>
          <p className="kpi-card-description-modern">{description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onEdit && (
            <button className="kpi-info-button" onClick={onEdit} aria-label="Editar" title="Editar KPI">✏️</button>
          )}
          <Tooltip content={`Objetivo: ${target}${unit}`}>
            <button className="kpi-info-button" aria-label="Info">ℹ️</button>
          </Tooltip>
        </div>
      </div>

      {/* Current Value */}
      <div className="kpi-value-container">
        <span className="kpi-value-large">
          {current}
          <span className="kpi-value-unit">{unit}</span>
        </span>
        <div className={`kpi-trend-badge ${trendColor}`}>
          <span className="kpi-trend-symbol">{trendSymbol}</span>
          <span>{change}</span>
        </div>
      </div>

      {/* Progress to Target */}
      <div className="kpi-progress-container">
        <div className="kpi-progress-header">
          <span className="kpi-progress-label">Progreso al objetivo</span>
          <span className="kpi-progress-percentage">
            {Math.min(progress, 100).toFixed(0)}%
          </span>
        </div>
        <div className="kpi-progress-bar-wrapper">
          <div 
            className={`kpi-progress-bar-fill ${
              isOnTarget ? 'kpi-progress-success' : 
              isCloseToTarget ? 'kpi-progress-warning' : 
              'kpi-progress-default'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
