
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers para permitir chamadas do frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratamento das solicitações OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY não está configurada nas variáveis de ambiente');
      return new Response(JSON.stringify({
        error: 'API Key OpenAI não configurada no servidor',
        apiUsed: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    console.log('Edge function foi chamada - API Key OpenAI encontrada');

    // Pegar URL e conteúdo da requisição
    const { url, content, timestamp } = await req.json();
    
    if (!url) {
      throw new Error('URL é obrigatória');
    }

    const requestId = crypto.randomUUID();
    console.log(`[${requestId}] Analisando URL: ${url} - Timestamp: ${timestamp || 'não fornecido'}`);

    // Criar prompts mais específicos com formato JSON para melhorar a análise
    const systemPrompt = `
Você é um analisador especializado em websites. 
Analise o site com base no URL e conteúdo fornecido.
Avalie também como o site se comporta para algoritmos de IA.
VOCÊ DEVE RESPONDER NO SEGUINTE FORMATO JSON:

{
  "score": [0-100],
  "contentClarity": [0-100],
  "logicalStructure": [0-100],
  "naturalLanguage": [0-100],
  "topicsDetected": ["tópico1", "tópico2", "tópico3"],
  "confusingParts": ["parte confusa 1", "parte confusa 2"],
  "analysis": "Sua análise textual detalhada aqui"
}

Não inclua mais nada além do JSON acima. Não forneça introduções, conclusões ou qualquer outro texto.`;
    
    const userPrompt = content 
      ? `Analise este site: ${url}\n\nConteúdo: ${content}\n\nForneça sua análise no formato JSON especificado.`
      : `Analise este site: ${url}\n\nForneça sua análise no formato JSON especificado.`;

    console.log(`[${requestId}] System prompt:`, systemPrompt);
    console.log(`[${requestId}] User prompt:`, userPrompt);
    console.log(`[${requestId}] Enviando requisição para API OpenAI com modelo gpt-4o-mini`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
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
          response_format: { type: "json_object" },
          max_tokens: 1000
        })
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`[${requestId}] Tempo de resposta da API OpenAI: ${responseTime}ms`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[${requestId}] Erro na API OpenAI: ${response.status} ${response.statusText}`, errorData);
        
        // Verificar se é um erro de chave API e fornecer uma mensagem mais específica
        const isApiKeyError = errorData.error?.code === "invalid_api_key" || 
                             errorData.error?.message?.includes("API key");
        
        return new Response(JSON.stringify({
          error: isApiKeyError 
            ? 'Chave API OpenAI inválida ou desatualizada' 
            : `Erro na API OpenAI: ${response.status} ${response.statusText}`,
          apiUsed: false,
          details: errorData
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502
        });
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
        // Tentar fazer parse do JSON da resposta
        const jsonResult = JSON.parse(analysisText);
        console.log(`[${requestId}] JSON extraído com sucesso:`, jsonResult);
        
        // Adicionar informações de identificação e tracking
        const result = {
          ...jsonResult,
          apiUsed: true,
          requestId: requestId,
          timestamp: new Date().toISOString(),
          rawAnalysis: analysisText
        };
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
        
      } catch (parseError) {
        console.error(`[${requestId}] Erro ao analisar o JSON da resposta:`, parseError);
        console.log(`[${requestId}] Tentando extrair dados da resposta em texto:`, analysisText);
        
        return new Response(JSON.stringify({
          error: `Falha ao analisar resposta da API: ${parseError.message}`,
          apiUsed: false,
          rawResponse: analysisText
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
    } catch (fetchError) {
      console.error(`[${requestId}] Erro ao chamar a API OpenAI:`, fetchError);
      
      return new Response(JSON.stringify({
        error: `Falha na conexão com a API OpenAI: ${fetchError.message}`,
        apiUsed: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 503
      });
    }
  } catch (error) {
    console.error('Erro ao analisar website:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Erro interno ao analisar website',
      apiUsed: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
