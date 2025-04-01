
import React from 'react';
import { CircleCheck, CircleAlert, AlertCircle } from 'lucide-react';
import { StatusClassification } from '@/utils/analyzerUtils';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  label: string;
  colorClass: string;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, label, colorClass }) => {
  // Calculate the stroke-dasharray and stroke-dashoffset for the circle progress
  const circumference = 2 * Math.PI * 38; // 38 is the radius of the circle
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="38"
            fill="transparent"
            stroke={colorClass}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
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

interface StatusBadgeProps {
  status: StatusClassification;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = status === 'Crítico' 
    ? 'bg-red-100 text-red-800'
    : status === 'A melhorar'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-green-100 text-green-800';
  
  return (
    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', colorClass)}>
      {status}
    </span>
  );
};

interface ScoreDisplayProps {
  seoScore: number;
  aioScore: number;
  status: StatusClassification;
  url: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  seoScore, 
  aioScore, 
  status,
  url 
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border animate-scale-in">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Resultado da análise</h2>
        <p className="text-sm text-gray-600 break-all">
          URL: <span className="font-medium">{url}</span>
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-4">
          <ScoreCircle score={seoScore} label="Score SEO" colorClass="#0EA5E9" />
          <ScoreCircle score={aioScore} label="Score AIO" colorClass="#8B5CF6" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <StatusIcon status={status} />
          <StatusBadge status={status} />
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-2">
          Descubra como pode melhorar a sua presença nos motores de busca e nos modelos de IA
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
