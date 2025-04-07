
// Export all public functions from services

// Types
export * from './types';

// Serviços específicos
export * from './userService';
export * from './clientService';
export * from './logoService';
export * from './bulkImportService';
export * from './searchConsole';  // Updated to use new modular structure

// Supabase Client
export { 
  saveAnalysisResult,
  getClientAnalysisHistory,
  storeApiKey,
  getApiKey
} from './supabaseClient';

// Analysis services
export { getPageInsightsData } from './pageInsights';
export { getChatGptAnalysis } from './chatGptService';
export { getFullAnalysis } from './analysisService';

// Utility functions
export { extractDomainFromUrl } from '../domainUtils';
