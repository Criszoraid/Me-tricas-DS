import { summarizePatterns, Pattern } from '../../utils/calculations/patternEfficiency';
import './PatternEfficiency.css';

interface PatternEfficiencySummaryProps {
  patterns: Pattern[];
  hourlyRate: number;
}

export default function PatternEfficiencySummary({ patterns, hourlyRate }: PatternEfficiencySummaryProps) {
  const s = summarizePatterns(patterns, hourlyRate);
  return (
    <div className="pattern-efficiency-container">
      <h3 className="pe-title">Resumen de Eficiencia</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
        <div className="summary-card">
          <div className="summary-label">Horas sin DS</div>
          <div className="summary-value-large">{Math.round(s.totalWithoutDS).toLocaleString('es-ES')} h</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Horas con DS</div>
          <div className="summary-value-large">{Math.round(s.totalWithDS).toLocaleString('es-ES')} h</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Horas Ahorradas</div>
          <div className="summary-value-large">{Math.round(s.totalHoursSaved).toLocaleString('es-ES')} h</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Valor Económico</div>
          <div className="summary-value-large">{s.econValue.toLocaleString('es-ES')}€</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Eficiencia Media</div>
          <div className="summary-value-large">{s.averageEfficiency.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}



