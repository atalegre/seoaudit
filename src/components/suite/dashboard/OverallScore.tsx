
import React from 'react';
import CircularProgress from '@/components/suite/dashboard/CircularProgress';
import { Globe } from 'lucide-react';

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
      {domain && (
        <div className="mb-3">
          {logoUrl ? (
            <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-gray-200 p-1 shadow-sm bg-white">
              <img 
                src={logoUrl} 
                alt={`Logo de ${domain}`} 
                className="w-12 h-12 object-contain" 
                onError={(e) => {
                  // Replace with Globe icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    container.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-gray-200 p-1 shadow-sm bg-gray-50">
              <Globe className="w-6 h-6 text-gray-400" />
            </div>
          )}
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
