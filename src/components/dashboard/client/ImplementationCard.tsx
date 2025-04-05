
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface ImplementationCardProps {
  implementedRecommendations: number;
  totalRecommendations: number;
}

const ImplementationCard = ({ implementedRecommendations, totalRecommendations }: ImplementationCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Melhorias implementadas</CardTitle>
        <CardDescription>
          Total de recomendações aplicadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{implementedRecommendations}</div>
        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: totalRecommendations ? `${(implementedRecommendations / totalRecommendations) * 100}%` : '0%' }}></div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {totalRecommendations} recomendações no total
        </p>
      </CardFooter>
    </Card>
  );
};

export default ImplementationCard;
