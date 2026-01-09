import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { storage } from './utils/storage.js';
import { FigmaService } from './services/figmaService.js';
import { GitHubService } from './services/githubService.js';
import {
  createComponentAdoptionKPI,
  createDevelopmentEfficiencyKPI,
  createIssueResolutionKPI,
} from './utils/kpiCalculator.js';
import { createROI, getCurrentQuarter } from './utils/roiCalculator.js';
import {
  DesignMetrics,
  DevelopmentMetrics,
  ROI,
  Objective,
  KeyResult,
  KPI,
} from './models/types.js';
import { generateAllSampleData } from './utils/sampleData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize storage and load sample data
async function initializeApp() {
  try {
    await storage.initialize();
    console.log('✅ Storage inicializado');

    // Load sample data on first run if no data exists
    const initialData = storage.getAllData();
    if (initialData.designMetrics.length === 0 && initialData.developmentMetrics.length === 0) {
      console.log('📊 Cargando datos de ejemplo...');
      const sampleData = generateAllSampleData();
      
      // Save sample data to storage
      for (const metric of sampleData.designMetrics) {
        await storage.addDesignMetrics(metric);
      }
      for (const metric of sampleData.developmentMetrics) {
        await storage.addDevelopmentMetrics(metric);
      }
      await storage.setROI(sampleData.roi);
      for (const kpi of sampleData.kpis) {
        await storage.addKPI(kpi);
      }
      for (const okr of sampleData.okrs) {
        await storage.addOKR(okr);
      }
      console.log('✅ Datos de ejemplo cargados');
    } else {
      console.log('📊 Datos existentes encontrados');
    }
  } catch (error: any) {
    console.error('❌ Error inicializando aplicación:', error);
    console.error('Stack:', error.stack);
    // Continue anyway - the app should still work
  }
}

// Initialize before starting server
await initializeApp();

// ============================================================================
// FIGMA ANALYSIS
// ============================================================================

app.post('/api/analyze/figma', async (req, res) => {
  try {
    const { fileKey, fileKeys } = req.body;

    if (!process.env.FIGMA_ACCESS_TOKEN) {
      return res.status(400).json({ error: 'FIGMA_ACCESS_TOKEN not configured' });
    }

    const figmaService = new FigmaService(process.env.FIGMA_ACCESS_TOKEN);

    let metrics: DesignMetrics[];
    
    if (fileKeys && Array.isArray(fileKeys)) {
      metrics = await figmaService.analyzeFiles(fileKeys);
    } else if (fileKey) {
      const result = await figmaService.analyzeFile(fileKey);
      metrics = [result];
    } else {
      return res.status(400).json({ error: 'fileKey or fileKeys required' });
    }

    // Save metrics
    for (const metric of metrics) {
      await storage.addDesignMetrics(metric);
    }

    // Recalculate KPIs
    const latestMetrics = storage.getLatestDesignMetrics();
    if (latestMetrics) {
      const previousMetrics = storage.getDesignMetrics()
        .filter(m => m.id !== latestMetrics.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      const kpi = createComponentAdoptionKPI(latestMetrics, previousMetrics);
      await storage.addKPI(kpi);
    }

    res.json({ metrics, message: 'Figma analysis completed' });
  } catch (error: any) {
    console.error('Figma analysis error:', error);
    res.status(500).json({ error: error.message || 'Figma analysis failed' });
  }
});

// ============================================================================
// GITHUB ANALYSIS
// ============================================================================

app.post('/api/analyze/github', async (req, res) => {
  try {
    const { organization, packageName } = req.body;

    if (!organization) {
      return res.status(400).json({ error: 'organization required' });
    }

    if (!process.env.GITHUB_TOKEN) {
      return res.status(400).json({ error: 'GITHUB_TOKEN not configured' });
    }

    const githubService = new GitHubService(process.env.GITHUB_TOKEN);
    const metrics = await githubService.analyzeOrganization(
      organization,
      packageName || 'design-system'
    );

    await storage.addDevelopmentMetrics(metrics);

    // Recalculate KPIs
    const previousMetrics = storage.getDevelopmentMetrics()
      .filter(m => m.id !== metrics.id)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    const efficiencyKPI = createDevelopmentEfficiencyKPI(metrics, previousMetrics);
    const issuesKPI = createIssueResolutionKPI(metrics, previousMetrics);
    
    await storage.addKPI(efficiencyKPI);
    await storage.addKPI(issuesKPI);

    res.json({ metrics, message: 'GitHub analysis completed' });
  } catch (error: any) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ error: error.message || 'GitHub analysis failed' });
  }
});

