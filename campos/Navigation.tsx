import { BarChart3, Package, Code, Target, TrendingUp, DollarSign } from 'lucide-react';

type Page = 'dashboard' | 'product' | 'development' | 'kpi' | 'okr' | 'roi';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: 'Overview', icon: BarChart3 },
    { id: 'product' as Page, label: 'Product Metrics', icon: Package },
    { id: 'development' as Page, label: 'Development', icon: Code },
    { id: 'kpi' as Page, label: 'KPIs', icon: Target },
    { id: 'okr' as Page, label: 'OKRs', icon: TrendingUp },
    { id: 'roi' as Page, label: 'ROI', icon: DollarSign },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-semibold">DS</span>
            </div>
            <span className="text-gray-900 font-semibold">Design System Analytics</span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}