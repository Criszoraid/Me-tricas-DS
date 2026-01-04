/**
 * Core Data Models
 * 
 * Distinción clave:
 * - Metrics: Datos crudos, informan pero no deciden
 * - KPIs: Indicadores derivados de métricas con umbrales
 * - OKRs: Objetivos y resultados clave, sin impacto automático en ROI
 * - ROI: Cálculo de retorno de inversión
 */

// ============================================================================
// METRICS - Datos Crudos
// ============================================================================

export interface DesignMetrics {
  id: string;
  timestamp: number;
  source: 'figma' | 'manual' | 'file';
  
  // Component Usage
  totalComponents: number;
  usedComponents: number;
  detachedComponents: number;
  
  // Adoption
  adoptionPercentage: number;
  
  // Accessibility (NUEVO)
  accessibilityScore?: number; // 0-100
  accessibilityIssues?: number; // Número de issues críticos
  
  // File metadata
  figmaFileId?: string;
  figmaFileKey?: string;
  
  // Manual overrides
  isManual?: boolean;
  manualValues?: Partial<DesignMetrics>;
  
  // Multiproducto
  productId?: string;
}

export interface DevelopmentMetrics {
  id: string;
  timestamp: number;
  source: 'github' | 'manual' | 'file';
  
  // Package Usage
  dsPackageInstalls: number;
  reposUsingDS: number;
  
  // Custom Components
  customComponentsCount: number;
  componentsBuiltFromScratch: number;
  
  // Issues
  uiRelatedIssues: number;
  resolvedIssues: number;
  
  // GitHub metadata
  organization?: string;
  repos?: string[];
  
  // Manual overrides
  isManual?: boolean;
  manualValues?: Partial<DevelopmentMetrics>;
}

export type MetricsSource = 'figma' | 'github' | 'manual' | 'file';

// ============================================================================
// KPIs - Indicadores Clave de Desempeño
// ============================================================================

export type KPIStatus = 'critical' | 'warning' | 'good' | 'excellent';

export interface KPIThreshold {
  critical: number;
  warning: number;
  good: number;
  excellent: number;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  
  // Current value and trend
  currentValue: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  
  // Thresholds for status calculation
  thresholds: KPIThreshold;
  status: KPIStatus;
  
  // Source metrics (which metrics inform this KPI)
  sourceMetrics: string[];
  
  // Calculation function (stored as reference)
  calculationMethod: string;
  
  lastUpdated: number;
}

// Common KPIs
export interface ComponentAdoptionKPI extends KPI {
  calculationMethod: 'component_adoption';
  sourceMetrics: ['designMetrics'];
}

export interface DevelopmentEfficiencyKPI extends KPI {
  calculationMethod: 'dev_efficiency';
  sourceMetrics: ['developmentMetrics'];
}

// ============================================================================
// OKRs - Objetivos y Resultados Clave
// ============================================================================

export interface KeyResult {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
  progress: number; // Average of key results
  quarter: string; // e.g., "2024-Q1"
  status: 'on-track' | 'at-risk' | 'behind' | 'complete';
}

// ============================================================================
// ROI - Retorno de Inversión
// ============================================================================

export type ROIConfidenceLevel = 'estimated' | 'partial' | 'measured';

export interface ROICosts {
  // People costs
  teamSize: number;
  averageSalary: number; // Annual
  timeMonths: number;
  
  // Maintenance costs
  maintenanceHoursPerMonth: number;
  maintenanceRate: number; // Hourly rate
  
  // Infrastructure
  toolsCost: number; // Annual
  infrastructureCost: number; // Annual
  
  // Total calculated
  total: number;
}

export interface ROIBenefits {
  // Time saved
  developmentTimeSaved: number; // Hours per month
  designTimeSaved: number; // Hours per month
  hourlyRate: number;
  
  // Reuse
  componentReuseCount: number;
  reuseValueMultiplier: number;
  
  // Quality
  bugsReduced: number;
  bugFixCost: number; // Per bug
  
  // Consistency
  consistencyValue: number; // Estimated value
  
  // Total calculated
  total: number;
}

export interface ROI {
  id: string;
  timestamp: number;
  
  costs: ROICosts;
  benefits: ROIBenefits;
  
  // ROI Calculation
  roi: number; // Percentage: (benefits - costs) / costs * 100
  netValue: number; // benefits - costs
  
  // Status
  status: 'negative' | 'low' | 'medium' | 'high';
  
  // Confidence
  confidenceLevel: ROIConfidenceLevel;
  confidenceNotes?: string;
  
  // Metadata
  period: string; // e.g., "2024-Q1"
  lastUpdated: number;
}

// ============================================================================
// Dashboard Aggregated Data
// ============================================================================

export interface DashboardData {
  roi: ROI;
  kpis: KPI[];
  okrs: Objective[];
  designMetrics: DesignMetrics[];
  developmentMetrics: DevelopmentMetrics[];
  
  // Trends (last 6 months)
  roiHistory: { timestamp: number; roi: number }[];
  kpiHistory: { timestamp: number; kpiId: string; value: number }[];
}

