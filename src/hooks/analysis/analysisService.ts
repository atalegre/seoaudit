
import { AnalysisResult } from '@/utils/api/types';
import { getPageInsightsData } from '@/utils/api';
import { getChatGptAnalysis } from '@/utils/api/chatGptService';
import { createAnalysisResult } from '@/utils/resultsPageHelpers';
import { toast } from 'sonner';
import { preloadLogo } from './logoPreloader';

/**
 * Performs a website analysis for the given URL
 */
export async function performAnalysis(
  url: string,
  abortSignal: AbortSignal,
  callbacks: {
    onPartialResults: (results: AnalysisResult) => void;
    onSeoError: (error: string) => void;
    onAioError: (error: string) => void;
  }
): Promise<AnalysisResult> {
  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  
  toast('Análise em andamento...', {
    description: 'Aguarde enquanto analisamos o site.',
    duration: 3000
  });
  
  // Prepare the logo URL in advance to reduce LCP
  const logoUrl = preloadLogo(normalizedUrl);
  
  // Strategy for optimized parallel loading
  let seoData = null;
  let aioData = null;
  
  // Start both requests in parallel, but prioritize showing SEO data
  // which is usually faster to obtain
  const seoPromise = getPageInsightsData(normalizedUrl)
    .catch(error => {
      callbacks.onSeoError(error instanceof Error ? error.message : 'Erro desconhecido na análise SEO');
      console.error('Error fetching Page Insights data:', error);
      return null;
    });
  
  const aioPromise = getChatGptAnalysis(normalizedUrl)
    .catch(error => {
      callbacks.onAioError(error instanceof Error ? error.message : 'Erro desconhecido na análise AIO');
      console.error('Error fetching AIO data:', error);
      return null;
    });
  
  // Start both promises, but prioritize displaying the first results
  seoData = await seoPromise;
  
  // If we have SEO data, show partial results immediately
  if (seoData) {
    const partialResults = createAnalysisResult(normalizedUrl, seoData, null);
    if (logoUrl) {
      partialResults.logoUrl = logoUrl;
    }
    
    callbacks.onPartialResults(partialResults);
  }
  
  // Wait for AIO data (which was already loading in parallel)
  aioData = await aioPromise;
  
  // Create final result with all available data
  const finalResults = createAnalysisResult(normalizedUrl, seoData, aioData as any);
  
  if (logoUrl) {
    finalResults.logoUrl = logoUrl;
  }
  
  return finalResults;
}

/**
 * Shows a toast notification for analysis in progress
 */
export function notifyAnalysisStarted() {
  toast('Análise em andamento...', {
    description: 'Aguarde enquanto analisamos o site.',
    duration: 3000
  });
}

/**
 * Shows an error toast for analysis failure
 */
export function notifyAnalysisError() {
  toast.error('Erro ao analisar site', {
    description: 'Não foi possível completar a análise do site.',
  });
}
