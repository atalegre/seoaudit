
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, TrendingUp, FileText, ArrowRight } from 'lucide-react';

interface FirstTimeExperienceProps {
  seoScore: number;
  aioScore: number;
  totalScore: number;
  lastAnalysisDate: string;
  isUserLoggedIn: boolean;
  navigateTo: (path: string) => void;
}

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({
  seoScore,
  aioScore,
  totalScore,
  lastAnalysisDate,
  isUserLoggedIn,
  navigateTo
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const recommendations = [
    {
      id: 1,
      title: 'Otimizar meta descrições',
      description: 'Suas meta descrições podem ser melhoradas para aumentar CTR.',
      impact: 'medium',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    },
    {
      id: 2,
      title: 'Estruturar conteúdo para IA',
      description: 'Adicione marcações semânticas para melhorar a compreensão por IA.',
      impact: 'high',
      icon: <Lightbulb className="h-5 w-5 text-violet-500" />
    },
    {
      id: 3,
      title: 'Criar FAQ estruturado',
      description: 'Implemente uma seção de perguntas frequentes com schema markup.',
      impact: 'medium',
      icon: <FileText className="h-5 w-5 text-green-500" />
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Progress Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-violet-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo ao SEOaudit!</h2>
        <p className="text-muted-foreground mb-6">
          Realizamos sua primeira análise em {lastAnalysisDate}. Aqui está seu progresso inicial:
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Pontuação Geral</span>
            <span className="font-bold text-lg">{totalScore}%</span>
          </div>
          <Progress value={totalScore} className="h-2 mb-4" indicatorClassName="bg-gradient-to-r from-blue-500 to-violet-500" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">SEO</span>
                <span className="font-bold">{seoScore}%</span>
              </div>
              <Progress value={seoScore} className="h-1.5" indicatorClassName="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">AIO (Otimização para IA)</span>
                <span className="font-bold">{aioScore}%</span>
              </div>
              <Progress value={aioScore} className="h-1.5" indicatorClassName="bg-violet-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ações Recomendadas</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateTo('/suite/seo')}
          >
            Ver todas
          </Button>
        </div>
        
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="border shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => navigateTo('/suite/seo')}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0">
                    {rec.icon}
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        rec.impact === 'high' ? 'bg-red-100 text-red-700' : 
                        rec.impact === 'medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {rec.impact === 'high' ? 'Alto impacto' : 
                        rec.impact === 'medium' ? 'Médio impacto' : 
                        'Baixo impacto'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold mb-4">Sugestões de IA</h3>
        
        <Card className="border-violet-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-violet-500" />
              Oportunidades de Conteúdo
            </CardTitle>
            <CardDescription>Baseado na análise do seu site</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="rounded-md bg-violet-50 p-3 border border-violet-100">
                <p className="text-sm font-medium text-violet-700 mb-2">Conteúdo Explicativo</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Seus visitantes buscam mais informações sobre "{isUserLoggedIn ? "SEO para pequenos negócios" : "otimização de site"}". 
                  Crie um guia completo para atrair mais tráfego.
                </p>
                <div className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-violet-600 hover:text-violet-700"
                    onClick={() => navigateTo('/suite/writer')}
                  >
                    Gerar ideias
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 p-3 border border-blue-100">
                <p className="text-sm font-medium text-blue-700 mb-2">FAQ estruturado</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Adicionar uma seção de perguntas frequentes com schema markup melhorará seu posicionamento.
                </p>
                <div className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => navigateTo('/suite/seo')}
                  >
                    Implementar
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 pb-3">
            <Button 
              onClick={() => navigateTo('/suite/writer')} 
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
            >
              Gerar Conteúdo Otimizado
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FirstTimeExperience;
