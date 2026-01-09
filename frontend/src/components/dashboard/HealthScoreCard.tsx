import { useMemo, useState, useEffect } from 'react';
import { calculateHealthScore, HealthScoreInputs } from '../../utils/calculations/healthScore';
import './HealthScoreCard.css';

interface HealthScoreCardProps {
  inputs: HealthScoreInputs;
}

const LS_KEY = 'ds_health_score_overrides_v1';

export default function HealthScoreCard({ inputs }: HealthScoreCardProps) {
  const [npsOverride, setNpsOverride] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.nps === 'number') setNpsOverride(parsed.nps);
      }
    } catch {
      // ignore
    }
  }, []);

  const effectiveInputs: HealthScoreInputs = useMemo(() => ({
    ...inputs,
    nps: npsOverride ?? inputs.nps,
  }), [inputs, npsOverride]);

  const result = useMemo(() => calculateHealthScore(effectiveInputs), [effectiveInputs]);

  const statusClass =
    result.status === 'Excelente' ? 'hs-status-excellent' :
    result.status === 'Bueno' ? 'hs-status-good' :
    result.status === 'Necesita mejora' ? 'hs-status-warn' :
    'hs-status-bad';

  const handleSave = () => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ nps: npsOverride }));
    } catch {
      // ignore
    }
    setEditing(false);
  };

  return (
    <div className="hs-card">
      <div className="hs-header">
        <div>
          <div className="hs-label">Health Score Global</div>
          <div className="hs-subtitle">Resumen ejecutivo de la salud del Design System</div>
        </div>
        <div className={`hs-status ${statusClass}`}>{result.status}</div>
      </div>

      <div className="hs-main">
        <div className="hs-score">{result.score}</div>
        <div className="hs-score-suffix">/ 100</div>
        <div className="hs-edit">
          {editing ? (
            <div className="hs-edit-row">
              <label className="hs-edit-label">NPS (manual)</label>
              <input
                className="hs-edit-input"
                type="number"
                min={-100}
                max={100}
                value={npsOverride ?? inputs.nps}
                onChange={(e) => setNpsOverride(Number(e.target.value))}
              />
              <div className="hs-edit-actions">
                <button className="hs-btn hs-btn-save" onClick={handleSave}>Guardar</button>
                <button className="hs-btn hs-btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button className="hs-btn hs-btn-edit" onClick={() => setEditing(true)}>✏️ Ajustar NPS</button>
          )}
        </div>
      </div>

      <div className="hs-breakdown">
        {([
          ['Adopción', result.breakdown.adoption],
          ['Calidad', result.breakdown.quality],
          ['Eficiencia', result.breakdown.efficiency],
          ['Satisfacción', result.breakdown.satisfaction],
          ['Gobernanza', result.breakdown.governance],
        ] as const).map(([label, value]) => (
          <div key={label} className="hs-row">
            <div className="hs-row-top">
              <span className="hs-row-label">{label}</span>
              <span className="hs-row-value">{value.toFixed(0)}%</span>
            </div>
            <div className="hs-bar">
              <div className="hs-bar-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



