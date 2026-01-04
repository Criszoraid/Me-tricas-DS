// Re-export types from backend models
export type ROIConfidenceLevel = 'estimated' | 'partial' | 'measured';
export type KPIStatus = 'critical' | 'warning' | 'good' | 'excellent';
export type MetricsSource = 'figma' | 'github' | 'manual' | 'file';

export interface DesignMetrics {
  id: string;
  timestamp: number;
  source: MetricsSource;
  totalComponents: number;
  usedComponents: number;
  detachedComponents: number;
  adoptionPercentage: number;
  accessibilityScore?: number; // 0-100
  accessibilityIssues?: number; // Número de issues críticos
  figmaFileId?: string;
  figmaFileKey?: string;
  isManual?: boolean;
  manualValues?: Partial<DesignMetrics>;
  productId?: string; // Para multiproducto
}

export interface DevelopmentMetrics {
  id: string;
  timestamp: number;
  source: MetricsSource;
  dsPackageInstalls: number;
  reposUsingDS: number;
  customComponentsCount: number;
  componentsBuiltFromScratch: number;
  uiRelatedIssues: number;
  resolvedIssues: number;
  organization?: string;
  repos?: string[];
  isManual?: boolean;
  manualValues?: Partial<DevelopmentMetrics>;
}

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
  currentValue: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  thresholds: KPIThreshold;
  status: KPIStatus;
  sourceMetrics: string[];
  calculationMethod: string;
  lastUpdated: number;
}

export interface KeyResult {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
  progress: number;
  quarter: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'complete';
}

export interface ROICosts {
  teamSize: number;
  averageSalary: number;
  timeMonths: number;
  maintenanceHoursPerMonth: number;
  maintenanceRate: number;
  toolsCost: number;
  infrastructureCost: number;
  total: number;
}

export interface ROIBenefits {
  developmentTimeSaved: number;
  designTimeSaved: number;
  hourlyRate: number;
  componentReuseCount: number;
  reuseValueMultiplier: number;
  bugsReduced: number;
  bugFixCost: number;
  consistencyValue: number;
  total: number;
}

export interface ROI {
  id: string;
  timestamp: number;
  costs: ROICosts;
  benefits: ROIBenefits;
  roi: number;
  netValue: number;
  status: 'negative' | 'low' | 'medium' | 'high';
  confidenceLevel: ROIConfidenceLevel;
  confidenceNotes?: string;
  period: string;
  lastUpdated: number;
}

export interface DashboardData {
  roi: ROI | null;
  kpis: KPI[];
  okrs: Objective[];
  designMetrics: DesignMetrics[];
  developmentMetrics: DevelopmentMetrics[];
  roiHistory: { timestamp: number; roi: number }[];
  kpiHistory: { timestamp: number; kpiId: string; value: number }[];
}

