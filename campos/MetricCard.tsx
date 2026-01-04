import { ArrowUp, ArrowDown, LucideIcon, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

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

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 text-left hover:shadow-md transition-all duration-300 group border border-gray-200 shadow-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600 font-medium">{label}</span>
        </div>
        <Tooltip content={tooltip}>
          <Info className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Tooltip>
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl text-gray-900 font-bold font-mono">{value}</span>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold font-mono px-2.5 py-1 rounded-full ${
              isPositive
                ? 'text-emerald-700 bg-emerald-50'
                : isNegative
                ? 'text-rose-700 bg-rose-50'
                : 'text-gray-700 bg-gray-50'
            }`}
          >
            {isPositive && <ArrowUp className="w-3 h-3" />}
            {isNegative && <ArrowDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 font-medium">Source: {source}</div>
    </button>
  );
}