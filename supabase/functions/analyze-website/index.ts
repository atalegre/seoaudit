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
    // Verificar autorização - agora com melhor tratamento
    const authHeader = req.headers.get('authorization');
    // Tornar a autorização opcional para desenvolvimento
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
    
    // Se não houver API key, simular análise em vez de dar erro
    if (!OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY não está configurada - usando análise simulada');
      const { url, content } = await req.json().catch(() => ({ url: '', content: '' }));
      
      if (!url) {
        throw new Error('URL é obrigatória');
      }
      
      // Gerar resultado consistente baseado no URL
      const generateConsistentResult = (url: string) => {
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
          hash = ((hash << 5) - hash) + url.charCodeAt(i);
          hash |= 0;
        }
        
        // Normalizar scores para valores realistas
        const baseScore = Math.abs(hash % 30) + 55; // 55-85
        const contentClarity = Math.abs((hash >> 3) % 25) + 60; // 60-85
        const logicalStructure = Math.abs((hash >> 6) % 30) + 50; // 50-80
        const naturalLanguage = Math.abs((hash >> 9) % 20) + 65; // 65-85
        
        // Gerar tópicos detectados baseados no URL
        const allTopics = ["Marketing Digital", "SEO", "E-commerce", "Desenvolvimento Web", 
                           "Conteúdo", "Vendas", "Tecnologia", "Negócios", "Empreendedorismo",
                           "Estratégia", "Design", "UX/UI", "Redes Sociais", "Analytics"];
        
        // Selecionar tópicos baseados no hash
        const topicsDetected = [];
        for (let i = 0; i < 5; i++) {
          const index = Math.abs((hash >> (i * 3)) % allTopics.length);
          if (!topicsDetected.includes(allTopics[index])) {
            topicsDetected.push(allTopics[index]);
          }
        }
        
        // Limitar para 3-5 tópicos únicos
        const uniqueTopics = [...new Set(topicsDetected)].slice(0, 3 + (hash % 3));
        
        // Gerar partes confusas
        const possibleConfusions = [
          "Seção 'Sobre Nós' com informações insuficientes",
          "Descrições de serviços muito técnicas",
          "Falta de contexto em estudos de caso",
          "Terminologia especializada sem explicação",
          "Estrutura da página de contato pouco intuitiva",
          "Informações de preços ambíguas",
          "Processo de compra com passos pouco claros"
        ];
        
        const confusingParts = [];
        for (let i = 0; i < 2 + (hash % 2); i++) {
          const index = Math.abs((hash >> (i * 5)) % possibleConfusions.length);
          if (!confusingParts.includes(possibleConfusions[index])) {
            confusingParts.push(possibleConfusions[index]);
          }
        }
        
        return {
          score: baseScore,
          contentClarity: contentClarity,
          logicalStructure: logicalStructure,
          naturalLanguage: naturalLanguage,
          topicsDetected: uniqueTopics,
          confusingParts: confusingParts,
          analysis: `Análise simulada para ${url}. Este site tem uma estrutura ${logicalStructure > 70 ? "boa" : "mediana"} e clareza de conteúdo ${contentClarity > 75 ? "excelente" : contentClarity > 65 ? "boa" : "mediana"}.`
        };
      };
      
      const result = {
        ...generateConsistentResult(url),
        apiUsed: false,
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        message: "Análise simulada (API key OpenAI não configurada)"
      };
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    console.log('Edge function foi chamada - API Key OpenAI encontrada');

    // Pegar URL e conteúdo da requisição
    const { url, content, timestamp } = await req.json().catch(() => ({ url: '', content: '', timestamp: '' }));
    
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
    
    // Retornar dados simulados em caso de erro, em vez de retornar apenas o erro
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
      status: 200 // Retornar 200 com dados simulados em vez de erro
    });
  }
});
