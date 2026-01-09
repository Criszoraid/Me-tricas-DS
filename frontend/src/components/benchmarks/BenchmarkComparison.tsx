import './Benchmark.css';

interface Benchmark {
  low: number;
  average: number;
  high: number;
  source: string;
}

interface BenchmarkCardProps {
  metric: string;
  yourValue: number;
  unit: string;
  benchmark: Benchmark;
  inverted?: boolean; // si menor es mejor
}

export default function BenchmarkComparison({ metric, yourValue, unit, benchmark, inverted }: BenchmarkCardProps) {
  // Clasificación sencilla
  const isBetter = inverted ? yourValue < benchmark.average : yourValue > benchmark.average;
  const status = isBetter ? 'Por encima' : 'Por debajo';
  const color = isBetter ? '#059669' : '#dc2626';

  const pctVsAvg = benchmark.average !== 0
    ? inverted
      ? ((benchmark.average - yourValue) / benchmark.average) * 100
      : ((yourValue - benchmark.average) / benchmark.average) * 100
    : 0;

  return (
    <div className="bm-card">
      <div className="bm-header">
        <h4 className="bm-title">{metric}</h4>
        <div className="bm-status" style={{ color }}>{status}</div>
      </div>
      <div className="bm-values">
        <div className="bm-your">
          <div className="bm-label">Tu valor</div>
          <div className="bm-number">{yourValue}{unit}</div>
        </div>
        <div className="bm-bench">
          <div className="bm-label">Media industria</div>
          <div className="bm-number">{benchmark.average}{unit}</div>
        </div>
        <div className="bm-diff" style={{ color }}>
          {pctVsAvg >= 0 ? '▲' : '▼'} {Math.abs(pctVsAvg).toFixed(1)}%
        </div>
      </div>
      <div className="bm-foot">
        <span className="bm-source">Fuente: {benchmark.source}</span>
      </div>
    </div>
  );
}



