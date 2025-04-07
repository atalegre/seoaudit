
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import RecommendationTable from './RecommendationTable';
import RecommendationDetail from './RecommendationDetail';
import SupportCallout from './SupportCallout';

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

interface EnhancedRecommendationsProps {
  recommendations: RecommendationItem[];
}

const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({ recommendations }) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const handleSelectRecommendation = (recommendation: RecommendationItem) => {
    setSelectedRecommendation(recommendation);
    setSheetOpen(true);
  };
  
  return (
    <Card id="recommendations">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recomendações de Melhorias
            </CardTitle>
            <CardDescription>
              Ações priorizadas para melhorar seu site
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <RecommendationTable 
            recommendations={recommendations} 
            onSelectRecommendation={handleSelectRecommendation} 
          />
          {selectedRecommendation && (
            <RecommendationDetail recommendation={selectedRecommendation} />
          )}
        </Sheet>
        
        <SupportCallout />
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendations;
