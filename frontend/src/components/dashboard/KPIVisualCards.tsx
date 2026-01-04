import { KPI } from '../../types';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
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
  Filler,
} from 'chart.js';
import './KPIVisualCards.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KPIVisualCardsProps {
  kpis: KPI[];
}

export default function KPIVisualCards({ kpis }: KPIVisualCardsProps) {
  // Seleccionar solo los KPIs más importantes (máximo 6)
  const importantKPIs = useMemo(() => {
    const priorityOrder = [
      'component_adoption',
      'dev_efficiency',
      'issue_resolution',
    ];
    
    const sorted = [...kpis].sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.calculationMethod);
      const bIndex = priorityOrder.indexOf(b.calculationMethod);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sorted.slice(0, 6);
  }, [kpis]);

  const getStatusColor = (status: KPI['status']) => {
    const colors = {
      critical: '#dc3545',
      warning: '#fd7e14',
      good: '#0d6efd',
      excellent: '#198754',
    };
    return colors[status];
  };

  const getStatusLabel = (status: KPI['status']) => {
    const labels = {
      critical: 'Crítico',
      warning: 'Advertencia',
      good: 'Bueno',
      excellent: 'Excelente',
    };
    return labels[status];
  };

  const formatValue = (value: number, method: string) => {
    if (method.includes('percentage') || method.includes('adoption') || method.includes('efficiency') || method.includes('resolution')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('es-ES', { maximumFractionDigits: 1 });
  };

  if (importantKPIs.length === 0) {
    return (
      <div className="kpi-visual-empty">
        <p>No hay KPIs disponibles. Los KPIs se generan automáticamente al analizar métricas.</p>
      </div>
    );
  }

  return (
    <div className="kpi-visual-cards">
      {importantKPIs.map((kpi) => {
        // Crear datos para el gráfico de barras
        const chartData = {
          labels: ['Actual', 'Anterior'],
          datasets: [
            {
              label: kpi.name,
              data: [
                kpi.currentValue,
                kpi.previousValue || 0,
              ],
              backgroundColor: [
                getStatusColor(kpi.status) + '80',
                '#e9ecef',
              ],
              borderColor: [
                getStatusColor(kpi.status),
                '#dee2e6',
              ],
              borderWidth: 2,
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context: any) {
                  return formatValue(context.parsed.y, kpi.calculationMethod);
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#e9ecef',
              },
            },
          },
        };

        return (
          <div key={kpi.id} className="kpi-visual-card">
            <div className="kpi-visual-header">
              <div>
                <h3 className="kpi-visual-name">{kpi.name}</h3>
                <p className="kpi-visual-description">{kpi.description}</p>
              </div>
              <div
                className="kpi-visual-status"
                style={{ backgroundColor: getStatusColor(kpi.status) }}
              >
                {getStatusLabel(kpi.status)}
              </div>
            </div>

            <div className="kpi-visual-value">
              {formatValue(kpi.currentValue, kpi.calculationMethod)}
            </div>

            <div className="kpi-visual-chart">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {kpi.previousValue !== undefined && (
              <div className="kpi-visual-trend">
                <span className="kpi-trend-label">Anterior:</span>
                <span className="kpi-trend-value">
                  {formatValue(kpi.previousValue, kpi.calculationMethod)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

