
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RecommendationRow from './RecommendationRow';

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

interface RecommendationTableProps {
  recommendations: RecommendationItem[];
  onSelectRecommendation: (recommendation: RecommendationItem) => void;
}

const RecommendationTable: React.FC<RecommendationTableProps> = ({ 
  recommendations, 
  onSelectRecommendation 
}) => {
  // Sort recommendations by priority (highest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => b.priority - a.priority);
  
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[46%]">Recomendação</TableHead>
            <TableHead className="w-[18%]">Impacto SEO</TableHead>
            <TableHead className="w-[18%]">Impacto AIO</TableHead>
            <TableHead className="w-[18%]">Prioridade</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecommendations.map((recommendation, index) => (
            <RecommendationRow
              key={index}
              recommendation={recommendation}
              onSelectRecommendation={onSelectRecommendation}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecommendationTable;
