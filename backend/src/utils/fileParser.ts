/**
 * File parser utilities for CSV and JSON files
 */

export interface ParsedDesignMetrics {
  totalComponents?: number;
  usedComponents?: number;
  detachedComponents?: number;
  adoptionPercentage?: number;
  figmaFileKey?: string;
}

export interface ParsedDevelopmentMetrics {
  dsPackageInstalls?: number;
  reposUsingDS?: number;
  customComponentsCount?: number;
  componentsBuiltFromScratch?: number;
  uiRelatedIssues?: number;
  resolvedIssues?: number;
  organization?: string;
}

/**
 * Parse JSON file content
 */
export function parseJSON(content: string): any {
  try {
    return JSON.parse(content);
  } catch (error: any) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}

/**
 * Parse CSV file content
 * Supports simple CSV format with headers
 */
export function parseCSV(content: string): any[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to parse as number
      const numValue = parseFloat(value);
      row[header] = isNaN(numValue) ? value : numValue;
    });
    
    rows.push(row);
  }

  return rows;
}

/**
 * Parse design metrics from JSON or CSV
 */
export function parseDesignMetrics(data: any): ParsedDesignMetrics {
  // If it's an array, take the first item or aggregate
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('No data found in file');
    }
    // For arrays, try to aggregate or use the last item
    data = data[data.length - 1];
  }

  // Handle wrapped format like { type: "design", data: {...} }
  if (data.type === 'design' && data.data) {
    data = data.data;
  }

  const metrics: ParsedDesignMetrics = {};

  // Map common field names
  if (data.totalComponents !== undefined) metrics.totalComponents = Number(data.totalComponents);
  if (data.usedComponents !== undefined) metrics.usedComponents = Number(data.usedComponents);
  if (data.detachedComponents !== undefined) metrics.detachedComponents = Number(data.detachedComponents);
  if (data.adoptionPercentage !== undefined) metrics.adoptionPercentage = Number(data.adoptionPercentage);
  if (data.adoption !== undefined) metrics.adoptionPercentage = Number(data.adoption);
  if (data.figmaFileKey !== undefined) metrics.figmaFileKey = String(data.figmaFileKey);
  if (data.fileKey !== undefined) metrics.figmaFileKey = String(data.fileKey);

  return metrics;
}

/**
 * Parse development metrics from JSON or CSV
 */
export function parseDevelopmentMetrics(data: any): ParsedDevelopmentMetrics {
  // If it's an array, take the first item or aggregate
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('No data found in file');
    }
    data = data[data.length - 1];
  }

  // Handle wrapped format like { type: "development", data: {...} }
  if (data.type === 'development' && data.data) {
    data = data.data;
  }

  const metrics: ParsedDevelopmentMetrics = {};

  // Map common field names
  if (data.dsPackageInstalls !== undefined) metrics.dsPackageInstalls = Number(data.dsPackageInstalls);
  if (data.reposUsingDS !== undefined) metrics.reposUsingDS = Number(data.reposUsingDS);
  if (data.customComponentsCount !== undefined) metrics.customComponentsCount = Number(data.customComponentsCount);
  if (data.componentsBuiltFromScratch !== undefined) metrics.componentsBuiltFromScratch = Number(data.componentsBuiltFromScratch);
  if (data.uiRelatedIssues !== undefined) metrics.uiRelatedIssues = Number(data.uiRelatedIssues);
  if (data.resolvedIssues !== undefined) metrics.resolvedIssues = Number(data.resolvedIssues);
  if (data.organization !== undefined) metrics.organization = String(data.organization);

  return metrics;
}

