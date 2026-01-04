import { createContext, useContext, useState, ReactNode } from 'react';

export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | '30d' | '90d' | 'custom' | 'all';
export type DataSourceStatus = 'figma' | 'github' | 'manual' | 'file' | 'mixed';

export interface Product {
  id: string;
  name: string;
}

export interface AppState {
  selectedProducts: string[]; // Array de IDs de productos, empty = "All"
  selectedPeriod: Period;
  dataSourceStatus: DataSourceStatus;
  lastUpdated: Date | null;
}

interface AppContextType {
  state: AppState;
  setSelectedProducts: (products: string[]) => void;
  setSelectedPeriod: (period: Period) => void;
  setDataSourceStatus: (status: DataSourceStatus) => void;
  setLastUpdated: (date: Date) => void;
  products: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'all', name: 'Todos los productos' },
  { id: 'marketing-site', name: 'Marketing Site' },
  { id: 'admin-panel', name: 'Admin Panel' },
  { id: 'analytics-dashboard', name: 'Analytics Dashboard' },
  { id: 'customer-portal', name: 'Customer Portal' },
  { id: 'mobile-app', name: 'Mobile App' },
  { id: 'internal-tools', name: 'Internal Tools' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Empty = All
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all');
  const [dataSourceStatus, setDataSourceStatus] = useState<DataSourceStatus>('mixed');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  return (
    <AppContext.Provider
      value={{
        state: {
          selectedProducts,
          selectedPeriod,
          dataSourceStatus,
          lastUpdated,
        },
        setSelectedProducts,
        setSelectedPeriod,
        setDataSourceStatus,
        setLastUpdated,
        products: DEFAULT_PRODUCTS,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
