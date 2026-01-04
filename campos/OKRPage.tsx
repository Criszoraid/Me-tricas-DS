import { Info, Edit3 } from 'lucide-react';
import { Tooltip } from './Tooltip';

export function OKRPage() {
  const okrs = [
    {
      objective: 'Increase design system adoption across all products',
      keyResults: [
        { description: '80% of active products using the design system', current: 73, target: 80 },
        { description: 'Onboard 5 new products to the design system', current: 3, target: 5 },
        { description: 'Reduce custom component usage to below 15%', current: 11, target: 15 },
      ],
    },
    {
      objective: 'Improve developer experience and efficiency',
      keyResults: [
        { description: 'Achieve NPS score of 50+ from developer survey', current: 42, target: 50 },
        { description: 'Reduce average implementation time to 2 hours', current: 2.3, target: 2.0 },
        { description: 'Publish 10 new components based on team requests', current: 7, target: 10 },
      ],
    },
    {
      objective: 'Ensure design consistency and quality',
      keyResults: [
        { description: 'Maintain consistency score above 90%', current: 94, target: 90 },
        { description: 'Keep deviation rate below 2%', current: 1.8, target: 2.0 },
        { description: 'Complete accessibility audit for all components', current: 78, target: 100 },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Objectives & Key Results</h1>
        <p className="text-gray-600">Strategic goals and measurable outcomes for Q2 2026</p>
      </div>

      {/* OKRs */}
      <div className="space-y-5">
        {okrs.map((okr, index) => (
          <OKRCard key={index} {...okr} />
        ))}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <h3 className="text-gray-900 mb-3">About OKRs</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          OKRs define the strategic direction for the design system. Unlike KPIs (which measure 
          ongoing health), OKRs are time-bound goals that push the system forward. They answer: 
          "Where do we want to be in 3 months?"
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-gray-900 font-semibold mb-1">Objectives</div>
            <div className="text-gray-600">Qualitative goals that provide direction</div>
          </div>
          <div>
            <div className="text-gray-900 font-semibold mb-1">Key Results</div>
            <div className="text-gray-600">Measurable outcomes that indicate success</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OKRCardProps {
  objective: string;
  keyResults: Array<{
    description: string;
    current: number;
    target: number;
  }>;
}

function OKRCard({ objective, keyResults }: OKRCardProps) {
  const overallProgress = keyResults.reduce((sum, kr) => {
    const krProgress = Math.min((kr.current / kr.target) * 100, 100);
    return sum + krProgress;
  }, 0) / keyResults.length;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      {/* Objective Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-gray-900">{objective}</h3>
            <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Overall progress</span>
            <span className="text-sm text-gray-900 font-mono font-semibold px-3 py-1 bg-gray-100 rounded-lg">{overallProgress.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Key Results */}
      <div className="space-y-5">
        {keyResults.map((kr, index) => (
          <KeyResultRow key={index} {...kr} />
        ))}
      </div>
    </div>
  );
}

interface KeyResultRowProps {
  description: string;
  current: number;
  target: number;
}

function KeyResultRow({ description, current, target }: KeyResultRowProps) {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  const isOnTrack = progress >= 70;

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-900 flex-1 font-medium">{description}</p>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-600 font-mono font-semibold">
            {current} / {target}
          </span>
          <Tooltip content={`${progress.toFixed(0)}% complete`}>
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-emerald-500' : 
            isOnTrack ? 'bg-blue-600' : 
            'bg-amber-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}