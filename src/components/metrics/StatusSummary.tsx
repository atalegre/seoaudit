
import React from 'react';
import { StatusClassification } from '@/utils/api/types';
import { cn } from '@/lib/utils';

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

export default StatusSummary;
