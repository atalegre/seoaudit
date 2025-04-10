
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import SuiteLayout from '@/components/suite/SuiteLayout';
import RecommenderPageHeader from '@/components/content-recommender/RecommenderPageHeader';
import RecommenderSearchForm from '@/components/content-recommender/RecommenderSearchForm';
import EmptyState from '@/components/content-recommender/EmptyState';
import SuggestionsList from '@/components/content-recommender/SuggestionsList';
import { toast } from 'sonner';

interface Suggestion {
  topic: string;
  reason: string;
  keywords: string[];
  selected?: boolean;
}

const ContentRecommenderPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);

  // Carregar ideias guardadas quando o componente é montado
  useEffect(() => {
    const loadSavedIdeas = () => {
      const ideas = JSON.parse(localStorage.getItem('savedContentIdeas') || '[]');
      setSavedIdeas(ideas);
    };
    
    loadSavedIdeas();
  }, []);

  const handleSubmit = () => {
    if (!url) return toast.error('Por favor insere um URL.');
    setLoading(true);
    setSuggestions([]);
    
    // Simular uma chamada API com setTimeout
    setTimeout(() => {
      try {
        // Dados simulados para demonstração
        const mockSuggestions: Suggestion[] = [
          {
            topic: "Como otimizar seu site para motores de busca em 2025",
            reason: "Este tópico preenche uma lacuna no seu conteúdo sobre práticas modernas de SEO e pode atrair tráfego significativo.",
            keywords: ["SEO 2025", "otimização moderna", "algoritmos de busca", "ranking de sites"],
            selected: false
          },
          {
            topic: "Guia completo sobre content marketing para pequenas empresas",
            reason: "Seu concorrente tem conteúdo semelhante, mas falta uma abordagem focada em pequenas empresas com orçamentos limitados.",
            keywords: ["marketing de conteúdo", "pequenas empresas", "orçamento limitado", "ROI"],
            selected: false
          },
          {
            topic: "Inteligência Artificial no SEO: Como utilizar ChatGPT para melhorar seu posicionamento",
            reason: "Tópico em tendência com alto volume de busca e pouca concorrência, alinhado ao seu perfil de conteúdo.",
            keywords: ["IA para SEO", "ChatGPT", "conteúdo com IA", "otimização automática"],
            selected: false
          },
          {
            topic: "Análise comparativa: WordPress vs Webflow para sites de negócios",
            reason: "Este tipo de conteúdo comparativo tem forte potencial para capturar tráfego de decisores em fase de escolha de plataforma.",
            keywords: ["WordPress vs Webflow", "CMS empresarial", "desenvolvimento web", "plataformas websites"],
            selected: false
          }
        ];
        
        setSuggestions(mockSuggestions);
      } catch (err: any) {
        toast.error('Erro ao gerar recomendações de conteúdo.');
      } finally {
        setLoading(false);
      }
    }, 2000); // Simular 2 segundos de processamento
  };

  const toggleSelection = (index: number) => {
    const updatedSuggestions = [...suggestions];
    updatedSuggestions[index].selected = !updatedSuggestions[index].selected;
    setSuggestions(updatedSuggestions);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const saveToIdeasList = (topic: string) => {
    // Verificar se a ideia já está guardada
    if (!savedIdeas.includes(topic)) {
      const updatedIdeas = [...savedIdeas, topic];
      localStorage.setItem('savedContentIdeas', JSON.stringify(updatedIdeas));
      setSavedIdeas(updatedIdeas);
      toast.success('Ideia guardada na sua lista!', {
        description: 'Acesse-a no Gerador de Conteúdo',
        action: {
          label: 'Ir para Writer',
          onClick: () => navigate('/suite/writer')
        }
      });
    } else {
      toast.info('Esta ideia já está guardada na sua lista.');
    }
  };

  const sendToWriter = (topic: string) => {
    // Garantir que a ideia seja guardada antes de redirecionar
    if (!savedIdeas.includes(topic)) {
      const updatedIdeas = [...savedIdeas, topic];
      localStorage.setItem('savedContentIdeas', JSON.stringify(updatedIdeas));
    }
    
    // Mostrar um toast informativo e redirecionar
    toast.success('Redirecionando para o Writer...', {
      description: 'O tópico foi salvo na sua lista de ideias'
    });
    
    // Redirecionar para o Writer com o tópico como parâmetro
    navigate(`/suite/writer?title=${encodeURIComponent(topic)}`);
  };

  const sendSelectedToWriter = () => {
    const selectedTopics = suggestions.filter(s => s.selected).map(s => s.topic);
    if (selectedTopics.length === 0) {
      toast.error('Selecione pelo menos uma sugestão para enviar.');
      return;
    }

    // Guardar todas as ideias selecionadas
    const updatedIdeas = [...savedIdeas];
    let newIdeasCount = 0;
    
    selectedTopics.forEach(topic => {
      if (!updatedIdeas.includes(topic)) {
        updatedIdeas.push(topic);
        newIdeasCount++;
      }
    });
    
    localStorage.setItem('savedContentIdeas', JSON.stringify(updatedIdeas));
    setSavedIdeas(updatedIdeas);
    
    // Informar o usuário
    if (newIdeasCount > 0) {
      toast.success(`${newIdeasCount} ${newIdeasCount === 1 ? 'nova ideia guardada' : 'novas ideias guardadas'}!`);
    }
    
    // Redirecionar para o primeiro tópico selecionado
    sendToWriter(selectedTopics[0]);
  };

  return (
    <SuiteLayout title="Sugestões de Conteúdo">
      <Helmet>
        <title>Sugestões de Conteúdo | SEOAudit</title>
        <meta 
          name="description" 
          content="Descobre ideias relevantes para atrair mais visitas ao teu site." 
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <RecommenderPageHeader 
          title="Sugestões de Conteúdo"
          subtitle="Descobre ideias relevantes para atrair mais visitas ao teu site."
        />

        <RecommenderSearchForm
          url={url}
          setUrl={setUrl}
          competitor={competitor}
          setCompetitor={setCompetitor}
          language={language}
          setLanguage={setLanguage}
          loading={loading}
          onSubmit={handleSubmit}
        />

        {suggestions.length > 0 && (
          <SuggestionsList
            suggestions={suggestions}
            onToggleSelection={toggleSelection}
            onCopyToClipboard={copyToClipboard}
            onSaveToIdeasList={saveToIdeasList}
            onSendToWriter={sendToWriter}
            onSendSelectedToWriter={sendSelectedToWriter}
          />
        )}

        {!loading && suggestions.length === 0 && (
          <EmptyState />
        )}
      </div>
    </SuiteLayout>
  );
};

export default ContentRecommenderPage;
