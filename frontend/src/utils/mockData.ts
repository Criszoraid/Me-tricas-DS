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
        total: 240000, // Calculado: (80000 * 3 * 1) + (40 * 75 * 12) + 5000 + 2000
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
        total: 592500, // Calculado: (120 + 60) * 75 * 12 + 150 * 50 + 45 * 200 + 15000
      },
      roi: 247,
      status: 'high',
      netValue: 185000,
      confidenceLevel: 'estimated',
      confidenceNotes: 'Estimación basada en datos históricos',
      period: 'Q1 2024',
      lastUpdated: now,
    },
    kpis: [
      {
        id: 'kpi-1',
        name: 'Tasa de Adopción',
        description: 'Porcentaje de productos usando el Design System',
        currentValue: 73,
        previousValue: 68,
        trend: 'up',
        thresholds: { critical: 50, warning: 70, good: 85, excellent: 95 },
        status: 'good',
        sourceMetrics: ['design'],
        calculationMethod: 'adoption',
        lastUpdated: now,
      },
      {
        id: 'kpi-2',
        name: 'Eficiencia de Desarrollo',
        description: 'Reducción en tiempo de desarrollo',
        currentValue: 35,
        previousValue: 32,
        trend: 'up',
        thresholds: { critical: 20, warning: 30, good: 50, excellent: 60 },
        status: 'warning',
        sourceMetrics: ['development'],
        calculationMethod: 'efficiency',
        lastUpdated: now,
      },
      {
        id: 'kpi-3',
        name: 'Resolución de Issues',
        description: 'Tiempo promedio de resolución de bugs UI',
        currentValue: 2.5,
        previousValue: 3.2,
        trend: 'down',
        thresholds: { critical: 5, warning: 3, good: 1, excellent: 0.5 },
        status: 'warning',
        sourceMetrics: ['development'],
        calculationMethod: 'issue-resolution',
        lastUpdated: now,
      },
    ],
    okrs: [
      {
        id: 'okr-1',
        title: 'Aumentar Adopción del Design System',
        description: 'Mejorar la adopción en todos los productos',
        quarter: 'Q1 2024',
        status: 'on-track',
        keyResults: [
          {
            id: 'kr-1-1',
            title: 'Adopción en productos principales',
            description: 'Alcanzar 80% de adopción',
            targetValue: 80,
            currentValue: 73,
            unit: '%',
            progress: 91.25, // (73/80) * 100
          },
          {
            id: 'kr-1-2',
            title: 'Reducir componentes desacoplados',
            description: 'Reducir a menos de 15',
            targetValue: 15,
            currentValue: 24,
            unit: 'componentes',
            progress: 62.5, // Invertido: (15/24) * 100, pero como es "reducir", mejor usar (15/24)
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
        accessibilityIssues: Math.floor((3 - progress * 2) + Math.random() * 2),
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

