
import React from 'react';
import MetricBar from './MetricBar';

interface MetricsSectionProps {
  contentClarity: number;
  logicalStructure: number;
  naturalLanguage: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  contentClarity, 
  logicalStructure, 
  naturalLanguage 
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
  );
};

export default MetricsSection;
