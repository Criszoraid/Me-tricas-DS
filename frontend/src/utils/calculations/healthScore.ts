/**
 * Health Score Global
 * Score compuesto (0-100) que resume la salud del DS.
 */

export interface HealthScoreWeights {
  adoption: number;      // 25%
  quality: number;       // 20%
  efficiency: number;    // 20%
  satisfaction: number;  // 15%
  governance: number;    // 20%
}

export interface HealthScoreInputs {
  adoptionRate: number;        // 0-100
  bugCount: number;            // menor es mejor
  timeSavedHours: number;      // mensual (0-200+)
  nps: number;                 // -100..100
  consistencyScore: number;    // 0-100
}

export interface HealthScoreBreakdown {
  adoption: number;
  quality: number;
  efficiency: number;
  satisfaction: number;
  governance: number;
}

export interface HealthScoreResult {
  score: number; // 0-100
  status: 'Excelente' | 'Bueno' | 'Necesita mejora' | 'Crítico';
  breakdown: HealthScoreBreakdown;
  weights: HealthScoreWeights;
}

export function normalizeScore(value: number, min: number, max: number) {
  if (max === min) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export function getHealthStatus(score: number): HealthScoreResult['status'] {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Necesita mejora';
  return 'Crítico';
}

export function calculateHealthScore(inputs: HealthScoreInputs, weights?: Partial<HealthScoreWeights>): HealthScoreResult {
  const w: HealthScoreWeights = {
    adoption: weights?.adoption ?? 0.25,
    quality: weights?.quality ?? 0.20,
    efficiency: weights?.efficiency ?? 0.20,
    satisfaction: weights?.satisfaction ?? 0.15,
    governance: weights?.governance ?? 0.20,
  };

  // Normalizaciones (heurísticas MVP; se pueden calibrar después)
  const adoption = normalizeScore(inputs.adoptionRate, 0, 100);
  const quality = normalizeScore(100 - inputs.bugCount, 50, 100); // 0 bugs ~100, 50 bugs ~50
  const efficiency = normalizeScore(inputs.timeSavedHours, 0, 200);
  const satisfaction = normalizeScore(inputs.nps, -100, 100);
  const governance = normalizeScore(inputs.consistencyScore, 0, 100);

  const breakdown: HealthScoreBreakdown = { adoption, quality, efficiency, satisfaction, governance };

  const scoreRaw =
    adoption * w.adoption +
    quality * w.quality +
    efficiency * w.efficiency +
    satisfaction * w.satisfaction +
    governance * w.governance;

  const score = Math.round(scoreRaw);
  return { score, status: getHealthStatus(score), breakdown, weights: w };
}



