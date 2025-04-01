
import { StatusClassification } from '../analyzerUtils';

// Interface para a estrutura de dados do cliente
export interface Client {
  id: number;
  name: string;
  website: string;
  contactEmail: string;
  contactName: string;
  account: string;
  status: 'active' | 'inactive' | 'pending';
  lastReport?: string;
  seoScore?: number;
  aioScore?: number;
  lastAnalysis?: Date;
}

// Changed these interfaces to match the ones in analyzerUtils.ts
export interface SeoAnalysisResult {
  score: number;
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  imageOptimization: number;
  headingsStructure: number;
  metaTags: number;
  security: boolean;
  issues: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  status?: StatusClassification;
}

export interface AioAnalysisResult {
  score: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
  status?: StatusClassification;
}

export interface AnalysisResult {
  url: string;
  timestamp: string;
  seo: SeoAnalysisResult;
  aio: AioAnalysisResult;
  recommendations?: Array<{
    suggestion: string;
    seoImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    aioImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
    priority: number;
    status?: 'pending' | 'in_progress' | 'done' | 'ignored';
  }>;
  status?: StatusClassification;
  overallStatus: StatusClassification;
}
