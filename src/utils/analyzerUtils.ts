
export interface SeoAnalysis {
  score: number;
  loadTimeDesktop: number;
  loadTimeMobile: number;
  mobileFriendly: boolean;
  imageOptimization: number;
  headingsStructure: number;
  metaTags: number;
  security: boolean;
  issues: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface AioAnalysis {
  score: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
}

export interface CombinedRecommendation {
  suggestion: string;
  seoImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
  aioImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
  priority: number; // 1-10 (10 being highest)
}

export type StatusClassification = 'Crítico' | 'A melhorar' | 'Saudável';

export interface AnalysisResult {
  url: string;
  timestamp: string; // Added this property
  seo: SeoAnalysis;
  aio: AioAnalysis;
  recommendations: CombinedRecommendation[];
  status: StatusClassification;
  overallStatus: StatusClassification; // Added this property
}

// Helper function to determine the overall status based on SEO and AIO scores
export const getOverallStatus = (seoScore: number, aioScore: number): StatusClassification => {
  const averageScore = (seoScore + aioScore) / 2;
  
  if (averageScore < 50) return 'Crítico';
  if (averageScore < 75) return 'A melhorar';
  return 'Saudável';
};

// Helper function to generate a random score between min and max
const randomScore = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

// Generate fake SEO analysis
const generateSeoAnalysis = (url: string): SeoAnalysis => {
  const score = randomScore(30, 90);
  
  return {
    score,
    loadTimeDesktop: Math.round((Math.random() * 4 + 0.5) * 100) / 100, // 0.5 - 4.5 seconds
    loadTimeMobile: Math.round((Math.random() * 8 + 1) * 100) / 100, // 1 - 9 seconds
    mobileFriendly: Math.random() > 0.3, // 70% chance of being mobile friendly
    imageOptimization: randomScore(20, 100),
    headingsStructure: randomScore(30, 95),
    metaTags: randomScore(20, 100),
    security: Math.random() > 0.2, // 80% chance of being secure
    issues: [
      {
        title: 'Imagens sem atributos alt',
        description: 'Várias imagens não possuem texto alternativo adequado.',
        severity: 'medium'
      },
      {
        title: 'Meta description em falta',
        description: 'Algumas páginas não têm meta descriptions únicas.',
        severity: 'high'
      },
      {
        title: 'Tempo de carregamento lento',
        description: 'A versão mobile do site carrega lentamente.',
        severity: Math.random() > 0.5 ? 'high' : 'medium'
      }
    ]
  };
};

// Generate fake AIO analysis
const generateAioAnalysis = (url: string): AioAnalysis => {
  const score = randomScore(40, 90);
  
  return {
    score,
    contentClarity: randomScore(40, 95),
    logicalStructure: randomScore(30, 90),
    naturalLanguage: randomScore(40, 95),
    topicsDetected: [
      'Marketing Digital',
      'SEO',
      'Presença Online',
      'Otimização Web'
    ],
    confusingParts: [
      'Parágrafos muito longos na página principal',
      'Informação técnica sem explicação adequada',
      'Texto denso sem estrutura visual'
    ]
  };
};

// Generate combined recommendations
const generateRecommendations = (seo: SeoAnalysis, aio: AioAnalysis): CombinedRecommendation[] => {
  return [
    {
      suggestion: 'Adicionar meta descriptions únicas em todas as páginas',
      seoImpact: 'Alto',
      aioImpact: 'Médio',
      priority: 9
    },
    {
      suggestion: 'Otimizar imagens para reduzir o tempo de carregamento',
      seoImpact: 'Alto',
      aioImpact: 'Baixo',
      priority: 8
    },
    {
      suggestion: 'Adicionar cabeçalhos hierárquicos (H1, H2, H3) com palavras-chave',
      seoImpact: 'Alto',
      aioImpact: 'Alto',
      priority: 10
    },
    {
      suggestion: 'Simplificar parágrafos longos e textos densos',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 7
    },
    {
      suggestion: 'Implementar HTTPS em todo o site',
      seoImpact: 'Médio',
      aioImpact: 'Médio',
      priority: 8
    },
    {
      suggestion: 'Criar estrutura de conteúdo mais lógica e organizada',
      seoImpact: 'Médio',
      aioImpact: 'Alto',
      priority: 9
    }
  ];
};

// Determine the overall status
const determineStatus = (seoScore: number, aioScore: number): StatusClassification => {
  const averageScore = (seoScore + aioScore) / 2;
  
  if (averageScore < 50) return 'Crítico';
  if (averageScore < 75) return 'A melhorar';
  return 'Saudável';
};

// Main analysis function
export const analyzeSite = (url: string): AnalysisResult => {
  const seoAnalysis = generateSeoAnalysis(url);
  const aioAnalysis = generateAioAnalysis(url);
  const recommendations = generateRecommendations(seoAnalysis, aioAnalysis);
  const status = determineStatus(seoAnalysis.score, aioAnalysis.score);
  
  return {
    url,
    timestamp: new Date().toISOString(),
    seo: seoAnalysis,
    aio: aioAnalysis,
    recommendations,
    status,
    overallStatus: status
  };
};
