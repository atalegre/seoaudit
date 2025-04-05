
import React from 'react';
import { Client } from '@/utils/api/types';
import ScoreOverview from '@/components/dashboard/ScoreOverview';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAnalysis } from '@/hooks/useAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import TechnicalHealthPanel from '@/components/TechnicalHealthPanel';
import AioAnalysisPanel from '@/components/AioAnalysisPanel';
import EnhancedRecommendations from '@/components/EnhancedRecommendations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LLMPresenceAudit from '@/components/llm-presence/LLMPresenceAudit';
import LocalDirectoryPresence from '@/components/LocalDirectoryPresence';

interface ClientPageContentProps {
  client: Client;
  analysisHistory: any[];
  onWebsiteAdded: () => void;
}

const ClientPageContent: React.FC<ClientPageContentProps> = ({ 
  client, 
  analysisHistory,
  onWebsiteAdded 
}) => {
  const { analysisData, isLoading, error } = useAnalysis(client.website);
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <p className="text-muted-foreground">{client.website}</p>
      </div>
      
      <Separator />
      
      <ScoreOverview client={client} showDetailedReport={true} />
      
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <p>A carregar análise detalhada...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : analysisData ? (
        <Tabs defaultValue="seo" className="space-y-4">
          <TabsList>
            <TabsTrigger value="seo">Saúde Técnica</TabsTrigger>
            <TabsTrigger value="aio">Análise AIO</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="llm">Presença em LLMs</TabsTrigger>
            <TabsTrigger value="directories">Diretórios Locais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seo" className="space-y-4">
            <TechnicalHealthPanel
              loadTimeDesktop={analysisData.seo.loadTimeDesktop}
              loadTimeMobile={analysisData.seo.loadTimeMobile}
              mobileFriendly={analysisData.seo.mobileFriendly}
              security={analysisData.seo.security}
              imageOptimization={analysisData.seo.imageOptimization}
              performanceScore={analysisData.seo.performanceScore}
              lcp={analysisData.seo.lcp}
              cls={analysisData.seo.cls}
              fid={analysisData.seo.fid}
            />
          </TabsContent>
          
          <TabsContent value="aio" className="space-y-4">
            <AioAnalysisPanel
              aioScore={analysisData.aio.score}
              contentClarity={analysisData.aio.contentClarity}
              logicalStructure={analysisData.aio.logicalStructure}
              naturalLanguage={analysisData.aio.naturalLanguage}
              topicsDetected={analysisData.aio.topicsDetected || []}
              confusingParts={analysisData.aio.confusingParts || []}
            />
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <EnhancedRecommendations recommendations={analysisData.recommendations || []} />
          </TabsContent>
          
          <TabsContent value="llm" className="space-y-4">
            <LLMPresenceAudit url={client.website} autoStart={true} />
          </TabsContent>
          
          <TabsContent value="directories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Presença em Diretórios Locais</CardTitle>
              </CardHeader>
              <CardContent>
                <LocalDirectoryPresence domain={client.website} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ainda não existem análises para este website. Execute uma nova análise para ver os resultados.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ClientPageContent;
