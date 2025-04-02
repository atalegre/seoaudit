
/**
 * Types for Page Insights service
 */

// Single recommendation item
export interface PageInsightsRecommendation {
  id: string;
  title: string;
  description: string;
  importance: number;
}

// Complete Page Insights data structure
export interface PageInsightsData {
  score: number;
  performanceScore: number;
  bestPracticesScore?: number;
  url: string;
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  security: boolean;
  imageOptimization: number;
  headingsStructure?: number;
  metaTags?: number;
  // Core Web Vitals
  lcp: number;
  fid: number;
  cls: number;
  // Mobile usability details
  tapTargetsScore?: number;
  tapTargetsIssues?: number;
  recommendations: PageInsightsRecommendation[];
  generated?: boolean;
}

// Google Page Insights API response
export interface GooglePageInsightsResponse {
  kind?: string;
  id?: string;
  responseCode?: number;
  analysisUTCTimestamp?: string;
  lighthouseResult?: {
    categories?: {
      seo?: { score: number };
      performance?: { score: number };
      'best-practices'?: { score: number };
    };
    audits?: Record<string, {
      score?: number;
      numericValue?: number;
      title?: string;
      description?: string;
      details?: {
        items?: any[];
      };
    }>;
  };
  loadingExperience?: {
    metrics?: {
      FIRST_CONTENTFUL_PAINT_MS?: {
        percentile: number;
      };
    };
  };
}
