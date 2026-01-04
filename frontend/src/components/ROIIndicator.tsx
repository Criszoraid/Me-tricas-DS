import './ROIIndicator.css';

interface ROIIndicatorProps {
  status: 'negative' | 'low' | 'medium' | 'high';
}

export function ROIIndicator({ status }: ROIIndicatorProps) {
  const statusConfig = {
    negative: {
      dotColor: '#ef4444',
      label: 'Negative',
      textColor: '#b91c1c',
      bgColor: '#fee2e2',
    },
    low: {
      dotColor: '#f59e0b',
      label: 'Low',
      textColor: '#d97706',
      bgColor: '#fef3c7',
    },
    medium: {
      dotColor: '#f59e0b',
      label: 'Medium',
      textColor: '#d97706',
      bgColor: '#fef3c7',
    },
    high: {
      dotColor: '#10b981',
      label: 'High',
      textColor: '#047857',
      bgColor: '#d1fae5',
    },
  };

  const config = statusConfig[status];

  return (
    <div 
      className="roi-indicator"
      style={{
        backgroundColor: config.bgColor,
      }}
    >
      <div 
        className="roi-indicator-dot"
        style={{ backgroundColor: config.dotColor }}
      />
      <span className="roi-indicator-label" style={{ color: config.textColor }}>
        {config.label} ROI
      </span>
    </div>
  );
}
