import { useState } from 'react';
import { ComponentCost, ComponentCostRates, COMPLEXITY_BENCHMARKS } from '../../types/componentCost';
import { calculateComponentCost } from '../../utils/calculations/componentCost';
import './ComponentCostTable.css';

interface ComponentCostTableProps {
  components: ComponentCost[];
  rates: ComponentCostRates;
  onUpdate: (components: ComponentCost[]) => void;
}

export default function ComponentCostTable({ components, rates, onUpdate }: ComponentCostTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedComponent, setEditedComponent] = useState<ComponentCost | null>(null);

  const handleEdit = (component: ComponentCost) => {
    setEditingId(component.id);
    setEditedComponent({ ...component });
  };

  const handleSave = () => {
    if (!editedComponent) return;
    
    const updated = components.map(c => 
      c.id === editedComponent.id ? calculateComponentCost(editedComponent, rates) : c
    );
    onUpdate(updated);
    setEditingId(null);
    setEditedComponent(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedComponent(null);
  };

  const handleChange = (field: keyof ComponentCost, value: string | number) => {
    if (!editedComponent) return;
    setEditedComponent({ ...editedComponent, [field]: value });
  };

  const handleAdd = () => {
    const newComponent: ComponentCost = {
      id: `component-${Date.now()}`,
      name: 'Nuevo Componente',
      complexity: 'medium',
      designHours: 8,
      devHours: 24,
      qaHours: 4,
      docsHours: 4,
      maintenanceHours: 2,
      numberOfUses: 0,
      totalCreationHours: 0,
      totalCreationCost: 0,
      monthlyCost: 0,
      costPerUse: 0,
    };
    onUpdate([...components, calculateComponentCost(newComponent, rates)]);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este componente?')) {
      onUpdate(components.filter(c => c.id !== id));
    }
  };

  const calculatedComponents = components.map(c => calculateComponentCost(c, rates));

  return (
    <div className="component-cost-container">
      <div className="component-cost-header">
        <h3 className="component-cost-title">Coste por Componente</h3>
        <button className="btn-add-component" onClick={handleAdd}>
          + Añadir Componente
        </button>
      </div>

      <div className="component-cost-table-wrapper">
        <table className="component-cost-table">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Complejidad</th>
              <th>Diseño (h)</th>
              <th>Desarrollo (h)</th>
              <th>QA (h)</th>
              <th>Docs (h)</th>
              <th>Mantenimiento (h/mes)</th>
              <th>Usos</th>
              <th>Coste Creación</th>
              <th>Coste/uso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {calculatedComponents.map((component) => {
              const isEditing = editingId === component.id;
              const displayComponent = isEditing && editedComponent ? editedComponent : component;

              return (
                <tr key={component.id}>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayComponent.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="table-input"
                      />
                    ) : (
                      <strong>{component.name}</strong>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={displayComponent.complexity}
                        onChange={(e) => handleChange('complexity', e.target.value)}
                        className="table-input"
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medio</option>
                        <option value="complex">Complejo</option>
                        <option value="very_complex">Muy Complejo</option>
                      </select>
                    ) : (
                      <span className={`complexity-badge complexity-${component.complexity}`}>
                        {component.complexity}
                      </span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.designHours}
                        onChange={(e) => handleChange('designHours', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.5"
                      />
                    ) : (
                      component.designHours
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.devHours}
                        onChange={(e) => handleChange('devHours', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.5"
                      />
                    ) : (
                      component.devHours
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.qaHours}
                        onChange={(e) => handleChange('qaHours', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.5"
                      />
                    ) : (
                      component.qaHours
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.docsHours}
                        onChange={(e) => handleChange('docsHours', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.5"
                      />
                    ) : (
                      component.docsHours
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.maintenanceHours}
                        onChange={(e) => handleChange('maintenanceHours', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      component.maintenanceHours
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayComponent.numberOfUses}
                        onChange={(e) => handleChange('numberOfUses', Number(e.target.value))}
                        className="table-input"
                        min="0"
                      />
                    ) : (
                      component.numberOfUses.toLocaleString()
                    )}
                  </td>
                  <td className="font-mono font-semibold">
                    {component.totalCreationCost.toLocaleString('es-ES')}€
                  </td>
                  <td className="font-mono">
                    {component.costPerUse > 0 
                      ? `${component.costPerUse.toFixed(2)}€` 
                      : 'N/A'}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="table-actions">
                        <button className="btn-save-small" onClick={handleSave}>✓</button>
                        <button className="btn-cancel-small" onClick={handleCancel}>✕</button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <button className="btn-edit-small" onClick={() => handleEdit(component)}>✏️</button>
                        <button className="btn-delete-small" onClick={() => handleDelete(component.id)}>🗑️</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


