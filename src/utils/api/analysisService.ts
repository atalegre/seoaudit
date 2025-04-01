
import { analyzeSite } from '../analyzerUtils';
import { getPageInsightsData } from './pageInsightsService';
import { getChatGptAnalysis } from './chatGptService';
import { getClientsFromDatabase, updateClientInDatabase, saveAnalysisResult } from './supabaseClient';
import { Client, AnalysisResult } from './types';

// Função combinada para obter análise completa de SEO e AIO
export async function getFullAnalysis(url: string): Promise<AnalysisResult> {
  try {
    // Para fins de demonstração, usaremos conteúdo simulado
    // Em uma aplicação real, buscaríamos o conteúdo real da URL
    const mockContent = "This is sample content from the website that would be analyzed";
    
    // Verifica se as chaves de API estão disponíveis
    const googleApiKey = localStorage.getItem('googlePageInsightsKey');
    const openaiApiKey = localStorage.getItem('chatGptApiKey');
    
    if (!googleApiKey || !openaiApiKey) {
      console.log('Using mock data for analysis as API keys are missing');
      return analyzeSite(url);
    }
    
    // Em uma implementação real:
    // 1. Buscaríamos dados de SEO do Google Page Insights
    // 2. Buscaríamos o conteúdo do site
    // 3. Enviaríamos o conteúdo para o ChatGPT para análise de AIO
    // 4. Combinaríamos os resultados
    
    // Por enquanto, retornaremos os dados simulados de analyzeSite
    return analyzeSite(url);
  } catch (error) {
    console.error('Error performing full analysis:', error);
    return analyzeSite(url);
  }
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
