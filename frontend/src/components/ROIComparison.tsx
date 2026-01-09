import { ROI, ROIBaseline } from '../types';
import './ROIComparison.css';

interface ROIComparisonProps {
  roi: ROI;
  onBaselineUpdate?: (baseline: ROIBaseline) => void;
}

export default function ROIComparison({ roi, onBaselineUpdate }: ROIComparisonProps) {
  const baseline = roi.baseline;
  const hasBaseline = baseline !== undefined;

  // Calcular diferencias
  const costDifference = baseline
    ? roi.costs.total - baseline.costs.total
    : 0;
  const benefitDifference = baseline
    ? roi.benefits.total - baseline.benefits.total
    : 0;
  const netValueDifference = baseline
    ? roi.netValue - (baseline.benefits.total - baseline.costs.total)
    : 0;

  return (
    <div className="roi-comparison-section">
      <div className="roi-comparison-header">
        <h2 className="roi-comparison-title">Comparativa: With DS vs Baseline (sin DS)</h2>
        {!hasBaseline && (
          <button className="btn-add-baseline" onClick={() => onBaselineUpdate?.({ costs: roi.costs, benefits: { ...roi.benefits, total: 0 } })}>
            + Añadir Baseline
          </button>
        )}
      </div>

      {hasBaseline ? (
        <div className="roi-comparison-table-container">
          <table className="roi-comparison-table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Con DS</th>
                <th>Sin DS (Baseline)</th>
                <th>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-label">Costes Totales</td>
                <td className="metric-value">€{roi.costs.total.toLocaleString('es-ES')}</td>
                <td className="metric-value baseline">€{baseline.costs.total.toLocaleString('es-ES')}</td>
                <td className={`metric-difference ${costDifference > 0 ? 'negative' : 'positive'}`}>
                  {costDifference > 0 ? '+' : ''}€{costDifference.toLocaleString('es-ES')}
                </td>
              </tr>
              <tr>
                <td className="metric-label">Beneficios Totales</td>
                <td className="metric-value">€{roi.benefits.total.toLocaleString('es-ES')}</td>
                <td className="metric-value baseline">€{baseline.benefits.total.toLocaleString('es-ES')}</td>
                <td className={`metric-difference ${benefitDifference >= 0 ? 'positive' : 'negative'}`}>
                  {benefitDifference >= 0 ? '+' : ''}€{benefitDifference.toLocaleString('es-ES')}
                </td>
              </tr>
              <tr className="highlight-row">
                <td className="metric-label"><strong>Valor Neto</strong></td>
                <td className="metric-value"><strong>€{roi.netValue.toLocaleString('es-ES')}</strong></td>
                <td className="metric-value baseline">
                  <strong>€{(baseline.benefits.total - baseline.costs.total).toLocaleString('es-ES')}</strong>
                </td>
                <td className={`metric-difference ${netValueDifference >= 0 ? 'positive' : 'negative'}`}>
                  <strong>{netValueDifference >= 0 ? '+' : ''}€{netValueDifference.toLocaleString('es-ES')}</strong>
                </td>
              </tr>
              <tr>
                <td className="metric-label">ROI</td>
                <td className="metric-value">{roi.roi.toFixed(1)}%</td>
                <td className="metric-value baseline">
                  {baseline.costs.total > 0
                    ? (((baseline.benefits.total - baseline.costs.total) / baseline.costs.total) * 100).toFixed(1)
                    : '0.0'}%
                </td>
                <td className={`metric-difference ${roi.roi >= (baseline.costs.total > 0 ? ((baseline.benefits.total - baseline.costs.total) / baseline.costs.total) * 100 : 0) ? 'positive' : 'negative'}`}>
                  {((roi.roi - (baseline.costs.total > 0 ? ((baseline.benefits.total - baseline.costs.total) / baseline.costs.total) * 100 : 0))).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>

          {baseline.notes && (
            <div className="baseline-notes">
              <strong>Notas del baseline:</strong> {baseline.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="roi-comparison-empty">
          <p>No hay datos de baseline disponibles. Añade un baseline para comparar el ROI con y sin Design System.</p>
          <p className="empty-hint">El baseline representa los costes y beneficios estimados sin el Design System.</p>
        </div>
      )}
    </div>
  );
}

