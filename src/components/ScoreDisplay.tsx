
import React, { memo } from 'react';
import { Globe, Calendar, BarChart, BrainCircuit, Zap, Bot, ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardAccess } from '@/hooks/useDashboardAccess';
import { useLLMPresence } from '@/components/llm-presence/useLLMPresence';

interface ScoreDisplayProps {
  seoScore: number;
  aioScore: number;
  performanceScore?: number;
  llmPresenceScore?: number;
  status: string;
  url: string;
  logoUrl?: string;
  onScrollToRecommendations: () => void;
}

const ScoreCard = memo(({ 
  title, 
  score, 
  description, 
  icon, 
  color = 'blue', 
  large = false 
}: {
  title: string;
  score: number;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'purple' | 'orange' | 'green' | 'gold';
  large?: boolean;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-green-50 text-green-700',
    gold: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className={`rounded-md p-3 ${colorClasses[color]} ${large ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="text-3xl font-bold">{score}</div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
});

ScoreCard.displayName = 'ScoreCard';

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'excelente') return 'text-green-500';
  if (statusLower === 'bom') return 'text-blue-500';
  if (statusLower === 'medio') return 'text-yellow-500';
  if (statusLower === 'critico') return 'text-red-500';
  return 'text-gray-500';
};

const ScoreDisplay = memo((props: ScoreDisplayProps) => {
  const {
    seoScore,
    aioScore,
    performanceScore = 0,
    llmPresenceScore = 0,
    status,
    url,
    logoUrl,
    onScrollToRecommendations,
  } = props;
  
  const { handleDashboardAccess } = useDashboardAccess();
  
  // Corrigido: removida a propriedade 'deferred' que não existe
  const { presenceScore } = useLLMPresence({ 
    url, 
    autoStart: false 
  });
  
  const actualLLMScore = llmPresenceScore || presenceScore || 0;
  const overallScore = Math.round((seoScore * 0.4) + (aioScore * 0.3) + (performanceScore * 0.2) + (actualLLMScore * 0.1));
  
  const statusColorClass = getStatusColor(status);
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`Logo de ${url}`} 
                className="w-10 h-10 object-contain rounded-md" 
                loading="eager" 
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <Globe className="w-8 h-8 text-primary" aria-hidden="true" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{url}</h2>
              <p className={`text-sm ${statusColorClass}`}>
                Status: {status}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Score Global" 
            score={overallScore} 
            description="Pontuação combinada de todas as métricas" 
            icon={<Star className="h-5 w-5 text-amber-500" aria-hidden="true" />} 
            color="gold"
            large
          />
          
          <ScoreCard 
            title="Score SEO" 
            score={seoScore} 
            description="Pontuação técnica do site" 
            icon={<BarChart className="h-5 w-5 text-blue-500" aria-hidden="true" />} 
          />
          
          <ScoreCard 
            title="Score AIO" 
            score={aioScore} 
            description="Pontuação para IA" 
            icon={<BrainCircuit className="h-5 w-5 text-purple-500" aria-hidden="true" />} 
            color="purple"
          />
          
          <ScoreCard 
            title="Performance" 
            score={performanceScore} 
            description="Velocidade do site" 
            icon={<Zap className="h-5 w-5 text-orange-500" aria-hidden="true" />} 
            color="orange"
          />
          
          <ScoreCard 
            title="Presença em IA" 
            score={actualLLMScore} 
            description="Visibilidade em LLMs" 
            icon={<Bot className="h-5 w-5 text-green-500" aria-hidden="true" />} 
            color="green"
          />
        </div>
        
        {overallScore < 70 && (
          <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-100">
            <p className="text-sm">
              O seu site tem aspectos positivos, mas ainda há margem para melhorias.
            </p>
          </div>
        )}
        
        <div className="mt-6 bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600 text-center">
            Score global combinando SEO (40%), AIO (30%), Performance (20%) e Presença em IA (10%).
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleDashboardAccess}
            className="gap-2"
            size="lg"
          >
            Ver relatório completo <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';

export default ScoreDisplay;
