
export interface AnalysisResult {
  url: string;
  timestamp: string;
  status: string;
  seo: SeoAnalysisResult;
  aio: AioAnalysisResult;
  recommendations?: Recommendation[];
  overallStatus: StatusClassification;
  logoUrl?: string | null; // Adicionado para armazenar a URL do logo
}

export interface SeoAnalysisResult {
  score: number;
  performanceScore: number;
  bestPracticesScore: number;
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  security: boolean;
  imageOptimization: number;
  headingsStructure: number;
  metaTags: number;
  lcp: number;
  fid: number;
  cls: number;
  [key: string]: any;
}

export interface AioAnalysisResult {
  score: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
  [key: string]: any;
}

export interface Recommendation {
  suggestion: string;
  seoImpact: "Alto" | "Médio" | "Baixo" | "Nenhum";
  aioImpact: "Alto" | "Médio" | "Baixo" | "Nenhum";
  priority: number;
  status: string;
}

export type StatusClassification = 'Saudável' | 'A melhorar' | 'Crítico';

export interface Client {
  id: number;
  name: string;
  website: string;
  contactName: string;
  contactEmail: string;
  notes?: string;
  created_at?: string;
  // Propriedades adicionais que estão sendo usadas no código
  status?: string;
  account?: string;
  seoScore?: number;
  aioScore?: number;
  lastAnalysis?: Date | string;
  lastReport?: string;
}
