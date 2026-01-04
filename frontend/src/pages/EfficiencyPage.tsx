import { Link } from 'react-router-dom';
import { DashboardData } from '../types';
import Tooltip from '../components/Tooltip';
import './PageLayout.css';
import './OKRPage.css';

export default function EfficiencyPage({ data }: { data: DashboardData; onRefresh: () => void }) {
  const okrs = data.okrs.length > 0 ? data.okrs : [
    {
      id: 'okr-sample-1',
      title: 'Incrementar la adopción del Design System',
      description: 'Mejorar el porcentaje de componentes del DS utilizados en todos los productos',
      keyResults: [
        {
          id: 'kr-1',
          title: 'Alcanzar 80% de adopción de componentes',
          description: 'Medido por el porcentaje de componentes usados vs disponibles',
          targetValue: 80,
          currentValue: 72,
          unit: '%',
          progress: 90,
        },
        {
          id: 'kr-2',
          title: 'Reducir componentes desconectados a menos de 5',
          description: 'Componentes que han sido modificados y perdido conexión con el DS',
          targetValue: 5,
          currentValue: 4,
          unit: 'componentes',
          progress: 80,
        },
        {
          id: 'kr-3',
          title: 'Implementar DS en 15 nuevos repositorios',
          description: 'Expandir el uso del DS a más proyectos',
          targetValue: 15,
          currentValue: 12,
          unit: 'repositorios',
          progress: 80,
        },
      ],
      progress: 83.3,
      quarter: '2024-Q1',
      status: 'on-track' as const,
    },
    {
      id: 'okr-sample-2',
      title: 'Mejorar la calidad y consistencia',
      description: 'Reducir bugs de UI y mejorar la consistencia visual',
      keyResults: [
        {
          id: 'kr-4',
          title: 'Reducir bugs de UI en un 40%',
          description: 'Comparado con el trimestre anterior',
          targetValue: 40,
          currentValue: 35,
          unit: '%',
          progress: 87.5,
        },
        {
          id: 'kr-5',
          title: 'Aumentar la resolución de issues a 85%',
          description: 'Porcentaje de issues de UI resueltos',
          targetValue: 85,
          currentValue: 78,
          unit: '%',
          progress: 91.8,
        },
      ],
      progress: 89.6,
      quarter: '2024-Q1',
      status: 'on-track' as const,
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
            <Link to="/kpis" className="nav-link">🎯 KPIs</Link>
            <Link to="/okrs" className="nav-link active">✅ OKRs</Link>
            <Link to="/roi" className="nav-link">💰 ROI</Link>
          </nav>
        </div>
        <div>
          <h1>Objetivos y Resultados Clave</h1>
          <p className="page-subtitle">Objetivos estratégicos y resultados medibles</p>
        </div>
      </header>

      <main className="page-content okr-page-content">
        <div className="okr-list">
          {okrs.map((okr) => (
            <div key={okr.id} className="okr-card">
              <div className="okr-header">
                <div className="okr-header-main">
                  <h3 className="okr-objective">{okr.title}</h3>
                  <p className="okr-description">{okr.description}</p>
                  <div className="okr-progress-info">
                    <span className="okr-progress-label">Progreso general</span>
                    <span className="okr-progress-value">{okr.progress.toFixed(0)}%</span>
                  </div>
                </div>
                <button className="okr-edit-button" aria-label="Edit OKR">✏️</button>
              </div>

              <div className="okr-key-results">
                {okr.keyResults.map((kr) => (
                  <div key={kr.id} className="key-result-row">
                    <div className="key-result-header">
                      <p className="key-result-description">{kr.title}</p>
                      <div className="key-result-values">
                        <span className="key-result-current-target">
                          {kr.currentValue} / {kr.targetValue} {kr.unit}
                        </span>
                        <Tooltip content={`${kr.progress.toFixed(0)}% complete`}>
                          <span className="key-result-info">ℹ️</span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="key-result-progress-bar">
                      <div
                        className={`key-result-progress-fill ${
                          kr.progress >= 100
                            ? 'key-result-progress-complete'
                            : kr.progress >= 70
                            ? 'key-result-progress-on-track'
                            : 'key-result-progress-at-risk'
                        }`}
                        style={{ width: `${Math.min(kr.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="okr-explanation">
          <h3 className="okr-explanation-title">Acerca de los OKRs</h3>
          <p className="okr-explanation-text">
            Los OKRs definen la dirección estratégica para el sistema de diseño. A diferencia de los KPIs (que miden 
            la salud continua), los OKRs son objetivos con límite de tiempo que impulsan el sistema hacia adelante. Responden: 
            "¿Dónde queremos estar en 3 meses?"
          </p>
          <div className="okr-explanation-grid">
            <div className="okr-explanation-item">
              <div className="okr-explanation-label">Objetivos</div>
              <div className="okr-explanation-detail">Metas cualitativas que proporcionan dirección</div>
            </div>
            <div className="okr-explanation-item">
              <div className="okr-explanation-label">Resultados Clave</div>
              <div className="okr-explanation-detail">Resultados medibles que indican el éxito</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
