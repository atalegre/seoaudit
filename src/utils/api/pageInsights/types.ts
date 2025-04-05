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
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  security: boolean;
  imageOptimization: number;
  lcp: number;
  cls: number;
  fid: number;
  auditResults?: AuditResultItem[];
  errorMessage?: string;
  isError?: boolean;
}
