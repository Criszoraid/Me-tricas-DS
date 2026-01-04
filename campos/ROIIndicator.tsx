interface ROIIndicatorProps {
  status: 'negative' | 'low' | 'medium' | 'high';
}

export function ROIIndicator({ status }: ROIIndicatorProps) {
  const config = {
    negative: {
      color: 'bg-rose-500',
      label: 'Negative',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
    },
    low: {
      color: 'bg-orange-500',
      label: 'Low',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    },
    medium: {
      color: 'bg-amber-500',
      label: 'Medium',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
    },
    high: {
      color: 'bg-emerald-500',
      label: 'High',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
    },
  };

  const { color, label, textColor, bgColor } = config[status];

  return (
    <div className={`flex items-center gap-2 ${bgColor} px-4 py-2 rounded-full`}>
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className={`text-sm font-semibold ${textColor}`}>{label} ROI</span>
    </div>
  );
}