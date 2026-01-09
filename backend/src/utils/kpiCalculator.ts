import { KPI, KPIStatus, KPIThreshold, DesignMetrics, DevelopmentMetrics } from '../models/types.js';

/**
 * KPI Calculator Engine
 * 
 * KPIs are derived from metrics with configurable thresholds
 */

export function calculateKPIStatus(value: number, thresholds: KPIThreshold): KPIStatus {
  if (value >= thresholds.excellent) return 'excellent';
  if (value >= thresholds.good) return 'good';
  if (value >= thresholds.warning) return 'warning';
  return 'critical';
}

export function calculateTrend(current: number, previous?: number): 'up' | 'down' | 'stable' {
  if (previous === undefined) return 'stable';
  const diff = current - previous;
  const threshold = Math.abs(previous * 0.02); // 2% threshold for "stable"
  
  if (Math.abs(diff) < threshold) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

/**
 * Component Adoption KPI
 * Calculated from Design Metrics
 */
export function createComponentAdoptionKPI(
  metrics: DesignMetrics,
  previousMetrics?: DesignMetrics,
  customThresholds?: Partial<KPIThreshold>
): KPI {
  const adoption = metrics.adoptionPercentage;
  
  const thresholds: KPIThreshold = {
    critical: customThresholds?.critical ?? 0,
    warning: customThresholds?.warning ?? 30,
    good: customThresholds?.good ?? 60,
    excellent: customThresholds?.excellent ?? 80,
  };
  
  const status = calculateKPIStatus(adoption, thresholds);
  const trend = calculateTrend(adoption, previousMetrics?.adoptionPercentage);
  
  return {
    id: `kpi-adoption-${Date.now()}`,
    name: 'Component Adoption',
    description: 'Percentage of available components being used',
    currentValue: adoption,
    previousValue: previousMetrics?.adoptionPercentage,
    trend,
    thresholds,
    status,
    sourceMetrics: [metrics.id],
    calculationMethod: 'component_adoption',
    lastUpdated: Date.now(),
  };
}

/**
 * Development Efficiency KPI
 * Calculated from Development Metrics
 */
export function createDevelopmentEfficiencyKPI(
  metrics: DevelopmentMetrics,
  previousMetrics?: DevelopmentMetrics,
  customThresholds?: Partial<KPIThreshold>
): KPI {
  // Efficiency = (repos using DS / total repos) * 100
  // Simplified: repos using DS as percentage
  const efficiency = metrics.reposUsingDS > 0 
    ? (metrics.reposUsingDS / (metrics.reposUsingDS + metrics.customComponentsCount)) * 100
    : 0;
  
  const thresholds: KPIThreshold = {
    critical: customThresholds?.critical ?? 0,
    warning: customThresholds?.warning ?? 25,
    good: customThresholds?.good ?? 50,
    excellent: customThresholds?.excellent ?? 75,
  };
  
  const status = calculateKPIStatus(efficiency, thresholds);
  const trend = calculateTrend(
    efficiency,
    previousMetrics ? 
      (previousMetrics.reposUsingDS / (previousMetrics.reposUsingDS + previousMetrics.customComponentsCount)) * 100
      : undefined
  );
  
  return {
    id: `kpi-efficiency-${Date.now()}`,
    name: 'Development Efficiency',
    description: 'Percentage of repositories using the Design System',
    currentValue: efficiency,
    previousValue: previousMetrics ? 
      (previousMetrics.reposUsingDS / (previousMetrics.reposUsingDS + previousMetrics.customComponentsCount)) * 100
      : undefined,
    trend,
    thresholds,
    status,
    sourceMetrics: [metrics.id],
    calculationMethod: 'dev_efficiency',
    lastUpdated: Date.now(),
  };
}

/**
 * Issue Resolution KPI
 */
export function createIssueResolutionKPI(
  metrics: DevelopmentMetrics,
  previousMetrics?: DevelopmentMetrics,
  customThresholds?: Partial<KPIThreshold>
): KPI {
  const resolutionRate = metrics.uiRelatedIssues > 0
    ? (metrics.resolvedIssues / metrics.uiRelatedIssues) * 100
    : 0;
  
  const thresholds: KPIThreshold = {
    critical: customThresholds?.critical ?? 0,
    warning: customThresholds?.warning ?? 50,
    good: customThresholds?.good ?? 70,
    excellent: customThresholds?.excellent ?? 90,
  };
  
  const status = calculateKPIStatus(resolutionRate, thresholds);
  const trend = calculateTrend(
    resolutionRate,
    previousMetrics && previousMetrics.uiRelatedIssues > 0
      ? (previousMetrics.resolvedIssues / previousMetrics.uiRelatedIssues) * 100
      : undefined
  );
  
  return {
    id: `kpi-issues-${Date.now()}`,
    name: 'Issue Resolution Rate',
    description: 'Percentage of UI-related issues resolved',
    currentValue: resolutionRate,
    previousValue: previousMetrics && previousMetrics.uiRelatedIssues > 0
      ? (previousMetrics.resolvedIssues / previousMetrics.uiRelatedIssues) * 100
      : undefined,
    trend,
    thresholds,
    status,
    sourceMetrics: [metrics.id],
    calculationMethod: 'issue_resolution',
    lastUpdated: Date.now(),
  };
}


