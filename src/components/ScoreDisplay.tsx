import React from 'react';
import { CircleCheck, CircleAlert, AlertCircle, Zap, Globe, BrainCircuit, MessageSquare } from 'lucide-react';
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

interface StatusIconProps {
  status: StatusClassification;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status) {
    case 'Crítico':
      return <CircleAlert className="h-8 w-8 text-red-500" />;
    case 'A melhorar':
      return <AlertCircle className="h-8 w-8 text-amber-500" />;
    case 'Saudável':
      return <CircleCheck className="h-8 w-8 text-green-500" />;
    default:
      return null;
  }
};

interface StatusCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "success" | "warning" | "error" | "info";
}

const StatusCard: React.FC<StatusCardProps> = ({ title, description, icon, variant }) => {
  const variantStyles = {
    success: "bg-green-50 border-green-200 text-green-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  
  return (
    <div className={cn("p-3 rounded-md border flex items-start gap-3", variantStyles[variant])}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs opacity-90">{description}</p>
      </div>
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
  
  const getSeoStatusCard = () => {
    if (seoScore >= 80) {
      return {
        title: "SEO com estrutura sólida",
        description: "A estrutura do site está bem otimizada para motores de busca.",
        icon: <CircleCheck className="h-4 w-4" />,
        variant: "success" as const
      };
    } else if (seoScore >= 60) {
      return {
        title: "SEO precisa de melhorias",
        description: "Existem oportunidades para otimizar o SEO do site.",
        icon: <AlertCircle className="h-4 w-4" />,
        variant: "warning" as const
      };
    } else {
      return {
        title: "SEO com problemas críticos",
        description: "Corrija estes problemas para melhorar o ranqueamento do site.",
        icon: <CircleAlert className="h-4 w-4" />,
        variant: "error" as const
      };
    }
  };
  
  const getAioStatusCard = () => {
    if (aioScore >= 80) {
      return {
        title: "IA entende bem o conteúdo",
        description: "O conteúdo é claro e bem estruturado para modelos de IA.",
        icon: <CircleCheck className="h-4 w-4" />,
        variant: "success" as const
      };
    } else if (aioScore >= 60) {
      return {
        title: "IA entende parte do conteúdo",
        description: "O conteúdo pode ser clarificado para melhor compreensão da IA.",
        icon: <AlertCircle className="h-4 w-4" />,
        variant: "warning" as const
      };
    } else {
      return {
        title: "IA tem dificuldade com o conteúdo",
        description: "O conteúdo precisa ser reescrito para ser compreendido por IA.",
        icon: <CircleAlert className="h-4 w-4" />,
        variant: "error" as const
      };
    }
  };
  
  const getLlmStatusCard = () => {
    if (llmPresenceScore >= 70) {
      return {
        title: "LLMs referenciam o seu site",
        description: "Sua marca é mencionada em respostas de IA generativa.",
        icon: <CircleCheck className="h-4 w-4" />,
        variant: "success" as const
      };
    } else if (llmPresenceScore >= 40) {
      return {
        title: "LLMs citam parcialmente seu site",
        description: "Sua marca é ocasionalmente mencionada em respostas de IA.",
        icon: <AlertCircle className="h-4 w-4" />,
        variant: "warning" as const
      };
    } else {
      return {
        title: "LLMs não referenciam seu site",
        description: "Sua marca não aparece em respostas de modelos de IA.",
        icon: <CircleAlert className="h-4 w-4" />,
        variant: "error" as const
      };
    }
  };
  
  const seoStatusCard = getSeoStatusCard();
  const aioStatusCard = getAioStatusCard();
  const llmStatusCard = getLlmStatusCard();
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border animate-scale-in">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
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
              <h2 className="text-xl font-semibold">Resultado da análise</h2>
              <p className="text-sm text-gray-600 break-all">
                URL: <span className="font-medium">{url}</span>
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
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-2">
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
          
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <ScoreCircle score={seoScore} label="SEO" colorClass="#0EA5E9" icon={<Globe className="h-4 w-4" />} />
            <ScoreCircle score={aioScore} label="AIO" colorClass="#8B5CF6" icon={<BrainCircuit className="h-4 w-4" />} />
            <ScoreCircle score={performanceScore} label="Performance" colorClass="#F97316" icon={<Zap className="h-4 w-4" />} />
            <ScoreCircle score={llmPresenceScore} label="Presença LLM" colorClass="#D946EF" icon={<MessageSquare className="h-4 w-4" />} />
          </div>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-2">
            Este é o score global de performance digital, combinando SEO (40%), AIO (30%), 
            Velocidade (20%) e Presença em IA (10%).
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium mb-3 text-base">Resumo executivo</h3>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            <StatusCard {...seoStatusCard} />
            <StatusCard {...aioStatusCard} />
            <StatusCard {...llmStatusCard} />
          </div>
          
          <div className="mt-5 flex justify-center">
            <Button 
              onClick={onScrollToRecommendations} 
              className="gap-2"
            >
              Ver recomendações
              <AlertCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm italic text-gray-500">
            "Pequenas melhorias hoje, grande impacto amanhã."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
