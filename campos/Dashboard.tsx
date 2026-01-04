import { ArrowUp, ArrowDown, TrendingUp, Package, Clock, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ROIIndicator } from './ROIIndicator';
import { TrendChart } from './TrendChart';

type Page = 'dashboard' | 'product' | 'development' | 'kpi' | 'okr' | 'roi';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const adoptionTrend = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 73 },
  ];

  const timeSavedTrend = [
    { month: 'Jan', design: 120, dev: 340 },
    { month: 'Feb', design: 145, dev: 380 },
    { month: 'Mar', design: 168, dev: 420 },
    { month: 'Apr', design: 182, dev: 465 },
    { month: 'May', design: 205, dev: 510 },
    { month: 'Jun', design: 234, dev: 568 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Design System Performance</h1>
        <p className="text-gray-600">Overview of key metrics and return on investment</p>
      </div>

      {/* Primary ROI Metric */}
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-3 font-medium uppercase tracking-wide">Return on Investment</div>
            <div className="flex items-baseline gap-6">
              <span className="text-8xl font-bold text-blue-600 font-mono">247%</span>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                <ArrowUp className="w-5 h-5" />
                <span className="text-sm font-semibold font-mono">+12% vs Q1</span>
              </div>
            </div>
          </div>
          <ROIIndicator status="high" />
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            For every $1 invested in the design system, we gain $2.47 in value through time savings, reduced errors, and improved consistency.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Adoption Rate"
          value="73%"
          change="+6%"
          trend="up"
          icon={Package}
          tooltip="Percentage of products using the design system"
          source="Figma"
          onClick={() => onNavigate('product')}
        />
        <MetricCard
          label="Component Reuse"
          value="89%"
          change="+3%"
          trend="up"
          icon={TrendingUp}
          tooltip="Percentage of UI built with DS components vs custom"
          source="GitHub"
          onClick={() => onNavigate('development')}
        />
        <MetricCard
          label="Time Saved (monthly)"
          value="802h"
          change="+58h"
          trend="up"
          icon={Clock}
          tooltip="Combined design and development time saved"
          source="Manual"
          onClick={() => onNavigate('kpi')}
        />
        <MetricCard
          label="Deviations"
          value="24"
          change="-8"
          trend="down"
          icon={AlertTriangle}
          tooltip="Detached instances and custom overrides"
          source="Figma"
          onClick={() => onNavigate('product')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">Adoption Trend</h3>
            <p className="text-sm text-gray-500">Design system adoption over time</p>
          </div>
          <TrendChart data={adoptionTrend} dataKey="value" color="#3b82f6" height={240} />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">Time Saved</h3>
            <p className="text-sm text-gray-500">Hours saved per month (Design + Dev)</p>
          </div>
          <TrendChart 
            data={timeSavedTrend} 
            dataKey={['design', 'dev']} 
            color={['#a78bfa', '#3b82f6']}
            height={240}
            stacked
          />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-gray-900 mb-6">Key Insights</h3>
        <div className="space-y-4">
          <InsightRow
            label="Highest impact component"
            value="Button"
            detail="Used 1,247 times across 23 products"
          />
          <InsightRow
            label="Most common deviation"
            value="Custom spacing"
            detail="18 instances in Marketing Dashboard"
          />
          <InsightRow
            label="Consistency score"
            value="94%"
            detail="Above target of 90%"
          />
        </div>
      </div>
    </div>
  );
}

interface InsightRowProps {
  label: string;
  value: string;
  detail: string;
}

function InsightRow({ label, value, detail }: InsightRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-base text-gray-900 font-semibold mt-1">{value}</div>
      </div>
      <div className="text-sm text-gray-500">{detail}</div>
    </div>
  );
}