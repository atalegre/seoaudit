
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
        const { data, error } = await supabase.functions.invoke('analyze-website', {
          body: { url, content }
        });
        
        if (error) {
          console.error('Erro na função Edge:', error);
          throw error;
        }

        console.log('Resposta da função Edge recebida:', data);
        return data;
      } catch (edgeFunctionError) {
        console.error('Erro ao usar função Edge para análise:', edgeFunctionError);
        console.log('Usando análise local como fallback devido ao erro na função Edge');
        return analyzeSite(url).aio;
      }
    }

    console.log('Chamando API do OpenAI diretamente com API key');
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
            content: "Você é um analisador de conteúdo de websites que avalia clareza, estrutura e qualidade da linguagem natural. Forneça pontuações de 0-100 para clareza de conteúdo, estrutura lógica e linguagem natural, além de uma pontuação geral. Identifique tópicos principais e partes confusas."
          },
          {
            role: "user",
            content: `Analise este conteúdo de website da URL ${url}: ${content || 'Por favor, analise a estrutura e qualidade do conteúdo com base na URL.'}`
          }
        ]
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
    console.log('Texto de análise da API OpenAI:', analysisText.substring(0, 100) + '...');
    
    try {
      // Extrair dados da resposta do ChatGPT
      console.log('Extraindo métricas da resposta da API');
      const scoreMatch = analysisText.match(/pontuação geral.*?(\d+)/i) || analysisText.match(/overall score.*?(\d+)/i);
      const clarityMatch = analysisText.match(/clareza de conteúdo.*?(\d+)/i) || analysisText.match(/content clarity.*?(\d+)/i);
      const structureMatch = analysisText.match(/estrutura lógica.*?(\d+)/i) || analysisText.match(/logical structure.*?(\d+)/i);
      const languageMatch = analysisText.match(/linguagem natural.*?(\d+)/i) || analysisText.match(/natural language.*?(\d+)/i);
      
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
        confusingParts: confusingParts
      };
      
      console.log('Análise extraída com sucesso:', result);
      return result;
    } catch (parseError) {
      console.error('Erro ao analisar resposta do ChatGPT:', parseError);
      console.log('Usando análise local como fallback devido a erro no parsing');
      return analyzeSite(url).aio;
    }
  } catch (error) {
    console.error('Erro ao buscar análise do ChatGPT:', error);
    console.log('Usando análise local como fallback devido a erro geral');
    return analyzeSite(url).aio;
  }
}
