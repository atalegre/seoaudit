import { analyzeSite } from '../analyzerUtils';
import { getApiKey } from './supabaseClient';
import { supabase } from '@/integrations/supabase/client';

// Função para obter a análise do ChatGPT
export async function getChatGptAnalysis(url: string, content: string): Promise<any> {
  try {
    // Primeiro tenta obter a chave da API do Supabase
    let apiKey = await getApiKey('chatGptApiKey');
    
    // Se não encontrou no Supabase, tenta do localStorage como fallback
    if (!apiKey) {
      apiKey = localStorage.getItem('chatGptApiKey');
    }
    
    if (!apiKey) {
      console.log('Usando função Edge para análise de IA');
      
      try {
        // Chamar a função Edge do Supabase
        const { data, error } = await supabase.functions.invoke('analyze-website', {
          body: { url, content }
        });
        
        if (error) {
          console.error('Erro ao chamar a função Edge:', error);
          throw error;
        }
        
        console.log('Resposta da análise de IA:', data);
        return data;
      } catch (edgeFunctionError) {
        console.error('Erro ao usar função Edge para análise:', edgeFunctionError);
        // Uso de dados simulados como fallback
        return analyzeSite(url).aio;
      }
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an AI content analyzer that evaluates websites for clarity, structure, and natural language quality. Provide scores from 0-100 for content clarity, logical structure, and natural language, plus an overall score. Identify key topics and confusing parts."
            },
            {
              role: "user",
              content: `Analyze this website content from ${url}: ${content}`
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch ChatGPT analysis');
      }
      
      const data = await response.json();
      const analysisText = data.choices[0]?.message?.content || '';
      console.log("ChatGPT API response:", analysisText);
      
      try {
        // Try to extract data from the ChatGPT response
        // This is a basic example - you would need more sophisticated parsing in production
        const scoreMatch = analysisText.match(/overall score.*?(\d+)/i);
        const clarityMatch = analysisText.match(/content clarity.*?(\d+)/i);
        const structureMatch = analysisText.match(/logical structure.*?(\d+)/i);
        const languageMatch = analysisText.match(/natural language.*?(\d+)/i);
        
        // Extract topics (this is a simplified approach)
        const topicsMatch = analysisText.match(/key topics:.*?\n([\s\S]*?)\n\n/i);
        const confusingMatch = analysisText.match(/confusing parts:.*?\n([\s\S]*?)(\n\n|$)/i);
        
        const topics = topicsMatch ? 
          topicsMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
          ['Marketing Digital', 'SEO', 'Presença Online'];
          
        const confusingParts = confusingMatch ?
          confusingMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
          ['Parágrafos muito longos', 'Informação técnica sem explicação'];
        
        return {
          score: parseInt(scoreMatch?.[1] || '70'),
          contentClarity: parseInt(clarityMatch?.[1] || '65'),
          logicalStructure: parseInt(structureMatch?.[1] || '75'),
          naturalLanguage: parseInt(languageMatch?.[1] || '80'),
          topicsDetected: topics,
          confusingParts: confusingParts
        };
      } catch (parseError) {
        console.error('Error parsing ChatGPT response:', parseError);
        return analyzeSite(url).aio;
      }
    } catch (error) {
      console.error('Error fetching ChatGPT analysis:', error);
      // Fallback para dados simulados
      return analyzeSite(url).aio;
    }
  } catch (error) {
    console.error('Error fetching ChatGPT analysis:', error);
    // Fallback para dados simulados
    return analyzeSite(url).aio;
  }
}
