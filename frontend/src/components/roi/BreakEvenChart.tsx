import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BreakEvenResult } from '../../utils/calculations/breakEven';
import './BreakEvenChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface BreakEvenChartProps {
  breakEvenData: BreakEvenResult;
}

export default function BreakEvenChart({ breakEvenData }: BreakEvenChartProps) {
  const { breakEvenMonth, isCurrentlyProfitable, data } = breakEvenData;

  // Preparar datos para el gráfico (mostrar primeros 36 meses o hasta break-even + 12 meses)
  const maxMonths = breakEvenMonth ? Math.min(breakEvenMonth + 12, 36) : 36;
  const chartData = data.slice(0, maxMonths);

  const chartConfig = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: 'Inversión Acumulada',
        data: chartData.map(d => d.investmentCumulative),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Valor Generado Acumulado',
        data: chartData.map(d => d.valueCumulative),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toLocaleString('es-ES')}€`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${(value / 1000).toFixed(0)}k€`,
        },
        grid: {
          color: '#e9ecef',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Encontrar el punto de intersección para destacarlo
  const breakEvenPoint = chartData.find(d => d.isBreakEven);

  return (
    <div className="break-even-chart-container">
      <div className="break-even-header">
        <h3 className="break-even-title">Punto de Equilibrio</h3>
        <div className="break-even-badge">
          {isCurrentlyProfitable && breakEvenMonth ? (
            <span className="badge-profitable">
              ✅ Rentable desde el mes {breakEvenMonth}
            </span>
          ) : breakEvenMonth ? (
            <span className="badge-break-even">
              📍 Break-even en el mes {breakEvenMonth}
            </span>
          ) : (
            <span className="badge-not-profitable">
              ⚠️ No rentable en {chartData.length} meses
            </span>
          )}
        </div>
      </div>

      <div className="break-even-chart-wrapper">
        <Line data={chartConfig} options={options} />
      </div>

      {breakEvenPoint && (
        <div className="break-even-info">
          <div className="break-even-info-item">
            <span className="info-label">Mes de equilibrio:</span>
            <span className="info-value">{breakEvenPoint.month}</span>
          </div>
          <div className="break-even-info-item">
            <span className="info-label">Inversión acumulada:</span>
            <span className="info-value">{breakEvenPoint.investmentCumulative.toLocaleString('es-ES')}€</span>
          </div>
          <div className="break-even-info-item">
            <span className="info-label">Valor generado:</span>
            <span className="info-value">{breakEvenPoint.valueCumulative.toLocaleString('es-ES')}€</span>
          </div>
        </div>
      )}

      <div className="break-even-explanation">
        <p className="explanation-text">
          El punto de equilibrio muestra cuándo el valor generado por el Design System iguala o supera 
          la inversión acumulada. Durante el primer año, el valor generado aumenta gradualmente debido 
          al tiempo de adopción y aprendizaje.
        </p>
      </div>
    </div>
  );
}