// ============================================================================
// FILE UPLOAD
// ============================================================================

import { parseJSON, parseCSV, parseDesignMetrics, parseDevelopmentMetrics } from './utils/fileParser.js';

app.post('/api/metrics/upload', async (req, res) => {
  try {
    const { type, fileContent, fileName } = req.body;

    if (!type || !fileContent) {
      return res.status(400).json({ error: 'type and fileContent are required' });
    }

    if (type !== 'design' && type !== 'development') {
      return res.status(400).json({ error: 'type must be "design" or "development"' });
    }

    // Determine file type from content or filename
    const isJSON = fileName?.endsWith('.json') || fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[');
    const isCSV = fileName?.endsWith('.csv') || (!isJSON && fileContent.includes(','));

    let parsedData: any;
    
    try {
      if (isJSON) {
        parsedData = parseJSON(fileContent);
      } else if (isCSV) {
        parsedData = parseCSV(fileContent);
      } else {
        return res.status(400).json({ error: 'Unsupported file format. Use JSON or CSV' });
      }
    } catch (parseError: any) {
      return res.status(400).json({ error: `Parse error: ${parseError.message}` });
    }

    // Parse metrics based on type
    let metricsData: any;
    
    if (type === 'design') {
      metricsData = parseDesignMetrics(parsedData);
      
      // Calculate adoption percentage if not provided
      if (!metricsData.adoptionPercentage && metricsData.totalComponents && metricsData.usedComponents) {
        metricsData.adoptionPercentage = (metricsData.usedComponents / metricsData.totalComponents) * 100;
      }

      const metrics: DesignMetrics = {
        id: `file-design-${Date.now()}`,
        timestamp: Date.now(),
        source: 'file',
        isManual: false,
        totalComponents: metricsData.totalComponents || 0,
        usedComponents: metricsData.usedComponents || 0,
        detachedComponents: metricsData.detachedComponents || 0,
        adoptionPercentage: metricsData.adoptionPercentage || 0,
        figmaFileKey: metricsData.figmaFileKey,
      };

      await storage.addDesignMetrics(metrics);

      // Recalculate KPIs
      const previousMetrics = storage.getDesignMetrics()
        .filter(m => m.id !== metrics.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      const kpi = createComponentAdoptionKPI(metrics, previousMetrics);
      await storage.addKPI(kpi);

      res.json({ metrics, message: 'Métricas de diseño importadas desde archivo' });
    } else {
      metricsData = parseDevelopmentMetrics(parsedData);

      const metrics: DevelopmentMetrics = {
        id: `file-dev-${Date.now()}`,
        timestamp: Date.now(),
        source: 'file',
        isManual: false,
        dsPackageInstalls: metricsData.dsPackageInstalls || 0,
        reposUsingDS: metricsData.reposUsingDS || 0,
        customComponentsCount: metricsData.customComponentsCount || 0,
        componentsBuiltFromScratch: metricsData.componentsBuiltFromScratch || 0,
        uiRelatedIssues: metricsData.uiRelatedIssues || 0,
        resolvedIssues: metricsData.resolvedIssues || 0,
        organization: metricsData.organization,
      };

      await storage.addDevelopmentMetrics(metrics);

      // Recalculate KPIs
      const previousMetrics = storage.getDevelopmentMetrics()
        .filter(m => m.id !== metrics.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      const efficiencyKPI = createDevelopmentEfficiencyKPI(metrics, previousMetrics);
      const issuesKPI = createIssueResolutionKPI(metrics, previousMetrics);
      
      await storage.addKPI(efficiencyKPI);
      await storage.addKPI(issuesKPI);

      res.json({ metrics, message: 'Métricas de desarrollo importadas desde archivo' });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

// ============================================================================
// MANUAL METRICS
// ============================================================================

app.post('/api/metrics/manual', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'design') {
      const metrics: DesignMetrics = {
        id: `manual-design-${Date.now()}`,
        timestamp: Date.now(),
        source: 'manual',
        isManual: true,
        totalComponents: data.totalComponents || 0,
        usedComponents: data.usedComponents || 0,
        detachedComponents: data.detachedComponents || 0,
        adoptionPercentage: data.adoptionPercentage || 0,
        manualValues: data,
      };

      await storage.addDesignMetrics(metrics);

      // Recalculate KPIs
      const previousMetrics = storage.getDesignMetrics()
        .filter(m => m.id !== metrics.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      const kpi = createComponentAdoptionKPI(metrics, previousMetrics);
      await storage.addKPI(kpi);

      res.json({ metrics, message: 'Métricas de diseño guardadas' });
    } else if (type === 'development') {
      const metrics: DevelopmentMetrics = {
        id: `manual-dev-${Date.now()}`,
        timestamp: Date.now(),
        source: 'manual',
        isManual: true,
        dsPackageInstalls: data.dsPackageInstalls || 0,
        reposUsingDS: data.reposUsingDS || 0,
        customComponentsCount: data.customComponentsCount || 0,
        componentsBuiltFromScratch: data.componentsBuiltFromScratch || 0,
        uiRelatedIssues: data.uiRelatedIssues || 0,
        resolvedIssues: data.resolvedIssues || 0,
        manualValues: data,
      };

      await storage.addDevelopmentMetrics(metrics);

      // Recalculate KPIs
      const previousMetrics = storage.getDevelopmentMetrics()
        .filter(m => m.id !== metrics.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      const efficiencyKPI = createDevelopmentEfficiencyKPI(metrics, previousMetrics);
      const issuesKPI = createIssueResolutionKPI(metrics, previousMetrics);
      
      await storage.addKPI(efficiencyKPI);
      await storage.addKPI(issuesKPI);

      res.json({ metrics, message: 'Métricas de desarrollo guardadas' });
    } else {
      res.status(400).json({ error: 'Invalid type. Use "design" or "development"' });
    }
  } catch (error: any) {
    console.error('Manual metrics error:', error);
    res.status(500).json({ error: error.message || 'Failed to save metrics' });
  }
});

// ============================================================================
// DASHBOARD
// ============================================================================

app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('📊 Solicitud de dashboard recibida');
    
    // Always use sample data for now to ensure dashboard works
    const useSampleData = true;
    
    let responseData;

    if (useSampleData) {
      console.log('📊 Generando datos de ejemplo...');
      // Generate sample data for demonstration
      const sampleData = generateAllSampleData();
      
      // Get ROI history from sample data
      const roiHistory = sampleData.designMetrics.map((_, index) => ({
        timestamp: sampleData.designMetrics[index].timestamp,
        roi: sampleData.roi.roi + (Math.random() * 10 - 5), // Add some variation
      }));

      // Get KPI history
      const kpiHistory = sampleData.kpis.map(kpi => ({
        timestamp: kpi.lastUpdated,
        kpiId: kpi.id,
        value: kpi.currentValue,
      }));

      responseData = {
        roi: sampleData.roi,
        kpis: sampleData.kpis,
        okrs: sampleData.okrs,
        designMetrics: sampleData.designMetrics,
        developmentMetrics: sampleData.developmentMetrics,
        roiHistory,
        kpiHistory,
      };
      
      console.log('✅ Datos de ejemplo generados:', {
        designMetrics: responseData.designMetrics.length,
        developmentMetrics: responseData.developmentMetrics.length,
        kpis: responseData.kpis.length,
        okrs: responseData.okrs.length,
        hasROI: !!responseData.roi,
      });
    } else {
      console.log('📊 Usando datos reales...');
      const data = storage.getAllData();
      
      // Use real data
      const roiHistory = data.roi ? [{
        timestamp: data.roi.timestamp,
        roi: data.roi.roi,
      }] : [];

      const kpiHistory = data.kpis.map(kpi => ({
        timestamp: kpi.lastUpdated,
        kpiId: kpi.id,
        value: kpi.currentValue,
      }));

      responseData = {
        roi: data.roi,
        kpis: data.kpis,
        okrs: data.okrs,
        designMetrics: data.designMetrics.slice(-10),
        developmentMetrics: data.developmentMetrics.slice(-10),
        roiHistory,
        kpiHistory,
      };
    }

    console.log('✅ Enviando respuesta del dashboard');
    res.json(responseData);
  } catch (error: any) {
    console.error('❌ Dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch dashboard data',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ============================================================================
// ROI
// ============================================================================

app.get('/api/roi', async (req, res) => {
  try {
    const roi = storage.getROI();
    res.json({ roi });
  } catch (error: any) {
    console.error('ROI error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch ROI' });
  }
});

app.post('/api/roi', async (req, res) => {
  try {
    const { costs, benefits, period, confidenceNotes } = req.body;

    const roi = createROI(costs, benefits, { period, confidenceNotes });
    await storage.setROI(roi);

    res.json({ roi, message: 'ROI calculated and saved' });
  } catch (error: any) {
    console.error('ROI calculation error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate ROI' });
  }
});

// ============================================================================
// KPIs
// ============================================================================

app.get('/api/kpis', async (req, res) => {
  try {
    const kpis = storage.getKPIs();
    res.json({ kpis });
  } catch (error: any) {
    console.error('KPIs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch KPIs' });
  }
});

app.post('/api/kpis', async (req, res) => {
  try {
    const { name, description, currentValue, previousValue, trend, thresholds, calculationMethod } = req.body;

    const kpi: KPI = {
      id: `kpi-manual-${Date.now()}`,
      name: name || 'KPI Manual',
      description: description || '',
      currentValue: currentValue || 0,
      previousValue: previousValue || 0,
      trend: trend || 'stable',
      thresholds: thresholds || {
        critical: 0,
        warning: 50,
        good: 70,
        excellent: 90,
      },
      status: 'unknown',
      sourceMetrics: [],
      calculationMethod: calculationMethod || 'manual',
      lastUpdated: Date.now(),
    };

    // Determine status based on current value and thresholds
    if (kpi.currentValue >= kpi.thresholds.excellent) {
      kpi.status = 'excellent';
    } else if (kpi.currentValue >= kpi.thresholds.good) {
      kpi.status = 'good';
    } else if (kpi.currentValue >= kpi.thresholds.warning) {
      kpi.status = 'warning';
    } else {
      kpi.status = 'critical';
    }

    await storage.addKPI(kpi);

    res.json({ kpi, message: 'KPI creado manualmente' });
  } catch (error: any) {
    console.error('KPI creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create KPI' });
  }
});

app.put('/api/kpis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Update status if value or thresholds changed
    if (updates.currentValue !== undefined || updates.thresholds) {
      const currentValue = updates.currentValue !== undefined 
        ? updates.currentValue 
        : storage.getKPIs().find(k => k.id === id)?.currentValue || 0;
      const thresholds = updates.thresholds || storage.getKPIs().find(k => k.id === id)?.thresholds || {
        critical: 0,
        warning: 50,
        good: 70,
        excellent: 90,
      };

      if (currentValue >= thresholds.excellent) {
        updates.status = 'excellent';
      } else if (currentValue >= thresholds.good) {
        updates.status = 'good';
      } else if (currentValue >= thresholds.warning) {
        updates.status = 'warning';
      } else {
        updates.status = 'critical';
      }
    }

    updates.lastUpdated = Date.now();

    await storage.updateKPI(id, updates);
    const kpis = storage.getKPIs();
    const updated = kpis.find(k => k.id === id);

    res.json({ kpi: updated, message: 'KPI actualizado' });
  } catch (error: any) {
    console.error('KPI update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update KPI' });
  }
});

