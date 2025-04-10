
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
  const getProgressGradient = (score: number, colorType: 'blue' | 'green' | 'red' | 'amber') => {
    const gradients = {
      blue: "bg-gradient-to-r from-blue-400 to-blue-600",
      green: "bg-gradient-to-r from-green-400 to-green-600",
      red: "bg-gradient-to-r from-red-400 to-red-600",
      amber: "bg-gradient-to-r from-amber-400 to-amber-600"
    };
    
    return gradients[colorType];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Métricas Adicionais</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-blue-100">
                <Cpu className="h-4 w-4 text-blue-600" />
              </div>
              Performance Técnica
            </CardTitle>
            <CardDescription>Core Web Vitals e velocidade de carregamento</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Score: {performanceScore}%</span>
              </div>
              <Progress 
                value={performanceScore} 
                className="h-2 bg-blue-100" 
                indicatorClassName={getProgressGradient(performanceScore, 'blue')} 
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 w-full text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              onClick={() => navigateTo('/suite/seo')}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-green-50 to-white border-green-100">
          <div className="h-1 w-full bg-gradient-to-r from-green-400 to-green-600"></div>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-green-100">
                <BrainCircuit className="h-4 w-4 text-green-600" />
              </div>
              Presença em IA
            </CardTitle>
            <CardDescription>Como sua marca aparece em ChatGPT e outros LLMs</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-700">Score: {llmScore}%</span>
              </div>
              <Progress 
                value={llmScore} 
                className="h-2 bg-green-100" 
                indicatorClassName={getProgressGradient(llmScore, 'green')} 
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 w-full text-green-700 hover:bg-green-50 hover:text-green-800"
              onClick={() => navigateTo('/suite/llm')}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600"></div>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-red-100">
                <MapPin className="h-4 w-4 text-red-600" />
              </div>
              Diretórios Locais
            </CardTitle>
            <CardDescription>Presença em Google Business e outros diretórios</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-red-700">Score: {directoryScore}%</span>
              </div>
              <Progress 
                value={directoryScore} 
                className="h-2 bg-red-100" 
                indicatorClassName={getProgressGradient(directoryScore, 'red')} 
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 w-full text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => navigateTo('/suite/directories')}
              disabled={!isUserLoggedIn}
            >
              Ver Detalhes
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-amber-100">
                <Search className="h-4 w-4 text-amber-600" />
              </div>
              Pesquisa de Keywords
            </CardTitle>
            <CardDescription>Palavras-chave relevantes para seu negócio</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-amber-700">Score: {keywordScore}%</span>
              </div>
              <Progress 
                value={keywordScore} 
                className="h-2 bg-amber-100" 
                indicatorClassName={getProgressGradient(keywordScore, 'amber')} 
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 w-full text-amber-700 hover:bg-amber-50 hover:text-amber-800"
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
