
// Tipo para os resultados da análise SEO
export interface SeoAnalysisResult {
  score: number;
  loadTimeDesktop?: number;
  loadTimeMobile?: number;
  mobileFriendly?: boolean;
  security?: boolean;
  imageOptimization?: number;
  headingsStructure?: number;
  metaTags?: number;
  
  // Core Web Vitals
  performanceScore?: number;
  bestPracticesScore?: number;
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Mobile Usability details
  tapTargetsScore?: number;
  tapTargetsIssues?: number;
  
  issues?: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

// Tipo para os resultados da análise AIO
export interface AioAnalysisResult {
  score: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  analysis?: string;
  topicsDetected: string[];
  confusingParts: string[];
}

// Tipo para o status da análise - alinhado com analyzerUtils.ts
export type StatusClassification = 'Excelente' | 'Bom' | 'Médio' | 'Crítico' | 'A melhorar' | 'Saudável';

// Tipo para os resultados completos da análise
export interface AnalysisResult {
  url: string;
  timestamp: string;
  seo: SeoAnalysisResult;
  aio: AioAnalysisResult;
  overallStatus?: StatusClassification;
  recommendations: Array<{
    id?: number;
    suggestion: string;
    description?: string;
    seoImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    aioImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    priority: number;
    status?: 'pending' | 'in_progress' | 'done' | 'ignored';
  }>;
}

// Interface para o cliente
export interface Client {
  id: number;
  name: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  status?: 'active' | 'inactive' | 'pending';
  seoScore?: number;
  aioScore?: number;
  lastAnalysis?: Date | string;
  account?: string;
}