// ============================================================================
// OKRs
// ============================================================================

app.get('/api/okrs', async (req, res) => {
  try {
    const okrs = storage.getOKRs();
    res.json({ okrs });
  } catch (error: any) {
    console.error('OKRs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch OKRs' });
  }
});

app.post('/api/okrs', async (req, res) => {
  try {
    const { title, description, keyResults, quarter } = req.body;

    const krObjects: KeyResult[] = keyResults.map((kr: any) => ({
      id: `kr-${Date.now()}-${Math.random()}`,
      title: kr.title,
      description: kr.description || '',
      targetValue: kr.targetValue,
      currentValue: kr.currentValue || 0,
      unit: kr.unit || '',
      progress: kr.targetValue > 0 
        ? Math.min(100, (kr.currentValue || 0) / kr.targetValue * 100)
        : 0,
    }));

    const progress = krObjects.length > 0
      ? krObjects.reduce((sum, kr) => sum + kr.progress, 0) / krObjects.length
      : 0;

    const status: Objective['status'] = 
      progress >= 100 ? 'complete' :
      progress >= 75 ? 'on-track' :
      progress >= 50 ? 'at-risk' :
      'behind';

    const objective: Objective = {
      id: `okr-${Date.now()}`,
      title,
      description: description || '',
      keyResults: krObjects,
      progress,
      quarter: quarter || getCurrentQuarter(),
      status,
    };

    await storage.addOKR(objective);

    res.json({ objective, message: 'OKR created' });
  } catch (error: any) {
    console.error('OKR creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create OKR' });
  }
});

