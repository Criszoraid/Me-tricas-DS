import { useState } from 'react';
import { Info, Edit3 } from 'lucide-react';
import { Tooltip } from './Tooltip';

export function ROIPage() {
  const [isEditing, setIsEditing] = useState(false);

  // Cost inputs
  const costs = {
    designerSalary: 120000,
    designerFTE: 2,
    developerSalary: 140000,
    developerFTE: 1.5,
    toolsAndInfra: 15000,
    annualTotal: 0,
  };

  costs.annualTotal = 
    (costs.designerSalary * costs.designerFTE) + 
    (costs.developerSalary * costs.developerFTE) + 
    costs.toolsAndInfra;

  // Benefit inputs
  const benefits = {
    designHoursSaved: 234, // per month
    devHoursSaved: 568, // per month
    avgDesignerHourlyRate: 60,
    avgDevHourlyRate: 70,
    monthlyTotal: 0,
    annualTotal: 0,
  };

  benefits.monthlyTotal = 
    (benefits.designHoursSaved * benefits.avgDesignerHourlyRate) + 
    (benefits.devHoursSaved * benefits.avgDevHourlyRate);
  
  benefits.annualTotal = benefits.monthlyTotal * 12;

  // ROI Calculation
  const roi = ((benefits.annualTotal - costs.annualTotal) / costs.annualTotal) * 100;
  const confidenceRange = { low: roi - 15, high: roi + 15 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-neutral-900 dark:text-white mb-2">Return on Investment</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Financial impact of the design system</p>
      </div>

      {/* ROI Result */}
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wide">Current ROI</div>
            <div className="flex items-baseline gap-6">
              <span className="text-8xl font-bold text-blue-600 font-mono">{roi.toFixed(0)}%</span>
              <div className="text-sm text-gray-600 font-medium">
                Confidence range: <span className="font-semibold">{confidenceRange.low.toFixed(0)}% - {confidenceRange.high.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
          <div>
            <div className="text-sm text-gray-500 mb-2 font-medium">Annual Investment</div>
            <div className="text-4xl text-gray-900 font-bold font-mono">
              ${(costs.annualTotal / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2 font-medium">Annual Value Generated</div>
            <div className="text-4xl text-gray-900 font-bold font-mono">
              ${(benefits.annualTotal / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2 font-medium">Net Benefit</div>
            <div className="text-4xl text-emerald-600 font-bold font-mono">
              +${((benefits.annualTotal - costs.annualTotal) / 1000).toFixed(0)}k
            </div>
          </div>
        </div>
      </div>

      {/* Cost Inputs */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-gray-900">Investment Costs</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium border border-gray-200"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Save' : 'Edit values'}
          </button>
        </div>

        <div className="space-y-1">
          <InputRow
            label="Designer annual salary"
            value={costs.designerSalary}
            format="currency"
            tooltip="Average annual salary per designer on the DS team"
            editable={isEditing}
          />
          <InputRow
            label="Designer FTEs"
            value={costs.designerFTE}
            format="number"
            tooltip="Full-time equivalents dedicated to the design system"
            editable={isEditing}
          />
          <InputRow
            label="Developer annual salary"
            value={costs.developerSalary}
            format="currency"
            tooltip="Average annual salary per developer on the DS team"
            editable={isEditing}
          />
          <InputRow
            label="Developer FTEs"
            value={costs.developerFTE}
            format="number"
            tooltip="Full-time equivalents dedicated to the design system"
            editable={isEditing}
          />
          <InputRow
            label="Tools & infrastructure (annual)"
            value={costs.toolsAndInfra}
            format="currency"
            tooltip="Figma, hosting, CI/CD, and other tools"
            editable={isEditing}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-semibold">Total Annual Investment</span>
            <span className="text-4xl text-gray-900 font-bold font-mono">
              ${(costs.annualTotal / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      {/* Benefit Inputs */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-gray-900">Value Generated</h3>
        </div>

        <div className="space-y-1">
          <InputRow
            label="Design hours saved (monthly)"
            value={benefits.designHoursSaved}
            format="number"
            suffix="h"
            tooltip="Time saved by designers using the design system"
            editable={isEditing}
          />
          <InputRow
            label="Development hours saved (monthly)"
            value={benefits.devHoursSaved}
            format="number"
            suffix="h"
            tooltip="Time saved by developers using pre-built components"
            editable={isEditing}
          />
          <InputRow
            label="Average designer hourly rate"
            value={benefits.avgDesignerHourlyRate}
            format="currency"
            tooltip="Calculated from annual salary ÷ 2080 hours"
            editable={isEditing}
          />
          <InputRow
            label="Average developer hourly rate"
            value={benefits.avgDevHourlyRate}
            format="currency"
            tooltip="Calculated from annual salary ÷ 2080 hours"
            editable={isEditing}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-semibold">Monthly Value</span>
            <span className="text-2xl text-gray-900 font-bold font-mono">
              ${(benefits.monthlyTotal / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-semibold">Annual Value</span>
            <span className="text-4xl text-gray-900 font-bold font-mono">
              ${(benefits.annualTotal / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
        <h3 className="text-gray-900 mb-3">Understanding ROI</h3>
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          ROI helps decide future investment, not judge past work. This calculation provides a 
          directional understanding of value, but should be combined with qualitative benefits like 
          brand consistency, reduced decision fatigue, and improved user experience.
        </p>
        <div className="text-sm text-gray-700 font-medium">
          <strong>Confidence Range:</strong> ±15% accounts for estimation uncertainty in time 
          tracking and attribution. The true ROI likely falls within this range.
        </div>
      </div>
    </div>
  );
}

interface InputRowProps {
  label: string;
  value: number;
  format: 'currency' | 'number';
  suffix?: string;
  tooltip: string;
  editable: boolean;
}

function InputRow({ label, value, format, suffix, tooltip, editable }: InputRowProps) {
  const formattedValue = format === 'currency' 
    ? `$${value.toLocaleString()}` 
    : value.toLocaleString();

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900 font-medium">{label}</span>
        <Tooltip content={tooltip}>
          <Info className="w-4 h-4 text-gray-400" />
        </Tooltip>
      </div>
      {editable ? (
        <input
          type="text"
          defaultValue={value}
          className="w-32 px-3 py-2 text-sm text-right text-gray-900 font-mono bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-semibold"
        />
      ) : (
        <span className="text-sm text-gray-900 font-mono font-semibold">
          {formattedValue}
          {suffix && suffix}
        </span>
      )}
    </div>
  );
}