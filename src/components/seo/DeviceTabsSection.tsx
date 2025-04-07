
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { PageInsightsData } from '@/utils/api/pageInsights/types';
import DevicePerformancePanel from './DevicePerformancePanel';
import CoreWebVitalsPanel from './CoreWebVitalsPanel';
import TechnicalAuditsPanel from './TechnicalAuditsPanel';
import OpportunitiesPanel from './OpportunitiesPanel';

interface DeviceTabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  desktopData: PageInsightsData | null;
  mobileData: PageInsightsData | null;
  isAnalyzing: boolean;
  error?: string | null;
}

const DeviceTabsSection: React.FC<DeviceTabsSectionProps> = ({
  activeTab,
  setActiveTab,
  desktopData,
  mobileData,
  isAnalyzing,
  error
}) => {
  // Se está carregando, mostre um indicador de carregamento
  if (isAnalyzing) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Analisando a página. Isso pode levar alguns minutos...</p>
        </div>
      </Card>
    );
  }

  // Se ocorreu um erro, exiba a mensagem
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao obter dados da API</AlertTitle>
        <AlertDescription>
          {error}
          <p className="mt-2">Certifique-se de que a URL é válida e acessível publicamente.</p>
        </AlertDescription>
      </Alert>
    );
  }

  // Se não houver dados, mostre uma mensagem orientando o usuário
  if (!desktopData && !mobileData) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Sem dados para exibir</AlertTitle>
        <AlertDescription>
          Insira uma URL válida acima e clique em "Analisar" para ver os resultados.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="desktop">Desktop</TabsTrigger>
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
      </TabsList>

      <TabsContent value="desktop" className="space-y-4">
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
            <OpportunitiesPanel 
              recommendations={desktopData.recommendations || []} 
            />
          </>
        ) : (
          <Alert>
            <AlertTitle>Dados Desktop não disponíveis</AlertTitle>
            <AlertDescription>
              Não foi possível obter dados para visualização desktop.
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>

      <TabsContent value="mobile" className="space-y-4">
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
            <OpportunitiesPanel 
              recommendations={mobileData.recommendations || []} 
            />
          </>
        ) : (
          <Alert>
            <AlertTitle>Dados Mobile não disponíveis</AlertTitle>
            <AlertDescription>
              Não foi possível obter dados para visualização mobile.
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DeviceTabsSection;
