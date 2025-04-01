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
      toast.warning('Chave da API Google Page Insights não encontrada', {
        description: 'Configure a chave nas configurações para obter análise de SEO real.',
      });
      
      // Use o analisador local como fallback
      console.log('Using local analyzer as fallback');
      return analyzeSite(url).seo;
    }

    toast('Analisando SEO com Google Page Insights...', {
      description: 'Isso pode levar alguns segundos.',
    });

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=performance&category=seo&category=best-practices`;
    
    console.log('Fetching Google Page Insights data from:', apiUrl.replace(apiKey, '[API_KEY_HIDDEN]'));
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Page Insights API error:', errorData);
      throw new Error(`Erro ao acessar API do Google Page Insights: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Google Page Insights API response received successfully');
    
    // Log a small portion of the response to avoid flooding the console
    if (data) {
      console.log('API response preview:', 
        JSON.stringify({
          kind: data.kind,
          id: data.id,
          responseCode: data.responseCode,
          analysisUTCTimestamp: data.analysisUTCTimestamp
        })
      );
    }
    
    return processPageInsightsData(data, url);
  } catch (error) {
    console.error('Error fetching Page Insights data:', error);
    toast.error('Erro ao buscar dados do Google Page Insights', {
      description: 'Utilizando análise local como alternativa.',
    });
    
    // Use o analisador local como fallback
    console.log('Using local analyzer as fallback due to error');
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
    
    // Extrair Core Web Vitals
    const lcpValue = data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue;
    const lcp = lcpValue ? Math.round(lcpValue / 10) / 100 : 3.5; // Converter para segundos e arredondar
    
    const fidValue = data.lighthouseResult?.audits?.['max-potential-fid']?.numericValue;
    const fid = fidValue ? Math.round(fidValue) : 120; // Arredondar para ms
    
    const clsValue = data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue;
    const cls = clsValue ? Math.round(clsValue * 100) / 100 : 0.15; // Arredondar para duas casas decimais
    
    // Extrair tempos de carregamento
    const loadTimeDesktop = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 3.5;
    const loadTimeMobile = data.loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000 || 5.2;
    
    // Extrair informações de usabilidade móvel
    const mobileFriendly = data.lighthouseResult?.audits?.['viewport']?.score === 1;
    const tapTargetsAudit = data.lighthouseResult?.audits?.['tap-targets'];
    const tapTargetsScore = tapTargetsAudit?.score || 0;
    const tapTargetsDetails = tapTargetsAudit?.details?.items || [];
    
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
      mobileFriendly: mobileFriendly,
      security: audits['is-on-https']?.score === 1,
      imageOptimization: Math.round((audits['uses-optimized-images']?.score || 0.6) * 100),
      headingsStructure: Math.round((audits['document-title']?.score || 0.7) * 100),
      metaTags: Math.round((audits['meta-description']?.score || 0.5) * 100),
      // Core Web Vitals
      lcp: lcp,
      fid: fid,
      cls: cls,
      // Mobile usability details
      tapTargetsScore: tapTargetsScore * 100,
      tapTargetsIssues: tapTargetsDetails.length,
      recommendations: auditItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        importance: item.importance
      }))
    };
  } catch (error) {
    console.error('Error processing Page Insights data:', error);
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
    'crawlable-anchors',
    'largest-contentful-paint',
    'cumulative-layout-shift',
    'total-blocking-time'
  ];
  
  const mediumImportanceAudits = [
    'uses-optimized-images',
    'tap-targets',
    'structured-data',
    'hreflang',
    'plugins',
    'first-contentful-paint',
    'interactive'
  ];
  
  if (highImportanceAudits.includes(auditId)) return 3;
  if (mediumImportanceAudits.includes(auditId)) return 2;
  return 1;
}
