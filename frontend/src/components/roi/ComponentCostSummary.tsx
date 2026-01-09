import { ComponentCostSummary as ComponentCostSummaryType, INDUSTRY_BENCHMARK_COST_PER_COMPONENT } from '../../types/componentCost';
import './ComponentCostSummary.css';

interface ComponentCostSummaryProps {
  summary: ComponentCostSummaryType;
}

export default function ComponentCostSummary({ summary }: ComponentCostSummaryProps) {
  const isAboveBenchmark = summary.vsIndustryBenchmark > 0;
  const benchmarkColor = isAboveBenchmark ? '#dc2626' : '#059669';
  const benchmarkIcon = isAboveBenchmark ? '↑' : '↓';

  return (
    <div className="component-cost-summary">
      <h3 className="summary-title">Resumen de Costes</h3>
      
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Total Componentes</div>
          <div className="summary-value-large">{summary.totalComponents}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Coste Total Creación</div>
          <div className="summary-value-large">
            {summary.totalCreationCost.toLocaleString('es-ES')}€
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Coste Mensual Mantenimiento</div>
          <div className="summary-value-large">
            {summary.totalMonthlyCost.toLocaleString('es-ES')}€
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Coste Medio por Componente</div>
          <div className="summary-value-large">
            {summary.averageCostPerComponent.toLocaleString('es-ES')}€
          </div>
          <div className="summary-benchmark">
            <span className="benchmark-label">vs Industria:</span>
            <span className="benchmark-value" style={{ color: benchmarkColor }}>
              {benchmarkIcon} {Math.abs(summary.vsIndustryBenchmark).toFixed(1)}%
            </span>
            <span className="benchmark-note">
              (Benchmark: {INDUSTRY_BENCHMARK_COST_PER_COMPONENT.toLocaleString('es-ES')}€)
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Coste Medio por Uso</div>
          <div className="summary-value-large">
            {summary.averageCostPerUse > 0
              ? `${summary.averageCostPerUse.toFixed(2)}€`
              : 'N/A'}
          </div>
        </div>
      </div>

      <div className="summary-explanation">
        <p className="explanation-text">
          <strong>Benchmark de la industria:</strong> El coste promedio de crear un componente 
          de Design System oscila entre 2,400€ y 7,200€, con un promedio de 4,200€ 
          (equivalente a 60-80 horas de trabajo × 60€/hora promedio).
        </p>
      </div>
    </div>
  );
}

