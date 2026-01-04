import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface TrendChartProps {
  data: Array<{ month: string; [key: string]: any }>;
  dataKey: string | string[];
  color: string | string[];
  height?: number;
  stacked?: boolean;
}

export function TrendChart({ data, dataKey, color, height = 240, stacked = false }: TrendChartProps) {
  const isMultiple = Array.isArray(dataKey);
  const colors = Array.isArray(color) ? color : [color];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: isMultiple,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        stacked: stacked,
      },
      y: {
        ...chartOptions.scales.y,
        stacked: stacked,
      },
    },
  };

  if (isMultiple) {
    const datasets = dataKey.map((key, index) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      data: data.map(d => d[key]),
      backgroundColor: colors[index] || colors[0],
    }));

    return (
      <div style={{ height: `${height}px` }}>
        <Bar
          data={{
            labels: data.map(d => d.month),
            datasets,
          }}
          options={barOptions}
        />
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }}>
      <Line
        data={{
          labels: data.map(d => d.month),
          datasets: [{
            label: String(dataKey),
            data: data.map(d => d[dataKey as string]),
            borderColor: colors[0],
            backgroundColor: `${colors[0]}1a`, // Add alpha for fill
            fill: true,
            tension: 0.4,
          }],
        }}
        options={chartOptions}
      />
    </div>
  );
}

