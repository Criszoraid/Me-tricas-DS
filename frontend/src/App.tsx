import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import GlobalControls from './components/GlobalControls';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/ProductPage';
import DevelopmentPage from './pages/DevelopmentPage';
import AdoptionPage from './pages/AdoptionPage';
import EfficiencyPage from './pages/EfficiencyPage';
import ROIPage from './pages/ROIPage';
import ProductMetricDetailPage from './pages/ProductMetricDetailPage';
import ComponentDetailPage from './pages/ComponentDetailPage';
import DataSourcesPage from './pages/DataSourcesPage';
import { DashboardData } from './types';
import { api } from './services/api';
import { exportToExcel, exportToPDF } from './utils/export';
import './App.css';

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando dashboard...');
      const dashboardData = await api.getDashboard();
      console.log('✅ Dashboard cargado:', dashboardData);
      setData(dashboardData);
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el dashboard';
      console.error('❌ Dashboard error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('⏹️ Loading terminado');
    }
  };

  // Siempre mostrar el dashboard, incluso si hay error o no hay datos
  const dashboardData: DashboardData = data || {
    roi: null,
    kpis: [],
    okrs: [],
    designMetrics: [],
    developmentMetrics: [],
    roiHistory: [],
    kpiHistory: [],
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  const handleRunAnalysis = () => {
    loadDashboard();
  };

  const handleExportPDF = () => {
    if (dashboardData) {
      exportToPDF(dashboardData, 'app', `metricas-ds-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const handleExportExcel = () => {
    if (dashboardData) {
      exportToExcel(dashboardData, `metricas-ds-${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  return (
    <HashRouter>
      <AppProvider>
        <div className="app">
          <GlobalControls
            onRunAnalysis={handleRunAnalysis}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
          {error && (
            <div className="app-error-banner">
              <p>⚠️ {error}</p>
              <button onClick={loadDashboard}>Reintentar</button>
            </div>
          )}
          <Routes>
          <Route 
            path="/" 
            element={<Dashboard data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route 
            path="/producto" 
            element={<ProductPage data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route 
            path="/metrics/product/:metricType" 
            element={<ProductMetricDetailPage data={dashboardData} />} 
          />
          <Route 
            path="/components/:componentName" 
            element={<ComponentDetailPage data={dashboardData} />} 
          />
          <Route 
            path="/data-sources" 
            element={<DataSourcesPage />} 
          />
          <Route 
            path="/desarrollo" 
            element={<DevelopmentPage data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route 
            path="/kpis" 
            element={<AdoptionPage data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route 
            path="/adopcion" 
            element={<AdoptionPage data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route
            path="/okrs"
            element={<EfficiencyPage data={dashboardData} onRefresh={loadDashboard} />}
          />
          <Route
            path="/eficiencia"
            element={<EfficiencyPage data={dashboardData} onRefresh={loadDashboard} />}
          />
          <Route 
            path="/roi" 
            element={<ROIPage data={dashboardData} onRefresh={loadDashboard} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AppProvider>
    </HashRouter>
  );
}

export default App;
