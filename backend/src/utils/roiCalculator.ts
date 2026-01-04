import { ROI, ROICosts, ROIBenefits, ROIConfidenceLevel } from '../models/types.js';

/**
 * ROI Calculator Engine
 * 
 * Formula: ROI = (Benefits - Costs) / Costs * 100
 * 
 * Status thresholds:
 * - negative: ROI < 0
 * - low: 0 <= ROI < 50
 * - medium: 50 <= ROI < 150
 * - high: ROI >= 150
 */

export function calculateROI(costs: ROICosts, benefits: ROIBenefits): number {
  if (costs.total === 0) {
    return benefits.total > 0 ? Infinity : 0;
  }
  
  return ((benefits.total - costs.total) / costs.total) * 100;
}

export function calculateCosts(costs: Partial<ROICosts>): ROICosts {
  const teamCost = (costs.teamSize || 0) * (costs.averageSalary || 0) * ((costs.timeMonths || 0) / 12);
  const maintenanceCost = (costs.maintenanceHoursPerMonth || 0) * 12 * (costs.maintenanceRate || 0);
  const infrastructureCost = (costs.toolsCost || 0) + (costs.infrastructureCost || 0);
  
  const total = teamCost + maintenanceCost + infrastructureCost;
  
  return {
    teamSize: costs.teamSize || 0,
    averageSalary: costs.averageSalary || 0,
    timeMonths: costs.timeMonths || 0,
    maintenanceHoursPerMonth: costs.maintenanceHoursPerMonth || 0,
    maintenanceRate: costs.maintenanceRate || 0,
    toolsCost: costs.toolsCost || 0,
    infrastructureCost: costs.infrastructureCost || 0,
    total,
  };
}

export function calculateBenefits(benefits: Partial<ROIBenefits>): ROIBenefits {
  const timeSavedValue = 
    ((benefits.developmentTimeSaved || 0) + (benefits.designTimeSaved || 0)) * 
    12 * 
    (benefits.hourlyRate || 0);
  
  const reuseValue = 
    (benefits.componentReuseCount || 0) * 
    (benefits.reuseValueMultiplier || 0);
  
  const qualityValue = 
    (benefits.bugsReduced || 0) * 
    (benefits.bugFixCost || 0);
  
  const total = timeSavedValue + reuseValue + qualityValue + (benefits.consistencyValue || 0);
  
  return {
    developmentTimeSaved: benefits.developmentTimeSaved || 0,
    designTimeSaved: benefits.designTimeSaved || 0,
    hourlyRate: benefits.hourlyRate || 0,
    componentReuseCount: benefits.componentReuseCount || 0,
    reuseValueMultiplier: benefits.reuseValueMultiplier || 0,
    bugsReduced: benefits.bugsReduced || 0,
    bugFixCost: benefits.bugFixCost || 0,
    consistencyValue: benefits.consistencyValue || 0,
    total,
  };
}

export function getROIStatus(roi: number): ROI['status'] {
  if (roi < 0) return 'negative';
  if (roi < 50) return 'low';
  if (roi < 150) return 'medium';
  return 'high';
}

export function determineConfidenceLevel(
  costs: ROICosts,
  benefits: ROIBenefits
): ROIConfidenceLevel {
  // Check if we have real data or estimates
  const hasRealCosts = costs.teamSize > 0 && costs.averageSalary > 0;
  const hasRealBenefits = 
    benefits.developmentTimeSaved > 0 || 
    benefits.componentReuseCount > 0 || 
    benefits.bugsReduced > 0;
  
  if (hasRealCosts && hasRealBenefits) {
    // Check if all values are measured
    const allMeasured = 
      costs.teamSize > 0 &&
      costs.averageSalary > 0 &&
      benefits.developmentTimeSaved > 0 &&
      benefits.componentReuseCount > 0;
    
    return allMeasured ? 'measured' : 'partial';
  }
  
  return 'estimated';
}

export function createROI(
  costsInput: Partial<ROICosts>,
  benefitsInput: Partial<ROIBenefits>,
  metadata?: {
    period?: string;
    confidenceNotes?: string;
  }
): ROI {
  const costs = calculateCosts(costsInput);
  const benefits = calculateBenefits(benefitsInput);
  const roi = calculateROI(costs, benefits);
  const status = getROIStatus(roi);
  const confidenceLevel = determineConfidenceLevel(costs, benefits);
  
  return {
    id: `roi-${Date.now()}`,
    timestamp: Date.now(),
    costs,
    benefits,
    roi,
    netValue: benefits.total - costs.total,
    status,
    confidenceLevel,
    confidenceNotes: metadata?.confidenceNotes,
    period: metadata?.period || getCurrentQuarter(),
    lastUpdated: Date.now(),
  };
}

export function getCurrentQuarter(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `${year}-Q${quarter}`;
}

