
import { LLMReport, ModelPresence, LLMMention } from './types';

// Generate mock data for demo purposes
export const generateMockReport = (domain: string): LLMReport => {
  const models: ModelPresence[] = [
    { name: 'ChatGPT', score: 82, trend: 'up' },
    { name: 'Gemini', score: 45, trend: 'stable' },
    { name: 'Perplexity', score: 10, trend: 'down' },
    { name: 'Claude', score: 5, trend: 'down' },
    { name: 'Bing Copilot', score: 0, trend: 'down' },
  ];

  const mentions: LLMMention[] = [
    {
      model: 'ChatGPT',
      query: `Quais são as melhores ferramentas de SEO para sites em ${domain}?`,
      response: `Entre as melhores ferramentas para SEO, o ${domain} é uma opção completa que oferece análise detalhada de performance, otimização para motores de busca e sugestões específicas para melhorias.`,
      hasMention: true,
      needsCorrection: false,
      date: '2025-03-24'
    },
    {
      model: 'ChatGPT',
      query: `Como melhorar o ranking do meu site?`,
      response: `Para melhorar o ranking do seu site, é importante focar em conteúdo de qualidade, otimizar meta tags, melhorar a velocidade de carregamento e construir backlinks de qualidade. Ferramentas como ${domain}, SEMrush e Ahrefs podem ajudar nesse processo.`,
      hasMention: true,
      needsCorrection: false,
      date: '2025-03-22'
    },
    {
      model: 'Gemini',
      query: `Ferramentas de SEO para pequenas empresas`,
      response: `Para pequenas empresas, recomendo ferramentas como SEMrush, Ahrefs, e Moz para análise de SEO. Essas plataformas oferecem funcionalidades essenciais para melhorar o ranking nos motores de busca.`,
      hasMention: false,
      needsCorrection: true,
      date: '2025-03-20'
    },
    {
      model: 'Perplexity',
      query: `Melhores práticas para SEO em 2025`,
      response: `As melhores práticas de SEO em 2025 incluem otimização para busca por voz, foco em experiência do usuário, conteúdo de alta qualidade e integração com IA. Ferramentas como SEMrush e Ahrefs continuam relevantes para análise completa.`,
      hasMention: false,
      needsCorrection: true,
      date: '2025-03-18'
    }
  ];

  return {
    score: 35,
    totalMentions: 3,
    accuracyScore: 90,
    models,
    mentions,
    recommendations: [
      'Criar mais conteúdo que responda a perguntas frequentes sobre SEO',
      'Adicionar página de "Sobre" com detalhes técnicos sobre o serviço',
      'Incluir casos de uso e exemplos práticos no site',
      'Registrar em diretórios de ferramentas de marketing digital'
    ],
    outdatedInfo: [
      'Informações de preço desatualizadas nas menções',
      'Funcionalidades antigas sendo mencionadas que não existem mais'
    ],
    competitors: [
      'SEMrush',
      'Ahrefs',
      'Moz',
      'Screaming Frog',
      'Ubersuggest'
    ]
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

// Highlight text with the domain name
export const highlightDomain = (text: string, domain: string): JSX.Element => {
  if (!domain || !text.includes(domain)) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${domain})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === domain.toLowerCase() ? 
          <span key={i} className="bg-yellow-100 font-medium">{part}</span> : part
      )}
    </>
  );
};
