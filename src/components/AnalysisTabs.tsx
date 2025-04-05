import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalysisResult } from '@/utils/api/types';
import { TechnicalHealthPanel } from './TechnicalHealthPanel';
import { AioAnalysisPanel } from './AioAnalysisPanel';
import AccessibilityPanel from './AccessibilityPanel';

interface AnalysisTabsProps {
  data: AnalysisResult;
  seoError?: string | null;
  aioError?: string | null;
}

export const AnalysisTabs = ({ data, seoError, aioError }: AnalysisTabsProps) => {
  return (
    <Tabs defaultValue="technical" className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="technical">Saúde Técnica</TabsTrigger>
        <TabsTrigger value="aio">Análise AIO</TabsTrigger>
        <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
      </TabsList>
      
      <TabsContent value="technical">
        <TechnicalHealthPanel 
          data={data.seo} 
          error={seoError}
          className="border-t-0 rounded-t-none" 
        />
      </TabsContent>
      
      <TabsContent value="aio">
        <AioAnalysisPanel 
          data={data.aio} 
          error={aioError}
          className="border-t-0 rounded-t-none" 
        />
      </TabsContent>
      
      <TabsContent value="accessibility">
        {data.accessibility ? (
          <AccessibilityPanel 
            data={data.accessibility}
            className="border-t-0 rounded-t-none" 
          />
        ) : (
          <div className="p-6 text-center bg-white border border-t-0 rounded-b-lg">
            <p className="text-muted-foreground">
              Dados de acessibilidade não disponíveis. Realize uma nova análise para avaliar a conformidade com WCAG/EAA.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
