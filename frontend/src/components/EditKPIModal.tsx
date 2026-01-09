import { useState, useEffect } from 'react';
import { KPI } from '../types';
import './EditMetricModal.css';

interface EditKPIModalProps {
  kpi: KPI | null;
  onSave: (data: Partial<KPI>) => Promise<void>;
  onClose: () => void;
}

export default function EditKPIModal({ kpi, onSave, onClose }: EditKPIModalProps) {
  const [formData, setFormData] = useState({
    name: kpi?.name || '',
    description: kpi?.description || '',
    currentValue: kpi?.currentValue || 0,
    previousValue: kpi?.previousValue || 0,
    trend: kpi?.trend || 'stable' as const,
    thresholds: {
      critical: kpi?.thresholds?.critical || 0,
      warning: kpi?.thresholds?.warning || 0,
      good: kpi?.thresholds?.good || 0,
      excellent: kpi?.thresholds?.excellent || 100,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (kpi) {
      setFormData({
        name: kpi.name || '',
        description: kpi.description || '',
        currentValue: kpi.currentValue || 0,
        previousValue: kpi.previousValue || 0,
        trend: kpi.trend || 'stable',
        thresholds: kpi.thresholds || {
          critical: 0,
          warning: 0,
          good: 0,
          excellent: 100,
        },
      });
    }
  }, [kpi]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThresholdChange = (threshold: keyof typeof formData.thresholds, value: number) => {
    setFormData(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [threshold]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave({
        ...formData,
        thresholds: formData.thresholds,
        lastUpdated: Date.now(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el KPI');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar KPI</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nombre del KPI</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-input"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor Actual</label>
              <input
                type="number"
                className="form-input"
                value={formData.currentValue}
                onChange={(e) => handleChange('currentValue', Number(e.target.value))}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor Anterior</label>
              <input
                type="number"
                className="form-input"
                value={formData.previousValue}
                onChange={(e) => handleChange('previousValue', Number(e.target.value))}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tendencia</label>
            <select
              className="form-input"
              value={formData.trend}
              onChange={(e) => handleChange('trend', e.target.value as 'up' | 'down' | 'stable')}
              required
            >
              <option value="up">↑ Subiendo</option>
              <option value="down">↓ Bajando</option>
              <option value="stable">→ Estable</option>
            </select>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Umbrales</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Crítico</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.thresholds.critical}
                  onChange={(e) => handleThresholdChange('critical', Number(e.target.value))}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Advertencia</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.thresholds.warning}
                  onChange={(e) => handleThresholdChange('warning', Number(e.target.value))}
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bueno</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.thresholds.good}
                  onChange={(e) => handleThresholdChange('good', Number(e.target.value))}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Excelente</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.thresholds.excellent}
                  onChange={(e) => handleThresholdChange('excellent', Number(e.target.value))}
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

