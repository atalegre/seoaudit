
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuiteHeaderProps {
  title?: string;
  domain?: string;
  lastAnalysisDate?: string;
  showBackButton?: boolean;
  onRerunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

const SuiteHeader = ({ 
  title, 
  domain, 
  lastAnalysisDate, 
  showBackButton = false,
  onRerunAnalysis,
  isAnalyzing = false
}: SuiteHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/suite')}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          )}
          
          <div>
            <h1 className="text-xl font-semibold">{title || 'Dashboard'}</h1>
            {domain && <p className="text-sm text-gray-500">{domain}</p>}
            {lastAnalysisDate && (
              <p className="text-xs text-gray-400">
                Última análise: {lastAnalysisDate}
              </p>
            )}
          </div>
        </div>
        
        {onRerunAnalysis && (
          <Button 
            onClick={onRerunAnalysis} 
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analisando...' : 'Analisar Novamente'}
          </Button>
        )}
      </div>
    </header>
  );
};

export default SuiteHeader;
