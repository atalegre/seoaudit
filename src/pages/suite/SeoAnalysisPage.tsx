
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Zap, Smartphone, Monitor, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import DevicePerformancePanel from '@/components/seo/DevicePerformancePanel';
import CoreWebVitalsPanel from '@/components/seo/CoreWebVitalsPanel';
import TechnicalAuditsPanel from '@/components/seo/TechnicalAuditsPanel';
import OpportunitiesPanel from '@/components/seo/OpportunitiesPanel';
import { getPageInsightsData } from '@/utils/api/pageInsights';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';

const SeoAnalysisPage = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [desktopData, setDesktopData] = useState<PageInsightsData | null>(null);
  const [mobileData, setMobileData] = useState<PageInsightsData | null>(null);
  const [activeTab, setActiveTab] = useState('desktop');
  const { toast } = useToast();

  // Carregar o último URL analisado e iniciar análise automaticamente
  useEffect(() => {
    const lastUrl = localStorage.getItem('lastAnalyzedUrl');
    if (lastUrl) {
      setUrl(lastUrl);
      analyzeUrl(lastUrl);
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const analyzeUrl = async (urlToAnalyze = url) => {
    if (!urlToAnalyze) {
      toast({
        title: "URL necessário",
        description: "Por favor, insira uma URL válida para analisar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Salvar a URL no localStorage
      localStorage.setItem('lastAnalyzedUrl', urlToAnalyze);
      
      // Simular carregamento sequencial (desktop primeiro, depois mobile)
      // Na implementação real, você pode fazer ambas as chamadas de forma paralela
      const desktopInsights = await getPageInsightsData(urlToAnalyze);
      setDesktopData(desktopInsights);
      
      // Em uma implementação real, você teria diferentes endpoints/parâmetros para mobile
      // Aqui estamos simulando usando os mesmos dados, mas em produção seria uma chamada separada
      const mobileInsights = await getPageInsightsData(urlToAnalyze);
      setMobileData(mobileInsights);
      
      toast({
        title: "Análise concluída",
        description: "Os resultados da análise SEO estão prontos.",
      });
    } catch (error) {
      console.error("Erro ao analisar URL:", error);
      toast({
        title: "Erro na análise",
        description: "Ocorreu um erro ao analisar a URL. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = () => {
    analyzeUrl();
  };

  const extractDomain = (url: string) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Análise SEO Technical</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Site em análise: {url ? extractDomain(url) : 'Nenhum site'}</CardTitle>
          <CardDescription>
            Resultados da análise com Google PageSpeed Insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://exemplo.com"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button 
              onClick={handleReanalyze} 
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
                  Analisar novamente
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(desktopData || mobileData) && (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="desktop" className="space-y-6">
              {desktopData ? (
                <>
                  <DevicePerformancePanel 
                    data={desktopData} 
                    deviceType="desktop" 
                  />
                  <CoreWebVitalsPanel 
                    lcp={desktopData.lcp} 
                    cls={desktopData.cls} 
                    fid={desktopData.fid} 
                  />
                  <TechnicalAuditsPanel 
                    mobileFriendly={desktopData.mobileFriendly}
                    security={desktopData.security}
                    headingsStructure={desktopData.headingsStructure}
                    metaTags={desktopData.metaTags}
                  />
                  <OpportunitiesPanel recommendations={desktopData.recommendations || []} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Carregando dados do desktop...</h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mobile" className="space-y-6">
              {mobileData ? (
                <>
                  <DevicePerformancePanel 
                    data={mobileData} 
                    deviceType="mobile" 
                  />
                  <CoreWebVitalsPanel 
                    lcp={mobileData.lcp} 
                    cls={mobileData.cls} 
                    fid={mobileData.fid} 
                  />
                  <TechnicalAuditsPanel 
                    mobileFriendly={mobileData.mobileFriendly}
                    security={mobileData.security}
                    headingsStructure={mobileData.headingsStructure}
                    metaTags={mobileData.metaTags}
                  />
                  <OpportunitiesPanel recommendations={mobileData.recommendations || []} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium">Carregando dados do mobile...</h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!desktopData && !mobileData && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted rounded-lg">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhuma análise realizada</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Insira uma URL acima e clique em Analisar para obter dados detalhados de performance
            e SEO técnico do seu site.
          </p>
        </div>
      )}
    </div>
  );
};

export default SeoAnalysisPage;
