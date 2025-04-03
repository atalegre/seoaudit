
import { corsHeaders } from "./corsHeaders.ts";
import { getSystemPrompt, getUserPrompt } from "./prompts.ts";
import OpenAI from "openai";

/**
 * Request analysis from OpenAI API
 * @param url Website URL to analyze
 * @param content Optional website content to analyze
 * @param requestId Unique request ID for logging
 * @returns Analysis results from OpenAI
 */
export async function requestOpenAiAnalysis(url: string, content: string, requestId: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const systemPrompt = getSystemPrompt();
  const userPrompt = getUserPrompt(url, content);

  console.log(`[${requestId}] System prompt:`, systemPrompt);
  console.log(`[${requestId}] User prompt:`, userPrompt);
  console.log(`[${requestId}] Enviando requisição para API OpenAI com modelo gpt-4o-search-preview`);
  
  const startTime = Date.now();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-search-preview",
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
      web_search_options: {
        search_context_size: 'high'
      }
    })
  });
  
  const responseTime = Date.now() - startTime;
  console.log(`[${requestId}] Tempo de resposta da API OpenAI: ${responseTime}ms`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`[${requestId}] Erro na API OpenAI: ${response.status} ${response.statusText}`, errorData);
    
    // Check if it's an API key error and provide a more specific message
    const isApiKeyError = errorData.error?.code === "invalid_api_key" || 
                         errorData.error?.message?.includes("API key");
    
    throw new Error(isApiKeyError 
      ? 'Chave API OpenAI inválida ou desatualizada' 
      : `Erro na API OpenAI: ${response.status} ${response.statusText}`);
  }
  
  console.log(`[${requestId}] Resposta da API OpenAI recebida`);
  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    console.error(`[${requestId}] Resposta da OpenAI não contém choices:`, data);
    throw new Error('Resposta inválida da API OpenAI');
  }
  
  const analysisText = data.choices[0]?.message?.content || '';
  console.log(`[${requestId}] Resposta da API OpenAI:`, analysisText.substring(0, 300) + '...');
  
  try {
    // Parse JSON response
    const jsonResult = JSON.parse(analysisText);
    console.log(`[${requestId}] JSON extraído com sucesso:`, jsonResult);
    
    // Add tracking information
    return {
      ...jsonResult,
      apiUsed: true,
      requestId: requestId,
      timestamp: new Date().toISOString(),
      rawAnalysis: analysisText
    };
  } catch (parseError) {
    console.error(`[${requestId}] Erro ao analisar o JSON da resposta:`, parseError);
    console.log(`[${requestId}] Tentando extrair dados da resposta em texto:`, analysisText);
    throw new Error(`Falha ao analisar resposta da API: ${parseError.message}`);
  }
}
