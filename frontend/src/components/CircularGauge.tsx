import './CircularGauge.css';

interface CircularGaugeProps {
  value: number;
  maxValue?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  color?: string;
}

export function CircularGauge({
  value,
  maxValue = 100,
  size = 'medium',
  showLabel = true,
  label,
  color = '#198754',
}: CircularGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = size === 'large' ? 80 : size === 'medium' ? 60 : 40;
  const strokeWidth = size === 'large' ? 12 : size === 'medium' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    large: 'gauge-large',
    medium: 'gauge-medium',
    small: 'gauge-small',
  };

  return (
    <div className={`circular-gauge ${sizeClasses[size]}`}>
      <svg className="gauge-svg" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          className="gauge-background"
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#e9ecef"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="gauge-progress"
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="gauge-content">
        <div className="gauge-value">{Math.round(value)}</div>
        {showLabel && label && <div className="gauge-label">{label}</div>}
      </div>
    </div>
  );
}

