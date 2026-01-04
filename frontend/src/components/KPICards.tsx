import { KPI } from '../types';
import './KPICards.css';

interface KPICardsProps {
  kpis: KPI[];
}

export default function KPICards({ kpis }: KPICardsProps) {
  const getStatusLabel = (status: KPI['status']) => {
    const labels = {
      critical: 'Crítico',
      warning: 'Advertencia',
      good: 'Bueno',
      excellent: 'Excelente',
    };
    return labels[status];
  };

  const getStatusColor = (status: KPI['status']) => {
    const colors = {
      critical: '#dc3545',
      warning: '#fd7e14',
      good: '#0d6efd',
      excellent: '#198754',
    };
    return colors[status];
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const formatValue = (value: number, method: string) => {
    if (method.includes('percentage') || method.includes('adoption') || method.includes('efficiency') || method.includes('resolution')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('es-ES', { maximumFractionDigits: 1 });
  };

  return (
    <div className="kpi-cards">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="kpi-card">
          <div className="kpi-header">
            <h3 className="kpi-name">{kpi.name}</h3>
            <div
              className="kpi-status-badge"
              style={{ backgroundColor: getStatusColor(kpi.status) }}
            >
              {getStatusLabel(kpi.status)}
            </div>
          </div>

          <div className="kpi-value-section">
            <div className="kpi-value">
              {formatValue(kpi.currentValue, kpi.calculationMethod)}
            </div>
            {kpi.previousValue !== undefined && (
              <div className="kpi-trend" style={{ color: getStatusColor(kpi.status) }}>
                <span className="kpi-trend-icon">{getTrendIcon(kpi.trend)}</span>
                <span className="kpi-trend-text">
                  {kpi.trend === 'up' ? 'Aumento' : kpi.trend === 'down' ? 'Disminución' : 'Estable'}
                </span>
              </div>
            )}
          </div>

          <p className="kpi-description">{kpi.description}</p>

          {kpi.previousValue !== undefined && (
            <div className="kpi-comparison">
              <span className="kpi-comparison-label">Valor anterior:</span>
              <span className="kpi-comparison-value">
                {formatValue(kpi.previousValue, kpi.calculationMethod)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

