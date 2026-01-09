import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './ChartCard.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export type ChartType = 'donut' | 'bar' | 'sparkline' | 'gauge';

interface ChartCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  chartType: ChartType;
  chartData?: any;
  icon?: LucideIcon;
  onClick?: () => void;
  navigateTo?: string;
  queryParams?: Record<string, string>; // Para deep linking con filtros
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}

export default function ChartCard({
  title,
  value,
  subtitle,
  chartType,
  chartData,
  icon: Icon,
  onClick,
  navigateTo,
  queryParams,
  trend,
  trendValue,
  color = '#3b82f6',
}: ChartCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      // Construir URL con query params si existen
      let url = navigateTo;
      if (queryParams && Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams(queryParams);
        url += `?${params.toString()}`;
      }
      navigate(url);
    } else if (onClick) {
      onClick();
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    switch (chartType) {
      case 'donut':
        return (
          <div className="chart-card-mini-donut">
            <Doughnut
              data={chartData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        );

      case 'bar':
        return (
          <div className="chart-card-mini-bar">
            <Bar
              data={chartData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        );

      case 'sparkline':
        return (
          <div className="chart-card-mini-sparkline">
            <Line
              data={chartData}
              options={{
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: false },
                },
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`chart-card ${navigateTo || onClick ? 'chart-card-clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="chart-card-header">
        {Icon && (
          <div className="chart-card-icon" style={{ color }}>
            <Icon size={20} />
          </div>
        )}
        <div className="chart-card-title-group">
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="chart-card-content">
        <div className="chart-card-value-section">
          <div className="chart-card-value">{value}</div>
          {trend && trendValue && (
            <div className={`chart-card-trend chart-card-trend-${trend}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </div>
          )}
        </div>
        {chartData && <div className="chart-card-chart">{renderChart()}</div>}
      </div>
    </div>
  );
}
