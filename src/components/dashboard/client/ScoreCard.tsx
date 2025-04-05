
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface ScoreCardProps {
  title: string;
  description: string;
  score: number;
  scoreDiff?: number;
  lastUpdate: string;
  colorClass?: string;
}

const ScoreCard = ({ 
  title, 
  description, 
  score, 
  scoreDiff = 0, 
  lastUpdate,
  colorClass = "bg-primary"
}: ScoreCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-4xl font-bold">{score}</div>
          {scoreDiff !== 0 && (
            <div className={`ml-2 text-sm font-medium ${scoreDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff} pts
            </div>
          )}
        </div>
        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }}></div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Última atualização: {lastUpdate || 'Sem dados'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ScoreCard;
