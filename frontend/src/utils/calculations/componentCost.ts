/**
 * Component Cost Calculator
 * Calcula el coste de crear y mantener componentes del Design System
 */

import { ComponentCost, ComponentCostRates, ComponentCostSummary, COMPLEXITY_BENCHMARKS, INDUSTRY_BENCHMARK_COST_PER_COMPONENT } from '../../types/componentCost';

/**
 * Calcula el coste total de un componente
 */
export function calculateComponentCost(
  component: ComponentCost,
  rates: ComponentCostRates
): ComponentCost {
  // Coste de creación
  const creationCost = 
    component.designHours * rates.design +
    component.devHours * rates.dev +
    component.qaHours * rates.qa +
    component.docsHours * rates.design; // Docs = rate diseñador

  // Coste mensual de mantenimiento
  const monthlyCost = component.maintenanceHours * ((rates.design + rates.dev) / 2);

  // Coste por uso
  const costPerUse = component.numberOfUses > 0
    ? (creationCost + (monthlyCost * 12)) / component.numberOfUses
    : 0;

  return {
    ...component,
    totalCreationHours: component.designHours + component.devHours + component.qaHours + component.docsHours,
    totalCreationCost: creationCost,
    monthlyCost,
    costPerUse,
  };
}

/**
 * Calcula el resumen de costes de todos los componentes
 */
export function calculateComponentCostSummary(
  components: ComponentCost[],
  rates: ComponentCostRates
): ComponentCostSummary {
  const calculatedComponents = components.map(c => calculateComponentCost(c, rates));
  
  const totalComponents = calculatedComponents.length;
  const totalCreationCost = calculatedComponents.reduce((sum, c) => sum + c.totalCreationCost, 0);
  const totalMonthlyCost = calculatedComponents.reduce((sum, c) => sum + c.monthlyCost, 0);
  const averageCostPerComponent = totalComponents > 0 ? totalCreationCost / totalComponents : 0;
  
  const totalUses = calculatedComponents.reduce((sum, c) => sum + c.numberOfUses, 0);
  const averageCostPerUse = totalUses > 0 
    ? (totalCreationCost + (totalMonthlyCost * 12)) / totalUses 
    : 0;

  const vsIndustryBenchmark = ((averageCostPerComponent - INDUSTRY_BENCHMARK_COST_PER_COMPONENT) / INDUSTRY_BENCHMARK_COST_PER_COMPONENT) * 100;

  return {
    totalComponents,
    totalCreationCost,
    totalMonthlyCost,
    averageCostPerComponent,
    averageCostPerUse,
    vsIndustryBenchmark,
  };
}

/**
 * Aplica benchmarks de complejidad a un componente
 */
export function applyComplexityBenchmark(
  component: ComponentCost
): ComponentCost {
  const benchmark = COMPLEXITY_BENCHMARKS[component.complexity];
  
  return {
    ...component,
    designHours: component.designHours || benchmark.design,
    devHours: component.devHours || benchmark.dev,
    qaHours: component.qaHours || benchmark.qa,
    docsHours: component.docsHours || benchmark.docs,
    maintenanceHours: component.maintenanceHours || benchmark.maintenance,
  };
}


