
import React from 'react';
import MetricCard from './MetricCard';

interface MetricsGridProps {
  presenceScore: number;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ presenceScore }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <MetricCard
        title="Menção direta"
        description={presenceScore > 50 
          ? "Sua marca é ocasionalmente mencionada em respostas de IA." 
          : "Sua marca não é mencionada diretamente em respostas de IA."}
        status={presenceScore > 50 ? "warning" : "error"}
      />

      <MetricCard
        title="Estrutura"
        description="Conteúdo precisa de melhor estrutura para contexto AIO."
        status="warning"
      />

      <MetricCard
        title="Relevância"
        description={presenceScore > 60 
          ? "O conteúdo aborda temas relevantes para AIO." 
          : "O conteúdo precisa focar em tópicos mais relevantes para AIO."}
        status={presenceScore > 60 ? "success" : "error"}
      />
    </div>
  );
};

export default MetricsGrid;
