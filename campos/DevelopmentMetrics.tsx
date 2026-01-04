import { useState } from 'react';
import { FileText, Edit3, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { TrendChart } from './TrendChart';

type DataSource = 'manual' | 'file';

export function DevelopmentMetrics() {
  const [dataSource, setDataSource] = useState<DataSource>('file');

  const usageTrend = [
    { month: 'Jan', dsComponents: 78, customComponents: 22 },
    { month: 'Feb', dsComponents: 82, customComponents: 18 },
    { month: 'Mar', dsComponents: 85, customComponents: 15 },
    { month: 'Apr', dsComponents: 87, customComponents: 13 },
    { month: 'May', dsComponents: 88, customComponents: 12 },
    { month: 'Jun', dsComponents: 89, customComponents: 11 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Development Metrics</h1>
          <p className="text-gray-600">Design system usage in production code</p>
        </div>

        {/* Data Source Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setDataSource('file')}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
              dataSource === 'file'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              GitHub
            </div>
          </button>
          <button
            onClick={() => setDataSource('manual')}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
              dataSource === 'manual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Manual input
            </div>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricBox
          label="DS Component Usage"
          value="89%"
          tooltip="Percentage of UI components from the design system vs custom built"
          source="GitHub"
        />
        <MetricBox
          label="UI-related Bugs"
          value="12"
          tooltip="Open bugs related to inconsistent UI implementation"
          source="Jira"
        />
        <MetricBox
          label="Avg. Implementation Time"
          value="2.3h"
          tooltip="Average time to implement a feature using DS components"
          source="Manual"
        />
        <MetricBox
          label="Bundle Size Impact"
          value="-14%"
          tooltip="Reduction in bundle size from using shared DS components"
          source="GitHub"
        />
      </div>

      {/* Usage Trend Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-gray-900 mb-1">Component Usage Over Time</h3>
            <p className="text-sm text-gray-500">DS components vs custom components</p>
          </div>
          <Tooltip content="Tracked through import analysis in the codebase">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <TrendChart 
          data={usageTrend} 
          dataKey={['dsComponents', 'customComponents']} 
          color={['#3b82f6', '#d1d5db']}
          height={280}
        />
      </div>

      {/* Implementation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-900 mb-6">Repository Breakdown</h3>
          <div className="space-y-5">
            <RepoRow name="web-app" usage={94} commits={245} />
            <RepoRow name="marketing-site" usage={88} commits={156} />
            <RepoRow name="admin-dashboard" usage={91} commits={189} />
            <RepoRow name="mobile-app" usage={76} commits={98} />
            <RepoRow name="internal-tools" usage={82} commits={67} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-0">
            <ActivityRow
              action="Added Button component"
              repo="web-app"
              time="2 hours ago"
            />
            <ActivityRow
              action="Updated Input styles"
              repo="marketing-site"
              time="5 hours ago"
            />
            <ActivityRow
              action="Fixed Modal accessibility"
              repo="admin-dashboard"
              time="1 day ago"
            />
            <ActivityRow
              action="Migrated to new Card API"
              repo="web-app"
              time="2 days ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricBoxProps {
  label: string;
  value: string;
  tooltip: string;
  source: string;
}

function MetricBox({ label, value, tooltip, source }: MetricBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-6">
        <span className="text-sm text-gray-600 font-medium">{label}</span>
        <Tooltip content={tooltip}>
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>
      <div className="text-5xl text-gray-900 font-bold font-mono mb-4">{value}</div>
      <div className="text-xs text-gray-500 font-medium">Source: {source}</div>
    </div>
  );
}

interface RepoRowProps {
  name: string;
  usage: number;
  commits: number;
}

function RepoRow({ name, usage, commits }: RepoRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-900 font-medium">{name}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-mono font-semibold">{usage}%</span>
          <span className="text-xs text-gray-500 font-medium">{commits} commits</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${usage}%` }}
        />
      </div>
    </div>
  );
}

interface ActivityRowProps {
  action: string;
  repo: string;
  time: string;
}

function ActivityRow({ action, repo, time }: ActivityRowProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-sm text-gray-900 font-semibold">{action}</div>
        <div className="text-sm text-gray-500 mt-0.5">{repo}</div>
      </div>
      <div className="text-xs text-gray-500 font-medium">{time}</div>
    </div>
  );
}