
import { corsHeaders } from "./corsHeaders.ts";
import { generateSimulatedAnalysis } from "./mockAnalysis.ts";
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
  
  // If there's no API key, simulate analysis instead of giving an error
  if (!OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY não está configurada - usando análise simulada');
    const { url, content } = await req.json().catch(() => ({ url: '', content: '' }));
    
    if (!url) {
      throw new Error('URL é obrigatória');
    }
    
    const result = generateSimulatedAnalysis(url);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
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
    if (error.message.includes('OpenAI')) {
      return new Response(JSON.stringify({
        error: error.message,
        apiUsed: false,
        details: error.details || {}
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502
      });
    } else {
      // For other errors, use simulated data
      const fallbackData = generateSimulatedAnalysis(url);
      fallbackData.error = error.message;
      
      return new Response(JSON.stringify(fallbackData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
  }
}
