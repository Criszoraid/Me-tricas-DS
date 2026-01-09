import { ROI } from '../types';
import './ROIScenarios.css';

interface ROIScenariosProps {
  costs: ROI['costs'];
  benefits: ROI['benefits'];
}

export default function ROIScenarios({ costs, benefits }: ROIScenariosProps) {
  // Escenarios con variaciones
  const scenarios = {
    conservador: {
      name: 'Conservador',
      description: 'Estimación pesimista (beneficios -15%, costos +10%)',
      costMultiplier: 1.1,
      benefitMultiplier: 0.85,
      color: '#dc2626',
    },
    realista: {
      name: 'Realista',
      description: 'Estimación basada en datos actuales',
      costMultiplier: 1.0,
      benefitMultiplier: 1.0,
      color: '#3b82f6',
    },
    optimista: {
      name: 'Optimista',
      description: 'Estimación optimista (beneficios +20%, costos -5%)',
      costMultiplier: 0.95,
      benefitMultiplier: 1.2,
      color: '#059669',
    },
  };

  const calculateScenarioROI = (costMultiplier: number, benefitMultiplier: number) => {
    const scenarioCosts = costs.total * costMultiplier;
    const scenarioBenefits = benefits.total * benefitMultiplier;
    const scenarioNetValue = scenarioBenefits - scenarioCosts;
    const scenarioROI = scenarioCosts > 0 ? ((scenarioBenefits - scenarioCosts) / scenarioCosts) * 100 : 0;
    return {
      costs: scenarioCosts,
      benefits: scenarioBenefits,
      netValue: scenarioNetValue,
      roi: scenarioROI,
    };
  };

  return (
    <div className="roi-scenarios-section">
      <h2 className="scenarios-title">Escenarios de ROI</h2>
      <p className="scenarios-description">
        Comparación de diferentes escenarios basados en variaciones de costos y beneficios
      </p>
      
      <div className="scenarios-grid">
        {Object.entries(scenarios).map(([key, scenario]) => {
          const scenarioData = calculateScenarioROI(scenario.costMultiplier, scenario.benefitMultiplier);
          return (
            <div key={key} className="scenario-card">
              <div className="scenario-header">
                <h3 className="scenario-name" style={{ color: scenario.color }}>
                  {scenario.name}
                </h3>
                <div className="scenario-roi" style={{ color: scenario.color }}>
                  {scenarioData.roi.toFixed(0)}%
                </div>
              </div>
              <p className="scenario-description">{scenario.description}</p>
              
              <div className="scenario-details">
                <div className="scenario-detail-row">
                  <span className="detail-label">Costes:</span>
                  <span className="detail-value">{scenarioData.costs.toLocaleString('es-ES')}€</span>
                </div>
                <div className="scenario-detail-row">
                  <span className="detail-label">Beneficios:</span>
                  <span className="detail-value">{scenarioData.benefits.toLocaleString('es-ES')}€</span>
                </div>
                <div className="scenario-detail-row highlight">
                  <span className="detail-label">Valor Neto:</span>
                  <span className="detail-value" style={{ color: scenario.color }}>
                    {scenarioData.netValue >= 0 ? '+' : ''}
                    {scenarioData.netValue.toLocaleString('es-ES')}€
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

