
import { AnalysisResult } from '@/utils/api/types';
import { toast } from 'sonner';

// Storage keys and TTL for caching
export const ANALYSIS_STORAGE_KEY = 'web_analysis_results';
export const ANALYSIS_URL_KEY = 'web_analysis_url';
export const CACHE_TTL = 1000 * 60 * 30; // 30 min cache

/**
 * Saves analysis result to local storage cache
 */
export function saveToCache(urlParam: string, results: AnalysisResult) {
  try {
    localStorage.setItem(ANALYSIS_URL_KEY, urlParam);
    localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(results));
    localStorage.setItem(ANALYSIS_STORAGE_KEY + '_time', Date.now().toString());
  } catch (storageError) {
    console.warn('Não foi possível salvar no cache:', storageError);
  }
}

/**
 * Loads and validates analysis from cache
 */
export function loadFromCache(urlParam: string): { 
  validCache: boolean; 
  cachedAnalysis: AnalysisResult | null 
} {
  try {
    const storedUrl = localStorage.getItem(ANALYSIS_URL_KEY);
    const storedAnalysis = localStorage.getItem(ANALYSIS_STORAGE_KEY);
    const storedTimestamp = localStorage.getItem(ANALYSIS_STORAGE_KEY + '_time');
    
    // Check if we have valid cached data
    if (storedUrl === urlParam && storedAnalysis && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp);
      
      // Use cache if it's not expired
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log('Usando análise em cache para URL:', urlParam);
        const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult;
        
        return { validCache: true, cachedAnalysis: parsedAnalysis };
      }
    }
    
    return { validCache: false, cachedAnalysis: null };
  } catch (parseError) {
    console.error('Erro ao analisar dados em cache:', parseError);
    return { validCache: false, cachedAnalysis: null };
  }
}

/**
 * Notifies user that cached data is being used
 */
export function notifyCachedData() {
  toast('Usando análise em cache', {
    description: 'Mostrando resultados da análise anterior',
    duration: 3000
  });
}

/**
 * Clears the analysis cache
 */
export function clearCache() {
  localStorage.removeItem(ANALYSIS_STORAGE_KEY);
  localStorage.removeItem(ANALYSIS_URL_KEY);
  localStorage.removeItem(ANALYSIS_STORAGE_KEY + '_time');
}
