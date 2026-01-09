import { useState, useEffect } from 'react';
import { Objective, KeyResult } from '../types';
import './EditMetricModal.css';

interface EditOKRModalProps {
  okr: Objective | null;
  onSave: (data: Partial<Objective>) => Promise<void>;
  onClose: () => void;
}

export default function EditOKRModal({ okr, onSave, onClose }: EditOKRModalProps) {
  const [formData, setFormData] = useState({
    title: okr?.title || '',
    description: okr?.description || '',
    quarter: okr?.quarter || '',
    status: okr?.status || 'on-track' as const,
    keyResults: okr?.keyResults || [
      {
        id: `kr-${Date.now()}`,
        title: '',
        description: '',
        targetValue: 0,
        currentValue: 0,
        unit: '',
        progress: 0,
      },
    ],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (okr) {
      setFormData({
        title: okr.title || '',
        description: okr.description || '',
        quarter: okr.quarter || '',
        status: okr.status || 'on-track',
        keyResults: okr.keyResults || [],
      });
    }
  }, [okr]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: string | number) => {
    setFormData(prev => {
      const newKeyResults = [...prev.keyResults];
      newKeyResults[index] = {
        ...newKeyResults[index],
        [field]: value,
        progress: field === 'currentValue' || field === 'targetValue'
          ? calculateProgress(newKeyResults[index], field, value)
          : newKeyResults[index].progress,
      };
      return { ...prev, keyResults: newKeyResults };
    });
  };

  const calculateProgress = (kr: KeyResult, field: keyof KeyResult, value: string | number): number => {
    const currentValue = field === 'currentValue' ? Number(value) : kr.currentValue;
    const targetValue = field === 'targetValue' ? Number(value) : kr.targetValue;
    return targetValue > 0 ? Math.min(100, Math.round((currentValue / targetValue) * 100)) : 0;
  };

  const addKeyResult = () => {
    setFormData(prev => ({
      ...prev,
      keyResults: [
        ...prev.keyResults,
        {
          id: `kr-${Date.now()}-${prev.keyResults.length}`,
          title: '',
          description: '',
          targetValue: 0,
          currentValue: 0,
          unit: '',
          progress: 0,
        },
      ],
    }));
  };

  const removeKeyResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyResults: prev.keyResults.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const overallProgress = formData.keyResults.length > 0
        ? formData.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / formData.keyResults.length
        : 0;

      await onSave({
        ...formData,
        progress: overallProgress,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el OKR');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar OKR</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Título del Objetivo</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
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
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Trimestre</label>
              <input
                type="text"
                className="form-input"
                value={formData.quarter}
                onChange={(e) => handleChange('quarter', e.target.value)}
                placeholder="2024-Q1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-input"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                <option value="on-track">En curso</option>
                <option value="at-risk">En riesgo</option>
                <option value="behind">Retrasado</option>
                <option value="complete">Completado</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="form-section-title">Resultados Clave</h3>
              <button type="button" className="btn-secondary" onClick={addKeyResult}>
                + Añadir Resultado Clave
              </button>
            </div>

            {formData.keyResults.map((kr, index) => (
              <div key={kr.id || index} className="key-result-form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 className="key-result-form-title">Resultado Clave {index + 1}</h4>
                  {formData.keyResults.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger-small"
                      onClick={() => removeKeyResult(index)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-input"
                    value={kr.title}
                    onChange={(e) => handleKeyResultChange(index, 'title', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-input"
                    value={kr.description}
                    onChange={(e) => handleKeyResultChange(index, 'description', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Valor Actual</label>
                    <input
                      type="number"
                      className="form-input"
                      value={kr.currentValue}
                      onChange={(e) => handleKeyResultChange(index, 'currentValue', Number(e.target.value))}
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Valor Objetivo</label>
                    <input
                      type="number"
                      className="form-input"
                      value={kr.targetValue}
                      onChange={(e) => handleKeyResultChange(index, 'targetValue', Number(e.target.value))}
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unidad</label>
                    <input
                      type="text"
                      className="form-input"
                      value={kr.unit}
                      onChange={(e) => handleKeyResultChange(index, 'unit', e.target.value)}
                      placeholder="%, horas, etc."
                      required
                    />
                  </div>
                </div>

                <div className="key-result-progress-display">
                  Progreso: {kr.progress}%
                </div>
              </div>
            ))}
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


