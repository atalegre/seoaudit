
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import RecommendationIcon from './RecommendationIcon';
import ImpactBadge from './ImpactBadge';
import PriorityBadge from './PriorityBadge';

interface RecommendationItem {
  id?: number;
  suggestion: string;
  description?: string;
  seoImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
  aioImpact: 'Alto' | 'Médio' | 'Baixo' | 'Nenhum';
  priority: number;
  status?: 'pending' | 'in_progress' | 'done' | 'ignored';
  actionType?: string;
}

interface RecommendationRowProps {
  recommendation: RecommendationItem;
  onSelectRecommendation: (recommendation: RecommendationItem) => void;
}

const RecommendationRow: React.FC<RecommendationRowProps> = ({ 
  recommendation, 
  onSelectRecommendation 
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <RecommendationIcon suggestion={recommendation.suggestion} />
          </div>
          <span className="text-sm">{recommendation.suggestion}</span>
        </div>
      </TableCell>
      <TableCell>
        <ImpactBadge impact={recommendation.seoImpact} />
      </TableCell>
      <TableCell>
        <ImpactBadge impact={recommendation.aioImpact} />
      </TableCell>
      <TableCell>
        <PriorityBadge priority={recommendation.priority} />
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onSelectRecommendation(recommendation)}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default RecommendationRow;
