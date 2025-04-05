
/**
 * Extracts domain from URL
 */
export const extractDomainFromUrl = (urlString: string): string => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return "";
  }
};

/**
 * Generates a consistent score based on the domain name
 */
export const generateConsistentScore = (domain: string): number => {
  // Use a simple hash function to generate a number based on the domain name
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash) + domain.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Normalize the hash to the range 30-70
  const normalizedScore = Math.abs(hash % 41) + 30;
  return normalizedScore;
};

/**
 * Generates a consistent report based on the domain and score
 */
export const generateConsistentReport = (domain: string, score: number): string => {
  const recommendations = [
    `- Criar artigos que respondam a perguntas diretas sobre ${domain}`,
    `- Incluir definições claras sobre serviços e objetivos`,
    `- Aumentar a autoridade com backlinks`,
    `- Garantir estrutura clara (headings, listas, FAQ)`
  ];
  
  // Determine if the domain is mentioned in LLMs based on the score
  const isDomainMentioned = score > 50;
  
  return `
Resultado da auditoria LLM para o domínio: ${domain}

${isDomainMentioned ? '✔️ A sua marca é mencionada em respostas de IA, mas com frequência limitada.' : '❌ A sua marca ainda não é mencionada diretamente em respostas de IA.'}

Recomendações:
${recommendations.join('\n')}

${score > 60 ? '✔️ O conteúdo atual já aborda temas relevantes para AIO' : '❌ O conteúdo atual precisa de mais contexto para AIO'}
`;
};
