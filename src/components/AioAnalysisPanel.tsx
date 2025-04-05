
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import MetricsSection from './aio/MetricsSection';
import TopicsSection from './aio/TopicsSection';
import ConfusingPartsSection from './aio/ConfusingPartsSection';
import InfoFooter from './aio/InfoFooter';

export interface AioAnalysisPanelProps {
  aioScore: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
  className?: string;
}

const AioAnalysisPanel: React.FC<AioAnalysisPanelProps> = ({
  aioScore,
  contentClarity,
  logicalStructure,
  naturalLanguage,
  topicsDetected,
  confusingParts,
  className
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-500" />
            Análise AIO (AI Optimization)
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-0.5",
              aioScore >= 80 ? "bg-purple-50 text-purple-700 border-purple-200" :
              aioScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {aioScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <MetricsSection 
          contentClarity={contentClarity}
          logicalStructure={logicalStructure}
          naturalLanguage={naturalLanguage}
        />
        
        <TopicsSection topics={topicsDetected} />
        
        <ConfusingPartsSection confusingParts={confusingParts} />
        
        <InfoFooter />
      </CardContent>
    </Card>
  );
};

export default AioAnalysisPanel;
