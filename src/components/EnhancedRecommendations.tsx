
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, ExternalLink, CheckCircle, Image, Globe, BrainCircuit, MessageSquare, ArrowRight, Lock, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

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
  
  // Sort recommendations by priority (highest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => b.priority - a.priority);
  
  // Function to get icon based on recommendation content
  const getRecommendationIcon = (recommendation: RecommendationItem) => {
    const suggestion = recommendation.suggestion.toLowerCase();
    
    if (suggestion.includes('imagem') || suggestion.includes('image')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (suggestion.includes('carregamento') || suggestion.includes('velocidade') || 
               suggestion.includes('speed') || suggestion.includes('performance')) {
      return <Zap className="h-4 w-4 text-orange-500" />;
    } else if (suggestion.includes('mobile') || suggestion.includes('móvel')) {
      return <Smartphone className="h-4 w-4 text-green-500" />;
    } else if (suggestion.includes('https') || suggestion.includes('segurança') || 
               suggestion.includes('security')) {
      return <Lock className="h-4 w-4 text-red-500" />;
    } else if (suggestion.includes('heading') || suggestion.includes('título') || 
               suggestion.includes('estrutura')) {
      return <BrainCircuit className="h-4 w-4 text-purple-500" />;
    } else if (suggestion.includes('meta') || suggestion.includes('seo') || 
               suggestion.includes('search')) {
      return <Globe className="h-4 w-4 text-blue-500" />;
    } else if (suggestion.includes('linguagem') || suggestion.includes('conteúdo') || 
               suggestion.includes('parágrafo') || suggestion.includes('texto')) {
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    }
    
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  };
  
  // Get impact badge color
  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'Alto':
        return "border-red-200 bg-red-100 text-red-800";
      case 'Médio':
        return "border-amber-200 bg-amber-100 text-amber-800";
      case 'Baixo':
        return "border-blue-200 bg-blue-100 text-blue-800";
      default:
        return "border-gray-200 bg-gray-100 text-gray-800";
    }
  };
  
  // Get priority text and color
  const getPriorityInfo = (priority: number) => {
    if (priority >= 8) {
      return { text: "Alta", color: "border-red-200 bg-red-100 text-red-800" };
    } else if (priority >= 5) {
      return { text: "Média", color: "border-amber-200 bg-amber-100 text-amber-800" };
    } else {
      return { text: "Baixa", color: "border-blue-200 bg-blue-100 text-blue-800" };
    }
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
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[46%]">Recomendação</TableHead>
                <TableHead className="w-[18%]">Impacto SEO</TableHead>
                <TableHead className="w-[18%]">Impacto AIO</TableHead>
                <TableHead className="w-[18%]">Prioridade</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecommendations.map((recommendation, index) => {
                const priorityInfo = getPriorityInfo(recommendation.priority);
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {getRecommendationIcon(recommendation)}
                        </div>
                        <span className="text-sm">{recommendation.suggestion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs font-normal", getImpactColor(recommendation.seoImpact))}
                      >
                        {recommendation.seoImpact}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs font-normal", getImpactColor(recommendation.aioImpact))}
                      >
                        {recommendation.aioImpact}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs font-normal", priorityInfo.color)}
                      >
                        {priorityInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedRecommendation(recommendation)}
                          >
                            <ArrowRight className="h-4 w-4" />
                            <span className="sr-only">Ver detalhes</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="pr-8">{selectedRecommendation?.suggestion}</SheetTitle>
                            <SheetDescription>
                              Instruções detalhadas para implementação
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Descrição</h4>
                              <p className="text-sm text-gray-600">
                                {selectedRecommendation?.description || "Melhore este aspecto do seu site para aumentar sua visibilidade online."}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Impacto SEO</h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs font-normal", 
                                    selectedRecommendation ? getImpactColor(selectedRecommendation.seoImpact) : ""
                                  )}
                                >
                                  {selectedRecommendation?.seoImpact}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Impacto AIO</h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs font-normal", 
                                    selectedRecommendation ? getImpactColor(selectedRecommendation.aioImpact) : ""
                                  )}
                                >
                                  {selectedRecommendation?.aioImpact}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Prioridade</h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs font-normal", 
                                    selectedRecommendation ? 
                                      getPriorityInfo(selectedRecommendation.priority).color : ""
                                  )}
                                >
                                  {selectedRecommendation ? 
                                    getPriorityInfo(selectedRecommendation.priority).text : ""}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4 mt-4">
                              <h4 className="text-sm font-medium mb-3">Como implementar</h4>
                              <div className="space-y-3">
                                <div className="p-3 rounded-md bg-muted">
                                  <p className="text-sm">
                                    {selectedRecommendation?.suggestion.includes("imagem") ? 
                                      "1. Comprima todas as imagens usando ferramentas como TinyPNG ou ShortPixel.\n2. Utilize formatos modernos como WebP.\n3. Implemente carregamento lazy para imagens abaixo da dobra." :
                                    selectedRecommendation?.suggestion.includes("carregamento") ?
                                      "1. Minimize o uso de scripts de terceiros.\n2. Ative a compressão Gzip/Brotli no servidor.\n3. Implemente cache de navegador para recursos estáticos." :
                                    selectedRecommendation?.suggestion.includes("mobile") ?
                                      "1. Utilize um design responsivo que adapte a todos os tamanhos de tela.\n2. Assegure que todos os elementos interativos têm tamanho adequado para toque.\n3. Teste em múltiplos dispositivos móveis." :
                                    selectedRecommendation?.suggestion.includes("estrutura") ?
                                      "1. Organize seu conteúdo com uma hierarquia clara de títulos (H1, H2, H3).\n2. Inclua palavras-chave relevantes nos títulos principais.\n3. Evite pular níveis na hierarquia de títulos." :
                                    "1. Determine os principais problemas a resolver.\n2. Priorize as mudanças com maior impacto.\n3. Teste antes e depois das implementações para medir o progresso."
                                    }
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
                      </Sheet>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6">
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-background rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Quer ajuda para implementar estas melhorias?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Nossa equipe de especialistas pode ajudar a implementar estas recomendações e melhorar seu posicionamento online.
                </p>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Falar com a equipa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecommendations;
