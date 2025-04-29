
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiOptimizationData, AiOptimizationItem } from '@/hooks/useAiOptimization';
import { AlertCircle, CheckCircle, ListChecks } from 'lucide-react';

interface AnalysisResultsProps {
  data: AiOptimizationData;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Scores Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pontuações de Otimização para IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <ScoreCard 
              title="Pontuação Geral" 
              score={data.scores.overall}
              description="Avaliação geral da otimização do conteúdo para IA"
            />
            <ScoreCard 
              title="Legibilidade Humana" 
              score={data.scores.human_readability}
              description="Quão fácil é para humanos lerem e entenderem o conteúdo"
            />
            <ScoreCard 
              title="Interpretação por IA" 
              score={data.scores.llm_interpretability}
              description="Quão bem os modelos de linguagem entendem o conteúdo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Strengths Section */}
      <ItemsSection 
        title="Pontos Fortes" 
        items={data.strengths}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        className="border-green-100 bg-green-50"
      />

      {/* Weaknesses Section */}
      <ItemsSection 
        title="Pontos Fracos" 
        items={data.weaknesses}
        icon={<AlertCircle className="h-5 w-5 text-red-500" />}
        className="border-red-100 bg-red-50"
      />

      {/* Recommendations Section */}
      <ItemsSection 
        title="Recomendações" 
        items={data.recommendations}
        icon={<ListChecks className="h-5 w-5 text-blue-500" />}
        className="border-blue-100 bg-blue-50"
      />
    </div>
  );
};

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${getScoreColor(score)}`}>{score}</div>
      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`} 
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
};

interface ItemsSectionProps {
  title: string;
  items: AiOptimizationItem[];
  icon: React.ReactNode;
  className?: string;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({ title, items, icon, className }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum item encontrado</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${className}`}>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm">{item.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
