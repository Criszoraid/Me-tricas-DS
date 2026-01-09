import { useState } from 'react';
import { Pattern, calculatePatternEfficiency } from '../../utils/calculations/patternEfficiency';
import './PatternEfficiency.css';

interface PatternEfficiencyTableProps {
  patterns: Pattern[];
  onUpdate: (patterns: Pattern[]) => void;
}

export default function PatternEfficiencyTable({ patterns, onUpdate }: PatternEfficiencyTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Pattern | null>(null);

  const handleEdit = (p: Pattern) => {
    setEditingId(p.id);
    setDraft({ ...p });
  };
  const handleCancel = () => { setEditingId(null); setDraft(null); };
  const handleSave = () => {
    if (!draft) return;
    onUpdate(patterns.map(p => p.id === draft.id ? draft : p));
    handleCancel();
  };
  const handleChange = (field: keyof Pattern, value: string | number) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: typeof value === 'string' ? value : Number(value) });
  };
  const handleAdd = () => {
    const n: Pattern = {
      id: `pattern-${Date.now()}`,
      name: 'Nuevo Pattern',
      designEffort: 16,
      devEffort: 40,
      maintenanceEffort: 8,
      designImportTime: 1,
      devImportTime: 2,
      uisUsing: 10,
    };
    onUpdate([...patterns, n]);
  };
  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este pattern?')) onUpdate(patterns.filter(p => p.id !== id));
  };

  return (
    <div className="pattern-efficiency-container">
      <div className="pattern-efficiency-header">
        <h3 className="pe-title">Eficiencia por Pattern (IBM)</h3>
        <button className="btn-add" onClick={handleAdd}>+ Añadir Pattern</button>
      </div>
      <div className="pe-table-wrapper">
        <table className="pe-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Diseño (h)</th>
              <th>Desarrollo (h)</th>
              <th>Mant. (h/año)</th>
              <th>Import Diseño (h)</th>
              <th>Import Dev (h)</th>
              <th>UIs</th>
              <th>Ahorro (h)</th>
              <th>Eficiencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((p) => {
              const res = calculatePatternEfficiency(p);
              const isEditing = editingId === p.id;
              const d = isEditing && draft ? draft : p;
              return (
                <tr key={p.id}>
                  <td>
                    {isEditing ? (
                      <input className="pe-input" value={d.name} onChange={(e) => handleChange('name', e.target.value)} />
                    ) : <strong>{p.name}</strong>}
                  </td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.designEffort} onChange={(e) => handleChange('designEffort', Number(e.target.value))} /> : p.designEffort}</td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.devEffort} onChange={(e) => handleChange('devEffort', Number(e.target.value))} /> : p.devEffort}</td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.maintenanceEffort} onChange={(e) => handleChange('maintenanceEffort', Number(e.target.value))} /> : p.maintenanceEffort}</td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.designImportTime} onChange={(e) => handleChange('designImportTime', Number(e.target.value))} /> : p.designImportTime}</td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.devImportTime} onChange={(e) => handleChange('devImportTime', Number(e.target.value))} /> : p.devImportTime}</td>
                  <td>{isEditing ? <input type="number" className="pe-input" value={d.uisUsing} onChange={(e) => handleChange('uisUsing', Number(e.target.value))} /> : p.uisUsing}</td>
                  <td className="font-mono">{Math.round(res.hoursSaved).toLocaleString('es-ES')}</td>
                  <td className="font-mono">{res.efficiency.toFixed(1)}%</td>
                  <td>
                    {isEditing ? (
                      <div className="pe-actions">
                        <button className="btn-save" onClick={handleSave}>✓</button>
                        <button className="btn-cancel" onClick={handleCancel}>✕</button>
                      </div>
                    ) : (
                      <div className="pe-actions">
                        <button className="btn-edit" onClick={() => handleEdit(p)}>✏️</button>
                        <button className="btn-delete" onClick={() => handleDelete(p.id)}>🗑️</button>
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



