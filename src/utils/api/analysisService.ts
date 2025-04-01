
import { analyzeSite } from '../analyzerUtils';
import { getPageInsightsData } from './pageInsightsService';
import { getChatGptAnalysis } from './chatGptService';
import { getClientsFromDatabase, updateClientInDatabase, saveAnalysisResult } from './supabaseClient';
import { toast } from 'sonner';

// Função para determinar o status com base nas pontuações
function determineStatus(seoScore: number, aioScore: number): 'Saudável' | 'A melhorar' | 'Crítico' {
  const averageScore = (seoScore + aioScore) / 2;
  
  if (averageScore >= 80) return 'Saudável';
  if (averageScore >= 60) return 'A melhorar';
  return 'Crítico';
}

// Função para gerar recomendações com base nos dados de análise
function generateRecommendations(seo: any, aio: any) {
  const recommendations = [];

  // SEO recommendations
  if (seo.loadTimeDesktop > 3) {
    recommendations.push({
      suggestion: 'Otimize o tempo de carregamento da página para desktop',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 9,
    });
  }

  if (seo.loadTimeMobile > 5) {
    recommendations.push({
      suggestion: 'Otimize o tempo de carregamento da página para mobile',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 9,
    });
  }

  if (!seo.mobileFriendly) {
    recommendations.push({
      suggestion: 'Torne o site mobile-friendly',
      seoImpact: 'Alto',
      aioImpact: 'Médio',
      priority: 8,
    });
  }

  if (!seo.security) {
    recommendations.push({
      suggestion: 'Implemente HTTPS no seu site',
      seoImpact: 'Alto',
      aioImpact: 'Nenhum',
      priority: 10,
    });
  }

  // More SEO recommendations
  if (seo.imageOptimization < 60) {
    recommendations.push({
      suggestion: 'Otimize as imagens do site',
      seoImpact: 'Médio',
      aioImpact: 'Baixo',
      priority: 6,
    });
  }

  if (seo.headingsStructure < 60) {
    recommendations.push({
      suggestion: 'Melhore a estrutura de headings do site',
      seoImpact: 'Médio',
      aioImpact: 'Alto',
      priority: 7,
    });
  }

  if (seo.metaTags < 60) {
    recommendations.push({
      suggestion: 'Otimize as meta tags do site',
      seoImpact: 'Médio',
      aioImpact: 'Baixo',
      priority: 5,
    });
  }

  // AIO recommendations
  if (aio.contentClarity < 60) {
    recommendations.push({
      suggestion: 'Melhore a clareza do conteúdo do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 7,
    });
  }

  if (aio.logicalStructure < 60) {
    recommendations.push({
      suggestion: 'Melhore a estrutura lógica do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 6,
    });
  }

  if (aio.naturalLanguage < 60) {
    recommendations.push({
      suggestion: 'Melhore a linguagem natural do site',
      seoImpact: 'Baixo',
      aioImpact: 'Alto',
      priority: 5,
    });
  }

  return recommendations;
}

// Função combinada para obter análise completa de SEO e AIO
export async function getFullAnalysis(url: string) {
  try {
    toast('Analisando site...', {
      description: 'A análise pode demorar alguns segundos.',
    });
    
    // Busca dados do Google Page Insights para SEO
    const seoData = await getPageInsightsData(url);
    
    // Busca dados de AI usando o OpenAI
    console.log('Iniciando análise de IA para:', url);
    const mockContent = ""; // Conteúdo vazio para usar URL na análise
    const aioResult = await getChatGptAnalysis(url, mockContent);
    console.log('Resultado da análise de IA:', aioResult);
    
    return {
      url: url,
      timestamp: new Date().toISOString(),
      status: determineStatus(seoData.score, aioResult.score),
      overallStatus: determineStatus(seoData.score, aioResult.score),
      seo: seoData,
      aio: aioResult,
      recommendations: generateRecommendations(seoData, aioResult)
    };
  } catch (error) {
    console.error('Error performing full analysis:', error);
    return analyzeSite(url);
  }
}

// Função para analisar múltiplos clientes em sequência
export async function analyzeBulkClients(clientIds: number[]) {
  // Busca os clientes do Supabase
  const clients = await getClientsFromDatabase();
  const clientsToAnalyze = clients.filter(client => clientIds.includes(client.id));
  
  for (const client of clientsToAnalyze) {
    try {
      if (!client.website) continue;
      
      // Realiza a análise completa
      const result = await getFullAnalysis(client.website);
      
      // Atualiza cliente com resultados da análise
      client.lastReport = new Date().toISOString().split('T')[0];
      client.seoScore = result.seo.score;
      client.aioScore = result.aio.score;
      client.lastAnalysis = new Date();
      client.status = 'active';
      
      // Atualiza o cliente no Supabase
      await updateClientInDatabase(client);
      
      // Salva o resultado da análise no Supabase
      await saveAnalysisResult(client.id, result);
      
    } catch (error) {
      console.error(`Error analyzing client ${client.name}:`, error);
    }
  }
}
