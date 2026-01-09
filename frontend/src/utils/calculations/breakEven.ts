/**
 * Break-even Point Calculator
 * Calcula cuándo el Design System empezará a ser rentable
 */

import { ROICosts, ROIBenefits } from '../../types';

export interface BreakEvenData {
  month: number;
  label: string;
  investmentCumulative: number;
  valueCumulative: number;
  isBreakEven: boolean;
}

export interface BreakEvenResult {
  breakEvenMonth: number | null;
  isCurrentlyProfitable: boolean;
  data: BreakEvenData[];
  totalInvestment: number;
  totalValue: number;
  netValue: number;
}

/**
 * Calcula el punto de equilibrio (break-even) del Design System
 */
export function calculateBreakEven(
  costs: ROICosts,
  benefits: ROIBenefits,
  months: number = 60
): BreakEvenResult {
  // Calcular inversión mensual
  const teamCost = (costs.teamSize * costs.averageSalary * (costs.timeMonths / 12)) / costs.timeMonths;
  const maintenanceCost = (costs.maintenanceHoursPerMonth * costs.maintenanceRate);
  const infrastructureCost = (costs.toolsCost + costs.infrastructureCost) / 12;
  const monthlyInvestment = teamCost + maintenanceCost + infrastructureCost;

  // Calcular valor mensual
  const timeSavedValue = ((benefits.developmentTimeSaved + benefits.designTimeSaved) * benefits.hourlyRate);
  const reuseValue = (benefits.componentReuseCount * benefits.reuseValueMultiplier) / 12;
  const qualityValue = (benefits.bugsReduced * benefits.bugFixCost) / 12;
  const consistencyValue = benefits.consistencyValue / 12;
  
  // Valor base mensual
  const baseMonthlyValue = timeSavedValue + reuseValue + qualityValue + consistencyValue;

  // Ramp-up: primer año crece gradualmente, después valor completo
  const getMonthlyValue = (month: number) => {
    if (month <= 12) {
      // Ramp-up: 50% mes 1, 100% mes 12
      const rampFactor = 0.5 + (month / 12) * 0.5;
      return baseMonthlyValue * rampFactor;
    }
    return baseMonthlyValue;
  };

  // Calcular datos mes a mes
  let cumulativeInvestment = 0;
  let cumulativeValue = 0;
  let breakEvenMonth: number | null = null;
  const data: BreakEvenData[] = [];

  for (let month = 1; month <= months; month++) {
    cumulativeInvestment += monthlyInvestment;
    cumulativeValue += getMonthlyValue(month);

    const isBreakEven = cumulativeValue >= cumulativeInvestment && breakEvenMonth === null;
    if (isBreakEven) {
      breakEvenMonth = month;
    }

    data.push({
      month,
      label: month === 1 ? 'Mes 1' : month <= 12 ? `Mes ${month}` : `Año ${Math.ceil(month / 12)}`,
      investmentCumulative: cumulativeInvestment,
      valueCumulative: cumulativeValue,
      isBreakEven,
    });
  }

  const isCurrentlyProfitable = cumulativeValue >= cumulativeInvestment;

  return {
    breakEvenMonth,
    isCurrentlyProfitable,
    data,
    totalInvestment: cumulativeInvestment,
    totalValue: cumulativeValue,
    netValue: cumulativeValue - cumulativeInvestment,
  };
}

