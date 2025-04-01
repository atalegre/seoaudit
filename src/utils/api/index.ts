
// Export all public functions from services

// Types
export * from './types';

// Serviços específicos
export * from './userService';
export * from './clientService';

// Supabase Client
export { 
  saveAnalysisResult,
  getClientAnalysisHistory,
  storeApiKey,
  getApiKey
} from './supabaseClient';

// Analysis services
export { getPageInsightsData } from './pageInsightsService';
export { getChatGptAnalysis } from './chatGptService';
export { processBulkImport } from './bulkImportService';
export { getFullAnalysis, analyzeBulkClients } from './analysisService';
