import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

export function KPIPage() {
  const kpis = [
    {
      name: 'Design System Adoption',
      description: 'Percentage of products actively using the design system',
      current: 73,
      target: 80,
      trend: 'up',
      change: '+6%',
      unit: '%',
    },
    {
      name: 'Component Reuse Rate',
      description: 'Ratio of DS components to custom components in production',
      current: 89,
      target: 90,
      trend: 'up',
      change: '+3%',
      unit: '%',
    },
    {
      name: 'Time to Implement',
      description: 'Average hours to build a feature using DS components',
      current: 2.3,
      target: 2.0,
      trend: 'down',
      change: '-0.2h',
      unit: 'h',
    },
    {
      name: 'Consistency Score',
      description: 'Percentage of designs following DS guidelines',
      current: 94,
      target: 90,
      trend: 'up',
      change: '+2%',
      unit: '%',
    },
    {
      name: 'Developer Satisfaction',
      description: 'NPS score from quarterly developer survey',
      current: 42,
      target: 50,
      trend: 'up',
      change: '+8',
      unit: 'NPS',
    },
    {
      name: 'Deviation Rate',
      description: 'Percentage of instances with custom overrides or detaches',
      current: 1.8,
      target: 2.0,
      trend: 'stable',
      change: '±0%',
      unit: '%',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Key Performance Indicators</h1>
        <p className="text-gray-600">Core metrics that answer: Is the design system working?</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {kpis.map((kpi) => (
          <KPICard key={kpi.name} {...kpi} />
        ))}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <h3 className="text-gray-900 mb-3">About KPIs</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          These six KPIs provide a holistic view of design system health. They measure adoption, 
          efficiency, consistency, and satisfaction — the core indicators of whether the design 
          system is delivering value to the organization.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-gray-900 font-semibold mb-1">Leading Indicators</div>
            <div className="text-gray-600">Adoption, Reuse Rate</div>
          </div>
          <div>
            <div className="text-gray-900 font-semibold mb-1">Efficiency Metrics</div>
            <div className="text-gray-600">Time to Implement, Deviation Rate</div>
          </div>
          <div>
            <div className="text-gray-900 font-semibold mb-1">Quality Metrics</div>
            <div className="text-gray-600">Consistency, Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  name: string;
  description: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  unit: string;
}

function KPICard({ name, description, current, target, trend, change, unit }: KPICardProps) {
  const progress = (current / target) * 100;
  const isOnTarget = current >= target;
  const isCloseToTarget = progress >= 90;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = 
    trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 
    trend === 'down' ? 'text-rose-700 bg-rose-50' : 
    'text-gray-700 bg-gray-50';

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-2">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Tooltip content={`Target: ${target}${unit}`}>
          <Info className="w-4 h-4 text-gray-400 ml-3" />
        </Tooltip>
      </div>

      {/* Current Value */}
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-6xl text-gray-900 font-bold font-mono">
          {current}
          <span className="text-2xl text-gray-500">{unit}</span>
        </span>
        <div className={`flex items-center gap-1 text-xs font-semibold font-mono px-3 py-1.5 rounded-full ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{change}</span>
        </div>
      </div>

      {/* Progress to Target */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Progress to target</span>
          <span className="text-xs text-gray-600 font-mono font-semibold">
            {Math.min(progress, 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isOnTarget ? 'bg-emerald-500' : 
              isCloseToTarget ? 'bg-amber-500' : 
              'bg-gray-400'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}