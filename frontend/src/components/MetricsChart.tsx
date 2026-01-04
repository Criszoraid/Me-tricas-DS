import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DesignMetrics, DevelopmentMetrics } from '../types';
import './MetricsChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MetricsChartProps {
  data: DesignMetrics[] | DevelopmentMetrics[];
  type: 'design' | 'development';
  title: string;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold' as const,
      },
      bodyFont: {
        size: 12,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: '#e9ecef',
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

export default function MetricsChart({ data, type, title }: MetricsChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const labels = sortedData.map((_, index) => {
      const date = new Date(sortedData[index].timestamp);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    if (type === 'design') {
      const designData = sortedData as DesignMetrics[];
      
      return {
        labels,
        datasets: [
          {
            label: 'Componentes Totales',
            data: designData.map(d => d.totalComponents),
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Componentes Usados',
            data: designData.map(d => d.usedComponents),
            borderColor: '#198754',
            backgroundColor: 'rgba(25, 135, 84, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Adopción (%)',
            data: designData.map(d => d.adoptionPercentage),
            borderColor: '#fd7e14',
            backgroundColor: 'rgba(253, 126, 20, 0.1)',
            tension: 0.4,
            yAxisID: 'y1',
          },
        ],
      };
    } else {
      const devData = sortedData as DevelopmentMetrics[];
      
      return {
        labels,
        datasets: [
          {
            label: 'Repos usando DS',
            data: devData.map(d => d.reposUsingDS),
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Componentes Personalizados',
            data: devData.map(d => d.customComponentsCount),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Issues UI',
            data: devData.map(d => d.uiRelatedIssues),
            borderColor: '#fd7e14',
            backgroundColor: 'rgba(253, 126, 20, 0.1)',
            tension: 0.4,
          },
        ],
      };
    }
  }, [data, type]);

  if (!chartData) {
    return <div className="chart-empty">No hay datos suficientes para mostrar el gráfico</div>;
  }

  const finalOptions = type === 'design' 
    ? {
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            type: 'linear' as const,
            position: 'left' as const,
          },
          y1: {
            type: 'linear' as const,
            position: 'right' as const,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function(value: any) {
                return value + '%';
              },
            },
          },
        },
      }
    : chartOptions;

  return (
    <div className="metrics-chart">
      <h4 className="chart-title">{title}</h4>
      <div className="chart-container">
        <Line data={chartData} options={finalOptions} />
      </div>
    </div>
  );
}

