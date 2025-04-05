
import React, { useState, useEffect } from 'react';
import { StatusClassification } from '@/utils/api/types';
import { Globe, BrainCircuit, Zap, MessageSquare, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import ScoreCircle from './metrics/ScoreCircle';
import StatusSummary from './metrics/StatusSummary';
import ScoreGradient from './metrics/ScoreGradient';

interface ScoreDisplayProps {
  seoScore: number;
  aioScore: number;
  performanceScore?: number;
  llmPresenceScore?: number; 
  status: StatusClassification;
  url: string;
  logoUrl?: string | null;
  onScrollToRecommendations?: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  seoScore, 
  aioScore, 
  performanceScore = 65,
  llmPresenceScore = 30,
  status,
  url,
  logoUrl,
  onScrollToRecommendations
}) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const overallScore = Math.round(
    (seoScore * 0.4) + 
    (aioScore * 0.3) + 
    (performanceScore * 0.2) + 
    (llmPresenceScore * 0.1)
  );
  
  // Logs detalhados para depuração
  console.log('ScoreDisplay - Rendering with URL:', url);
  console.log('ScoreDisplay - Logo URL:', logoUrl);
  
  // Reset logo state when URL changes
  useEffect(() => {
    setLogoLoaded(false);
    setLogoError(false);
  }, [logoUrl]);
  
  // Se não temos URL do logo mas temos URL do site, tentar gerar logo URL diretamente
  const fallbackLogoUrl = !logoUrl && url ? `https://logo.clearbit.com/${url.replace(/^(https?:\/\/)?(www\.)?/, '')}` : null;
  
  console.log('ScoreDisplay - Fallback Logo URL:', fallbackLogoUrl);
  
  const handleLogoLoad = () => {
    console.log('Logo carregado com sucesso');
    setLogoLoaded(true);
  };
  
  const handleLogoError = () => {
    console.log('Erro ao carregar logo');
    setLogoError(true);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border animate-scale-in">
      {/* Header com URL e Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border">
            {(logoUrl || fallbackLogoUrl) && !logoError ? (
              <AvatarImage 
                src={logoUrl || fallbackLogoUrl || ''} 
                alt={`Logo de ${url}`}
                onLoad={handleLogoLoad}
                onError={handleLogoError}
              />
            ) : null}
            <AvatarFallback>{url.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Análise Digital</h2>
            <p className="text-sm text-gray-600 break-all">
              {url}
            </p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs py-1 px-3", 
            status === 'Saudável' ? "bg-green-50 border-green-200 text-green-800" :
            status === 'A melhorar' ? "bg-amber-50 border-amber-200 text-amber-800" :
            "bg-red-50 border-red-200 text-red-800"
          )}
        >
          {status}
        </Badge>
      </div>
      
      {/* 1. 🧠 Resumo Geral no Topo (Hero Impacto) */}
      <div className="flex flex-col items-center justify-center">
        {/* Score Global central */}
        <div className="mb-4">
          <ScoreCircle 
            score={overallScore} 
            label="Score Global" 
            colorClass="url(#scoreGradient)" 
            size="lg"
            icon={<Globe className="h-5 w-5" />}
          />
          
          <ScoreGradient />
        </div>
        
        {/* Scores individuais em linha */}
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <ScoreCircle score={seoScore} label="SEO" colorClass="#0EA5E9" icon={<Globe className="h-4 w-4" />} />
          <ScoreCircle score={aioScore} label="AIO" colorClass="#8B5CF6" icon={<BrainCircuit className="h-4 w-4" />} />
          <ScoreCircle score={performanceScore} label="Performance" colorClass="#F97316" icon={<Zap className="h-4 w-4" />} />
          <ScoreCircle score={llmPresenceScore} label="Presença IA" colorClass="#D946EF" icon={<MessageSquare className="h-4 w-4" />} />
        </div>
        
        {/* Frase resumo de estado do site */}
        <StatusSummary status={status} seoScore={seoScore} aioScore={aioScore} />
        
        {/* Explicação do score */}
        <div className="text-center mt-3 mb-6">
          <p className="text-sm text-gray-500 bg-gray-50 rounded-md p-2">
            Score global combinando SEO (40%), AIO (30%), 
            Performance (20%) e Presença em IA (10%).
          </p>
        </div>
        
        {/* Botão flutuante para recomendações */}
        <div className="sticky bottom-4 flex justify-center">
          <Button 
            onClick={onScrollToRecommendations}
            size="lg"
            className="shadow-lg flex items-center gap-2 animate-pulse"
          >
            <span>Ver recomendações detalhadas</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
