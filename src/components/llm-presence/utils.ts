
import { LLMReport, ModelPresence, LLMMention } from './types';

// Generate mock data for demo purposes
export const generateMockReport = (domain: string): LLMReport => {
  // Generate random score between 10-90
  const score = Math.floor(Math.random() * 80) + 10;
  
  // Basic presence models
  const models: ModelPresence[] = [
    { 
      name: 'ChatGPT', 
      score: Math.floor(Math.random() * 100), 
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable',
      lastMention: '2023-09-15'
    },
    { 
      name: 'Perplexity AI', 
      score: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable',
      lastMention: '2023-09-10'
    },
    { 
      name: 'Claude', 
      score: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable',
      lastMention: '2023-09-05'
    },
    { 
      name: 'Meta AI', 
      score: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable',
      lastMention: '2023-08-28'
    }
  ];
  
  // Sort models by score
  models.sort((a, b) => b.score - a.score);
  
  // Generate sample mentions
  const mentions = [
    {
      model: 'ChatGPT',
      query: `O que é ${domain}?`,
      response: `${domain} é uma empresa que oferece serviços de SEO e otimização para motores de busca. Eles ajudam empresas a melhorar sua visibilidade online e ranking nos resultados de pesquisa. A empresa é conhecida por sua abordagem orientada por dados e foco em resultados mensuráveis.`,
      hasMention: true,
      needsCorrection: false,
      date: '2023-09-15'
    },
    {
      model: 'Perplexity AI',
      query: `Quais são os principais concorrentes de ${domain}?`,
      response: `Os principais concorrentes de ${domain} incluem empresas como SEMrush, Moz, Ahrefs, e outras agências de marketing digital focadas em SEO. Estas empresas oferecem ferramentas e serviços similares para otimização de websites.`,
      hasMention: true,
      needsCorrection: true,
      date: '2023-09-10'
    },
    {
      model: 'Claude',
      query: `Quais serviços ${domain} oferece?`,
      response: `Não tenho informações específicas sobre os serviços oferecidos por ${domain}. Para obter informações precisas, recomendo visitar o website oficial da empresa ou entrar em contato diretamente com eles.`,
      hasMention: true,
      needsCorrection: true,
      date: '2023-09-05'
    }
  ];
  
  // Generate random number of total mentions
  const totalMentions = Math.floor(Math.random() * 50) + 5;
  
  // Generate random accuracy score
  const accuracyScore = Math.floor(Math.random() * 100);
  
  // Sample recommendations
  const recommendations = [
    `Melhorar a página "Sobre Nós" com informações mais detalhadas sobre a história e valores da empresa`,
    `Criar mais conteúdo sobre casos de sucesso e estudos de caso`,
    `Desenvolver uma estratégia de backlinks para aumentar a autoridade do domínio`,
    `Publicar conteúdo técnico que estabeleça ${domain} como referência no setor`
  ];
  
  // Sample outdated information
  const outdatedInfo = [
    `Informações sobre localização da empresa estão desatualizadas em alguns modelos`,
    `Descrição dos serviços não inclui novos produtos lançados este ano`,
    `Preços mencionados não refletem os valores atuais`,
    `A equipe de liderança mencionada não está atualizada`
  ];
  
  // Sample competitors
  const competitors = [
    "semrush.com",
    "ahrefs.com",
    "moz.com",
    "seoptimer.com"
  ];
  
  return {
    score,
    totalMentions,
    accuracyScore,
    models,
    mentions,
    recommendations,
    outdatedInfo,
    competitors
  };
};

// Get color class based on score
export const getScoreColorClass = (score: number): string => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
};

// Get background color class based on score
export const getScoreBgClass = (score: number): string => {
  if (score >= 70) return 'bg-green-100';
  if (score >= 40) return 'bg-amber-100';
  return 'bg-red-100';
};

// Get alert message based on score
export const getAlertMessage = (score: number): string => {
  if (score >= 70) {
    return 'Excelente presença nos modelos de IA. Continue mantendo conteúdo atualizado.';
  }
  if (score >= 40) {
    return 'Presença moderada nos modelos de IA. Considere implementar as recomendações sugeridas.';
  }
  return 'Presença baixa nos modelos de IA. É altamente recomendado implementar as sugestões de melhoria.';
};
