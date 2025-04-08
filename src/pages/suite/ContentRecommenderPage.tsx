
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, FilePlus2 } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  title: string;
  keyword: string;
  type: string;
  opportunity: 'Alto' | 'Médio' | 'Baixo';
}

const ContentRecommenderPage = () => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('pt');
  const [competitor, setCompetitor] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getColor = (level: string) => {
    return level === 'Alto' ? 'text-green-600' : level === 'Médio' ? 'text-yellow-500' : 'text-red-500';
  };

  const handleSubmit = () => {
    setLoading(true);
    setRecommendations([]);
    setError(null);
    
    // Simular uma chamada API com setTimeout
    setTimeout(() => {
      try {
        // Dados simulados para demonstração
        const mockRecommendations: Recommendation[] = [
          {
            title: "Guia Completo: Como Otimizar seu Site para SEO em 2025",
            keyword: "otimização SEO 2025",
            type: "Post de Blog",
            opportunity: "Alto"
          },
          {
            title: "10 Ferramentas Essenciais para Análise de SEO",
            keyword: "ferramentas análise SEO",
            type: "Lista",
            opportunity: "Médio"
          },
          {
            title: "Como a IA está Transformando o SEO: Tendências Atuais",
            keyword: "IA SEO tendências",
            type: "Artigo",
            opportunity: "Alto"
          },
          {
            title: "SEO vs. SEM: Qual Estratégia é Melhor para Seu Negócio?",
            keyword: "SEO vs SEM",
            type: "Comparativo",
            opportunity: "Baixo"
          },
          {
            title: "Guia Passo a Passo para Auditar o SEO do Seu Site",
            keyword: "auditoria SEO site",
            type: "Tutorial",
            opportunity: "Médio"
          }
        ];
        
        setRecommendations(mockRecommendations);
      } catch (err: any) {
        setError("Erro ao gerar recomendações. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }, 2000); // Simular 2 segundos de processamento
  };

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    toast.success('Título copiado!');
  };
  
  const handleSaveRecommendation = () => {
    // Em uma implementação real, isto salvaria no banco de dados
    toast.success('Recomendação guardada!');
  };
  
  const handleCreateContent = (recommendation: Recommendation) => {
    // Em uma implementação real, isto redirecionaria para o gerador de conteúdo
    // com os dados pré-preenchidos
    toast.success('Redirecionando para o gerador de conteúdo...');
    console.log('Criar conteúdo com:', recommendation);
  };

  return (
    <SuiteLayout title="Sugestões de Conteúdo">
      <Helmet>
        <title>Sugestões de Conteúdo | SEOAudit</title>
        <meta 
          name="description" 
          content="Descobre tópicos relevantes que podem impulsionar o tráfego do teu site com IA." 
        />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sugestões de Conteúdo com IA</h1>
          <p className="text-lg text-muted-foreground">
            Descobre tópicos relevantes que podem impulsionar o tráfego do teu site.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="space-y-4 py-6">
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
              <label htmlFor="language" className="text-sm font-medium">Idioma</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                  <SelectItem value="es">Espanhol</SelectItem>
                </SelectContent>
              </Select>
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
            
            <Button onClick={handleSubmit} disabled={loading} className="w-full mt-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Gerando sugestões...
                </>
              ) : (
                'Gerar sugestões'
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="text-red-600 text-sm mb-6 p-4 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Sugestões de conteúdo ({recommendations.length})</h2>
            
            {recommendations.map((rec, i) => (
              <Card key={i} className="mb-4 hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Keyword: <strong>{rec.keyword}</strong></p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <p className="text-sm">
                          <span className="font-medium">Tipo:</span> {rec.type}
                        </p>
                        <p className={`text-sm font-medium ${getColor(rec.opportunity)}`}>
                          <span className="text-gray-700 font-medium">Oportunidade:</span> {rec.opportunity}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopyTitle(rec.title)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveRecommendation}
                      >
                        <FilePlus2 className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleCreateContent(rec)}
                      >
                        Criar com IA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && recommendations.length === 0 && !error && (
          <div className="text-center p-8 border rounded-md bg-gray-50">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H15M8 8L4 12M4 12L8 16M4 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Sem resultados ainda</h3>
            <p className="text-muted-foreground">
              Preencha o formulário acima e clique em "Gerar sugestões" para receber recomendações de conteúdo.
            </p>
          </div>
        )}
      </div>
    </SuiteLayout>
  );
};

export default ContentRecommenderPage;
