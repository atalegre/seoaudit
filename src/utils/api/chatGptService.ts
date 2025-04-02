
import { analyzeSite } from '../analyzerUtils';
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
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
    
    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
            description: 'Usando análise local como alternativa'
          });
        }
        
        // Log mais detalhado
        if (errorData.details) {
          console.error('Detalhes do erro:', errorData.details);
        }
        
        // Usar análise local como fallback
        console.info('Using local analyzer as fallback due to edge function error');
        return analyzeSite(url).aio;
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
        console.error('Edge function request timed out after 30 seconds');
        toast.error('Tempo limite excedido', {
          description: 'A análise remota demorou muito tempo, usando análise local'
        });
      } else {
        console.error('Error connecting to edge function:', fetchError);
        toast.error('Erro de conexão', {
          description: 'Não foi possível conectar ao serviço de análise'
        });
      }
      
      // Usar análise local como fallback
      console.info('Using local analyzer as fallback due to fetch error');
      return analyzeSite(url).aio;
    }
  } catch (error) {
    console.error('General error in ChatGPT analysis service:', error);
    toast.error('Erro na análise de IA', {
      description: 'Utilizando análise local como alternativa'
    });
    
    // Usar análise local como fallback
    return analyzeSite(url).aio;
  }
}
