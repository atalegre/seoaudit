
import { corsHeaders } from "./corsHeaders.ts";
import { requestOpenAiAnalysis } from "./openaiClient.ts";

/**
 * Main website analysis handler
 * @param req HTTP request
 * @returns HTTP response with analysis results
 */
export async function analyzeWebsite(req: Request): Promise<Response> {
  // Check authorization - now with better handling
  const authHeader = req.headers.get('authorization');
  // Make authorization optional for development
  const authRequired = Deno.env.get('REQUIRE_AUTH') === 'true';
  
  if (authRequired && (!authHeader || !authHeader.startsWith('Bearer '))) {
    console.error('Missing or invalid authorization header');
    return new Response(JSON.stringify({ 
      code: 401, 
      message: "Missing or invalid authorization header",
      error: "Authorization required" 
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  // Se não houver chave API, retornar erro em vez de simular
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY não está configurada');
    return new Response(JSON.stringify({
      error: 'Chave API OpenAI não configurada no servidor',
      code: 500,
      message: 'Configuração de servidor incompleta'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }

  console.log('Edge function foi chamada - API Key OpenAI encontrada');

  // Get URL and content from request
  const { url, content, timestamp } = await req.json().catch(() => ({ url: '', content: '', timestamp: '' }));
  
  if (!url) {
    throw new Error('URL é obrigatória');
  }

  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Analisando URL: ${url} - Timestamp: ${timestamp || 'não fornecido'}`);

  try {
    const result = await requestOpenAiAnalysis(url, content, requestId);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error(`[${requestId}] Erro ao chamar a API OpenAI:`, error);
    
    // If the error is specific to the OpenAI API
    return new Response(JSON.stringify({
      error: error.message,
      apiUsed: false,
      details: error.details || {}
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 502
    });
  }
}
