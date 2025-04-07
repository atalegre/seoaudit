
import React from 'react';
import { 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImpactColor, getPriorityInfo } from './ImpactBadge';

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

interface RecommendationDetailProps {
  recommendation: RecommendationItem | null;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({ recommendation }) => {
  if (!recommendation) return null;
  
  const getImplementationSteps = (suggestion: string): string => {
    if (suggestion.includes("imagem")) {
      return "1. Comprima todas as imagens usando ferramentas como TinyPNG ou ShortPixel.\n2. Utilize formatos modernos como WebP.\n3. Implemente carregamento lazy para imagens abaixo da dobra.";
    } else if (suggestion.includes("carregamento")) {
      return "1. Minimize o uso de scripts de terceiros.\n2. Ative a compressão Gzip/Brotli no servidor.\n3. Implemente cache de navegador para recursos estáticos.";
    } else if (suggestion.includes("mobile")) {
      return "1. Utilize um design responsivo que adapte a todos os tamanhos de tela.\n2. Assegure que todos os elementos interativos têm tamanho adequado para toque.\n3. Teste em múltiplos dispositivos móveis.";
    } else if (suggestion.includes("estrutura")) {
      return "1. Organize seu conteúdo com uma hierarquia clara de títulos (H1, H2, H3).\n2. Inclua palavras-chave relevantes nos títulos principais.\n3. Evite pular níveis na hierarquia de títulos.";
    }
    return "1. Determine os principais problemas a resolver.\n2. Priorize as mudanças com maior impacto.\n3. Teste antes e depois das implementações para medir o progresso.";
  };
  
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="pr-8">{recommendation.suggestion}</SheetTitle>
        <SheetDescription>
          Instruções detalhadas para implementação
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Descrição</h4>
          <p className="text-sm text-gray-600">
            {recommendation.description || "Melhore este aspecto do seu site para aumentar sua visibilidade online."}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Impacto SEO</h4>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-normal", getImpactColor(recommendation.seoImpact))}
            >
              {recommendation.seoImpact}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Impacto AIO</h4>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-normal", getImpactColor(recommendation.aioImpact))}
            >
              {recommendation.aioImpact}
            </Badge>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Prioridade</h4>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-normal", getPriorityInfo(recommendation.priority).color)}
            >
              {getPriorityInfo(recommendation.priority).text}
            </Badge>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-3">Como implementar</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-muted">
              <p className="text-sm">
                {getImplementationSteps(recommendation.suggestion)}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver guia completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default RecommendationDetail;
