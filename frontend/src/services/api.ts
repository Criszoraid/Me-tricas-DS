import axios from 'axios';
import {
  DashboardData,
  ROI,
  KPI,
  Objective,
  DesignMetrics,
  DevelopmentMetrics,
} from '../types';
import { getMockDashboardData } from '../utils/mockData';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Detectar si estamos en GitHub Pages (sin backend)
const isGitHubPages = window.location.hostname.includes('github.io') || 
                      window.location.hostname.includes('github.com');

export const api = {
  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    // En GitHub Pages, usar datos mock
    if (isGitHubPages) {
      console.log('🌐 Modo GitHub Pages: usando datos mock');
      return getMockDashboardData();
    }
    
    try {
      const response = await apiClient.get<DashboardData>('/dashboard');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error al conectar con el backend, usando datos mock:', error);
      return getMockDashboardData();
    }
  },

  // ROI
  async getROI(): Promise<{ roi: ROI | null }> {
    if (isGitHubPages) {
      const mockData = getMockDashboardData();
      return { roi: mockData.roi };
    }
    
    try {
      const response = await apiClient.get<{ roi: ROI | null }>('/roi');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error al obtener ROI, usando datos mock:', error);
      const mockData = getMockDashboardData();
      return { roi: mockData.roi };
    }
  },

  async calculateROI(data: {
    costs: Partial<ROI['costs']>;
    benefits: Partial<ROI['benefits']>;
    period?: string;
    confidenceNotes?: string;
  }): Promise<{ roi: ROI; message: string }> {
    const response = await apiClient.post<{ roi: ROI; message: string }>('/roi', data);
    return response.data;
  },

  // KPIs
  async getKPIs(): Promise<{ kpis: KPI[] }> {
    if (isGitHubPages) {
      const mockData = getMockDashboardData();
      return { kpis: mockData.kpis };
    }
    
    try {
      const response = await apiClient.get<{ kpis: KPI[] }>('/kpis');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error al obtener KPIs, usando datos mock:', error);
      const mockData = getMockDashboardData();
      return { kpis: mockData.kpis };
    }
  },

  async updateKPI(id: string, data: Partial<KPI>): Promise<{ kpi: KPI; message: string }> {
    const response = await apiClient.put<{ kpi: KPI; message: string }>(`/kpis/${id}`, data);
    return response.data;
  },

  async createKPI(data: Partial<KPI>): Promise<{ kpi: KPI; message: string }> {
    const response = await apiClient.post<{ kpi: KPI; message: string }>('/kpis', data);
    return response.data;
  },

  // OKRs
  async getOKRs(): Promise<{ okrs: Objective[] }> {
    if (isGitHubPages) {
      const mockData = getMockDashboardData();
      return { okrs: mockData.okrs };
    }
    
    try {
      const response = await apiClient.get<{ okrs: Objective[] }>('/okrs');
      return response.data;
    } catch (error) {
      console.warn('⚠️ Error al obtener OKRs, usando datos mock:', error);
      const mockData = getMockDashboardData();
      return { okrs: mockData.okrs };
    }
  },

  async createOKR(data: {
    title: string;
    description?: string;
    keyResults: Array<{
      title: string;
      description?: string;
      targetValue: number;
      currentValue?: number;
      unit?: string;
    }>;
    quarter?: string;
  }): Promise<{ objective: Objective; message: string }> {
    const response = await apiClient.post<{ objective: Objective; message: string }>('/okrs', data);
    return response.data;
  },

  async updateOKR(id: string, data: Partial<Objective>): Promise<{ objective: Objective; message: string }> {
    const response = await apiClient.put<{ objective: Objective; message: string }>(`/okrs/${id}`, data);
    return response.data;
  },

  // Figma Analysis
  async analyzeFigma(data: { fileKey?: string; fileKeys?: string[] }): Promise<{
    metrics: DesignMetrics[];
    message: string;
  }> {
    const response = await apiClient.post<{ metrics: DesignMetrics[]; message: string }>('/analyze/figma', data);
    return response.data;
  },

  // GitHub Analysis
  async analyzeGitHub(data: { organization: string; packageName?: string }): Promise<{
    metrics: DevelopmentMetrics;
    message: string;
  }> {
    const response = await apiClient.post<{ metrics: DevelopmentMetrics; message: string }>('/analyze/github', data);
    return response.data;
  },

  // Manual Metrics
  async addManualMetrics(data: {
    type: 'design' | 'development';
    data: Partial<DesignMetrics> | Partial<DevelopmentMetrics>;
  }): Promise<{ metrics: DesignMetrics | DevelopmentMetrics; message: string }> {
    const response = await apiClient.post<{ metrics: DesignMetrics | DevelopmentMetrics; message: string }>(
      '/metrics/manual',
      data
    );
    return response.data;
  },

  // File Upload
  async uploadMetricsFile(data: {
    type: 'design' | 'development';
    fileContent: string;
    fileName: string;
  }): Promise<{ metrics: DesignMetrics | DevelopmentMetrics; message: string }> {
    const response = await apiClient.post<{ metrics: DesignMetrics | DevelopmentMetrics; message: string }>(
      '/metrics/upload',
      data
    );
    return response.data;
  },

  async uploadKPIOrOKRFile(data: {
    type: 'kpi' | 'okr';
    fileContent: string;
    fileName: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/kpis-okrs/upload',
      data
    );
    return response.data;
  },
};

