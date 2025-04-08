
import React, { useState } from 'react';
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
    // Simular salvar em localStorage ou state global
    const savedIdeas = JSON.parse(localStorage.getItem('savedContentIdeas') || '[]');
    if (!savedIdeas.includes(topic)) {
      savedIdeas.push(topic);
      localStorage.setItem('savedContentIdeas', JSON.stringify(savedIdeas));
      toast.success('Ideia guardada na sua lista!');
    } else {
      toast.info('Esta ideia já está guardada na sua lista.');
    }
  };

  const sendToWriter = (topic: string) => {
    navigate(`/suite/writer?title=${encodeURIComponent(topic)}`);
  };

  const sendSelectedToWriter = () => {
    const selectedTopics = suggestions.filter(s => s.selected).map(s => s.topic);
    if (selectedTopics.length === 0) {
      toast.error('Selecione pelo menos uma sugestão para enviar.');
      return;
    }

    // Guardar na lista para acesso posterior
    const savedIdeas = JSON.parse(localStorage.getItem('savedContentIdeas') || '[]');
    const newIdeas = selectedTopics.filter(topic => !savedIdeas.includes(topic));
    localStorage.setItem('savedContentIdeas', JSON.stringify([...savedIdeas, ...newIdeas]));
    
    // Redirecionar para o primeiro selecionado
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
