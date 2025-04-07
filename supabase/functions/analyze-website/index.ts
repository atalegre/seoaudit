
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "./corsHeaders.ts";
import { analyzeWebsite } from "./analyzeWebsite.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await analyzeWebsite(req);
  } catch (error) {
    console.error('Erro ao analisar website:', error);
    
    // Retornar erro real sem dados simulados
    return new Response(JSON.stringify({
      error: error.message || 'Erro interno ao analisar website',
      apiUsed: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 // Return error status instead of fake data
    });
  }
});
