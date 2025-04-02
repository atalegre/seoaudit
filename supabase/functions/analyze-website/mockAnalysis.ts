
// Generate mock analysis when OpenAI API is not available

/**
 * Generate consistent mock analysis based on URL
 * @param url Website URL to analyze
 * @returns Simulated analysis data
 */
export function generateSimulatedAnalysis(url: string) {
  console.log('Generating simulated analysis for URL:', url);
  
  // Generate hash based on URL for consistent results
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  
  // Normalize scores to realistic values
  const baseScore = Math.abs(hash % 30) + 55; // 55-85
  const contentClarity = Math.abs((hash >> 3) % 25) + 60; // 60-85
  const logicalStructure = Math.abs((hash >> 6) % 30) + 50; // 50-80
  const naturalLanguage = Math.abs((hash >> 9) % 20) + 65; // 65-85
  
  // Generate topics detected based on URL
  const allTopics = ["Marketing Digital", "SEO", "E-commerce", "Desenvolvimento Web", 
                    "Conteúdo", "Vendas", "Tecnologia", "Negócios", "Empreendedorismo",
                    "Estratégia", "Design", "UX/UI", "Redes Sociais", "Analytics"];
  
  // Select topics based on hash
  const topicsDetected = [];
  for (let i = 0; i < 5; i++) {
    const index = Math.abs((hash >> (i * 3)) % allTopics.length);
    if (!topicsDetected.includes(allTopics[index])) {
      topicsDetected.push(allTopics[index]);
    }
  }
  
  // Limit to 3-5 unique topics
  const uniqueTopics = [...new Set(topicsDetected)].slice(0, 3 + (hash % 3));
  
  // Generate confusing parts
  const possibleConfusions = [
    "Seção 'Sobre Nós' com informações insuficientes",
    "Descrições de serviços muito técnicas",
    "Falta de contexto em estudos de caso",
    "Terminologia especializada sem explicação",
    "Estrutura da página de contato pouco intuitiva",
    "Informações de preços ambíguas",
    "Processo de compra com passos pouco claros"
  ];
  
  const confusingParts = [];
  for (let i = 0; i < 2 + (hash % 2); i++) {
    const index = Math.abs((hash >> (i * 5)) % possibleConfusions.length);
    if (!confusingParts.includes(possibleConfusions[index])) {
      confusingParts.push(possibleConfusions[index]);
    }
  }
  
  return {
    score: baseScore,
    contentClarity: contentClarity,
    logicalStructure: logicalStructure,
    naturalLanguage: naturalLanguage,
    topicsDetected: uniqueTopics,
    confusingParts: confusingParts,
    analysis: `Análise simulada para ${url}. Este site tem uma estrutura ${logicalStructure > 70 ? "boa" : "mediana"} e clareza de conteúdo ${contentClarity > 75 ? "excelente" : contentClarity > 65 ? "boa" : "mediana"}.`,
    apiUsed: false,
    generated: true,
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    message: "Análise simulada (API key OpenAI não configurada)"
  };
}
