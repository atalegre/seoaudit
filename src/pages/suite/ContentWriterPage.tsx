
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ContentLayout from '@/components/content/ContentLayout';
import ContentWriterForm from '@/components/content-writer/ContentWriterForm';
import LoadingContent from '@/components/content-writer/LoadingContent';
import GeneratedContentCard from '@/components/content-writer/GeneratedContentCard';

interface GeneratedContent {
  title: string;
  content: string;
}

const ContentWriterPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
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
  
  return (
    <>
      <Helmet>
        <title>Gerador de Conteúdo SEO | SEOAudit</title>
        <meta 
          name="description" 
          content="Crie conteúdos otimizados para motores de busca e modelos de IA em segundos." 
        />
      </Helmet>
      
      <ContentLayout>
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Gerador de Conteúdo SEO com IA
            </h1>
            <p className="text-lg text-muted-foreground">
              Crie conteúdos otimizados para motores de busca e modelos de IA em segundos.
            </p>
          </div>
          
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
                O gerador de conteúdo SEO utiliza inteligência artificial avançada para criar textos otimizados 
                tanto para motores de busca (SEO) quanto para modelos de IA (AIO).
              </p>
              <p>
                Ao fornecer algumas informações básicas sobre o tema, nosso sistema gera 
                conteúdo relevante, estruturado e otimizado para melhorar seu posicionamento nos resultados de busca.
              </p>
            </div>
          )}
        </div>
      </ContentLayout>
    </>
  );
};

export default ContentWriterPage;
