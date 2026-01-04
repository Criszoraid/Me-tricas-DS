import { useState, useEffect } from 'react';
import { DesignMetrics, DevelopmentMetrics } from '../types';
import './EditMetricModal.css';

interface EditDesignMetricsProps {
  metrics: DesignMetrics | null;
  onSave: (data: Partial<DesignMetrics>) => Promise<void>;
  onClose: () => void;
}

interface EditDevelopmentMetricsProps {
  metrics: DevelopmentMetrics | null;
  onSave: (data: Partial<DevelopmentMetrics>) => Promise<void>;
  onClose: () => void;
}

type EditMetricModalProps = EditDesignMetricsProps | EditDevelopmentMetricsProps;

export default function EditMetricModal(props: EditMetricModalProps) {
  const isDesign = 'metrics' in props && props.metrics && 'totalComponents' in props.metrics;
  
  if (isDesign) {
    return <EditDesignMetricModal {...(props as EditDesignMetricsProps)} />;
  } else {
    return <EditDevelopmentMetricModal {...(props as EditDevelopmentMetricsProps)} />;
  }
}

function EditDesignMetricModal({ metrics, onSave, onClose }: EditDesignMetricsProps) {
  const [formData, setFormData] = useState({
    totalComponents: metrics?.totalComponents || 0,
    usedComponents: metrics?.usedComponents || 0,
    detachedComponents: metrics?.detachedComponents || 0,
    adoptionPercentage: metrics?.adoptionPercentage || 0,
    figmaFileKey: metrics?.figmaFileKey || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metrics) {
      setFormData({
        totalComponents: metrics.totalComponents || 0,
        usedComponents: metrics.usedComponents || 0,
        detachedComponents: metrics.detachedComponents || 0,
        adoptionPercentage: metrics.adoptionPercentage || 0,
        figmaFileKey: metrics.figmaFileKey || '',
      });
    }
  }, [metrics]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate adoption percentage if total and used are provided
    if (field === 'totalComponents' || field === 'usedComponents') {
      const total = field === 'totalComponents' ? Number(value) : formData.totalComponents;
      const used = field === 'usedComponents' ? Number(value) : formData.usedComponents;
      if (total > 0 && used >= 0) {
        setFormData(prev => ({
          ...prev,
          adoptionPercentage: Math.round((used / total) * 100 * 100) / 100,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar las métricas');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Métricas de Diseño</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Total de Componentes</label>
            <input
              type="number"
              className="form-input"
              value={formData.totalComponents}
              onChange={(e) => handleChange('totalComponents', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Componentes Usados</label>
            <input
              type="number"
              className="form-input"
              value={formData.usedComponents}
              onChange={(e) => handleChange('usedComponents', Number(e.target.value))}
              min="0"
              max={formData.totalComponents}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Componentes Desconectados</label>
            <input
              type="number"
              className="form-input"
              value={formData.detachedComponents}
              onChange={(e) => handleChange('detachedComponents', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Porcentaje de Adopción (%)</label>
            <input
              type="number"
              className="form-input"
              value={formData.adoptionPercentage}
              onChange={(e) => handleChange('adoptionPercentage', Number(e.target.value))}
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Figma File Key (opcional)</label>
            <input
              type="text"
              className="form-input"
              value={formData.figmaFileKey}
              onChange={(e) => handleChange('figmaFileKey', e.target.value)}
            />
          </div>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditDevelopmentMetricModal({ metrics, onSave, onClose }: EditDevelopmentMetricsProps) {
  const [formData, setFormData] = useState({
    dsPackageInstalls: metrics?.dsPackageInstalls || 0,
    reposUsingDS: metrics?.reposUsingDS || 0,
    customComponentsCount: metrics?.customComponentsCount || 0,
    componentsBuiltFromScratch: metrics?.componentsBuiltFromScratch || 0,
    uiRelatedIssues: metrics?.uiRelatedIssues || 0,
    resolvedIssues: metrics?.resolvedIssues || 0,
    organization: metrics?.organization || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metrics) {
      setFormData({
        dsPackageInstalls: metrics.dsPackageInstalls || 0,
        reposUsingDS: metrics.reposUsingDS || 0,
        customComponentsCount: metrics.customComponentsCount || 0,
        componentsBuiltFromScratch: metrics.componentsBuiltFromScratch || 0,
        uiRelatedIssues: metrics.uiRelatedIssues || 0,
        resolvedIssues: metrics.resolvedIssues || 0,
        organization: metrics.organization || '',
      });
    }
  }, [metrics]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar las métricas');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Editar Métricas de Desarrollo</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Instalaciones del Paquete DS</label>
            <input
              type="number"
              className="form-input"
              value={formData.dsPackageInstalls}
              onChange={(e) => handleChange('dsPackageInstalls', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Repositorios Usando DS</label>
            <input
              type="number"
              className="form-input"
              value={formData.reposUsingDS}
              onChange={(e) => handleChange('reposUsingDS', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Componentes Personalizados</label>
            <input
              type="number"
              className="form-input"
              value={formData.customComponentsCount}
              onChange={(e) => handleChange('customComponentsCount', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Componentes Construidos desde Cero</label>
            <input
              type="number"
              className="form-input"
              value={formData.componentsBuiltFromScratch}
              onChange={(e) => handleChange('componentsBuiltFromScratch', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Issues Relacionados con UI</label>
            <input
              type="number"
              className="form-input"
              value={formData.uiRelatedIssues}
              onChange={(e) => handleChange('uiRelatedIssues', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Issues Resueltos</label>
            <input
              type="number"
              className="form-input"
              value={formData.resolvedIssues}
              onChange={(e) => handleChange('resolvedIssues', Number(e.target.value))}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organización (opcional)</label>
            <input
              type="text"
              className="form-input"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
            />
          </div>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button-primary" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
