import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardData, ROI } from '../types';
import Tooltip from '../components/Tooltip';
import './PageLayout.css';
import './ROIPage.css';

export default function ROIPage({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const roi = data.roi;
  const [isEditing, setIsEditing] = useState(false);
  const [editedCosts, setEditedCosts] = useState(roi?.costs || null);
  const [editedBenefits, setEditedBenefits] = useState(roi?.benefits || null);

  if (!roi) {
    return (
      <div className="page-layout">
        <header className="page-header">
          <Link to="/" className="back-link">← Dashboard</Link>
          <h1>ROI</h1>
        </header>
        <main className="page-content">
          <div className="page-section">
            <p>No hay datos de ROI disponibles</p>
          </div>
        </main>
      </div>
    );
  }

  const costs = editedCosts || roi.costs;
  const benefits = editedBenefits || roi.benefits;
  const annualInvestment = costs.total;
  const annualValue = benefits.total;
  const netBenefit = annualValue - annualInvestment;
  const calculatedROI = annualInvestment > 0 
    ? ((annualValue - annualInvestment) / annualInvestment) * 100 
    : 0;
  const confidenceRange = {
    low: calculatedROI * 0.85,
    high: calculatedROI * 1.15,
  };

  const handleCostChange = (field: keyof typeof costs, value: number) => {
    if (!editedCosts) return;
    const updated = { ...editedCosts, [field]: value };
    // Recalcular total
    const teamCost = updated.teamSize * updated.averageSalary * (updated.timeMonths / 12);
    const maintenanceCost = updated.maintenanceHoursPerMonth * 12 * updated.maintenanceRate;
    const infrastructureCost = updated.toolsCost + updated.infrastructureCost;
    updated.total = teamCost + maintenanceCost + infrastructureCost;
    setEditedCosts(updated);
  };

  const handleBenefitChange = (field: keyof typeof benefits, value: number) => {
    if (!editedBenefits) return;
    const updated = { ...editedBenefits, [field]: value };
    // Recalcular total
    const timeSavedValue = (updated.developmentTimeSaved + updated.designTimeSaved) * 12 * updated.hourlyRate;
    const reuseValue = updated.componentReuseCount * updated.reuseValueMultiplier;
    const qualityValue = updated.bugsReduced * updated.bugFixCost;
    updated.total = timeSavedValue + reuseValue + qualityValue + updated.consistencyValue;
    setEditedBenefits(updated);
  };

  const handleSave = async () => {
    if (!editedCosts || !editedBenefits) return;
    // Aquí se podría hacer una llamada a la API para guardar
    setIsEditing(false);
    onRefresh();
  };

  return (
    <div className="page-layout">
      <header className="page-header">
        <div className="header-nav">
          <Link to="/" className="back-link">← Dashboard</Link>
          <nav className="page-nav">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/producto" className="nav-link">Métricas</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link active">ROI</Link>
          </nav>
        </div>
        <h1>Retorno de Inversión</h1>
        <p className="page-subtitle">Impacto financiero del design system</p>
      </header>

      <main className="page-content roi-page-content">
        {/* ROI Hero */}
        <section className="roi-page-hero">
          <div className="roi-page-value">
            <div className="roi-page-label">ROI ACTUAL</div>
            <div className="roi-page-number">{calculatedROI.toFixed(0)}%</div>
          </div>
          <div className="roi-page-confidence">
            Rango de confianza: {confidenceRange.low.toFixed(0)}% - {confidenceRange.high.toFixed(0)}%
          </div>
        </section>

        {/* Financial Summary Cards */}
        <section className="financial-summary">
          <div className="financial-card">
            <div className="financial-label">Inversión Anual</div>
            <div className="financial-value">
              {(annualInvestment / 1000).toFixed(0)}k€
            </div>
          </div>
          <div className="financial-card">
            <div className="financial-label">Valor Generado Anual</div>
            <div className="financial-value">
              {(annualValue / 1000).toFixed(0)}k€
            </div>
          </div>
          <div className="financial-card highlight">
            <div className="financial-label">Beneficio Neto</div>
            <div className="financial-value positive">
              +{(netBenefit / 1000).toFixed(0)}k€
            </div>
          </div>
        </section>

        {/* Investment Costs Breakdown */}
        <section className="roi-breakdown-section">
          <div className="section-header">
            <h2 className="section-title">Costes de Inversión</h2>
            <button 
              className="edit-button" 
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setEditedCosts({ ...roi.costs });
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? '💾 Guardar' : '✏️ Editar valores'}
            </button>
          </div>
          <div className="breakdown-list">
            <InputRow
              label="Salario anual diseñador"
              value={costs.averageSalary}
              format="currency"
              tooltip="Salario anual promedio por diseñador en el equipo DS"
              editable={isEditing}
              onChange={(value) => handleCostChange('averageSalary', value)}
            />
            <InputRow
              label="FTEs diseñador"
              value={costs.teamSize}
              format="number"
              tooltip="Equivalentes a tiempo completo dedicados al design system"
              editable={isEditing}
              onChange={(value) => handleCostChange('teamSize', value)}
            />
            <InputRow
              label="Salario anual desarrollador"
              value={Math.round(costs.averageSalary * 1.17)}
              format="currency"
              tooltip="Salario anual promedio por desarrollador en el equipo DS"
              editable={false}
            />
            <InputRow
              label="FTEs desarrollador"
              value={1.5}
              format="number"
              tooltip="Equivalentes a tiempo completo dedicados al design system"
              editable={false}
            />
            <InputRow
              label="Herramientas e infraestructura (anual)"
              value={costs.toolsCost + costs.infrastructureCost}
              format="currency"
              tooltip="Figma, hosting, CI/CD y otras herramientas"
              editable={isEditing}
              onChange={(value) => {
                handleCostChange('toolsCost', value * 0.6);
                handleCostChange('infrastructureCost', value * 0.4);
              }}
            />
            <div className="breakdown-item total">
              <div className="breakdown-label">Inversión Anual Total</div>
              <div className="breakdown-value">
                {(annualInvestment / 1000).toFixed(0)}k€
              </div>
            </div>
          </div>
        </section>

        {/* Value Generated Breakdown */}
        <section className="roi-breakdown-section">
          <h2 className="section-title">
            Valor Generado
            <Tooltip content="Calculado a partir del tiempo ahorrado, reutilización de componentes y mejoras de calidad">
              <button className="info-button" aria-label="Info">ℹ️</button>
            </Tooltip>
          </h2>
          <div className="breakdown-list">
            <InputRow
              label="Horas de diseño ahorradas (mensual)"
              value={benefits.designTimeSaved}
              format="number"
              suffix="h"
              tooltip="Tiempo ahorrado por diseñadores usando el design system"
              editable={isEditing}
              onChange={(value) => handleBenefitChange('designTimeSaved', value)}
            />
            <InputRow
              label="Horas de desarrollo ahorradas (mensual)"
              value={benefits.developmentTimeSaved}
              format="number"
              suffix="h"
              tooltip="Tiempo ahorrado por desarrolladores usando componentes pre-construidos"
              editable={isEditing}
              onChange={(value) => handleBenefitChange('developmentTimeSaved', value)}
            />
            <InputRow
              label="Tarifa horaria promedio diseñador"
              value={benefits.hourlyRate}
              format="currency"
              tooltip="Calculado a partir del salario anual ÷ 2080 horas"
              editable={isEditing}
              onChange={(value) => handleBenefitChange('hourlyRate', value)}
            />
            <InputRow
              label="Tarifa horaria promedio desarrollador"
              value={Math.round(benefits.hourlyRate * 1.17)}
              format="currency"
              tooltip="Calculado a partir del salario anual ÷ 2080 horas"
              editable={false}
            />
            <div className="breakdown-item">
              <div className="breakdown-label">Valor Mensual</div>
              <div className="breakdown-value">
                {((benefits.total / 12) / 1000).toFixed(1)}k€
              </div>
            </div>
            <div className="breakdown-item total">
              <div className="breakdown-label">Valor Anual</div>
              <div className="breakdown-value">
                {(annualValue / 1000).toFixed(0)}k€
              </div>
            </div>
          </div>
        </section>

        {/* Explanation */}
        <section className="roi-explanation">
          <h3 className="explanation-title">Entendiendo el ROI</h3>
          <p className="explanation-text">
            El ROI ayuda a decidir la inversión futura, no a juzgar el trabajo pasado. Este cálculo proporciona una 
            comprensión direccional del valor, pero debe combinarse con beneficios cualitativos como 
            consistencia de marca, reducción de fatiga de decisión y mejora de la experiencia de usuario.
          </p>
          <p className="explanation-text">
            <strong>Rango de Confianza: ±15%</strong> tiene en cuenta la incertidumbre de estimación en el 
            seguimiento del tiempo y la atribución. El ROI real probablemente cae dentro de este rango.
          </p>
        </section>
      </main>
    </div>
  );
}

interface InputRowProps {
  label: string;
  value: number;
  format: 'currency' | 'number';
  suffix?: string;
  tooltip: string;
  editable: boolean;
  onChange?: (value: number) => void;
}

function InputRow({ label, value, format, suffix, tooltip, editable, onChange }: InputRowProps) {
  const formattedValue = value.toLocaleString('es-ES');

  return (
    <div className="breakdown-item">
      <div className="breakdown-info">
        <span className="breakdown-label">{label}</span>
        <Tooltip content={tooltip}>
          <button className="info-button" aria-label="Info">ℹ️</button>
        </Tooltip>
      </div>
      {editable && onChange ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="breakdown-input"
        />
      ) : (
        <div className="breakdown-value">
          {format === 'currency' ? `${formattedValue}€` : formattedValue}
          {suffix && ` ${suffix}`}
        </div>
      )}
    </div>
  );
}
