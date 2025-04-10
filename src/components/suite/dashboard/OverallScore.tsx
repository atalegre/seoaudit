
import React from 'react';
import CircularProgress from '@/components/suite/dashboard/CircularProgress';

interface OverallScoreProps {
  totalScore: number;
  logoUrl?: string;
  domain?: string;
}

const OverallScore = ({ totalScore, logoUrl, domain }: OverallScoreProps) => {
  // Generate colors based on score
  const getScoreColor = () => {
    if (totalScore >= 80) return 'text-green-500';
    if (totalScore >= 60) return 'text-amber-500';
    if (totalScore >= 40) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Generate stroke color for progress circle
  const getCircleColor = () => {
    if (totalScore >= 80) return 'stroke-green-500';
    if (totalScore >= 60) return 'stroke-amber-500';
    if (totalScore >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };
  
  // Generate score description
  const getScoreDescription = () => {
    if (totalScore >= 80) return 'Excelente';
    if (totalScore >= 60) return 'Bom';
    if (totalScore >= 40) return 'Precisa Melhorar';
    return 'Precisa de Atenção';
  };
  
  return (
    <div className="flex flex-col items-center">
      {logoUrl && (
        <div className="mb-3">
          <img 
            src={logoUrl} 
            alt={`Logo de ${domain}`} 
            className="w-14 h-14 object-contain rounded-lg border border-gray-200 p-1 shadow-sm" 
          />
        </div>
      )}
      
      <div className="relative flex items-center justify-center">
        <CircularProgress 
          value={totalScore} 
          size={150} 
          color={getCircleColor()}
          bgColor="stroke-gray-100"
          thickness={8}
        >
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-bold ${getScoreColor()}`}>{totalScore}</span>
            <span className="text-xs text-muted-foreground">de 100</span>
          </div>
        </CircularProgress>
      </div>
      
      <div className="mt-3 text-center">
        <p className={`font-medium ${getScoreColor()}`}>{getScoreDescription()}</p>
        <p className="text-xs text-muted-foreground mt-1">Pontuação combinada</p>
      </div>
    </div>
  );
};

export default OverallScore;
