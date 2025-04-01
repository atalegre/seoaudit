
import { createClient } from '@supabase/supabase-js';
import { AnalysisResult, SeoAnalysisResult, AioAnalysisResult, StatusClassification } from './types';
import { supabase as supabaseInstance } from '@/integrations/supabase/client';

// Usar a instância do Supabase da integração
const supabase = supabaseInstance;

// Função para salvar resultados de análise no Supabase
export async function saveAnalysisResult(clientId: number, result: AnalysisResult): Promise<void> {
  try {
    const analysisData = {
      client_id: clientId.toString(), // Convert to string to match DB schema
      url: result.url,
      timestamp: result.timestamp,
      seo_score: result.seo.score,
      aio_score: result.aio.score,
      seo_data: result.seo,
      aio_data: result.aio,
      overall_status: result.overallStatus
    };
    
    const { error } = await supabase
      .from('analysis_results')
      .insert(analysisData);
    
    if (error) {
      throw error;
    }
    
    console.log(`Análise para cliente ${clientId} salva com sucesso`);
  } catch (error) {
    console.error('Erro ao salvar análise no Supabase:', error);
    // Fallback para localStorage
    const analysisResults = JSON.parse(localStorage.getItem('analysis_results') || '[]');
    analysisResults.push({
      client_id: clientId,
      url: result.url,
      timestamp: result.timestamp,
      seo_score: result.seo.score,
      aio_score: result.aio.score,
      seo_data: result.seo,
      aio_data: result.aio,
      overall_status: result.overallStatus
    });
    localStorage.setItem('analysis_results', JSON.stringify(analysisResults));
  }
}

// Função para buscar histórico de análises de um cliente
export async function getClientAnalysisHistory(clientId: number): Promise<AnalysisResult[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('client_id', clientId.toString()) // Convert to string to match DB schema
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transforma o formato do banco de dados para o formato da aplicação
    return ((data || []).map(item => ({
      url: item.url,
      timestamp: item.timestamp,
      seo: item.seo_data,
      aio: item.aio_data,
      overallStatus: item.overall_status,
      recommendations: [] // Add this property to match AnalysisResult type
    }))) as unknown as AnalysisResult[];
  } catch (error) {
    console.error('Erro ao buscar histórico de análises:', error);
    
    // Fallback para localStorage
    const analysisResults = JSON.parse(localStorage.getItem('analysis_results') || '[]');
    const clientResults = analysisResults.filter((item: any) => item.client_id === clientId);
    
    return clientResults.map((item: any) => ({
      url: item.url,
      timestamp: item.timestamp,
      seo: item.seo_data,
      aio: item.aio_data,
      overallStatus: item.overall_status,
      recommendations: [] // Add this property to match AnalysisResult type
    })) as unknown as AnalysisResult[];
  }
}

// Função para armazenar chaves de API no Supabase
export async function storeApiKey(keyType: 'googlePageInsightsKey' | 'chatGptApiKey', value: string): Promise<void> {
  try {
    // Always store in localStorage for easier access
    localStorage.setItem(keyType, value);
    
    const { error } = await supabase
      .from('api_keys')
      .upsert({ 
        key_type: keyType, 
        key_value: value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key_type' });
    
    if (error) {
      console.error('Error storing API key in Supabase:', error);
      throw error;
    }
    
    console.log(`Chave de API ${keyType} armazenada com sucesso no Supabase`);
  } catch (error) {
    console.error('Erro ao armazenar chave de API no Supabase:', error);
    // Fallback para localStorage já feito no início da função
  }
}

// Função para obter chaves de API do Supabase
export async function getApiKey(keyType: 'googlePageInsightsKey' | 'chatGptApiKey'): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_type', keyType)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Registro não encontrado
        console.log(`API key ${keyType} not found in Supabase, checking localStorage`);
      } else {
        console.error(`Erro ao buscar chave de API ${keyType} do Supabase:`, error);
      }
      // Em caso de erro, tenta buscar do localStorage
      return localStorage.getItem(keyType);
    }
    
    // If found in Supabase, also update localStorage for easier access
    if (data?.key_value) {
      localStorage.setItem(keyType, data.key_value);
      return data.key_value;
    }
    
    // Fallback para localStorage
    return localStorage.getItem(keyType);
  } catch (error) {
    console.error(`Erro ao buscar chave de API ${keyType}:`, error);
    
    // Fallback para localStorage
    return localStorage.getItem(keyType);
  }
}
