
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SuiteLayout from '@/components/suite/SuiteLayout';
import ContentLayout from '@/components/content/ContentLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const ContentWriterPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
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
          
          {/* Conteúdo Principal - Placeholder para desenvolvimento futuro */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gerador de Conteúdo</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para gerar conteúdo otimizado para SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Funcionalidade em desenvolvimento</AlertTitle>
                <AlertDescription>
                  O gerador de conteúdo SEO estará disponível em breve. Esta página está em construção.
                </AlertDescription>
              </Alert>
              
              <Button 
                disabled={isGenerating} 
                className="w-full"
                onClick={() => setIsGenerating(true)}
              >
                {isGenerating ? (
                  <>Gerando conteúdo<span className="loading-dots">...</span></>
                ) : (
                  <>Gerar conteúdo com IA</>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* Seção de instruções/info */}
          <div className="space-y-4 text-sm">
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
        </div>
      </ContentLayout>
    </>
  );
};

export default ContentWriterPage;
