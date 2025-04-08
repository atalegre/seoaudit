
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import SuiteLayout from '@/components/suite/SuiteLayout';
import ContentWriterForm from '@/components/content-writer/ContentWriterForm';
import LoadingContent from '@/components/content-writer/LoadingContent';
import GeneratedContentCard from '@/components/content-writer/GeneratedContentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContent {
  title: string;
  content: string;
}

const ContentWriterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  
  // Extract title from URL query param if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const titleParam = queryParams.get('title');
    
    // Load saved ideas from localStorage
    const loadSavedIdeas = () => {
      const ideas = JSON.parse(localStorage.getItem('savedContentIdeas') || '[]');
      setSavedIdeas(ideas);
    };
    
    loadSavedIdeas();
    
    // If there's a title in the URL, pre-fill the form
    if (titleParam) {
      // In a real implementation, you would set this in your form state
      console.log("Title from URL:", titleParam);
      // For now, we'll just clear the URL param after reading it
      if (titleParam) {
        // This could be passed to the ContentWriterForm component
        // For this example, we'll simulate immediate generation
        handleGenerateContent({ keyword: titleParam, language: 'pt', tone: 'Profissional', contentType: 'Artigo de blog', size: 'Médio' });
      }
    }
  }, [location.search]);
  
  const handleGenerateContent = async (formData: any) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    
    // Simular uma chamada API com setTimeout
    setTimeout(() => {
      // Dados simulados para demonstração
      const mockContent = {
        title: `Conteúdo sobre ${formData.keyword}`,
        content: `Este é um conteúdo de exemplo gerado para a palavra-chave "${formData.keyword}" em tom ${formData.tone.toLowerCase()}. 
        
O conteúdo gerado é adaptado para o formato de ${formData.contentType.toLowerCase()} e tem um tamanho ${formData.size.toLowerCase()}.

Este texto é apenas uma amostra do que seria gerado por um modelo de IA real. Em uma implementação completa, este texto seria substituído por conteúdo genuinamente gerado por um modelo de linguagem avançado.

A verdadeira implementação conectaria a um serviço como OpenAI GPT ou outro modelo de linguagem para criar conteúdo otimizado para SEO que incorpora a palavra-chave "${formData.keyword}" de forma natural e eficaz.

O tom ${formData.tone.toLowerCase()} seria refletido na maneira como o conteúdo é escrito, adaptando-se ao tipo de audiência esperada.

O formato de ${formData.contentType.toLowerCase()} determina a estrutura e o comprimento do texto gerado, garantindo que ele seja adequado para o propósito pretendido.`
      };
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000); // Simular 2 segundos de processamento
  };
  
  const handleCreateNewVersion = () => {
    // Reutilizar o formulário atual sem limpar os inputs
    setGeneratedContent(null);
  };
  
  const generateFromIdea = (idea: string) => {
    handleGenerateContent({ 
      keyword: idea, 
      language: 'pt', 
      tone: 'Profissional', 
      contentType: 'Artigo de blog', 
      size: 'Médio' 
    });
  };
  
  const editIdeaBeforeGenerate = (idea: string) => {
    // Reset any current content and redirect to form with pre-filled keyword
    setGeneratedContent(null);
    // In a real implementation, you would set the form state
    console.log("Pre-fill form with:", idea);
    toast.success("Ideia carregada no formulário");
  };
  
  const removeFromSavedIdeas = (idea: string) => {
    const updatedIdeas = savedIdeas.filter(i => i !== idea);
    localStorage.setItem('savedContentIdeas', JSON.stringify(updatedIdeas));
    setSavedIdeas(updatedIdeas);
    toast.success("Ideia removida da lista");
  };
  
  return (
    <SuiteLayout title="Gerar Conteúdo com IA">
      <Helmet>
        <title>Gerar Conteúdo com IA | SEOAudit</title>
        <meta 
          name="description" 
          content="Cria textos otimizados para motores de busca e modelos de IA." 
        />
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Gerar Conteúdo com IA
          </h1>
          <p className="text-lg text-muted-foreground">
            Cria textos otimizados para motores de busca e modelos de IA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Formulário ou Resultado */}
            {!isGenerating && !generatedContent && (
              <ContentWriterForm onSubmit={handleGenerateContent} />
            )}
            
            {/* Estado de carregamento */}
            {isGenerating && <LoadingContent />}
            
            {/* Resultado gerado */}
            {!isGenerating && generatedContent && (
              <GeneratedContentCard 
                content={generatedContent} 
                onCreateNewVersion={handleCreateNewVersion}
              />
            )}
            
            {/* Seção de instruções/info - mantida da versão anterior */}
            {!generatedContent && !isGenerating && (
              <div className="space-y-4 text-sm mt-8">
                <h3 className="font-medium text-lg">Como funciona o gerador de conteúdo?</h3>
                <p>
                  O gerador de conteúdo utiliza inteligência artificial avançada para criar textos otimizados 
                  tanto para motores de busca (SEO) quanto para modelos de IA (AIO).
                </p>
                <p>
                  Ao fornecer algumas informações básicas sobre o tema, nosso sistema gera 
                  conteúdo relevante e estruturado para melhorar seu posicionamento nos resultados de busca.
                </p>
              </div>
            )}
          </div>
          
          {/* Lista de ideias guardadas */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ideias Guardadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedIdeas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Guarde ideias a partir da página de Sugestões para aceder aqui.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {savedIdeas.map((idea, index) => (
                      <div key={index} className="relative p-3 border rounded-md">
                        <button 
                          onClick={() => removeFromSavedIdeas(idea)}
                          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-medium pr-6 mb-2">{idea}</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => editIdeaBeforeGenerate(idea)}
                          >
                            Editar inputs
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="text-xs"
                            onClick={() => generateFromIdea(idea)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Gerar com IA
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/suite/recommender')}
                  >
                    Ver mais sugestões de conteúdo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SuiteLayout>
  );
};

export default ContentWriterPage;
