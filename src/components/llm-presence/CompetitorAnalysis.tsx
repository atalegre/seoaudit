
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TrendingUp, PlusCircle, X, Lock, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface CompetitorAnalysisProps {
  domain: string;
  competitors: string[];
  isLoggedIn: boolean;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ 
  domain, 
  competitors = [],
  isLoggedIn 
}) => {
  const [localCompetitors, setLocalCompetitors] = useState<string[]>(competitors);
  const form = useForm();
  
  const addCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('competitor-url') as HTMLInputElement;
    const competitor = input.value.trim();
    
    if (!competitor) return;
    
    // Simple validation for URL format
    try {
      new URL(competitor);
      if (!localCompetitors.includes(competitor)) {
        setLocalCompetitors([...localCompetitors, competitor]);
        input.value = '';
        toast.success("Concorrente adicionado", {
          description: `${competitor} foi adicionado à análise.`
        });
      } else {
        toast.error("Concorrente duplicado", {
          description: "Este domínio já foi adicionado."
        });
      }
    } catch {
      toast.error("URL inválido", {
        description: "Por favor, insira um URL válido."
      });
    }
  };
  
  const removeCompetitor = (competitor: string) => {
    setLocalCompetitors(localCompetitors.filter(c => c !== competitor));
  };
  
  if (!isLoggedIn) {
    return (
      <div className="py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-amber-100 p-3">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium">Funcionalidade Premium</h3>
          <p className="text-muted-foreground max-w-md">
            A análise competitiva permite comparar a presença da sua marca com a dos concorrentes em modelos de IA.
            Faça login para aceder a esta funcionalidade.
          </p>
          <Button>Entrar na Conta</Button>
        </div>
      </div>
    );
  }

  // Placeholder data for competitor comparison
  const comparisonData = [
    { name: domain, score: 78, growth: 12 },
    ...(localCompetitors.map((competitor, i) => {
      const randomScore = Math.floor(Math.random() * 100);
      const randomGrowth = Math.floor(Math.random() * 20) - 10;
      return { name: competitor, score: randomScore, growth: randomGrowth };
    }))
  ];
  
  // Sort by score in descending order
  comparisonData.sort((a, b) => b.score - a.score);
  
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Análise Competitiva</h3>
        <p className="text-sm text-muted-foreground">
          Compare a presença da sua marca com a dos concorrentes em plataformas de IA
        </p>
      </div>
      
      {/* Add competitor form */}
      <form onSubmit={addCompetitor} className="flex gap-2">
        <Input 
          id="competitor-url" 
          placeholder="https://competitor.com" 
          className="flex-1" 
        />
        <Button type="submit" size="sm" className="shrink-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </form>
      
      {localCompetitors.length === 0 ? (
        <Alert variant="default" className="bg-muted/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Adicione concorrentes para ver uma análise comparativa.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {/* Comparison chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Presença Relativa em IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisonData.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium flex items-center">
                      {item.name === domain ? (
                        <span className="text-primary">{item.name} (Sua marca)</span>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 ml-2" 
                            onClick={() => removeCompetitor(item.name)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.score}%</span>
                      {item.growth > 0 ? (
                        <span className="text-green-600 text-xs">+{item.growth}%</span>
                      ) : item.growth < 0 ? (
                        <span className="text-red-600 text-xs">{item.growth}%</span>
                      ) : (
                        <span className="text-gray-500 text-xs">0%</span>
                      )}
                    </div>
                  </div>
                  <Progress value={item.score} className={item.name === domain ? "bg-muted" : ""} />
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recomendações para Melhoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Com base na análise competitiva, sugerimos:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fortalecer a presença da sua marca em plataformas onde os concorrentes têm maior visibilidade</li>
                <li>Destacar os diferenciais únicos da sua marca em comparação com {localCompetitors[0]}</li>
                <li>Desenvolver conteúdo que aborde as lacunas identificadas na análise</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;
