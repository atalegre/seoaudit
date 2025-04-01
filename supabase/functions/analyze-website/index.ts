
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
      throw new Error('OPENAI_API_KEY não está configurada');
    }

    // Pegar URL e conteúdo da requisição
    const { url, content } = await req.json();
    
    if (!url) {
      throw new Error('URL é obrigatória');
    }

    // Para análise real, utilizamos o conteúdo. 
    // Se não for fornecido, usamos apenas a URL para análise simplificada
    const prompt = content 
      ? `Analise este site: ${url}\n\nConteúdo: ${content}\n\nFaça uma análise detalhada de SEO e como modelos de IA interpretam este conteúdo.`
      : `Analise este site: ${url}\n\nFaça uma análise detalhada de SEO e como modelos de IA interpretam este URL.`;

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
            content: "Você é um analisador de websites especializado em SEO e otimização para IA. Forneça pontuações de 0-100 para clareza de conteúdo, estrutura lógica e linguagem natural, além de uma pontuação geral. Identifique tópicos principais e partes confusas."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro na API OpenAI: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content || '';
    console.log("Resposta da API OpenAI:", analysisText);
    
    try {
      // Extrair dados da resposta do OpenAI
      const scoreMatch = analysisText.match(/pontuação geral.*?(\d+)/i);
      const clarityMatch = analysisText.match(/clareza de conteúdo.*?(\d+)/i);
      const structureMatch = analysisText.match(/estrutura lógica.*?(\d+)/i);
      const languageMatch = analysisText.match(/linguagem natural.*?(\d+)/i);
      
      // Extrair tópicos (abordagem simplificada)
      const topicsMatch = analysisText.match(/tópicos principais:.*?\n([\s\S]*?)\n\n/i);
      const confusingMatch = analysisText.match(/partes confusas:.*?\n([\s\S]*?)(\n\n|$)/i);
      
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
        rawAnalysis: analysisText
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (parseError) {
      console.error('Erro ao analisar a resposta do OpenAI:', parseError);
      
      // Retornar os dados brutos se não conseguir analisar
      return new Response(JSON.stringify({
        score: 70,
        contentClarity: 65,
        logicalStructure: 75,
        naturalLanguage: 80,
        topicsDetected: ['Marketing Digital', 'SEO', 'Presença Online'],
        confusingParts: ['Parágrafos muito longos', 'Informação técnica sem explicação'],
        rawAnalysis: analysisText,
        error: 'Erro ao analisar resposta'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
  } catch (error) {
    console.error('Erro ao analisar website:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Erro interno ao analisar website'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
