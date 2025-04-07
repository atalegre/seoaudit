
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  importance: number;
}

interface OpportunitiesPanelProps {
  recommendations: Recommendation[];
}

const OpportunitiesPanel: React.FC<OpportunitiesPanelProps> = ({ recommendations }) => {
  if (!recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Oportunidades de Melhoria
          </CardTitle>
          <CardDescription>
            Sugestões do Google PageSpeed Insights para melhorar o desempenho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Não foram encontradas recomendações para esse site. Isso pode indicar que seu site já está bem otimizado ou que a análise não conseguiu encontrar melhorias específicas.
            </p>
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
          Oportunidades de Melhoria
        </CardTitle>
        <CardDescription>
          Sugestões do Google PageSpeed Insights para melhorar o desempenho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-2">
          {recommendations.map((item, index) => (
            <AccordionItem 
              key={item.id || index} 
              value={item.id || index.toString()}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 flex items-center group">
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.importance >= 3 ? "destructive" : item.importance >= 2 ? "warning" : "secondary"}
                      className="text-xs"
                    >
                      {item.importance >= 3 ? "Alta Prioridade" : 
                       item.importance >= 2 ? "Média Prioridade" : 
                       "Baixa Prioridade"}
                    </Badge>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 border-t bg-gray-50">
                <div className="text-sm text-gray-700">
                  <p>{item.description}</p>
                  <div className="mt-3 flex items-center">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center gap-1"
                      asChild
                    >
                      <a 
                        href={`https://web.dev/articles/lighthouse-${item.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Saiba mais <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default OpportunitiesPanel;
