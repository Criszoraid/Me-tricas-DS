/**
 * Types for Component Cost calculations
 */

export type ComponentComplexity = 'simple' | 'medium' | 'complex' | 'very_complex';

export interface ComponentCost {
  id: string;
  name: string;
  complexity: ComponentComplexity;
  
  // Horas de creación
  designHours: number;
  devHours: number;
  qaHours: number;
  docsHours: number;
  
  // Horas de mantenimiento (mensual)
  maintenanceHours: number;
  
  // Uso (para calcular coste por uso)
  numberOfUses: number;
  
  // Calculados (se calculan automáticamente)
  totalCreationHours: number;
  totalCreationCost: number;
  monthlyCost: number;
  costPerUse: number;
}

export interface ComponentCostRates {
  design: number; // €/hora
  dev: number; // €/hora
  qa: number; // €/hora
}

export interface ComponentCostSummary {
  totalComponents: number;
  totalCreationCost: number;
  totalMonthlyCost: number;
  averageCostPerComponent: number;
  averageCostPerUse: number;
  vsIndustryBenchmark: number; // % diferencia vs benchmark
}

export const COMPLEXITY_BENCHMARKS = {
  simple: { 
    design: 4, 
    dev: 12, 
    qa: 2, 
    docs: 2, 
    maintenance: 1,
    examples: ['Button', 'Badge', 'Icon']
  },
  medium: { 
    design: 8, 
    dev: 24, 
    qa: 4, 
    docs: 4, 
    maintenance: 2,
    examples: ['Input', 'Card', 'Modal']
  },
  complex: { 
    design: 16, 
    dev: 48, 
    qa: 8, 
    docs: 8, 
    maintenance: 4,
    examples: ['Table', 'Form', 'DatePicker']
  },
  very_complex: { 
    design: 32, 
    dev: 96, 
    qa: 16, 
    docs: 12, 
    maintenance: 8,
    examples: ['DataGrid', 'RichTextEditor', 'Chart']
  },
};

export const INDUSTRY_BENCHMARK_COST_PER_COMPONENT = 4200; // € (60-80 horas × €60/h promedio)


