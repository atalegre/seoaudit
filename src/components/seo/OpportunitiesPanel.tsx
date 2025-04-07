
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, ChevronDown, ChevronUp, Zap, Shield, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface OpportunitiesPanelProps {
  recommendations: Recommendation[];
}

const OpportunitiesPanel: React.FC<OpportunitiesPanelProps> = ({ recommendations }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  const toggleItem = (id: string) => {
    setOpenItems(current => 
      current.includes(id) 
        ? current.filter(item => item !== id) 
        : [...current, id]
    );
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'seo':
        return <LayoutList className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'medium':
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case 'low':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };
  
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Oportunidades de melhoria
          </CardTitle>
          <CardDescription>
            Não encontramos oportunidades significativas de melhoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
            <p>Parabéns! Seu site parece estar bem otimizado nos aspectos analisados.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Oportunidades de melhoria
        </CardTitle>
        <CardDescription>
          Sugestões baseadas na análise do PageSpeed Insights para melhorar seu site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map(recommendation => (
            <Collapsible
              key={recommendation.id}
              open={openItems.includes(recommendation.id)}
              onOpenChange={() => toggleItem(recommendation.id)}
              className="border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-full",
                    recommendation.category.toLowerCase() === "performance" ? "bg-blue-50" :
                    recommendation.category.toLowerCase() === "seo" ? "bg-violet-50" :
                    "bg-emerald-50"
                  )}>
                    {getCategoryIcon(recommendation.category)}
                  </div>
                  <span className="font-medium">{recommendation.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(
                    "font-normal",
                    getImpactColor(recommendation.impact)
                  )}>
                    {recommendation.impact === 'high' ? 'Alto impacto' : 
                     recommendation.impact === 'medium' ? 'Médio impacto' : 
                     'Baixo impacto'}
                  </Badge>
                  {openItems.includes(recommendation.id) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 py-3 bg-muted/50 border-t">
                  <p className="text-sm">{recommendation.description}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Estas recomendações são geradas automaticamente com base na análise de desempenho e melhores práticas.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunitiesPanel;
