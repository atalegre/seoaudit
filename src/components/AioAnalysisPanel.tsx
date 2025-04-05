import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MetricBarProps {
  title: string;
  score: number;
  description: string;
}

const MetricBar: React.FC<MetricBarProps> = ({ title, score, description }) => {
  const getColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-amber-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          {getIcon(score)}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <span className="text-sm font-medium">{score}%</span>
      </div>
      <Progress value={score} className={cn("h-2", getColor(score))} />
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

interface TopicTagProps {
  topic: string;
}

const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  const backgroundColor = stringToColor(topic);
  const textColor = "hsl(0, 0%, 20%)";
  
  return (
    <Badge 
      variant="outline" 
      className="py-1 px-2 rounded-md font-normal border-none text-xs"
      style={{ backgroundColor, color: textColor }}
    >
      {topic}
    </Badge>
  );
};

interface ConfusingPartProps {
  text: string;
}

const ConfusingPart: React.FC<ConfusingPartProps> = ({ text }) => {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-red-50 border border-red-100 mb-2">
      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-red-800">{text}</p>
    </div>
  );
};

interface AioAnalysisPanelProps {
  aioScore: number;
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
  topicsDetected: string[];
  confusingParts: string[];
  className?: string;
}

const AioAnalysisPanel: React.FC<AioAnalysisPanelProps> = ({
  aioScore,
  contentClarity,
  logicalStructure,
  naturalLanguage,
  topicsDetected,
  confusingParts,
  className
}) => {
  const getClarityDescription = (score: number) => {
    if (score >= 80) return "O conteúdo é claro e direto, facilitando o entendimento da IA.";
    if (score >= 60) return "O conteúdo é razoavelmente claro, mas tem pontos que a IA pode não compreender completamente.";
    return "O conteúdo tem problemas de clareza que dificultam a compreensão pela IA.";
  };
  
  const getStructureDescription = (score: number) => {
    if (score >= 80) return "A estrutura do conteúdo segue uma sequência lógica bem definida.";
    if (score >= 60) return "A estrutura tem alguma organização, mas poderia ser mais coerente.";
    return "A estrutura do conteúdo é confusa e falta organização lógica.";
  };
  
  const getLanguageDescription = (score: number) => {
    if (score >= 80) return "O texto utiliza linguagem natural e fluida, ideal para processamento por IA.";
    if (score >= 60) return "A linguagem é compreensível, mas apresenta alguns termos técnicos não explicados.";
    return "O texto usa linguagem muito técnica ou confusa que prejudica o entendimento da IA.";
  };
  
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-500" />
            Análise AIO (AI Optimization)
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-0.5",
              aioScore >= 80 ? "bg-purple-50 text-purple-700 border-purple-200" :
              aioScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {aioScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Compreensão do Conteúdo</h3>
          <MetricBar 
            title="Clareza de Conteúdo" 
            score={contentClarity} 
            description={getClarityDescription(contentClarity)}
          />
          <MetricBar 
            title="Estrutura Lógica" 
            score={logicalStructure} 
            description={getStructureDescription(logicalStructure)}
          />
          <MetricBar 
            title="Linguagem Natural" 
            score={naturalLanguage} 
            description={getLanguageDescription(naturalLanguage)}
          />
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-purple-500" />
            Tópicos Detetados
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {topicsDetected.map((topic, index) => (
              <TopicTag key={index} topic={topic} />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Tópicos que a IA identificou como principais no seu conteúdo.
          </p>
        </div>
        
        {confusingParts.length > 0 && (
          <div className="pt-2 border-t">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Partes Confusas
            </h3>
            <div className="space-y-2">
              {confusingParts.map((part, index) => (
                <ConfusingPart key={index} text={part} />
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-3 border-t">
          <div className="flex items-start gap-2 p-2 rounded-md bg-purple-50">
            <BrainCircuit className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-purple-800">
              AIO avalia como modelos de IA compreendem seu conteúdo. Uma pontuação alta indica que seu site está bem otimizado para interações com IA generativa.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AioAnalysisPanel;
