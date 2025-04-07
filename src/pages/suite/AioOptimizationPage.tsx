
import React from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { Bot, BookOpen, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AioAnalysisPanel from '@/components/AioAnalysisPanel';

const AioOptimizationPage = () => {
  // Sample data - in a real app, this would come from an API
  const aioScore = 65;
  const naturalReadingScore = 72;
  const interpretationScore = 81;
  
  // Sample recommendations
  const recommendations = [
    {
      type: 'warning',
      title: 'Utilize linguagem mais natural',
      description: 'O conteúdo é demasiado técnico para ser bem interpretado por IA.'
    },
    {
      type: 'info',
      title: 'Adicione perguntas frequentes',
      description: 'FAQs ajudam os modelos de IA a entender melhor o conteúdo.'
    },
    {
      type: 'error',
      title: 'Evite jargões',
      description: 'Termos muito específicos dificultam a leitura por modelos como o ChatGPT.'
    }
  ];
  
  // Mock data for the AioAnalysisPanel component
  const mockAioData = {
    aioScore: aioScore,
    contentClarity: 60,
    logicalStructure: 70,
    naturalLanguage: 65,
    topicsDetected: ['SEO', 'Marketing Digital', 'Análise de Website', 'Otimização'],
    confusingParts: [
      'O texto utiliza jargões técnicos sem explicá-los adequadamente',
      'Estrutura confusa na seção sobre métricas de desempenho'
    ]
  };
  
  return (
    <SuiteLayout title="AI Optimization" domain="example.com">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pontuação AIO</h1>
        <p className="text-muted-foreground">
          Avaliação da otimização do conteúdo para IA e modelos de linguagem.
        </p>
      </div>
      
      {/* Score Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <ScoreCard 
          title="AIO Score" 
          score={aioScore} 
          icon={<Bot />} 
          colorClass="bg-purple-600" 
        />
        
        <ScoreCard 
          title="Leitura Natural" 
          score={naturalReadingScore} 
          icon={<BookOpen />} 
          colorClass="bg-indigo-600" 
        />
        
        <ScoreCard 
          title="Facilidade de Interpretação" 
          score={interpretationScore} 
          icon={<Brain />} 
          colorClass="bg-green-600" 
        />
      </div>
      
      {/* Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recomendações de Otimização</h2>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <RecommendationItem 
              key={index}
              type={recommendation.type} 
              title={recommendation.title} 
              description={recommendation.description}
            />
          ))}
        </ul>
      </div>
      
      {/* Detailed AIO Analysis Panel */}
      <AioAnalysisPanel 
        aioScore={mockAioData.aioScore}
        contentClarity={mockAioData.contentClarity}
        logicalStructure={mockAioData.logicalStructure}
        naturalLanguage={mockAioData.naturalLanguage}
        topicsDetected={mockAioData.topicsDetected}
        confusingParts={mockAioData.confusingParts}
      />
    </SuiteLayout>
  );
};

// Helper component for score cards
const ScoreCard = ({ title, score, icon, colorClass }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-full bg-opacity-20 ${colorClass.replace('bg-', 'bg-opacity-20 text-')}`}>
          {React.cloneElement(icon, { className: `w-5 h-5 ${colorClass.replace('bg-', 'text-')}` })}
        </div>
      </div>
      <div className="mt-4 text-3xl font-bold">{score}</div>
      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass}`} 
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  );
};

// Helper component for recommendation items
const RecommendationItem = ({ type, title, description }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'info':
        return 'bg-blue-100 border-blue-500';
      case 'error':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };
  
  return (
    <li className={`p-4 rounded-md border-l-4 ${getTypeStyles()}`}>
      <strong>{title}:</strong> {description}
    </li>
  );
};

export default AioOptimizationPage;
