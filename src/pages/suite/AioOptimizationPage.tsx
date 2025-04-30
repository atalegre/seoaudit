
import React from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Card } from '@/components/ui/card';
import { useAiOptimization } from '@/hooks/useAiOptimization';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import AnalysisResults from '@/components/aio/AnalysisResults';
import AuthRequiredRoute from '@/components/auth/AuthRequiredRoute';

const AioOptimizationPage = () => {
  const { 
    url, 
    isAnalyzing, 
    optimizationData, 
    error,
    handleUrlChange, 
    handleReanalyze, 
    extractDomain,
    analyzeUrl
  } = useAiOptimization();

  // Handler for analyze button (separate from reanalyze)
  const handleAnalyze = () => {
    analyzeUrl();
  };

  // The content of the page that should be protected
  const pageContent = (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card className="mb-6 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Análise de Otimização para IA</h2>
          <p className="text-muted-foreground">
            Descubra como modelos de IA interpretam seu conteúdo e como melhorá-lo.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="exemplo.com"
            value={url}
            onChange={handleUrlChange}
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Analisar
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Analysis States */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-xl font-medium mb-1">Analisando o conteúdo</h3>
          <p className="text-muted-foreground">
            Nosso sistema está avaliando como modelos de IA interpretam seu conteúdo...
          </p>
        </div>
      )}

      {!isAnalyzing && error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <h3 className="text-lg font-medium text-destructive mb-1">Erro na análise</h3>
          <p className="text-sm">{error}</p>
          <Button variant="destructive" onClick={handleReanalyze} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      )}

      {!isAnalyzing && !error && !optimizationData && !url && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Digite uma URL para analisar</h3>
          <p className="text-muted-foreground">
            Insira a URL do site que deseja analisar para receber recomendações de otimização para IA.
          </p>
        </div>
      )}

      {!isAnalyzing && !error && !optimizationData && url && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Pronto para analisar</h3>
          <p className="text-muted-foreground mb-6">
            Clique em "Analisar" para iniciar a análise de otimização para IA.
          </p>
          <Button onClick={handleAnalyze} className="gap-2">
            <Zap className="h-4 w-4" />
            Iniciar Análise
          </Button>
        </div>
      )}

      {!isAnalyzing && !error && optimizationData && (
        <AnalysisResults data={optimizationData} />
      )}
    </div>
  );

  return (
    <SuiteLayout 
      title="Otimização para IA"
      domain={url ? extractDomain(url) : undefined}
    >
      <AuthRequiredRoute>
        {pageContent}
      </AuthRequiredRoute>
    </SuiteLayout>
  );
};

export default AioOptimizationPage;
