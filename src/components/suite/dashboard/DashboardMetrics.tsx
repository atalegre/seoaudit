
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, MapPin, Search, Cpu } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DashboardMetricsProps {
  performanceScore: number;
  llmScore: number;
  directoryScore: number;
  keywordScore: number;
  isUserLoggedIn: boolean;
  navigateTo: (path: string) => void;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  performanceScore,
  llmScore,
  directoryScore,
  keywordScore,
  isUserLoggedIn,
  navigateTo
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Métricas Adicionais</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4 text-blue-500" />
              Performance Técnica
            </CardTitle>
            <CardDescription>Core Web Vitals e velocidade de carregamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Score: {performanceScore}%</span>
              </div>
              <Progress value={performanceScore} className="h-2" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigateTo('/suite/seo')}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BrainCircuit className="h-4 w-4 text-green-500" />
              Presença em IA
            </CardTitle>
            <CardDescription>Como sua marca aparece em ChatGPT e outros LLMs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Score: {llmScore}%</span>
              </div>
              <Progress value={llmScore} className="h-2" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigateTo('/suite/llm')}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-red-500" />
              Diretórios Locais
            </CardTitle>
            <CardDescription>Presença em Google Business e outros diretórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Score: {directoryScore}%</span>
              </div>
              <Progress value={directoryScore} className="h-2" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigateTo('/suite/directories')}
              disabled={!isUserLoggedIn}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-amber-500" />
              Pesquisa de Keywords
            </CardTitle>
            <CardDescription>Palavras-chave relevantes para seu negócio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Score: {keywordScore}%</span>
              </div>
              <Progress value={keywordScore} className="h-2" />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigateTo('/suite/keywords')}
              disabled={!isUserLoggedIn}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
