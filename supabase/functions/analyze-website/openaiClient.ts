
import { corsHeaders } from "./corsHeaders.ts";
import { getSystemPrompt, getUserPrompt } from "./prompts.ts";
import { performAccessibilityAudit } from "./accessibilityAudit.ts";
// Using direct ESM import for OpenAI to ensure compatibility with Deno
import { OpenAI } from "https://esm.sh/openai@4.20.1";

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
  console.log(`[${requestId}] Enviando requisição para API OpenAI com modelo gpt-4o`);
  
  const startTime = Date.now();
  
  // Set timeout to 60 seconds (60000ms)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ]
      // Removed web_search_options that were previously here
    })
  });
  
  // Clear the timeout since we got a response
  clearTimeout(timeoutId);
  
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
    
    // Perform accessibility audit if content is available
    let accessibilityResults = null;
    if (content) {
      console.log(`[${requestId}] Realizando auditoria de acessibilidade WCAG/EAA`);
      accessibilityResults = performAccessibilityAudit(content);
      console.log(`[${requestId}] Resultado da auditoria de acessibilidade:`, accessibilityResults);
    }
    
    // Add tracking information
    return {
      ...jsonResult,
      accessibility: accessibilityResults,
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
