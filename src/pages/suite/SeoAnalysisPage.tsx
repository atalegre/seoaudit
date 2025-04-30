
import React, { useState } from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, BarChart } from 'lucide-react';
import DeviceTabsSection from '@/components/seo/DeviceTabsSection';
import { useSeoAnalysis } from '@/hooks/useSeoAnalysis';
import { toast } from 'sonner';

const SeoAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('desktop');
  const { 
    url, 
    isAnalyzing, 
    desktopData, 
    mobileData, 
    error,
    handleUrlChange, 
    handleReanalyze, 
    extractDomain,
    analyzeUrl
  } = useSeoAnalysis();

  // Handler for analyze button
  const handleAnalyze = () => {
    if (!url) {
      toast.error("URL necessária", {
        description: "Por favor, digite uma URL para analisar."
      });
      return;
    }
    analyzeUrl();
  };

  // Debug logging
  console.log('SeoAnalysisPage - desktopData keys:', desktopData ? Object.keys(desktopData) : 'null');
  console.log('SeoAnalysisPage - mobileData keys:', mobileData ? Object.keys(mobileData) : 'null');
  console.log('SeoAnalysisPage - isAnalyzing:', isAnalyzing);
  console.log('SeoAnalysisPage - error:', error);

  return (
    <SuiteLayout 
      title="Análise SEO Technical"
      domain={url ? extractDomain(url) : undefined}
    >
      <div className="space-y-6">
        {/* URL Input Section */}
        <Card className="mb-6 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Análise SEO Technical</h2>
            <p className="text-muted-foreground">
              Avalie o desempenho técnico do seu site e identifique problemas de SEO.
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
                  <BarChart className="h-4 w-4" />
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
            <h3 className="text-xl font-medium mb-1">Analisando o site</h3>
            <p className="text-muted-foreground">
              Nosso sistema está avaliando o desempenho técnico do seu site...
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

        {!isAnalyzing && !error && !desktopData && !mobileData && !url && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Digite uma URL para analisar</h3>
            <p className="text-muted-foreground">
              Insira a URL do site que deseja analisar para receber recomendações de SEO.
            </p>
          </div>
        )}

        {!isAnalyzing && !error && !desktopData && !mobileData && url && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Pronto para analisar</h3>
            <p className="text-muted-foreground mb-6">
              Clique em "Analisar" para iniciar a análise SEO technical.
            </p>
            <Button onClick={handleAnalyze} className="gap-2">
              <BarChart className="h-4 w-4" />
              Iniciar Análise
            </Button>
          </div>
        )}

        {!isAnalyzing && (desktopData || mobileData) && (
          <DeviceTabsSection 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            desktopData={desktopData}
            mobileData={mobileData}
            isAnalyzing={isAnalyzing}
            error={error}
          />
        )}
      </div>
    </SuiteLayout>
  );
};

export default SeoAnalysisPage;
