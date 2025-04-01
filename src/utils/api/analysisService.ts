import { analyzeSite, AnalysisResult as AnalyzerResult } from '../analyzerUtils';
import { getPageInsightsData } from './pageInsightsService';
import { getChatGptAnalysis } from './chatGptService';
import { getClientsFromDatabase, updateClientInDatabase, saveAnalysisResult } from './supabaseClient';
import { Client, AnalysisResult as ApiAnalysisResult } from './types';
import { toast } from 'sonner';

// Função combinada para obter análise completa de SEO e AIO
export async function getFullAnalysis(url: string): Promise<ApiAnalysisResult> {
  try {
    // Para fins de demonstração, usaremos conteúdo simulado
    // Em uma aplicação real, buscaríamos o conteúdo real da URL
    const mockContent = "This is sample content from the website that would be analyzed";
    
    // Primeiro, tentamos usar as APIs
    try {
      toast('Analisando site...', {
        description: 'A análise pode demorar alguns segundos.',
      });
      
      // Busca dados de AI usando o OpenAI
      console.log('Iniciando análise de IA para:', url);
      const aioResult = await getChatGptAnalysis(url, mockContent);
      console.log('Resultado da análise de IA:', aioResult);
      
      // Combina com dados de SEO simulados até termos a API do Google integrada
      const seoData = analyzeSite(url).seo;
      
      const result: ApiAnalysisResult = {
        url: url,
        timestamp: new Date().toISOString(),
        status: determineStatus(seoData.score, aioResult.score),
        overallStatus: determineStatus(seoData.score, aioResult.score),
        seo: seoData,
        aio: aioResult,
        recommendations: generateRecommendations(seoData, aioResult)
      };
      
      return result;
    } catch (apiError) {
      console.error('Erro na análise via API:', apiError);
      
      toast('Usando dados simulados para análise', {
        description: 'Não foi possível conectar às APIs externas.',
      });
      
      // Se falhar, volta para dados simulados
      return analyzeSite(url);
    }
  } catch (error) {
    console.error('Error performing full analysis:', error);
    return analyzeSite(url);
  }
}

// Helper function to determine status based on scores
function determineStatus(seoScore: number, aioScore: number): 'Saudável' | 'A melhorar' | 'Crítico' {
  const averageScore = (seoScore + aioScore) / 2;
  
  if (averageScore >= 80) return 'Saudável';
  if (averageScore >= 60) return 'A melhorar';
  return 'Crítico';
}

// Helper function to generate recommendations
function generateRecommendations(seo: any, aio: any) {
  // Existing code or use the recommendations from analyzeSite
  const recommendations = [];

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

// Função para analisar múltiplos clientes em sequência
export async function analyzeBulkClients(clientIds: number[]): Promise<void> {
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
