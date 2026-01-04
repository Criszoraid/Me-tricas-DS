import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DesignMetrics,
  DevelopmentMetrics,
  KPI,
  Objective,
  ROI,
} from '../models/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const METRICS_FILE = path.join(DATA_DIR, 'metrics.json');
const KPIS_FILE = path.join(DATA_DIR, 'kpis.json');
const OKRS_FILE = path.join(DATA_DIR, 'okrs.json');
const ROI_FILE = path.join(DATA_DIR, 'roi.json');

interface StorageData {
  designMetrics: DesignMetrics[];
  developmentMetrics: DevelopmentMetrics[];
  kpis: KPI[];
  okrs: Objective[];
  roi: ROI | null;
}

/**
 * In-memory storage with JSON file persistence
 * MVP implementation - can be replaced with a database later
 */
class Storage {
  private data: StorageData = {
    designMetrics: [],
    developmentMetrics: [],
    kpis: [],
    okrs: [],
    roi: null,
  };

  async initialize() {
    // Ensure data directory exists
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Load existing data
    await this.load();
  }

  async load() {
    try {
      const metricsData = await fs.readFile(METRICS_FILE, 'utf-8');
      const parsed = JSON.parse(metricsData);
      this.data.designMetrics = parsed.designMetrics || [];
      this.data.developmentMetrics = parsed.developmentMetrics || [];
    } catch (error) {
      // File doesn't exist yet, use defaults
      this.data.designMetrics = [];
      this.data.developmentMetrics = [];
    }

    try {
      const kpisData = await fs.readFile(KPIS_FILE, 'utf-8');
      this.data.kpis = JSON.parse(kpisData);
    } catch (error) {
      this.data.kpis = [];
    }

    try {
      const okrsData = await fs.readFile(OKRS_FILE, 'utf-8');
      this.data.okrs = JSON.parse(okrsData);
    } catch (error) {
      this.data.okrs = [];
    }

    try {
      const roiData = await fs.readFile(ROI_FILE, 'utf-8');
      this.data.roi = JSON.parse(roiData);
    } catch (error) {
      this.data.roi = null;
    }
  }

  async save() {
    await fs.writeFile(
      METRICS_FILE,
      JSON.stringify({
        designMetrics: this.data.designMetrics,
        developmentMetrics: this.data.developmentMetrics,
      }, null, 2)
    );

    await fs.writeFile(KPIS_FILE, JSON.stringify(this.data.kpis, null, 2));
    await fs.writeFile(OKRS_FILE, JSON.stringify(this.data.okrs, null, 2));
    
    if (this.data.roi) {
      await fs.writeFile(ROI_FILE, JSON.stringify(this.data.roi, null, 2));
    }
  }

  // Design Metrics
  getDesignMetrics(): DesignMetrics[] {
    return this.data.designMetrics;
  }

  getLatestDesignMetrics(): DesignMetrics | null {
    const sorted = [...this.data.designMetrics].sort((a, b) => b.timestamp - a.timestamp);
    return sorted[0] || null;
  }

  async addDesignMetrics(metrics: DesignMetrics): Promise<void> {
    this.data.designMetrics.push(metrics);
    await this.save();
  }

  // Development Metrics
  getDevelopmentMetrics(): DevelopmentMetrics[] {
    return this.data.developmentMetrics;
  }

  getLatestDevelopmentMetrics(): DevelopmentMetrics | null {
    const sorted = [...this.data.developmentMetrics].sort((a, b) => b.timestamp - a.timestamp);
    return sorted[0] || null;
  }

  async addDevelopmentMetrics(metrics: DevelopmentMetrics): Promise<void> {
    this.data.developmentMetrics.push(metrics);
    await this.save();
  }

  // KPIs
  getKPIs(): KPI[] {
    return this.data.kpis;
  }

  async addKPI(kpi: KPI): Promise<void> {
    // Remove old KPI with same calculation method if exists
    this.data.kpis = this.data.kpis.filter(k => k.calculationMethod !== kpi.calculationMethod);
    this.data.kpis.push(kpi);
    await this.save();
  }

  async updateKPI(kpiId: string, updates: Partial<KPI>): Promise<void> {
    const index = this.data.kpis.findIndex(k => k.id === kpiId);
    if (index !== -1) {
      this.data.kpis[index] = { ...this.data.kpis[index], ...updates };
      await this.save();
    }
  }

  // OKRs
  getOKRs(): Objective[] {
    return this.data.okrs;
  }

  async addOKR(objective: Objective): Promise<void> {
    this.data.okrs.push(objective);
    await this.save();
  }

  async updateOKR(objectiveId: string, updates: Partial<Objective>): Promise<void> {
    const index = this.data.okrs.findIndex(o => o.id === objectiveId);
    if (index !== -1) {
      this.data.okrs[index] = { ...this.data.okrs[index], ...updates };
      await this.save();
    }
  }

  // ROI
  getROI(): ROI | null {
    return this.data.roi;
  }

  async setROI(roi: ROI): Promise<void> {
    this.data.roi = roi;
    await this.save();
  }

  // Get all data for dashboard
  getAllData(): StorageData {
    return { ...this.data };
  }
}

export const storage = new Storage();

