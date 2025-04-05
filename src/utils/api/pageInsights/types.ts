
export interface AuditResultItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  explanation?: string;
  warnings?: string;
  details?: {
    type: string;
    headings: { key: string; itemType: string; text: string }[];
    items: Record<string, any>[];
  };
}

export interface PageInsightsData {
  url: string;
  score: number;
  performanceScore: number;
  bestPracticesScore?: number;
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  security: boolean;
  imageOptimization: number;
  headingsStructure?: number;
  metaTags?: number;
  lcp: number;
  cls: number;
  fid: number;
  tapTargetsScore?: number;
  tapTargetsIssues?: number;
  recommendations?: { id: string; title: string; description: string; importance: number }[];
  auditResults?: AuditResultItem[];
  errorMessage?: string;
  isError?: boolean;
}

// Added GooglePageInsightsResponse interface for apiProcessor.ts
export interface GooglePageInsightsResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      seo?: { score: number };
      'best-practices'?: { score: number };
    };
    audits?: Record<string, {
      score: number | null;
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
