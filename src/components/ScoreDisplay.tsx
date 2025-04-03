
import React from 'react';
import { CircleCheck, CircleAlert, AlertCircle, Zap, Globe, BrainCircuit, MessageSquare, ChevronDown } from 'lucide-react';
import { StatusClassification } from '@/utils/api/types';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface ScoreCircleProps {
  score: number;
  label: string;
  colorClass: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label, colorClass, size = 'md', icon }) => {
  const radius = size === 'lg' ? 42 : size === 'md' ? 38 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28", 
    lg: "w-36 h-36"
  };
  
  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl"
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius + 2}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={colorClass}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {icon && <div className="mb-1 opacity-70">{icon}</div>}
          <span className={cn("font-bold", textSizeClasses[size])}>{score}</span>
        </div>
      </div>
      <span className={cn("mt-2 font-medium", size === 'lg' ? 'text-base' : 'text-sm')}>{label}</span>
    </div>
  );
};

interface StatusSummaryProps {
  status: StatusClassification;
  seoScore: number;
  aioScore: number;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ status, seoScore, aioScore }) => {
  const getSummaryText = () => {
    if (seoScore >= 80 && aioScore >= 80) {
      return "O seu site tem excelente base técnica e clareza para IA.";
    } else if (seoScore >= 80 && aioScore < 60) {
      return "O seu site tem boa base técnica, mas precisa melhorar na clareza para IA.";
    } else if (seoScore < 60 && aioScore >= 80) {
      return "O seu site é claro para IA, mas precisa melhorar sua estrutura técnica.";
    } else if (seoScore < 60 && aioScore < 60) {
      return "O seu site precisa de melhorias técnicas e de clareza para IA.";
    } else {
      return "O seu site tem aspectos positivos, mas ainda há margem para melhorias.";
    }
  };
  
  const summaryBgColor = {
    'Saudável': 'bg-green-50 border-green-200 text-green-800',
    'A melhorar': 'bg-amber-50 border-amber-200 text-amber-800',
    'Crítico': 'bg-red-50 border-red-200 text-red-800',
  };
  
  return (
    <div className={cn("p-4 rounded-lg border text-center mt-4", summaryBgColor[status])}>
      <p className="text-lg font-medium">{getSummaryText()}</p>
    </div>
  );
};

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
  const overallScore = Math.round(
    (seoScore * 0.4) + 
    (aioScore * 0.3) + 
    (performanceScore * 0.2) + 
    (llmPresenceScore * 0.1)
  );
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border animate-scale-in">
      {/* Header com URL e Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={logoUrl} alt={`Logo de ${url}`} />
              <AvatarFallback>{url.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-12 w-12 border">
              <AvatarFallback>{url.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
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
          
          <svg width="0" height="0" className="absolute">
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </svg>
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
