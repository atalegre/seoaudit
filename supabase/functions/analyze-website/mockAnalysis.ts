
// Mock analysis generator for demo purposes and API failure fallbacks

import { performAccessibilityAudit } from "./accessibilityAudit.ts";

// Generates a simulated analysis when we don't have a real one
export function generateSimulatedAnalysis(url: string, content?: string) {
  // Calculate a consistent score for the same URL to ensure deterministic results
  const scoreBase = calculateConsistentScore(url);
  
  // Generate simulated accessibility results if content is provided
  let accessibilityResults = null;
  if (content) {
    accessibilityResults = performAccessibilityAudit(content);
  } else {
    // Provide a simple mock if no content is available
    accessibilityResults = {
      score: Math.floor(65 + Math.random() * 20),
      violations: [
        {
          id: "image-alt",
          impact: "serious",
          description: "Images must have alternate text",
          nodes: 3
        }
      ],
      wcagCompliant: Math.random() > 0.5,
      eaaCompliant: Math.random() > 0.7,
      passedTests: [
        "HTML language is specified",
        "Proper heading structure"
      ],
      manualChecksNeeded: [
        "Keyboard accessibility for all interactive elements",
        "Focus indication is clearly visible"
      ]
    };
  }
  
  return {
    score: Math.floor(scoreBase.normalizedScore * 100),
    contentClarity: Math.floor(70 + scoreBase.varianceA * 15),
    logicalStructure: Math.floor(65 + scoreBase.varianceB * 20),
    naturalLanguage: Math.floor(75 + scoreBase.varianceC * 15),
    topicsDetected: generateTopics(url),
    confusingParts: generateConfusingParts(),
    analysis: generateAnalysisText(url),
    accessibility: accessibilityResults,
    apiUsed: false,
    generated: true,
    timestamp: new Date().toISOString()
  };
}

// Helper function to generate a consistent score based on URL
function calculateConsistentScore(url: string) {
  // Use simple hashing for deterministic but seemingly random values
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Scale to 0-1 range with some bounds
  const normalizedScore = Math.min(0.95, Math.max(0.5, Math.abs(Math.sin(hash)) * 0.7 + 0.3));
  
  // Generate a few different "random" values based on the URL
  const varianceA = Math.abs(Math.cos(hash)) * 0.5;
  const varianceB = Math.abs(Math.sin(hash * 2)) * 0.5;
  const varianceC = Math.abs(Math.cos(hash * 3)) * 0.5;
  
  return { normalizedScore, varianceA, varianceB, varianceC };
}

// Helper to generate fake topics based on URL
function generateTopics(url: string) {
  const allTopics = ["Marketing Digital", "SEO", "E-commerce", "Tecnologia", "Saúde", "Educação", "Finanças", "Sustentabilidade", "Design", "Social Media"];
  const domainName = url.replace(/^https?:\/\//, '').split('/')[0];
  
  // Use the domain to determine topics
  let selectedTopics = [];
  if (domainName.includes('tech') || domainName.includes('digital')) {
    selectedTopics.push("Tecnologia", "Marketing Digital");
  } else if (domainName.includes('edu') || domainName.includes('learn')) {
    selectedTopics.push("Educação", "Conhecimento");
  } else if (domainName.includes('shop') || domainName.includes('store')) {
    selectedTopics.push("E-commerce", "Produtos");
  } else if (domainName.includes('health') || domainName.includes('med')) {
    selectedTopics.push("Saúde", "Bem-estar");
  } else {
    // Pick 2-3 random topics if no match
    const numTopics = 2 + Math.floor(Math.abs(Math.sin(domainName.length)) * 2);
    for (let i = 0; i < numTopics; i++) {
      const idx = Math.floor(Math.abs(Math.sin(domainName.charCodeAt(i % domainName.length) * i)) * allTopics.length);
      selectedTopics.push(allTopics[idx % allTopics.length]);
    }
  }
  
  // Deduplicate and return
  return [...new Set(selectedTopics)];
}

// Helper to generate confusing parts for the simulated analysis
function generateConfusingParts() {
  const possibleIssues = [
    "Seção 'Sobre Nós' com informações insuficientes",
    "Menu de navegação com categorias ambíguas",
    "Página de contato sem informações claras",
    "Descrições de produto com linguagem técnica excessiva",
    "Termos de serviço com linguagem jurídica complexa",
    "Formulário de checkout com campos não explicados",
    "Pop-ups com mensagens promocionais confusas",
    "Tabela de preços com estrutura pouco clara"
  ];
  
  // Pick 1-3 random issues
  const numIssues = 1 + Math.floor(Math.random() * 2);
  const selected = [];
  
  for (let i = 0; i < numIssues; i++) {
    const idx = Math.floor(Math.random() * possibleIssues.length);
    selected.push(possibleIssues[idx]);
    possibleIssues.splice(idx, 1); // Remove to avoid duplicates
  }
  
  return selected;
}

// Helper to generate analysis text
function generateAnalysisText(url: string) {
  return `O site ${url} apresenta conteúdo relativamente claro para processamento por algoritmos de IA, mas poderia melhorar em alguns aspectos. A estrutura de navegação é adequada, mas algumas seções carecem de contexto suficiente. O texto principal utiliza linguagem natural, facilitando a compreensão, porém há seções com terminologia especializada que poderiam ser simplificadas. Recomenda-se revisar as descrições de produtos/serviços para garantir clareza e consistência.`;
}
