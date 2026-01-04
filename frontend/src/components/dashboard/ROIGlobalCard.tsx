import { ROI } from '../../types';
import './ROIGlobalCard.css';

interface ROIGlobalCardProps {
  roi: ROI;
}

export default function ROIGlobalCard({ roi }: ROIGlobalCardProps) {
  const getROIStatus = (roiValue: number): 'exploracion' | 'estabilizacion' | 'escala' => {
    if (roiValue < 0) return 'exploracion';
    if (roiValue < 100) return 'estabilizacion';
    return 'escala';
  };

  const getStatusLabel = (status: 'exploracion' | 'estabilizacion' | 'escala') => {
    const labels = {
      exploracion: 'Exploración',
      estabilizacion: 'Estabilización',
      escala: 'Escala',
    };
    return labels[status];
  };

  const getStatusColor = (status: 'exploracion' | 'estabilizacion' | 'escala') => {
    const colors = {
      exploracion: '#dc3545',
      estabilizacion: '#fd7e14',
      escala: '#198754',
    };
    return colors[status];
  };

  const getStatusEmoji = (status: 'exploracion' | 'estabilizacion' | 'escala') => {
    const emojis = {
      exploracion: '🔴',
      estabilizacion: '🟡',
      escala: '🟢',
    };
    return emojis[status];
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const status = getROIStatus(roi.roi);
  const statusColor = getStatusColor(status);

  return (
    <div className="roi-global-card">
      <div className="roi-global-header">
        <h2>Valor Global del Design System</h2>
      </div>

      <div className="roi-global-content">
        <div className="roi-main-value">
          <div className="roi-percentage" style={{ color: statusColor }}>
            {formatPercentage(roi.roi)}
          </div>
          <div className="roi-status-badge" style={{ backgroundColor: statusColor }}>
            <span className="roi-status-emoji">{getStatusEmoji(status)}</span>
            <span>{getStatusLabel(status)}</span>
          </div>
        </div>

        <div className="roi-metrics-grid">
          <div className="roi-metric-item">
            <span className="roi-metric-label">Valor Neto</span>
            <span className="roi-metric-value">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
              }).format(roi.netValue)}
            </span>
          </div>
          <div className="roi-metric-item">
            <span className="roi-metric-label">Beneficios</span>
            <span className="roi-metric-value">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
              }).format(roi.benefits.total)}
            </span>
          </div>
          <div className="roi-metric-item">
            <span className="roi-metric-label">Costes</span>
            <span className="roi-metric-value">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
              }).format(roi.costs.total)}
            </span>
          </div>
        </div>

        <div className="roi-context">
          <p className="roi-context-text">
            Este estado no indica "bueno" o "malo", sino el contexto actual del Design System.
          </p>
          <p className="roi-period">{roi.period}</p>
        </div>
      </div>
    </div>
  );
}

