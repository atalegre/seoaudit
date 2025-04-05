
export interface AnalysisResult {
  url: string;
  timestamp: string;
  status: string;
  seo: SeoAnalysisResult;
  aio: AioAnalysisResult;
  accessibility?: AccessibilityAnalysisResult; // New accessibility analysis
  recommendations?: Recommendation[];
  overallStatus: StatusClassification;
  logoUrl?: string | null; // Added for logo URL storage
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
  headingsStructure?: number;
  metaTags?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  companyName?: string; // Added for company information
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

// New interface for accessibility analysis
export interface AccessibilityAnalysisResult {
  score: number;
  violations: AccessibilityViolation[];
  wcagCompliant: boolean;
  eaaCompliant: boolean;
  passedTests: string[];
  manualChecksNeeded: string[];
}

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl?: string;
  nodes: number;
}

export interface Recommendation {
  suggestion: string;
  seoImpact: "Alto" | "Médio" | "Baixo" | "Nenhum";
  aioImpact: "Alto" | "Médio" | "Baixo" | "Nenhum";
  priority: number;
  status: "pending" | "in_progress" | "done" | "ignored"; // Updated to match RecommendationItem status types
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
  accessibilityScore?: number; // New accessibility score
  lastAnalysis?: Date | string;
  lastReport?: string;
}
