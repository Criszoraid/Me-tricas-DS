import axios from 'axios';
import { DevelopmentMetrics } from '../models/types.js';

/**
 * GitHub Service
 * 
 * Analyzes GitHub repositories to extract development metrics:
 * - DS package usage
 * - Custom components
 * - UI-related issues
 */

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  language: string;
  default_branch: string;
}

interface GitHubPackage {
  name: string;
  version: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  labels: Array<{ name: string }>;
  state: 'open' | 'closed';
  created_at: string;
  closed_at: string | null;
}

export class GitHubService {
  private accessToken: string;
  private baseURL = 'https://api.github.com';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `token ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`GitHub API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get all repositories for an organization or user
   */
  async getRepositories(orgOrUser: string): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await this.request(`/orgs/${orgOrUser}/repos`, {
        page,
        per_page: perPage,
      });

      if (response.length === 0) break;
      repos.push(...response);
      if (response.length < perPage) break;
      page++;
    }

    return repos;
  }

  /**
   * Check if a repository uses the Design System package
   */
  async checkPackageUsage(
    owner: string,
    repo: string,
    packageName: string
  ): Promise<boolean> {
    try {
      // Check package.json files
      const packageFiles = [
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
      ];

      for (const file of packageFiles) {
        try {
          const content = await this.request(`/repos/${owner}/${repo}/contents/${file}`);
          
          if (content.encoding === 'base64') {
            const decoded = Buffer.from(content.content, 'base64').toString('utf-8');
            const parsed = JSON.parse(decoded);
            
            // Check dependencies
            const allDeps = {
              ...parsed.dependencies,
              ...parsed.devDependencies,
              ...parsed.peerDependencies,
            };

            if (Object.keys(allDeps).some(dep => dep.includes(packageName))) {
              return true;
            }
          }
        } catch (error) {
          // File doesn't exist or can't be read, continue
          continue;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Search for UI-related issues
   */
  async getUIIssues(owner: string, repo: string): Promise<GitHubIssue[]> {
    try {
      const issues = await this.request(`/repos/${owner}/${repo}/issues`, {
        state: 'all',
        labels: 'ui,design,component,design-system',
        per_page: 100,
      });

      // Filter for actual issues (not PRs)
      return issues.filter((issue: any) => !issue.pull_request);
    } catch (error) {
      return [];
    }
  }

  /**
   * Count custom components in a repository
   * This is a simplified heuristic - in reality you'd need to parse the codebase
   */
  async countCustomComponents(owner: string, repo: string): Promise<number> {
    try {
      // Search for component files
      const searchResults = await this.request('/search/code', {
        q: `repo:${owner}/${repo} filename:*.tsx OR filename:*.jsx component`,
      });

      // Simplified: return number of results
      // In a real implementation, you'd analyze the code to determine
      // if components are custom or from the DS
      return Math.min(searchResults.total_count || 0, 100);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Analyze organization/repo for development metrics
   */
  async analyzeOrganization(
    organization: string,
    packageName: string = 'design-system'
  ): Promise<DevelopmentMetrics> {
    const repos = await this.getRepositories(organization);
    
    let reposUsingDS = 0;
    let totalUIIssues = 0;
    let resolvedIssues = 0;
    let totalCustomComponents = 0;

    // Analyze each repository (limit to avoid rate limits)
    const reposToAnalyze = repos.slice(0, 20);
    
    for (const repo of reposToAnalyze) {
      const [usesDS, issues, customComponents] = await Promise.all([
        this.checkPackageUsage(organization, repo.name, packageName),
        this.getUIIssues(organization, repo.name),
        this.countCustomComponents(organization, repo.name),
      ]);

      if (usesDS) {
        reposUsingDS++;
      }

      totalUIIssues += issues.length;
      resolvedIssues += issues.filter(i => i.state === 'closed').length;
      totalCustomComponents += customComponents;
    }

    return {
      id: `github-${organization}-${Date.now()}`,
      timestamp: Date.now(),
      source: 'github',
      dsPackageInstalls: reposUsingDS,
      reposUsingDS,
      customComponentsCount: totalCustomComponents,
      componentsBuiltFromScratch: totalCustomComponents,
      uiRelatedIssues: totalUIIssues,
      resolvedIssues,
      organization,
      repos: reposToAnalyze.map(r => r.full_name),
    };
  }
}

