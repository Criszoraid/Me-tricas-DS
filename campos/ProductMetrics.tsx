import { useState } from 'react';
import { FileText, Edit3, Info, Upload } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { TrendChart } from './TrendChart';

type DataSource = 'manual' | 'file';

export function ProductMetrics() {
  const [dataSource, setDataSource] = useState<DataSource>('file');
  const [isEditing, setIsEditing] = useState(false);

  const adoptionData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 61 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 73 },
  ];

  const componentUsage = [
    { component: 'Button', instances: 1247, products: 23, detached: 3 },
    { component: 'Input', instances: 892, products: 21, detached: 5 },
    { component: 'Card', instances: 734, products: 19, detached: 2 },
    { component: 'Modal', instances: 456, products: 18, detached: 8 },
    { component: 'Dropdown', instances: 389, products: 16, detached: 4 },
    { component: 'Tabs', instances: 234, products: 14, detached: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Product Metrics</h1>
          <p className="text-gray-600">Design system adoption and usage in Figma</p>
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
              File-based
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricBox
          label="Adoption Rate in Figma"
          value="73%"
          tooltip="Percentage of design files using DS components"
          source="Figma API"
          editable
        />
        <MetricBox
          label="Total Detached Instances"
          value="24"
          tooltip="Components detached from the library (potential deviations)"
          source="Figma API"
          editable
        />
        <MetricBox
          label="Consistency Score"
          value="94%"
          tooltip="Percentage of designs following DS guidelines"
          source="Manual"
          editable
        />
      </div>

      {/* Adoption Trend Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-gray-900 mb-1">Adoption Over Time</h3>
            <p className="text-sm text-gray-500">Monthly adoption rate across all products</p>
          </div>
          <Tooltip content="Calculated from the number of files using DS components divided by total design files">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <TrendChart data={adoptionData} dataKey="value" color="#3b82f6" height={280} />
      </div>

      {/* Component Usage Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-900 mb-1">Component Usage</h3>
              <p className="text-sm text-gray-500">Breakdown by component type</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-200">
              <Upload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-8 py-4 text-xs text-gray-600 font-semibold uppercase tracking-wider">Component</th>
                <th className="text-right px-8 py-4 text-xs text-gray-600 font-semibold uppercase tracking-wider">Total Instances</th>
                <th className="text-right px-8 py-4 text-xs text-gray-600 font-semibold uppercase tracking-wider">Products Using</th>
                <th className="text-right px-8 py-4 text-xs text-gray-600 font-semibold uppercase tracking-wider">Detached</th>
                <th className="text-right px-8 py-4 text-xs text-gray-600 font-semibold uppercase tracking-wider">Deviation %</th>
              </tr>
            </thead>
            <tbody>
              {componentUsage.map((item, index) => {
                const deviationRate = ((item.detached / item.instances) * 100).toFixed(1);
                const isLowDeviation = parseFloat(deviationRate) < 1;
                
                return (
                  <tr 
                    key={item.component}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-8 py-4 text-sm text-gray-900 font-semibold">{item.component}</td>
                    <td className="px-8 py-4 text-sm text-gray-900 text-right font-mono">
                      {item.instances.toLocaleString()}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-900 text-right font-mono">
                      {item.products}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-900 text-right font-mono">
                      {item.detached}
                    </td>
                    <td className={`px-8 py-4 text-sm text-right font-mono font-semibold ${
                      isLowDeviation ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {deviationRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-900 mb-6">Products by Adoption</h3>
          <div className="space-y-4">
            <ProductBar name="Analytics Dashboard" adoption={98} />
            <ProductBar name="Marketing Site" adoption={89} />
            <ProductBar name="Admin Panel" adoption={85} />
            <ProductBar name="Customer Portal" adoption={76} />
            <ProductBar name="Mobile App" adoption={62} />
            <ProductBar name="Internal Tools" adoption={45} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-gray-900 mb-6">Top Deviations</h3>
          <div className="space-y-0">
            <DeviationRow
              file="Marketing Dashboard"
              component="Custom spacing"
              instances={18}
            />
            <DeviationRow
              file="Admin Panel"
              component="Modified Button colors"
              instances={12}
            />
            <DeviationRow
              file="Customer Portal"
              component="Custom Modal sizes"
              instances={8}
            />
            <DeviationRow
              file="Analytics Dashboard"
              component="Non-standard icons"
              instances={6}
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
  editable?: boolean;
}

function MetricBox({ label, value, tooltip, source, editable }: MetricBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <span className="text-sm text-gray-600 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <Tooltip content={tooltip}>
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
          {editable && (
            <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="text-5xl text-gray-900 font-bold font-mono mb-4">{value}</div>
      <div className="text-xs text-gray-500 font-medium">Source: {source}</div>
    </div>
  );
}

interface ProductBarProps {
  name: string;
  adoption: number;
}

function ProductBar({ name, adoption }: ProductBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-900 font-medium">{name}</span>
        <span className="text-sm text-gray-600 font-mono font-semibold">{adoption}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${adoption}%` }}
        />
      </div>
    </div>
  );
}

interface DeviationRowProps {
  file: string;
  component: string;
  instances: number;
}

function DeviationRow({ file, component, instances }: DeviationRowProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-sm text-gray-900 font-semibold">{file}</div>
        <div className="text-sm text-gray-500 mt-0.5">{component}</div>
      </div>
      <div className="text-sm text-gray-900 font-mono font-semibold">{instances}</div>
    </div>
  );
}