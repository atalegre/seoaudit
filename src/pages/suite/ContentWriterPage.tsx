
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import SuiteLayout from '@/components/suite/SuiteLayout';
import ContentWriterForm from '@/components/content-writer/ContentWriterForm';
import LoadingContent from '@/components/content-writer/LoadingContent';
import GeneratedContentCard from '@/components/content-writer/GeneratedContentCard';
import SavedIdeasCard from '@/components/content-writer/SavedIdeasCard';
import ContentPageHeader from '@/components/content-writer/ContentPageHeader';
import InstructionsSection from '@/components/content-writer/InstructionsSection';
import { toast } from 'sonner';

interface GeneratedContent {
  title: string;
  content: string;
}

const ContentWriterPage: React.FC = () => {
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  
  // Load saved ideas from localStorage and check for URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const titleParam = queryParams.get('title');
    
    // Load saved ideas from localStorage
    const loadSavedIdeas = () => {
      const ideas = JSON.parse(localStorage.getItem('savedContentIdeas') || '[]');
      setSavedIdeas(ideas);
    };
    
    loadSavedIdeas();
    
    // If there's a title in the URL, use it to generate content
    if (titleParam) {
      handleGenerateContent({ 
        keyword: titleParam, 
        language: 'pt', 
        tone: 'Profissional', 
        contentType: 'Artigo de blog', 
        size: 'Médio' 
      });
    }
  }, [location.search]);
  
  const handleGenerateContent = async (formData: any) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data for demonstration
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
    }, 2000);
  };
  
  const handleCreateNewVersion = () => {
    // Reset the generated content without clearing the form
    setGeneratedContent(null);
  };
  
  const removeFromSavedIdeas = (idea: string) => {
    const updatedIdeas = savedIdeas.filter(i => i !== idea);
    localStorage.setItem('savedContentIdeas', JSON.stringify(updatedIdeas));
    setSavedIdeas(updatedIdeas);
    toast.success("Ideia removida da lista");
  };
  
  const editIdeaBeforeGenerate = (idea: string) => {
    // Reset current content and pre-fill the form with the idea
    setGeneratedContent(null);
    toast.success("Ideia carregada no formulário");
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
        <ContentPageHeader 
          title="Gerar Conteúdo com IA"
          subtitle="Cria textos otimizados para motores de busca e modelos de IA."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Form or Result */}
            {!isGenerating && !generatedContent && (
              <ContentWriterForm onSubmit={handleGenerateContent} />
            )}
            
            {/* Loading state */}
            {isGenerating && <LoadingContent />}
            
            {/* Generated result */}
            {!isGenerating && generatedContent && (
              <GeneratedContentCard 
                content={generatedContent} 
                onCreateNewVersion={handleCreateNewVersion}
              />
            )}
            
            {/* Instructions section - only shown when no content is being generated or displayed */}
            {!generatedContent && !isGenerating && <InstructionsSection />}
          </div>
          
          {/* Saved ideas section */}
          <div className="md:col-span-1">
            <SavedIdeasCard 
              savedIdeas={savedIdeas}
              onRemoveIdea={removeFromSavedIdeas}
              onEditIdea={editIdeaBeforeGenerate}
              onGenerateFromIdea={generateFromIdea}
            />
          </div>
        </div>
      </div>
    </SuiteLayout>
  );
};

export default ContentWriterPage;
