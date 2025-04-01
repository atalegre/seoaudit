
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

export interface SeoAnalysisResult {
  score: number;
  technicalIssues: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  contentIssues: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  status: StatusClassification;
}

export interface AioAnalysisResult {
  score: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
  status: StatusClassification;
}

export interface AnalysisResult {
  url: string;
  timestamp: string;
  seo: SeoAnalysisResult;
  aio: AioAnalysisResult;
  overallStatus: StatusClassification;
}
