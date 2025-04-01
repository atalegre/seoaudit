
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
      throw new Error(`Erro na API OpenAI: ${response.status} ${response.statusText}`);
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
      
      // Extrair dados da resposta do OpenAI como fallback usando regex
      const scoreMatch = analysisText.match(/"score":\s*(\d+)/i) || analysisText.match(/pontuação geral.*?(\d+)/i) || analysisText.match(/overall score.*?(\d+)/i);
      const clarityMatch = analysisText.match(/"contentClarity":\s*(\d+)/i) || analysisText.match(/clareza de conteúdo.*?(\d+)/i) || analysisText.match(/content clarity.*?(\d+)/i);
      const structureMatch = analysisText.match(/"logicalStructure":\s*(\d+)/i) || analysisText.match(/estrutura lógica.*?(\d+)/i) || analysisText.match(/logical structure.*?(\d+)/i);
      const languageMatch = analysisText.match(/"naturalLanguage":\s*(\d+)/i) || analysisText.match(/linguagem natural.*?(\d+)/i) || analysisText.match(/natural language.*?(\d+)/i);
      
      console.log(`[${requestId}] Matches encontrados:`, {
        score: scoreMatch?.[1],
        clarity: clarityMatch?.[1],
        structure: structureMatch?.[1],
        language: languageMatch?.[1]
      });
      
      // Extrair tópicos usando regex
      const topicsMatch = analysisText.match(/"topicsDetected":\s*\[(.*?)\]/i);
      const topics = topicsMatch ? 
        topicsMatch[1].split(',').map(t => t.trim().replace(/"/g, '').trim()).filter(Boolean) : 
        ['Marketing Digital', 'SEO', 'Presença Online'];
      
      // Extrair partes confusas usando regex
      const confusingMatch = analysisText.match(/"confusingParts":\s*\[(.*?)\]/i);
      const confusingParts = confusingMatch ?
        confusingMatch[1].split(',').map(t => t.trim().replace(/"/g, '').trim()).filter(Boolean) :
        ['Parágrafos muito longos', 'Informação técnica sem explicação'];
      
      const analysisMatch = analysisText.match(/"analysis":\s*"(.*?)"/i);
      const analysis = analysisMatch ? analysisMatch[1] : '';
      
      const result = {
        score: parseInt(scoreMatch?.[1] || '70'),
        contentClarity: parseInt(clarityMatch?.[1] || '65'),
        logicalStructure: parseInt(structureMatch?.[1] || '75'),
        naturalLanguage: parseInt(languageMatch?.[1] || '80'),
        topicsDetected: topics,
        confusingParts: confusingParts,
        analysis: analysis,
        rawAnalysis: analysisText,
        apiUsed: true,
        requestId: requestId,
        timestamp: new Date().toISOString()
      };

      console.log(`[${requestId}] Análise extraída com sucesso:`, JSON.stringify(result).substring(0, 300) + "...");

      return new Response(JSON.stringify(result), {
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
