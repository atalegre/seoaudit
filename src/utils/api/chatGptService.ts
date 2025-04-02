
import { toast } from 'sonner';

// Cliente de API mais robusto para comunicar com a edge function do Supabase
export async function getChatGptAnalysis(url: string, content: string = ''): Promise<any> {
  try {
    console.log('Starting AIO analysis for URL:', url);
    
    // Tentar usar a edge function do Supabase para análise
    const edgeFunctionUrl = import.meta.env.VITE_SUPABASE_URL 
      ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`
      : 'https://vwtracpgzdqrowvjmizi.supabase.co/functions/v1/analyze-website';
    
    console.log('Chamando edge function:', edgeFunctionUrl);
    
    // Adicionar um timeout para a solicitação para evitar esperas longas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout (reduzido de 30)
    
    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dHJhY3BnemRxcm93dmptaXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDA4ODIsImV4cCI6MjA1OTA3Njg4Mn0.WC6DrG_ftze64gQVajR-n1vjfjMqA_ADP_hyTShQckA'}`
        },
        body: JSON.stringify({ url, content, timestamp: new Date().toISOString() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Verificar se a resposta é bem-sucedida
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Edge function error:', response.status, response.statusText, errorData);
        
        // Mostrar mensagem específica para erro de API key
        if (errorData.error?.includes('API Key') || errorData.message?.includes('API Key')) {
          toast.error('Erro de configuração da API OpenAI', {
            description: 'Verifique se a chave da API está configurada corretamente nas configurações'
          });
        } else {
          toast.error('Erro ao acessar serviço de análise', {
            description: 'Falha ao conectar com a API de análise'
          });
        }
        
        // Log mais detalhado
        if (errorData.details) {
          console.error('Detalhes do erro:', errorData.details);
        }
        
        // Gerar dados simulados consistentes em caso de erro
        return generateSimulatedAnalysis(url);
      }
      
      const data = await response.json();
      
      if (data.apiUsed) {
        console.log('OpenAI API was used successfully for the analysis');
        toast.success('Análise de IA concluída', {
          description: 'Usando o modelo avançado de análise da OpenAI'
        });
      } else {
        console.log('OpenAI API was not used, fallback analysis provided');
        if (data.message) {
          toast.warning('Aviso da API de análise', {
            description: data.message
          });
        }
      }
      
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Verificar se é um erro de timeout
      if (fetchError.name === 'AbortError') {
        console.error('Edge function request timed out after 15 seconds');
        toast.error('Tempo limite excedido', {
          description: 'A análise remota demorou muito tempo'
        });
      } else {
        console.error('Error connecting to edge function:', fetchError);
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao serviço de análise'
        });
      }
      
      // Retornar dados simulados consistentes em caso de erro
      return generateSimulatedAnalysis(url);
    }
  } catch (error) {
    console.error('General error in ChatGPT analysis service:', error);
    toast.error('Erro na análise de IA', {
      description: 'Não foi possível completar a análise de IA'
    });
    
    // Retornar dados simulados consistentes em caso de erro
    return generateSimulatedAnalysis(url);
  }
}

// Função para gerar análise simulada consistente baseada no URL
function generateSimulatedAnalysis(url: string) {
  console.log('Generating simulated AIO analysis for URL:', url);
  
  // Gerar hash baseado no URL para resultados consistentes
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
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
  
  // Retornar dados simulados
  return {
    score: baseScore,
    contentClarity: contentClarity,
    logicalStructure: logicalStructure,
    naturalLanguage: naturalLanguage,
    topicsDetected: uniqueTopics,
    confusingParts: confusingParts,
    analysis: `Análise simulada para ${url}. Este site tem uma estrutura ${logicalStructure > 70 ? "boa" : "mediana"} e clareza de conteúdo ${contentClarity > 75 ? "excelente" : contentClarity > 65 ? "boa" : "mediana"}.`,
    apiUsed: false,
    generated: true
  };
}
