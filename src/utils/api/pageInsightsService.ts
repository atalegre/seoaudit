
import { analyzeSite } from '../analyzerUtils';
import { getApiKey } from './supabaseClient';
import { toast } from 'sonner';

// Função para obter os dados do Google Page Insights
export async function getPageInsightsData(url: string): Promise<any> {
  try {
    // Primeiro tenta obter a chave da API do Supabase
    let apiKey = await getApiKey('googlePageInsightsKey');
    
    // Se não encontrou no Supabase, tenta do localStorage como fallback
    if (!apiKey) {
      apiKey = localStorage.getItem('googlePageInsightsKey');
    }
    
    if (!apiKey) {
      console.error('Google Page Insights API key not found');
      toast('Chave da API Google Page Insights não encontrada', {
        description: 'Configure a chave nas configurações para obter análise de SEO real.',
      });
      // Usa dados simulados quando a chave da API não está disponível
      return analyzeSite(url).seo;
    }

    toast('Analisando SEO com Google Page Insights...', {
      description: 'Isso pode levar alguns segundos.',
    });

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=seo&category=best-practices`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch Page Insights data: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Processar os dados retornados pela API para um formato compatível com nossa aplicação
    return processPageInsightsData(data, url);
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    toast('Erro ao buscar dados do Google Page Insights', {
      description: 'Usando dados simulados como fallback.',
    });
    // Fallback para dados simulados
    return analyzeSite(url).seo;
  }
}

// Função para processar os dados retornados pela API do Google Page Insights
function processPageInsightsData(data: any, url: string): any {
  try {
    // Extrair a pontuação de SEO
    const seoScore = Math.round(data.lighthouseResult?.categories?.seo?.score * 100) || 70;
    
    // Extrair informações de performance
    const performanceScore = Math.round(data.lighthouseResult?.categories?.performance?.score * 100) || 65;
    
    // Extrair informações de práticas recomendadas
    const bestPracticesScore = Math.round(data.lighthouseResult?.categories?.['best-practices']?.score * 100) || 75;
    
    // Extrair tempos de carregamento
    const loadTimeDesktop = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 3.5;
    const loadTimeMobile = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 5.2;
    
    // Extrair auditorias para recomendações
    const audits = data.lighthouseResult?.audits || {};
    const auditItems = Object.keys(audits)
      .filter(key => !audits[key].score || audits[key].score < 0.9)
      .map(key => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        score: audits[key].score || 0,
        importance: getAuditImportance(key)
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
    
    // Construir estrutura de dados compatível com a aplicação
    return {
      score: seoScore,
      performanceScore: performanceScore,
      bestPracticesScore: bestPracticesScore,
      url: url,
      loadTimeDesktop: loadTimeDesktop,
      loadTimeMobile: loadTimeMobile,
      mobileFriendly: data.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category === 'FAST',
      security: audits['is-on-https']?.score === 1,
      imageOptimization: Math.round((audits['uses-optimized-images']?.score || 0.6) * 100),
      headingsStructure: Math.round((audits['document-title']?.score || 0.7) * 100),
      metaTags: Math.round((audits['meta-description']?.score || 0.5) * 100),
      recommendations: auditItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        importance: item.importance
      }))
    };
  } catch (error) {
    console.error('Error processing Page Insights data:', error);
    // Fallback para dados simulados
    return analyzeSite(url).seo;
  }
}

// Função para determinar a importância de cada auditoria
function getAuditImportance(auditId: string): number {
  const highImportanceAudits = [
    'is-on-https', 
    'viewport', 
    'document-title', 
    'meta-description', 
    'link-text', 
    'crawlable-anchors'
  ];
  
  const mediumImportanceAudits = [
    'uses-optimized-images',
    'tap-targets',
    'structured-data',
    'hreflang',
    'plugins'
  ];
  
  if (highImportanceAudits.includes(auditId)) return 3;
  if (mediumImportanceAudits.includes(auditId)) return 2;
  return 1;
}
