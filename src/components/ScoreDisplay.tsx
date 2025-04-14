
import React from 'react';
import { Globe, Calendar, BarChart, BrainCircuit, Zap, Bot, ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardAccess } from '@/hooks/useDashboardAccess';

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

// Componente de cartão de pontuação simplificado
const ScoreCard = ({ 
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
};

// Função simplificada para determinar cor do status
function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === 'excelente') return 'text-green-500';
  if (statusLower === 'bom') return 'text-blue-500';
  if (statusLower === 'medio') return 'text-yellow-500';
  if (statusLower === 'critico') return 'text-red-500';
  return 'text-gray-500';
}

const ScoreDisplay = (props: ScoreDisplayProps) => {
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
  
  // Cálculo simplificado
  const actualLLMScore = llmPresenceScore || 0;
  const overallScore = Math.round((seoScore * 0.4) + (aioScore * 0.3) + (performanceScore * 0.2) + (actualLLMScore * 0.1));
  
  const statusColorClass = getStatusColor(status);
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-white border overflow-hidden">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`Logo de ${url}`} 
                  className="w-full h-full object-contain" 
                  loading="eager" 
                  fetchPriority="high"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      container.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    }
                  }}
                />
              ) : (
                <Globe className="w-6 h-6 text-gray-400" aria-hidden="true" />
              )}
            </div>
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
};

export default ScoreDisplay;
