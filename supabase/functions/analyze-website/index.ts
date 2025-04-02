
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
    
    // Return simulated data in case of error
    const fallbackData = {
      score: 65,
      contentClarity: 70,
      logicalStructure: 60,
      naturalLanguage: 75,
      topicsDetected: ["Marketing Digital", "SEO", "Web"],
      confusingParts: ["Seção 'Sobre Nós' com informações insuficientes"],
      analysis: "Análise de fallback devido a erro na API.",
      apiUsed: false,
      error: error.message || 'Erro interno ao analisar website',
      generated: true
    };
    
    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Return 200 with simulated data instead of error
    });
  }
});
