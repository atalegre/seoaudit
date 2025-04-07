
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai';
  onLearnMore: () => void;
}

const RecommendationCard = ({
  title,
  description,
  impact,
  type,
  onLearnMore
}: RecommendationCardProps) => {
  const getImpactColor = () => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'structure': return 'bg-teal-100 text-teal-800';
      case 'ai': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getImpactColor()}>
            Impacto {impact === 'high' ? 'Alto' : impact === 'medium' ? 'Médio' : 'Baixo'}
          </Badge>
          <Badge className={getTypeColor()}>
            {type === 'technical' ? 'Técnico' : 
             type === 'content' ? 'Conteúdo' : 
             type === 'structure' ? 'Estrutura' : 'IA'}
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <Button 
          variant="ghost" 
          className="p-0 h-auto font-normal text-primary hover:bg-transparent hover:text-primary-dark"
          onClick={onLearnMore}
        >
          <span>Saber mais</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
