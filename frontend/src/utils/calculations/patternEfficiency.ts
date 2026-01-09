/**
 * Pattern Efficiency (Fórmula IBM)
 * Calcula ahorro y eficiencia por patrón y resumen agregado.
 */

export interface Pattern {
  id: string;
  name: string;
  // Esfuerzo de creación (una vez)
  designEffort: number; // horas
  devEffort: number; // horas
  maintenanceEffort: number; // horas/año
  // Tiempo de importar/usar (cada vez)
  designImportTime: number; // horas
  devImportTime: number; // horas
  // Uso
  uisUsing: number; // cuántas UIs/productos lo usan
}

export interface PatternEfficiencyResult {
  withoutDS: number;
  withDS: number;
  hoursSaved: number;
  efficiency: number; // %
}

export interface PatternEfficiencySummary {
  totalWithoutDS: number;
  totalWithDS: number;
  totalHoursSaved: number;
  averageEfficiency: number;
  econValue: number; // horas × coste/hora
}

export function calculatePatternEfficiency(pattern: Pattern): PatternEfficiencyResult {
  const totalEffort = pattern.designEffort + pattern.devEffort + pattern.maintenanceEffort;
  const withoutDS = totalEffort * pattern.uisUsing;
  const withDS = totalEffort + ((pattern.designImportTime + pattern.devImportTime) * pattern.uisUsing);
  const hoursSaved = Math.max(0, withoutDS - withDS);
  const efficiency = withoutDS > 0 ? (hoursSaved / withoutDS) * 100 : 0;
  return { withoutDS, withDS, hoursSaved, efficiency };
}

export function summarizePatterns(
  patterns: Pattern[],
  hourlyRate: number
): PatternEfficiencySummary {
  const results = patterns.map(calculatePatternEfficiency);
  const totalWithoutDS = results.reduce((s, r) => s + r.withoutDS, 0);
  const totalWithDS = results.reduce((s, r) => s + r.withDS, 0);
  const totalHoursSaved = results.reduce((s, r) => s + r.hoursSaved, 0);
  const averageEfficiency = results.length > 0
    ? results.reduce((s, r) => s + r.efficiency, 0) / results.length
    : 0;
  const econValue = totalHoursSaved * hourlyRate;
  return { totalWithoutDS, totalWithDS, totalHoursSaved, averageEfficiency, econValue };
}



