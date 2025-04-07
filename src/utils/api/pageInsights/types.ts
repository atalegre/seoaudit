
export interface PageInsightsData {
  performanceScore: number;
  fcp: number;
  lcp: number;
  tbt: number;
  cls: number;
  speedIndex: number;
  tti: number;
  fid: number;
  mobileFriendly: boolean;
  security: {
    https: boolean;
    mixedContent: boolean;
  };
  headingsStructure: {
    hasH1: boolean;
    multipleH1: boolean;
    headingsOrder: boolean;
  };
  metaTags: {
    title: string;
    description: string;
    titleLength: number;
    descriptionLength: number;
  };
  recommendations?: {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    category: string;
  }[];
}

// Google PageSpeed Insights API response interface
export interface GooglePageInsightsResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number };
      seo?: { score?: number };
      'best-practices'?: { score?: number };
    };
    audits?: Record<string, {
      score?: number;
      numericValue?: number;
      title?: string;
      description?: string;
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
