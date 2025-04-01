
import { analyzeSite } from '../analyzerUtils';
import { getApiKey } from './supabaseClient';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Função para obter a análise do ChatGPT
export async function getChatGptAnalysis(url: string, content: string = ''): Promise<any> {
  try {
    console.log('Iniciando análise do ChatGPT para URL:', url);
    
    // Primeiro tenta obter a chave da API do Supabase
    let apiKey = await getApiKey('chatGptApiKey');
    
    // Se não encontrou no Supabase, tenta do localStorage como fallback
    if (!apiKey) {
      apiKey = localStorage.getItem('chatGptApiKey');
      console.log('API Key obtida do localStorage:', apiKey ? 'Sim (encontrada)' : 'Não (não encontrada)');
    } else {
      console.log('API Key obtida do Supabase');
    }
    
    if (!apiKey) {
      console.log('Usando função Edge para análise de IA');
      
      try {
        // Chamar a função Edge do Supabase
        console.log('Chamando função Edge do Supabase para análise do site');
        
        // Adicionar um timestamp para ajudar a identificar a solicitação nos logs
        const requestTimestamp = new Date().toISOString();
        console.log(`[${requestTimestamp}] Enviando solicitação para Edge function com URL: ${url}`);
        
        const { data, error } = await supabase.functions.invoke('analyze-website', {
          body: { 
            url, 
            content,
            timestamp: requestTimestamp
          }
        });
        
        if (error) {
          console.error(`[${requestTimestamp}] Erro na função Edge:`, error);
          throw error;
        }

        console.log(`[${requestTimestamp}] Resposta da função Edge recebida:`, data);
        
        // Verificar se a resposta contém os dados esperados
        if (!data || (!data.score && data.score !== 0)) {
          console.warn(`[${requestTimestamp}] Resposta da Edge function não contém score:`, data);
          throw new Error('Resposta da função Edge não contém os dados esperados');
        }
        
        // Se chegou até aqui, a API foi usada com sucesso
        if (data.apiUsed) {
          toast.success('Análise realizada com API OpenAI', {
            description: 'A API do OpenAI foi utilizada para análise'
          });
        }
        
        return data;
      } catch (edgeFunctionError) {
        console.error('Erro ao usar função Edge para análise:', edgeFunctionError);
        toast.error('Erro na análise do site via Edge function', {
          description: 'Usando análise local como fallback'
        });
        console.log('Usando análise local como fallback devido ao erro na função Edge');
        return analyzeSite(url).aio;
      }
    }

    // Usando API key direta fornecida pelo usuário
    console.log('Chamando API do OpenAI diretamente com API key');
    
    // Criando o prompt para análise
    const systemPrompt = "Você é um analisador de conteúdo de websites que avalia clareza, estrutura e qualidade da linguagem natural. Forneça pontuações numéricas exatas de 0-100 para clareza de conteúdo, estrutura lógica e linguagem natural, além de uma pontuação geral. Identifique tópicos principais e partes confusas.";
    
    const userPrompt = content 
      ? `Analise este conteúdo de website da URL ${url}: ${content}`
      : `Analise este website: ${url}. Por favor, analise a estrutura e qualidade do conteúdo com base na URL. Forneça pontuações numéricas claras.`;
    
    console.log('System prompt:', systemPrompt);
    console.log('User prompt:', userPrompt);
    
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
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Falha na requisição à API OpenAI:', response.status, response.statusText, errorData);
      throw new Error(`Falha na requisição à API OpenAI: ${response.status} ${response.statusText}`);
    }
    
    console.log('Resposta da API OpenAI recebida');
    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content || '';
    console.log('Texto completo de análise da API OpenAI:', analysisText);
    
    // Notificar usuário que a API foi usada
    toast.success('Análise realizada com API OpenAI', {
      description: 'A API do OpenAI foi utilizada diretamente para análise'
    });
    
    try {
      // Extrair dados da resposta do ChatGPT
      console.log('Extraindo métricas da resposta da API');
      const scoreMatch = analysisText.match(/pontuação geral.*?(\d+)/i) || analysisText.match(/overall score.*?(\d+)/i);
      const clarityMatch = analysisText.match(/clareza de conteúdo.*?(\d+)/i) || analysisText.match(/content clarity.*?(\d+)/i);
      const structureMatch = analysisText.match(/estrutura lógica.*?(\d+)/i) || analysisText.match(/logical structure.*?(\d+)/i);
      const languageMatch = analysisText.match(/linguagem natural.*?(\d+)/i) || analysisText.match(/natural language.*?(\d+)/i);
      
      console.log('Matches encontrados:', {
        score: scoreMatch?.[1],
        clarity: clarityMatch?.[1],
        structure: structureMatch?.[1],
        language: languageMatch?.[1]
      });
      
      // Extrair tópicos (abordagem simplificada)
      const topicsMatch = analysisText.match(/tópicos principais:.*?\n([\s\S]*?)\n\n/i) || analysisText.match(/key topics:.*?\n([\s\S]*?)\n\n/i);
      const confusingMatch = analysisText.match(/partes confusas:.*?\n([\s\S]*?)(\n\n|$)/i) || analysisText.match(/confusing parts:.*?\n([\s\S]*?)(\n\n|$)/i);
      
      const topics = topicsMatch ? 
        topicsMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
        ['Marketing Digital', 'SEO', 'Presença Online'];
        
      const confusingParts = confusingMatch ?
        confusingMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(Boolean) :
        ['Parágrafos muito longos', 'Informação técnica sem explicação'];
      
      const result = {
        score: parseInt(scoreMatch?.[1] || '70'),
        contentClarity: parseInt(clarityMatch?.[1] || '65'),
        logicalStructure: parseInt(structureMatch?.[1] || '75'),
        naturalLanguage: parseInt(languageMatch?.[1] || '80'),
        topicsDetected: topics,
        confusingParts: confusingParts,
        rawAnalysis: analysisText, // Include the raw response for debugging
        apiUsed: true // Confirmar que a API foi usada
      };
      
      console.log('Análise extraída com sucesso:', result);
      return result;
    } catch (parseError) {
      console.error('Erro ao analisar resposta do ChatGPT:', parseError);
      console.log('Texto completo da resposta:', analysisText);
      console.log('Usando análise local como fallback devido a erro no parsing');
      return analyzeSite(url).aio;
    }
  } catch (error) {
    console.error('Erro ao buscar análise do ChatGPT:', error);
    console.log('Usando análise local como fallback devido a erro geral');
    return analyzeSite(url).aio;
  }
}
