import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DashboardData, ROI, ROIBaseline } from '../types';
import Tooltip from '../components/Tooltip';
import ROIComparison from '../components/ROIComparison';
import ROIScenarios from '../components/ROIScenarios';
import BreakEvenChart from '../components/roi/BreakEvenChart';
import PatternEfficiencyTable from '../components/efficiency/PatternEfficiencyTable';
import PatternEfficiencySummary from '../components/efficiency/PatternEfficiencySummary';
import BenchmarkComparison from '../components/benchmarks/BenchmarkComparison';
import { industryBenchmarks } from '../utils/benchmarks';
import { Pattern } from '../utils/calculations/patternEfficiency';
import ComponentCostTable from '../components/roi/ComponentCostTable';
import ComponentCostSummary from '../components/roi/ComponentCostSummary';
import { calculateBreakEven } from '../utils/calculations/breakEven';
import { calculateComponentCostSummary } from '../utils/calculations/componentCost';
import { ComponentCost, ComponentCostRates } from '../types/componentCost';
import './PageLayout.css';
import './ROIPage.css';

export default function ROIPage({ data, onRefresh }: { data: DashboardData; onRefresh: () => void }) {
  const [searchParams] = useSearchParams();
  const roi = data.roi;
  
  // Leer filtros de URL para deep linking
  const sectionFilter = searchParams.get('section'); // 'benefits', 'costs', 'compare'
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedCosts, setEditedCosts] = useState(roi?.costs || null);
  const [editedBenefits, setEditedBenefits] = useState(roi?.benefits || null);
  const [roiData, setRoiData] = useState<ROI | null>(roi);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [componentCosts, setComponentCosts] = useState<ComponentCost[]>([]);

  // Scroll automático a la sección correspondiente si viene de un ChartCard
  useEffect(() => {
    if (sectionFilter) {
      setTimeout(() => {
        const element = document.getElementById(`roi-section-${sectionFilter}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [sectionFilter]);

  // Sincronizar roiData cuando cambia data.roi
  useEffect(() => {
    if (roi) {
      setRoiData(roi);
      setEditedCosts(roi.costs);
      setEditedBenefits(roi.benefits);
    }
  }, [roi]);

  // Datos de ejemplo para Pattern Efficiency
  useEffect(() => {
    if (patterns.length === 0) {
      setPatterns([
        { id: 'search', name: 'Buscar', designEffort: 20, devEffort: 50, maintenanceEffort: 10, designImportTime: 1, devImportTime: 2, uisUsing: 30 },
        { id: 'pagination', name: 'Paginación', designEffort: 12, devEffort: 36, maintenanceEffort: 6, designImportTime: .5, devImportTime: 1, uisUsing: 22 },
        { id: 'form', name: 'Formulario', designEffort: 28, devEffort: 72, maintenanceEffort: 12, designImportTime: 2, devImportTime: 3, uisUsing: 15 },
      ]);
    }
  }, [patterns.length]);

  // Inicializar componentes de ejemplo si no hay datos
  useEffect(() => {
    if (componentCosts.length === 0) {
      const sampleComponents: ComponentCost[] = [
        {
          id: 'button',
          name: 'Button',
          complexity: 'simple',
          designHours: 4,
          devHours: 12,
          qaHours: 2,
          docsHours: 2,
          maintenanceHours: 1,
          numberOfUses: 1247,
          totalCreationHours: 0,
          totalCreationCost: 0,
          monthlyCost: 0,
          costPerUse: 0,
        },
        {
          id: 'input',
          name: 'Input',
          complexity: 'medium',
          designHours: 8,
          devHours: 24,
          qaHours: 4,
          docsHours: 4,
          maintenanceHours: 2,
          numberOfUses: 892,
          totalCreationHours: 0,
          totalCreationCost: 0,
          monthlyCost: 0,
          costPerUse: 0,
        },
        {
          id: 'table',
          name: 'Table',
          complexity: 'complex',
          designHours: 16,
          devHours: 48,
          qaHours: 8,
          docsHours: 8,
          maintenanceHours: 4,
          numberOfUses: 234,
          totalCreationHours: 0,
          totalCreationCost: 0,
          monthlyCost: 0,
          costPerUse: 0,
        },
      ];
      setComponentCosts(sampleComponents);
    }
  }, [componentCosts.length]);

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

  const currentROI = roiData || roi;
  const costs = editedCosts || currentROI.costs;
  const benefits = editedBenefits || currentROI.benefits;
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

  // KPI de adopción (si existe) para Benchmarks
  const adoptionKPI = data.kpis.find(k => k.calculationMethod === 'component_adoption');
  const adoptionValue = adoptionKPI ? Math.round(adoptionKPI.currentValue) : 73;
  // Ganancias de eficiencia aproximadas desde beneficios (horas/mes → % aprox)
  const efficiencyGainDev = Math.min(100, Math.round((benefits.developmentTimeSaved / 200) * 100)); // heurística
  const efficiencyGainDesign = Math.min(100, Math.round((benefits.designTimeSaved / 160) * 100)); // heurística

  // Calcular rates para coste de componentes
  const componentRates: ComponentCostRates = {
    design: costs ? costs.averageSalary / 2080 : 38.46, // €/hora
    dev: costs ? (costs.averageSalary * 1.17) / 2080 : 45, // €/hora
    qa: costs ? (costs.averageSalary * 0.9) / 2080 : 34.62, // €/hora
  };

  const componentCostSummary = componentCosts.length > 0
    ? calculateComponentCostSummary(componentCosts, componentRates)
    : null;

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

  const handleBaselineUpdate = async (baseline: ROIBaseline) => {
    if (!roiData) return;
    const updatedROI: ROI = {
      ...roiData,
      baseline,
    };
    setRoiData(updatedROI);
    // TODO: Guardar baseline en backend cuando tengamos endpoint
    console.log('Baseline actualizado:', baseline);
  };

  const handleSave = async () => {
    if (!editedCosts || !editedBenefits || !roiData) return;
    // Aquí se podría hacer una llamada a la API para guardar
    const updatedROI: ROI = {
      ...roiData,
      costs: editedCosts,
      benefits: editedBenefits,
    };
    setRoiData(updatedROI);
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
            <Link to="/producto" className="nav-link">Producto</Link>
            <Link to="/desarrollo" className="nav-link">Desarrollo</Link>
            <Link to="/kpis" className="nav-link">KPIs</Link>
            <Link to="/okrs" className="nav-link">OKRs</Link>
            <Link to="/roi" className="nav-link active">ROI</Link>
            <Link to="/data-sources" className="nav-link">Fuentes</Link>
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

        {/* Break-even Point */}
        {costs && benefits && (
          <section id="roi-section-break-even" className="roi-breakdown-section">
            <BreakEvenChart
              breakEvenData={calculateBreakEven(costs, benefits, 60)}
            />
          </section>
        )}

        {/* Coste por Componente ya insertado más arriba */}

        {/* Pattern Efficiency (IBM) */}
        <section id="roi-section-pattern-efficiency" className="roi-breakdown-section">
          <div className="section-header">
            <h2 className="section-title">Eficiencia por Patrones</h2>
            <Tooltip content="Cálculo de ahorro real usando la fórmula IBM: sin DS = esfuerzo×UIs; con DS = esfuerzo + import×UIs">
              <span className="section-info-icon">ℹ️</span>
            </Tooltip>
          </div>
          <PatternEfficiencySummary patterns={patterns} hourlyRate={benefits.hourlyRate} />
          <PatternEfficiencyTable patterns={patterns} onUpdate={setPatterns} />
        </section>

        {/* Benchmarks de Industria */}
        <section id="roi-section-benchmarks" className="roi-breakdown-section">
          <div className="section-header">
            <h2 className="section-title">Benchmarks de la Industria</h2>
            <Tooltip content="Comparativa frente a estudios publicados de la industria (adopción, eficiencia y ROI)">
              <span className="section-info-icon">ℹ️</span>
            </Tooltip>
          </div>
          <div className="bm-grid">
            <BenchmarkComparison
              metric="Adopción DS"
              yourValue={adoptionValue}
              unit="%"
              benchmark={industryBenchmarks.adoptionRate}
            />
            <BenchmarkComparison
              metric="Eficiencia Diseño"
              yourValue={efficiencyGainDesign}
              unit="%"
              benchmark={industryBenchmarks.designEfficiencyGain}
            />
            <BenchmarkComparison
              metric="Eficiencia Desarrollo"
              yourValue={efficiencyGainDev}
              unit="%"
              benchmark={industryBenchmarks.devEfficiencyGain}
            />
            <BenchmarkComparison
              metric="ROI (Año 3)"
              yourValue={Math.round(calculatedROI)}
              unit="%"
              benchmark={industryBenchmarks.roiYear3}
            />
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
        <section id="roi-section-costs" className="roi-breakdown-section">
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
            <section id="roi-section-benefits" className="roi-breakdown-section">
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

        {/* Break-even Point */}
        {costs && benefits && (
          <section id="roi-section-break-even" className="roi-breakdown-section">
            <BreakEvenChart
              breakEvenData={calculateBreakEven(costs, benefits, 60)}
            />
          </section>
        )}

        {/* Coste por Componente */}
        <section id="roi-section-component-cost" className="roi-breakdown-section">
          <div className="section-header">
            <h2 className="section-title">Coste por Componente</h2>
            <Tooltip content="Calcula el coste de crear y mantener cada componente del Design System">
              <span className="section-info-icon">ℹ️</span>
            </Tooltip>
          </div>
          
          {componentCostSummary && (
            <ComponentCostSummary summary={componentCostSummary} />
          )}
          
          <ComponentCostTable
            components={componentCosts}
            rates={componentRates}
            onUpdate={setComponentCosts}
          />
        </section>

        {/* Escenarios ROI */}
        <section className="roi-scenarios-wrapper">
          <ROIScenarios 
            costs={costs}
            benefits={benefits}
          />
        </section>

        {/* Comparativa With DS vs Baseline */}
        {roi && (
          <ROIComparison
            roi={roiData || roi}
            onBaselineUpdate={handleBaselineUpdate}
          />
        )}
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
