import {
  DesignMetrics,
  DevelopmentMetrics,
  ROI,
  ROICosts,
  ROIBenefits,
  Objective,
  KeyResult,
} from '../models/types.js';
import { createROI, getCurrentQuarter } from './roiCalculator.js';
import {
  createComponentAdoptionKPI,
  createDevelopmentEfficiencyKPI,
  createIssueResolutionKPI,
} from './kpiCalculator.js';

/**
 * Genera datos de ejemplo para demostración
 */

function getPastTimestamp(monthsAgo: number): number {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date.getTime();
}

export function generateSampleDesignMetrics(): DesignMetrics[] {
  const metrics: DesignMetrics[] = [];
  const baseTimestamp = Date.now();
  
  // Generar 6 meses de datos históricos
  for (let i = 5; i >= 0; i--) {
    const timestamp = getPastTimestamp(i);
    const progress = 1 - (i / 5); // De 0 a 1
    
    metrics.push({
      id: `figma-sample-${i}`,
      timestamp,
      source: 'figma',
      totalComponents: 45 + Math.floor(Math.random() * 5),
      usedComponents: Math.floor((30 + progress * 15) + Math.random() * 3),
      detachedComponents: Math.floor((5 - progress * 2) + Math.random() * 2),
      adoptionPercentage: Math.round(((65 + progress * 20) + Math.random() * 5) * 10) / 10,
      accessibilityScore: Math.round((85 + progress * 5 + Math.random() * 5) * 10) / 10, // 85-95
      accessibilityIssues: Math.floor((3 - progress * 2) + Math.random() * 2), // 0-3 issues críticos
      figmaFileKey: 'sample-file-key',
    });
  }
  
  return metrics;
}

export function generateSampleDevelopmentMetrics(): DevelopmentMetrics[] {
  const metrics: DevelopmentMetrics[] = [];
  
  // Generar 6 meses de datos históricos
  for (let i = 5; i >= 0; i--) {
    const timestamp = getPastTimestamp(i);
    const progress = 1 - (i / 5);
    
    metrics.push({
      id: `github-sample-${i}`,
      timestamp,
      source: 'github',
      dsPackageInstalls: Math.floor((15 + progress * 10) + Math.random() * 3),
      reposUsingDS: Math.floor((12 + progress * 8) + Math.random() * 2),
      customComponentsCount: Math.floor((25 - progress * 5) + Math.random() * 3),
      componentsBuiltFromScratch: Math.floor((20 - progress * 5) + Math.random() * 2),
      uiRelatedIssues: Math.floor((8 - progress * 3) + Math.random() * 2),
      resolvedIssues: Math.floor((6 - progress * 2) + Math.random() * 2),
      organization: 'sample-org',
      repos: ['repo1', 'repo2', 'repo3'],
    });
  }
  
  return metrics;
}

export function generateSampleROI(): ROI {
  const costs: Partial<ROICosts> = {
    teamSize: 3,
    averageSalary: 80000, // Annual salary in EUR
    timeMonths: 12,
    maintenanceHoursPerMonth: 40,
    maintenanceRate: 75, // Hourly rate
    toolsCost: 5000, // Annual
    infrastructureCost: 2000, // Annual
  };

  const benefits: Partial<ROIBenefits> = {
    developmentTimeSaved: 120, // Hours per month
    designTimeSaved: 60, // Hours per month
    hourlyRate: 75,
    componentReuseCount: 150,
    reuseValueMultiplier: 50, // Value per reuse
    bugsReduced: 45,
    bugFixCost: 200, // Cost per bug
    consistencyValue: 15000, // Estimated value
  };

  return createROI(costs, benefits, {
    period: getCurrentQuarter(),
    confidenceNotes: 'Datos de ejemplo para demostración. Basados en estimaciones del equipo.',
  });
}

export function generateSampleKPIs(
  designMetrics: DesignMetrics[],
  developmentMetrics: DevelopmentMetrics[]
): any[] {
  const kpis: any[] = [];
  
  const latestDesign = designMetrics[designMetrics.length - 1];
  const previousDesign = designMetrics.length > 1 ? designMetrics[designMetrics.length - 2] : undefined;
  
  const latestDev = developmentMetrics[developmentMetrics.length - 1];
  const previousDev = developmentMetrics.length > 1 ? developmentMetrics[developmentMetrics.length - 2] : undefined;
  
  if (latestDesign) {
    kpis.push(createComponentAdoptionKPI(latestDesign, previousDesign));
  }
  
  if (latestDev) {
    kpis.push(createDevelopmentEfficiencyKPI(latestDev, previousDev));
    kpis.push(createIssueResolutionKPI(latestDev, previousDev));
  }
  
  return kpis;
}

export function generateSampleOKRs(): Objective[] {
  const quarter = getCurrentQuarter();
  
  const objective1: Objective = {
    id: 'okr-sample-1',
    title: 'Incrementar la adopción del Design System',
    description: 'Mejorar el porcentaje de componentes del DS utilizados en todos los productos',
    keyResults: [
      {
        id: 'kr-1',
        title: 'Alcanzar 80% de adopción de componentes',
        description: 'Medido por el porcentaje de componentes usados vs disponibles',
        targetValue: 80,
        currentValue: 72,
        unit: '%',
        progress: 90,
      },
      {
        id: 'kr-2',
        title: 'Reducir componentes desconectados a menos de 5',
        description: 'Componentes que han sido modificados y perdido conexión con el DS',
        targetValue: 5,
        currentValue: 4,
        unit: 'componentes',
        progress: 80,
      },
      {
        id: 'kr-3',
        title: 'Implementar DS en 15 nuevos repositorios',
        description: 'Expandir el uso del DS a más proyectos',
        targetValue: 15,
        currentValue: 12,
        unit: 'repositorios',
        progress: 80,
      },
    ],
    progress: 83.3,
    quarter,
    status: 'on-track',
  };

  const objective2: Objective = {
    id: 'okr-sample-2',
    title: 'Mejorar la calidad y consistencia',
    description: 'Reducir bugs de UI y mejorar la consistencia visual',
    keyResults: [
      {
        id: 'kr-4',
        title: 'Reducir bugs de UI en un 40%',
        description: 'Comparado con el trimestre anterior',
        targetValue: 40,
        currentValue: 35,
        unit: '%',
        progress: 87.5,
      },
      {
        id: 'kr-5',
        title: 'Aumentar la resolución de issues a 85%',
        description: 'Porcentaje de issues de UI resueltos',
        targetValue: 85,
        currentValue: 78,
        unit: '%',
        progress: 91.8,
      },
    ],
    progress: 89.6,
    quarter,
    status: 'on-track',
  };

  return [objective1, objective2];
}

export function generateAllSampleData() {
  const designMetrics = generateSampleDesignMetrics();
  const developmentMetrics = generateSampleDevelopmentMetrics();
  const roi = generateSampleROI();
  const kpis = generateSampleKPIs(designMetrics, developmentMetrics);
  const okrs = generateSampleOKRs();

  return {
    designMetrics,
    developmentMetrics,
    roi,
    kpis,
    okrs,
  };
}

