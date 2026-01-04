import { ArrowUp, ArrowDown, LucideIcon, Info } from 'lucide-react';
import Tooltip from './Tooltip';
import './MetricCard.css';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  tooltip: string;
  source: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  tooltip,
  source,
  onClick,
}: MetricCardProps) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  const cardContent = (
    <div className="metric-card-wrapper">
      <div className="metric-card-header-section">
        <div className="metric-card-icon-label-group">
          <div className="metric-card-icon-container">
            <Icon className="metric-card-icon" />
          </div>
          <span className="metric-card-label-text">{label}</span>
        </div>
        <Tooltip content={tooltip}>
          <Info className="metric-card-info-icon" />
        </Tooltip>
      </div>

      <div className="metric-card-value-group">
        <span className="metric-card-value-text">{value}</span>
        {change && (
          <div
            className={`metric-card-change-badge ${
              isPositive
                ? 'metric-card-change-up'
                : isNegative
                ? 'metric-card-change-down'
                : 'metric-card-change-neutral'
            }`}
          >
            {isPositive && <ArrowUp className="metric-card-change-icon" />}
            {isNegative && <ArrowDown className="metric-card-change-icon" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="metric-card-source-text">Source: {source}</div>
    </div>
  );

  if (onClick) {
    return (
      <button className="metric-card-button" onClick={onClick}>
        {cardContent}
      </button>
    );
  }

  return <div className="metric-card-container">{cardContent}</div>;
}
