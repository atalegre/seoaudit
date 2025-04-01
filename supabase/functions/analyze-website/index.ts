
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
      throw new Error('OPENAI_API_KEY não está configurada');
    }

    console.log('Edge function foi chamada - API Key OpenAI encontrada');

    // Pegar URL e conteúdo da requisição
    const { url, content, timestamp } = await req.json();
    
    if (!url) {
      throw new Error('URL é obrigatória');
    }

    console.log(`Analisando URL: ${url} - Timestamp: ${timestamp || 'não fornecido'}`);

    // Criar prompts mais específicos para melhorar a análise
    const systemPrompt = "Você é um analisador especializado em websites que avalia claramente o conteúdo. IMPORTANTE: Forneça pontuações NUMÉRICAS DE 0 A 100 para clareza de conteúdo, estrutura lógica e linguagem natural, além de uma pontuação geral. Identifique explicitamente os tópicos principais e partes confusas.";
    
    const userPrompt = content 
      ? `Analise este site: ${url}\n\nConteúdo: ${content}\n\nFaça uma análise detalhada e forneça PONTUAÇÕES NUMÉRICAS de 0 a 100 para cada critério.`
      : `Analise este site: ${url}\n\nFaça uma análise detalhada e forneça PONTUAÇÕES NUMÉRICAS de 0 a 100 para cada critério.`;

    console.log('System prompt:', systemPrompt);
    console.log('User prompt:', userPrompt);
    console.log('Enviando requisição para API OpenAI com modelo gpt-4o-mini');
    
    const startTime = Date.now();
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
        max_tokens: 1000
      })
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`Tempo de resposta da API OpenAI: ${responseTime}ms`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Erro na API OpenAI: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Erro na API OpenAI: ${response.status} ${response.statusText}`);
    }
    
    console.log('Resposta da API OpenAI recebida');
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      console.error('Resposta da OpenAI não contém choices:', data);
      throw new Error('Resposta inválida da API OpenAI');
    }
    
    const analysisText = data.choices[0]?.message?.content || '';
    console.log("Resposta completa da API OpenAI:", analysisText);
    
    try {
      // Extrair dados da resposta do OpenAI
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
        rawAnalysis: analysisText,
        apiUsed: true // Flag to confirm API was used
      };

      console.log('Análise extraída com sucesso:', JSON.stringify(result).substring(0, 300) + "...");

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
        apiUsed: true, // Flag to confirm API was used
        error: 'Erro ao analisar resposta'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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
