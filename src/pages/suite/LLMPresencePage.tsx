
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SuiteLayout from '@/components/suite/SuiteLayout';
import BrandPresenceMonitor from '@/components/llm-presence/BrandPresenceMonitor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { extractDomainFromUrl } from '@/utils/domainUtils';

const LLMPresencePage = () => {
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get('url') || localStorage.getItem('lastAnalyzedUrl') || '';
  
  const [url, setUrl] = useState(urlParam);
  const [analyzedUrl, setAnalyzedUrl] = useState(urlParam);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = () => {
    if (!url) {
      toast.error("URL obrigatório", {
        description: "Por favor, insira um URL para analisar."
      });
      return;
    }
    
    let processedUrl = url;
    if (!url.startsWith('http')) {
      processedUrl = 'https://' + url;
    }
    
    setIsAnalyzing(true);
    setAnalyzedUrl(processedUrl);
    
    // Save URL to localStorage for future use
    localStorage.setItem('lastAnalyzedUrl', processedUrl);
    
    // Simulate analysis (in a real app this would be an API call)
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Análise concluída", {
        description: `Análise de presença em IA para ${extractDomainFromUrl(processedUrl)} concluída.`
      });
    }, 1000);
  };
  
  return (
    <SuiteLayout title="Presença em IA">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Monitorização de Presença em IA</h1>
          <p className="text-muted-foreground">
            Analise e otimize como a sua marca aparece em plataformas de IA como ChatGPT, Perplexity e Meta AI.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="url-input" className="text-sm font-medium mb-2 block">
                  URL do Website
                </label>
                <Input
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="shrink-0"
              >
                {isAnalyzing ? 'Analisando...' : 'Analisar Presença'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {analyzedUrl && (
          <BrandPresenceMonitor url={analyzedUrl} autoStart={true} />
        )}
        
        {!analyzedUrl && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              Insira o URL do seu website para analisar a presença da sua marca em plataformas de IA.
            </p>
          </div>
        )}
      </div>
    </SuiteLayout>
  );
};

export default LLMPresencePage;