app.put('/api/okrs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Recalculate progress if key results updated
    if (updates.keyResults) {
      const progress = updates.keyResults.length > 0
        ? updates.keyResults.reduce((sum: number, kr: KeyResult) => sum + kr.progress, 0) / updates.keyResults.length
        : 0;

      updates.progress = progress;
      updates.status = 
        progress >= 100 ? 'complete' :
        progress >= 75 ? 'on-track' :
        progress >= 50 ? 'at-risk' :
        'behind';
    }

    await storage.updateOKR(id, updates);
    const okrs = storage.getOKRs();
    const updated = okrs.find(o => o.id === id);

    res.json({ objective: updated, message: 'OKR updated' });
  } catch (error: any) {
    console.error('OKR update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update OKR' });
  }
});

// ============================================================================
// KPI/OKR FILE UPLOAD
// ============================================================================

app.post('/api/kpis-okrs/upload', async (req, res) => {
  try {
    const { type, fileContent, fileName } = req.body;

    if (!type || !fileContent) {
      return res.status(400).json({ error: 'type and fileContent are required' });
    }

    if (type !== 'kpi' && type !== 'okr') {
      return res.status(400).json({ error: 'type must be "kpi" or "okr"' });
    }

    // Determine file type
    const isJSON = fileName?.endsWith('.json') || fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[');
    const isCSV = fileName?.endsWith('.csv') || (!isJSON && fileContent.includes(','));

    let parsedData: any;
    
    try {
      if (isJSON) {
        parsedData = JSON.parse(fileContent);
      } else if (isCSV) {
        // Simple CSV parsing for KPIs/OKRs
        const lines = fileContent.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const rows: any[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          rows.push(row);
        }
        parsedData = rows;
      } else {
        return res.status(400).json({ error: 'Unsupported file format. Use JSON or CSV' });
      }
    } catch (parseError: any) {
      return res.status(400).json({ error: `Parse error: ${parseError.message}` });
    }

    if (type === 'kpi') {
      // Handle KPI import
      const kpis = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      for (const kpiData of kpis) {
        const kpi: KPI = {
          id: `kpi-file-${Date.now()}-${Math.random()}`,
          name: kpiData.name || 'KPI Importado',
          description: kpiData.description || '',
          currentValue: Number(kpiData.currentValue) || 0,
          previousValue: Number(kpiData.previousValue) || 0,
          trend: kpiData.trend || 'stable',
          thresholds: kpiData.thresholds || {
            critical: 0,
            warning: 50,
            good: 70,
            excellent: 90,
          },
          status: 'unknown',
          sourceMetrics: [],
          calculationMethod: kpiData.calculationMethod || 'file',
          lastUpdated: Date.now(),
        };

        // Determine status
        if (kpi.currentValue >= kpi.thresholds.excellent) {
          kpi.status = 'excellent';
        } else if (kpi.currentValue >= kpi.thresholds.good) {
          kpi.status = 'good';
        } else if (kpi.currentValue >= kpi.thresholds.warning) {
          kpi.status = 'warning';
        } else {
          kpi.status = 'critical';
        }

        await storage.addKPI(kpi);
      }

      res.json({ message: `${kpis.length} KPI(s) importado(s) desde archivo` });
    } else {
      // Handle OKR import
      const okrs = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      for (const okrData of okrs) {
        const keyResults = (okrData.keyResults || []).map((kr: any) => ({
          id: `kr-${Date.now()}-${Math.random()}`,
          title: kr.title || '',
          description: kr.description || '',
          targetValue: Number(kr.targetValue) || 0,
          currentValue: Number(kr.currentValue) || 0,
          unit: kr.unit || '',
          progress: Number(kr.targetValue) > 0
            ? Math.min(100, (Number(kr.currentValue) || 0) / Number(kr.targetValue) * 100)
            : 0,
        }));

        const progress = keyResults.length > 0
          ? keyResults.reduce((sum: number, kr: KeyResult) => sum + kr.progress, 0) / keyResults.length
          : 0;

        const status: Objective['status'] = 
          progress >= 100 ? 'complete' :
          progress >= 75 ? 'on-track' :
          progress >= 50 ? 'at-risk' :
          'behind';

        const objective: Objective = {
          id: `okr-file-${Date.now()}-${Math.random()}`,
          title: okrData.title || 'OKR Importado',
          description: okrData.description || '',
          keyResults,
          progress,
          quarter: okrData.quarter || getCurrentQuarter(),
          status,
        };

        await storage.addOKR(objective);
      }

      res.json({ message: `${okrs.length} OKR(s) importado(s) desde archivo` });
    }
  } catch (error: any) {
    console.error('KPI/OKR file upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

