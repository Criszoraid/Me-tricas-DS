import { ROI } from '../types';
import './ROICard.css';

interface ROICardProps {
  roi: ROI;
}

export default function ROICard({ roi }: ROICardProps) {
  const getStatusLabel = (status: ROI['status']) => {
    const labels = {
      negative: 'Negativo',
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
    };
    return labels[status];
  };

  const getStatusColor = (status: ROI['status']) => {
    const colors = {
      negative: '#dc3545',
      low: '#fd7e14',
      medium: '#0d6efd',
      high: '#198754',
    };
    return colors[status];
  };

  const getConfidenceLabel = (level: ROI['confidenceLevel']) => {
    const labels = {
      estimated: 'Estimado',
      partial: 'Parcial',
      measured: 'Medido',
    };
    return labels[level];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  return (
    <div className="roi-card">
      <div className="roi-header">
        <h2>Retorno de Inversión (ROI)</h2>
        <div className="roi-period">{roi.period}</div>
      </div>

      <div className="roi-main">
        <div className="roi-value-section">
          <div className="roi-value" style={{ color: getStatusColor(roi.status) }}>
            {formatPercentage(roi.roi)}
          </div>
          <div className="roi-status" style={{ color: getStatusColor(roi.status) }}>
            {getStatusLabel(roi.status)}
          </div>
        </div>

        <div className="roi-details">
          <div className="roi-detail-item">
            <span className="roi-detail-label">Valor Neto</span>
            <span className="roi-detail-value">{formatCurrency(roi.netValue)}</span>
          </div>
          <div className="roi-detail-item">
            <span className="roi-detail-label">Costos Totales</span>
            <span className="roi-detail-value">{formatCurrency(roi.costs.total)}</span>
          </div>
          <div className="roi-detail-item">
            <span className="roi-detail-label">Beneficios Totales</span>
            <span className="roi-detail-value">{formatCurrency(roi.benefits.total)}</span>
          </div>
          <div className="roi-detail-item">
            <span className="roi-detail-label">Nivel de Confianza</span>
            <span className="roi-detail-value">{getConfidenceLabel(roi.confidenceLevel)}</span>
          </div>
        </div>
      </div>

      {roi.confidenceNotes && (
        <div className="roi-notes">
          <strong>Notas:</strong> {roi.confidenceNotes}
        </div>
      )}

      <div className="roi-breakdown">
        <div className="roi-breakdown-section">
          <h3>Costos</h3>
          <div className="roi-breakdown-list">
            <div className="roi-breakdown-item">
              <span>Equipo ({roi.costs.teamSize} personas × {roi.costs.timeMonths} meses)</span>
              <span>{formatCurrency(roi.costs.teamSize * roi.costs.averageSalary * (roi.costs.timeMonths / 12))}</span>
            </div>
            <div className="roi-breakdown-item">
              <span>Mantenimiento ({roi.costs.maintenanceHoursPerMonth}h/mes)</span>
              <span>{formatCurrency(roi.costs.maintenanceHoursPerMonth * 12 * roi.costs.maintenanceRate)}</span>
            </div>
            <div className="roi-breakdown-item">
              <span>Herramientas e Infraestructura</span>
              <span>{formatCurrency(roi.costs.toolsCost + roi.costs.infrastructureCost)}</span>
            </div>
          </div>
        </div>

        <div className="roi-breakdown-section">
          <h3>Beneficios</h3>
          <div className="roi-breakdown-list">
            <div className="roi-breakdown-item">
              <span>Tiempo Ahorrado (Dev: {roi.benefits.developmentTimeSaved}h, Design: {roi.benefits.designTimeSaved}h)</span>
              <span>{formatCurrency((roi.benefits.developmentTimeSaved + roi.benefits.designTimeSaved) * 12 * roi.benefits.hourlyRate)}</span>
            </div>
            <div className="roi-breakdown-item">
              <span>Reutilización ({roi.benefits.componentReuseCount} componentes)</span>
              <span>{formatCurrency(roi.benefits.componentReuseCount * roi.benefits.reuseValueMultiplier)}</span>
            </div>
            <div className="roi-breakdown-item">
              <span>Calidad ({roi.benefits.bugsReduced} bugs reducidos)</span>
              <span>{formatCurrency(roi.benefits.bugsReduced * roi.benefits.bugFixCost)}</span>
            </div>
            {roi.benefits.consistencyValue > 0 && (
              <div className="roi-breakdown-item">
                <span>Consistencia</span>
                <span>{formatCurrency(roi.benefits.consistencyValue)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

