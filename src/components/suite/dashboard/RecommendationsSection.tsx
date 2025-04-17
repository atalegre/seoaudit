
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { SampleRecommendation } from '@/hooks/suite/dashboard/useRecommendations';

export interface RecommendationsSectionProps {
  recommendations: SampleRecommendation[];
  onViewMore: () => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations, onViewMore }) => {
  // Only show top 3 recommendations
  const topRecommendations = recommendations?.slice(0, 3) || [];

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recomendações prioritárias</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewMore}>
          Ver todas
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRecommendations.map((recommendation, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{recommendation.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  recommendation.impact === 'high' ? 'bg-red-100 text-red-800' :
                  recommendation.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {recommendation.impact === 'high' ? 'Alta prioridade' :
                   recommendation.impact === 'medium' ? 'Média prioridade' : 'Baixa prioridade'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase">{recommendation.type}</span>
                <Button variant="outline" size="sm">Implementar</Button>
              </div>
            </div>
          ))}

          {topRecommendations.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhuma recomendação disponível no momento.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSection;
