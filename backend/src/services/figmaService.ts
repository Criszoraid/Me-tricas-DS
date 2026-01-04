import axios from 'axios';
import { DesignMetrics } from '../models/types.js';

/**
 * Figma Service
 * 
 * Analyzes Figma files to extract design metrics:
 * - Component usage
 * - Adoption percentage
 * - Detached components
 */

interface FigmaFile {
  key: string;
  name: string;
  lastModified: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  componentId?: string;
  componentProperties?: Record<string, any>;
}

interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, {
    key: string;
    name: string;
    description: string;
    componentSetId?: string;
  }>;
  styles: Record<string, any>;
}

export class FigmaService {
  private accessToken: string;
  private baseURL = 'https://api.figma.com/v1';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'X-Figma-Token': this.accessToken,
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Figma API error: ${error.response?.data?.err || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get file data from Figma
   */
  async getFile(fileKey: string): Promise<FigmaFileResponse> {
    return await this.request(`/files/${fileKey}`);
  }

  /**
   * Analyze a Figma file and extract metrics
   */
  async analyzeFile(fileKey: string): Promise<DesignMetrics> {
    const fileData = await this.getFile(fileKey);

    // Count components
    const components = Object.keys(fileData.components || {});
    const totalComponents = components.length;

    // Traverse nodes to find component instances
    const componentInstances = new Set<string>();
    const detachedComponents = new Set<string>();

    const traverseNodes = (nodes: FigmaNode[]) => {
      for (const node of nodes) {
        if (node.type === 'INSTANCE' && node.componentId) {
          componentInstances.add(node.componentId);
          
          // Check if component is detached (has overrides)
          if (node.componentProperties && Object.keys(node.componentProperties).length > 0) {
            // Simplified: consider it detached if it has property overrides
            // In a real implementation, you'd check if overrides break the component
            detachedComponents.add(node.componentId);
          }
        }

        if (node.children) {
          traverseNodes(node.children);
        }
      }
    };

    if (fileData.document?.children) {
      traverseNodes(fileData.document.children);
    }

    const usedComponents = componentInstances.size;
    const adoptionPercentage = totalComponents > 0 
      ? (usedComponents / totalComponents) * 100 
      : 0;

    return {
      id: `figma-${fileKey}-${Date.now()}`,
      timestamp: Date.now(),
      source: 'figma',
      totalComponents,
      usedComponents,
      detachedComponents: detachedComponents.size,
      adoptionPercentage: Math.round(adoptionPercentage * 100) / 100,
      figmaFileId: fileData.document?.id,
      figmaFileKey: fileKey,
    };
  }

  /**
   * Analyze multiple files (for teams with multiple design files)
   */
  async analyzeFiles(fileKeys: string[]): Promise<DesignMetrics[]> {
    const results = await Promise.all(
      fileKeys.map(key => this.analyzeFile(key))
    );

    // Aggregate results
    const aggregated: DesignMetrics = {
      id: `figma-aggregated-${Date.now()}`,
      timestamp: Date.now(),
      source: 'figma',
      totalComponents: results.reduce((sum, r) => sum + r.totalComponents, 0),
      usedComponents: results.reduce((sum, r) => sum + r.usedComponents, 0),
      detachedComponents: results.reduce((sum, r) => sum + r.detachedComponents, 0),
      adoptionPercentage: results.length > 0
        ? results.reduce((sum, r) => sum + r.adoptionPercentage, 0) / results.length
        : 0,
    };

    return [aggregated, ...results];
  }
}

