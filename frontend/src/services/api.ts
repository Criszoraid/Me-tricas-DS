import axios from 'axios';
import {
  DashboardData,
  ROI,
  KPI,
  Objective,
  DesignMetrics,
  DevelopmentMetrics,
} from '../types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  },

  // ROI
  async getROI(): Promise<{ roi: ROI | null }> {
    const response = await apiClient.get<{ roi: ROI | null }>('/roi');
    return response.data;
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
    const response = await apiClient.get<{ kpis: KPI[] }>('/kpis');
    return response.data;
  },

  // OKRs
  async getOKRs(): Promise<{ okrs: Objective[] }> {
    const response = await apiClient.get<{ okrs: Objective[] }>('/okrs');
    return response.data;
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
};

