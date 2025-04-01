
// Exporta todas as funções públicas dos serviços

// Tipos
export * from './types';

// Cliente Supabase
export { 
  getClientsFromDatabase,
  saveClientsToDatabase,
  updateClientInDatabase,
  saveAnalysisResult,
  getClientAnalysisHistory,
  storeApiKey,
  getApiKey
} from './supabaseClient';

// Serviços de análise
export { getPageInsightsData } from './pageInsightsService';
export { getChatGptAnalysis } from './chatGptService';
export { processBulkImport } from './bulkImportService';
export { getFullAnalysis, analyzeBulkClients } from './analysisService';
