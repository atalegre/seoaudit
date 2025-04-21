
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeArray } from '@/utils/dataChecks';

interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  url?: string;
}

interface OpportunitiesPanelProps {
  opportunities?: OpportunityItem[];
}

const OpportunitiesPanel: React.FC<OpportunitiesPanelProps> = ({ opportunities = [] }) => {
  // Safe opportunities array
  const safeOpportunities = safeArray(opportunities);
  
  // Empty state
  if (safeOpportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Oportunidades de Melhoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma oportunidade de melhoria foi identificada para este site.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Oportunidades de Melhoria ({safeOpportunities.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {safeOpportunities.map(item => (
          <div 
            key={item.id} 
            className="p-4 border rounded-md hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium">{item.title}</h3>
              <span 
                className={`px-2 py-0.5 text-xs rounded-full border ${getImpactColor(item.impact)}`}
              >
                {item.impact === 'high' ? 'Alto Impacto' : 
                  item.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-600">{item.description}</p>
            {item.url && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Mais informações
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OpportunitiesPanel;
