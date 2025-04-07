
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from '@/components/suite/dashboard/CircularProgress';

interface OverallScoreProps {
  totalScore: number;
  logoUrl?: string;
  domain?: string;
}

const OverallScore = ({ totalScore, logoUrl, domain }: OverallScoreProps) => {
  return (
    <Card className="col-span-full lg:col-span-1 row-span-2">
      <CardHeader className="flex flex-row items-center gap-4">
        <CardTitle>Pontuação Geral</CardTitle>
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt={`Logo de ${domain}`} 
            className="w-10 h-10 ml-auto object-contain rounded" 
          />
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <CircularProgress 
          value={totalScore} 
          size={180} 
          color="stroke-blue-600"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold">{totalScore}</span>
            <span className="text-sm text-muted-foreground">de 100</span>
          </div>
        </CircularProgress>
      </CardContent>
    </Card>
  );
};

export default OverallScore;
