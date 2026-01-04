import { Objective } from '../types';
import './OKRList.css';

interface OKRListProps {
  okrs: Objective[];
  onRefresh: () => void;
}

export default function OKRList({ okrs }: OKRListProps) {
  const getStatusLabel = (status: Objective['status']) => {
    const labels = {
      'on-track': 'En curso',
      'at-risk': 'En riesgo',
      'behind': 'Retrasado',
      'complete': 'Completado',
    };
    return labels[status];
  };

  const getStatusColor = (status: Objective['status']) => {
    const colors = {
      'on-track': '#198754',
      'at-risk': '#fd7e14',
      'behind': '#dc3545',
      'complete': '#6c757d',
    };
    return colors[status];
  };

  return (
    <div className="okr-list">
      {okrs.map((objective) => (
        <div key={objective.id} className="okr-card">
          <div className="okr-header">
            <div className="okr-title-section">
              <h3 className="okr-title">{objective.title}</h3>
              <span className="okr-quarter">{objective.quarter}</span>
            </div>
            <div
              className="okr-status-badge"
              style={{ backgroundColor: getStatusColor(objective.status) }}
            >
              {getStatusLabel(objective.status)}
            </div>
          </div>

          {objective.description && (
            <p className="okr-description">{objective.description}</p>
          )}

          <div className="okr-progress">
            <div className="okr-progress-header">
              <span className="okr-progress-label">Progreso General</span>
              <span className="okr-progress-value">{objective.progress.toFixed(1)}%</span>
            </div>
            <div className="okr-progress-bar">
              <div
                className="okr-progress-fill"
                style={{
                  width: `${Math.min(100, objective.progress)}%`,
                  backgroundColor: getStatusColor(objective.status),
                }}
              />
            </div>
          </div>

          <div className="okr-key-results">
            <h4 className="okr-key-results-title">Resultados Clave</h4>
            {objective.keyResults.map((kr) => (
              <div key={kr.id} className="okr-key-result">
                <div className="okr-key-result-header">
                  <span className="okr-key-result-title">{kr.title}</span>
                  <span className="okr-key-result-progress">
                    {kr.currentValue.toLocaleString('es-ES')} / {kr.targetValue.toLocaleString('es-ES')} {kr.unit}
                  </span>
                </div>
                {kr.description && (
                  <p className="okr-key-result-description">{kr.description}</p>
                )}
                <div className="okr-key-result-progress-bar">
                  <div
                    className="okr-key-result-progress-fill"
                    style={{ width: `${Math.min(100, kr.progress)}%` }}
                  />
                </div>
                <div className="okr-key-result-percentage">
                  {kr.progress.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

