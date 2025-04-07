
import { AioAnalysisResult } from './types';

// Using a template URL that can be overridden by environment variables
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_URL || 'https://vwtracpgzdqrowvjmizi.supabase.co';

export async function getChatGptAnalysis(url: string): Promise<AioAnalysisResult> {
  console.log('Starting AIO analysis for URL:', url);
  const timestamp = new Date().toISOString();

  try {
    // Make sure the URL references the full path to the function
    console.log('Chamando edge function:', `${EDGE_FUNCTION_URL}/functions/v1/analyze-website`);
    
    const response = await fetch(`${EDGE_FUNCTION_URL}/functions/v1/analyze-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dHJhY3BnemRxcm93dmptaXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDA4ODIsImV4cCI6MjA1OTA3Njg4Mn0.WC6DrG_ftze64gQVajR-n1vjfjMqA_ADP_hyTShQckA'
      },
      body: JSON.stringify({
        url: url,
        content: '', // We can add content scraping later if needed
        timestamp: timestamp
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error in API OpenAI:', response.status, response.statusText, errorData);
      
      throw new Error(
        errorData.error || 
        `Error in OpenAI API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log('OpenAI API was used successfully for the analysis');
    
    // Se a API usou dados simulados, rejeitar
    if (data.generated === true) {
      throw new Error('A API OpenAI retornou dados simulados. Configure uma chave API válida.');
    }
    
    if (data.error) {
      throw new Error(`Erro na análise AIO: ${data.error}`);
    }
    
    // Process the response into the format expected by our frontend
    return {
      score: data.score || 0,
      contentClarity: data.contentClarity || 0,
      logicalStructure: data.logicalStructure || 0,
      naturalLanguage: data.naturalLanguage || 0,
      topicsDetected: data.topicsDetected || [],
      confusingParts: data.confusingParts || [],
    };
  } catch (error) {
    console.error('Error in getChatGptAnalysis:', error);
    throw error;
  }
}
