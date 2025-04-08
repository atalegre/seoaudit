
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, Copy, ArrowRight } from 'lucide-react';
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sugestões de Conteúdo</h1>
          <p className="text-lg text-muted-foreground">
            Descobre ideias relevantes para atrair mais visitas ao teu site.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="space-y-4 py-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">URL do seu site</label>
                <Input
                  id="url"
                  placeholder="https://seusite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="competitor" className="text-sm font-medium">Concorrente principal (opcional)</label>
                <Input
                  id="competitor"
                  placeholder="https://concorrente.com"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">Idioma</label>
                <Input
                  id="language"
                  placeholder="pt, en, es..."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSubmit} disabled={loading} className="w-full mt-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  A gerar...
                </>
              ) : (
                'Gerar sugestões'
              )}
            </Button>
          </CardContent>
        </Card>

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Recomendações de conteúdo ({suggestions.length})</h2>
            
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border border-border">
                  <CardHeader className="flex flex-row items-start gap-4 py-4">
                    <Checkbox 
                      id={`suggestion-${index}`}
                      checked={suggestion.selected}
                      onCheckedChange={() => toggleSelection(index)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`suggestion-${index}`}
                        className="font-medium text-lg cursor-pointer"
                      >
                        {suggestion.topic}
                      </label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
                    <div className="flex flex-wrap gap-2 text-xs mb-4">
                      {suggestion.keywords.map((keyword, i) => (
                        <span key={i} className="bg-muted px-2 py-1 rounded">{keyword}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => copyToClipboard(suggestion.topic)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                      <Button variant="outline" onClick={() => saveToIdeasList(suggestion.topic)}>
                        Guardar na Lista
                      </Button>
                      <Button variant="secondary" onClick={() => sendToWriter(suggestion.topic)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enviar para o Writer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={sendSelectedToWriter} className="gap-2">
                Enviar selecionados para o Writer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center p-8 border rounded-md bg-gray-50">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Sem recomendações ainda</h3>
            <p className="text-muted-foreground">
              Preencha o formulário acima e clique em "Gerar sugestões" para receber sugestões de conteúdo.
            </p>
          </div>
        )}
      </div>
    </SuiteLayout>
  );
};

export default ContentRecommenderPage;
