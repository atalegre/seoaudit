
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: string;
  onClick?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onClick }) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="p-2 bg-purple-50 rounded-full text-purple-600 shrink-0">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800 mb-2">{recommendation}</p>
        {onClick && (
          <button 
            onClick={onClick}
            className="text-xs font-medium text-purple-600 hover:text-purple-700"
          >
            Criar conteúdo →
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
