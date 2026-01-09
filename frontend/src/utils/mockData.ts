import { DashboardData } from '../types';

/**
 * Datos mock para usar cuando el backend no está disponible (GitHub Pages)
 */
export function getMockDashboardData(): DashboardData {
  const now = Date.now();
  const getPastTimestamp = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.getTime();
  };

  return {
    roi: {
      id: 'mock-roi-1',
      timestamp: now,
      costs: {
        teamSize: 3,
        averageSalary: 80000,
        timeMonths: 12,
        maintenanceHoursPerMonth: 40,
        maintenanceRate: 75,
        toolsCost: 5000,
        infrastructureCost: 2000,
      },
      benefits: {
        developmentTimeSaved: 120,
        designTimeSaved: 60,
        hourlyRate: 75,
        componentReuseCount: 150,
        reuseValueMultiplier: 50,
        bugsReduced: 45,
        bugFixCost: 200,
        consistencyValue: 15000,
      },
      roi: 247,
      status: 'high',
      netValue: 185000,
      confidenceRange: {
        low: 180,
        high: 320,
      },
      confidenceNotes: 'Estimación basada en datos históricos',
      period: 'Q1 2024',
    },
    kpis: [
      {
        id: 'kpi-1',
        name: 'Tasa de Adopción',
        description: 'Porcentaje de productos usando el Design System',
        currentValue: 73,
        previousValue: 68,
        targetValue: 80,
        unit: '%',
        trend: 'up',
        calculationMethod: 'adoption',
        thresholds: { low: 50, medium: 70, high: 85 },
      },
      {
        id: 'kpi-2',
        name: 'Eficiencia de Desarrollo',
        description: 'Reducción en tiempo de desarrollo',
        currentValue: 35,
        previousValue: 32,
        targetValue: 40,
        unit: '%',
        trend: 'up',
        calculationMethod: 'efficiency',
        thresholds: { low: 20, medium: 30, high: 50 },
      },
      {
        id: 'kpi-3',
        name: 'Resolución de Issues',
        description: 'Tiempo promedio de resolución de bugs UI',
        currentValue: 2.5,
        previousValue: 3.2,
        targetValue: 2.0,
        unit: 'días',
        trend: 'down',
        calculationMethod: 'issue-resolution',
        thresholds: { low: 5, medium: 3, high: 1 },
      },
    ],
    okrs: [
      {
        id: 'okr-1',
        title: 'Aumentar Adopción del Design System',
        description: 'Mejorar la adopción en todos los productos',
        quarter: 'Q1 2024',
        keyResults: [
          {
            id: 'kr-1-1',
            title: 'Adopción en productos principales',
            description: 'Alcanzar 80% de adopción',
            targetValue: 80,
            currentValue: 73,
            unit: '%',
          },
          {
            id: 'kr-1-2',
            title: 'Reducir componentes desacoplados',
            description: 'Reducir a menos de 15',
            targetValue: 15,
            currentValue: 24,
            unit: 'componentes',
          },
        ],
        progress: 0.65,
      },
    ],
    designMetrics: Array.from({ length: 6 }, (_, i) => {
      const timestamp = getPastTimestamp(5 - i);
      const progress = 1 - (i / 5);
      return {
        id: `design-${i}`,
        timestamp,
        source: 'figma',
        totalComponents: 45 + Math.floor(Math.random() * 5),
        usedComponents: Math.floor((30 + progress * 15) + Math.random() * 3),
        detachedComponents: Math.floor((5 - progress * 2) + Math.random() * 2),
        adoptionPercentage: Math.round(((65 + progress * 20) + Math.random() * 5) * 10) / 10,
        accessibilityScore: Math.round((85 + progress * 5 + Math.random() * 5) * 10) / 10,
        criticalAccessibilityIssues: Math.floor((3 - progress * 2) + Math.random() * 2),
        figmaFileKey: 'sample-file-key',
      };
    }),
    developmentMetrics: Array.from({ length: 6 }, (_, i) => {
      const timestamp = getPastTimestamp(5 - i);
      const progress = 1 - (i / 5);
      return {
        id: `dev-${i}`,
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
      };
    }),
    roiHistory: [],
    kpiHistory: [],
  };
}

