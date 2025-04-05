
import React from 'react';
import { Globe, Calendar, BarChart, BrainCircuit, Zap, Bot, ChevronDown } from 'lucide-react';
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

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'purple' | 'orange' | 'green';
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description, icon, color = 'blue' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'purple':
        return 'bg-purple-50 text-purple-700';
      case 'orange':
        return 'bg-orange-50 text-orange-700';
      case 'green':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  return (
    <div className={`rounded-md p-3 ${getColorClass()}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="text-3xl font-bold">{score}</div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'excelente':
      return 'text-green-500';
    case 'bom':
      return 'text-blue-500';
    case 'medio':
      return 'text-yellow-500';
    case 'critico':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const ScoreDisplay = ({
  seoScore,
  aioScore,
  performanceScore = 0,
  llmPresenceScore = 0,
  status,
  url,
  logoUrl,
  onScrollToRecommendations,
}) => {
  const { handleDashboardAccess } = useDashboardAccess();
  const overallScore = (seoScore * 0.4) + (aioScore * 0.3) + (performanceScore * 0.2) + (llmPresenceScore * 0.1);
  
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
              />
            ) : (
              <Globe className="w-8 h-8 text-primary" />
            )}
            <div>
              <h2 className="text-lg font-semibold">{url}</h2>
              <p className={`text-sm ${getStatusColor(status)}`}>
                Status: {status}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Score SEO" 
            score={seoScore} 
            description="Pontuação técnica do site" 
            icon={<BarChart className="h-5 w-5 text-blue-500" />} 
          />
          
          <ScoreCard 
            title="Score AIO" 
            score={aioScore} 
            description="Pontuação para IA" 
            icon={<BrainCircuit className="h-5 w-5 text-purple-500" />} 
            color="purple"
          />
          
          <ScoreCard 
            title="Performance" 
            score={performanceScore} 
            description="Velocidade do site" 
            icon={<Zap className="h-5 w-5 text-orange-500" />} 
            color="orange"
          />
          
          <ScoreCard 
            title="Presença em IA" 
            score={llmPresenceScore} 
            description="Visibilidade em LLMs" 
            icon={<Bot className="h-5 w-5 text-green-500" />} 
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
            Ver relatório completo <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
