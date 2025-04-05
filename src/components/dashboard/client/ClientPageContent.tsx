
import React, { useRef } from 'react';
import ScoreOverview from './ScoreOverview';
import WebsitesSection from './WebsitesSection';
import ReportsSection from '../ReportsSection';
import NotificationsSection from './NotificationsSection';
import EnhancedRecommendations from '@/components/EnhancedRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/utils/api/types';
import { Button } from '@/components/ui/button';
import { Globe, PlusCircle } from 'lucide-react';

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
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
  // Get the latest analysis if available
  const latestAnalysis = analysisHistory && analysisHistory.length > 0 
    ? analysisHistory[0] 
    : null;
  
  // Extract scores and recommendations
  const seoScore = latestAnalysis?.seo?.score || client?.seoScore || 0;
  const aioScore = latestAnalysis?.aio?.score || client?.aioScore || 0;
  const performanceScore = latestAnalysis?.seo?.performanceScore || 0;
  const llmPresenceScore = latestAnalysis?.llmPresenceScore || 0;
  
  // Format date for last update
  const lastUpdate = latestAnalysis?.timestamp 
    ? new Date(latestAnalysis.timestamp).toLocaleDateString()
    : 'Sem dados';
  
  // Extract recommendations from latest analysis
  const recommendations = latestAnalysis?.recommendations || [];
  
  // Calculate implemented recommendations
  const implementedRecs = recommendations.filter(r => r.status === 'done').length;
  
  // Format reports for reports section
  const formattedReports = analysisHistory.map((report, index) => ({
    id: index + 1,
    name: `Relatório ${report.url} (${new Date(report.timestamp).toLocaleDateString()})`,
    date: new Date(report.timestamp).toLocaleDateString(),
    status: 'completed',
    type: (report.seo?.score || 0) > (report.aio?.score || 0) ? 'SEO' : 'AIO',
    url: report.url,
    logoUrl: report.logoUrl
  }));
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de {client.name}</h1>
          <p className="text-muted-foreground">
            Gerencie seus websites e analise o desempenho
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={onWebsiteAdded} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Adicionar site
          </Button>
        </div>
      </div>
      
      {client.website && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Site atual: {client.website}
            </CardTitle>
          </CardHeader>
          {latestAnalysis?.logoUrl && (
            <CardContent>
              <div className="flex items-center gap-3">
                <img 
                  src={latestAnalysis.logoUrl} 
                  alt={`Logo de ${client.website}`} 
                  className="w-12 h-12 object-contain rounded-md border p-1" 
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Última análise: {lastUpdate}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
      
      <ScoreOverview
        seoScore={seoScore}
        aioScore={aioScore}
        accessibilityScore={0}
        scoreDiff={latestAnalysis?.scoreDiff || { seo: 0, aio: 0 }}
        lastUpdate={lastUpdate}
        implementedRecommendations={implementedRecs}
        totalRecommendations={recommendations.length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReportsSection reports={formattedReports} />
        <NotificationsSection 
          notifications={[
            {
              id: 1,
              title: 'Bem-vindo ao Dashboard',
              description: client.website 
                ? `Acompanhe o desempenho de ${client.website} aqui.` 
                : 'Adicione o seu primeiro website para começar as análises.',
              date: new Date().toLocaleDateString(),
              read: false,
              urgent: false
            }
          ]} 
          onMarkAsRead={() => {}}
        />
      </div>
      
      <div ref={recommendationsRef}>
        {recommendations.length > 0 && (
          <EnhancedRecommendations recommendations={recommendations} />
        )}
      </div>
      
      <WebsitesSection 
        websites={[
          {
            id: 1,
            name: client.website || 'Sem website',
            url: client.website || '',
            status: latestAnalysis?.overallStatus || 'Em análise',
            lastAnalysis: latestAnalysis?.timestamp ? new Date(latestAnalysis.timestamp) : null
          }
        ]}
      />
    </div>
  );
};

export default ClientPageContent;
