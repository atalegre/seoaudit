import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, BarChart2, Brain, ChevronRight, Lock, User, Zap, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import BlurredSection from './BlurredSection';
import OnboardingTour from './OnboardingTour';

interface RecommendationType {
  id: string;
  title: string;
  description: string;
  type: 'seo' | 'aio';
  impact: 'high' | 'medium' | 'low';
}

interface DashboardContentProps {
  domain: string;
  logoUrl?: string;
  totalScore: number;
  seoScore: number;
  aioScore: number;
  llmScore: number;
  performanceScore: number;
  directoryScore: number;
  keywordScore: number;
  recommendations: RecommendationType[];
  isUserLoggedIn: boolean;
  onViewMoreRecommendations: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  domain,
  logoUrl,
  totalScore,
  seoScore,
  aioScore,
  llmScore,
  performanceScore,
  directoryScore,
  keywordScore,
  recommendations,
  isUserLoggedIn,
  onViewMoreRecommendations
}) => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const isFirstVisit = !localStorage.getItem('onboardingCompleted');
    return isFirstVisit && !isUserLoggedIn;
  });

  const onboardingSteps = [
    {
      title: 'Pontuação do seu site',
      description: 'Aqui pode ver a pontuação geral do seu website tanto em SEO como em otimização para IA.',
      targetId: 'dashboard-scores',
      position: 'bottom' as const
    },
    {
      title: 'Métricas principais',
      description: 'Esta secção mostra as métricas mais importantes para o sucesso do seu site.',
      targetId: 'dashboard-metrics',
      position: 'right' as const
    },
    {
      title: 'Recomendações personalizadas',
      description: 'Receba sugestões práticas para melhorar o seu site. Algumas recomendações avançadas requerem conta.',
      targetId: 'dashboard-recommendations',
      position: 'top' as const
    },
    {
      title: 'Navegação rápida',
      description: 'Aceda facilmente a todas as ferramentas disponíveis para analisar e melhorar seu site.',
      targetId: 'quick-actions',
      position: 'left' as const
    }
  ];

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    toast.success("Bem-vindo à SEOaudit! Explore todas as ferramentas disponíveis.");
  };

  const navigateTo = (path: string) => {
    if (!isUserLoggedIn && (path === '/suite/writer' || path === '/suite/keywords' || path === '/suite/llm')) {
      toast.info("Esta funcionalidade completa requer conta", {
        description: "Registe-se para aceder a todas as ferramentas avançadas.",
        action: {
          label: "Criar conta",
          onClick: () => navigate('/signin')
        }
      });
    }
    
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <OnboardingTour 
        steps={onboardingSteps} 
        onComplete={handleCompleteOnboarding} 
        isOpen={showOnboarding}
      />

      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt={`${domain} logo`} 
            className="w-12 h-12 rounded-full border shadow-sm" 
          />
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{domain}</h2>
          <p className="text-muted-foreground">Dashboard de Análise</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} id="dashboard-scores" className="grid md:grid-cols-2 gap-6">
        <Card className="border border-blue-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              Pontuação SEO
            </CardTitle>
            <CardDescription>Performance em motores de busca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-4xl font-bold">{seoScore}</span>
              <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                {seoScore >= 80 ? 'Excelente' : seoScore >= 60 ? 'Bom' : seoScore >= 40 ? 'Razoável' : 'Fraco'}
              </div>
            </div>
            <Progress value={seoScore} className="h-2 mb-2" indicatorClassName="bg-blue-500" />
          </CardContent>
          <CardFooter className="border-t pt-4 pb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs w-full"
              onClick={() => navigateTo('/suite/seo')}
            >
              Ver análise SEO detalhada <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border border-violet-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-500" />
              Pontuação AIO
            </CardTitle>
            <CardDescription>Otimização para IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-4xl font-bold">{aioScore}</span>
              <div className="px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-700">
                {aioScore >= 80 ? 'Excelente' : aioScore >= 60 ? 'Bom' : aioScore >= 40 ? 'Razoável' : 'Fraco'}
              </div>
            </div>
            <Progress value={aioScore} className="h-2 mb-2" indicatorClassName="bg-violet-500" />
          </CardContent>
          <CardFooter className="border-t pt-4 pb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs w-full"
              onClick={() => navigateTo('/suite/aio')}
            >
              Ver otimização para IA <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} id="dashboard-metrics" className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Métricas detalhadas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Performance', score: performanceScore, color: 'blue', route: '/suite/seo' },
            { name: 'LLM Presence', score: llmScore, color: 'purple', route: '/suite/llm' },
            { name: 'Diretórios', score: directoryScore, color: 'green', route: '/suite/directories' },
            { name: 'Keywords', score: keywordScore, color: 'amber', route: '/suite/keywords' },
          ].map((metric) => (
            <Card 
              key={metric.name} 
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigateTo(metric.route)}
            >
              <CardContent className="pt-6 pb-4 text-center">
                <div className={`text-3xl font-bold mb-1 text-${metric.color}-600`}>
                  {metric.score}
                </div>
                <p className="text-xs text-muted-foreground">{metric.name}</p>
              </CardContent>
            </Card>
          ))}
          
          {!isUserLoggedIn && (
            <>
              <BlurredSection onClick={() => navigate('/signin')}>
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer relative h-full">
                  <CardContent className="pt-6 pb-4 text-center h-full flex flex-col items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Histórico</p>
                  </CardContent>
                </Card>
              </BlurredSection>
              
              <BlurredSection onClick={() => navigate('/signin')}>
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer relative h-full">
                  <CardContent className="pt-6 pb-4 text-center h-full flex flex-col items-center justify-center">
                    <Lock className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Competição</p>
                  </CardContent>
                </Card>
              </BlurredSection>
            </>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} id="dashboard-recommendations" className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recomendações Personalizadas</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewMoreRecommendations}
            disabled={!isUserLoggedIn}
          >
            Ver todas 
            {!isUserLoggedIn && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="aio">AIO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  isLoggedIn={isUserLoggedIn}
                  onClick={() => navigateTo(rec.type === 'seo' ? '/suite/seo' : '/suite/aio')}
                />
              ))}
              
              {!isUserLoggedIn && (
                <BlurredSection onClick={() => navigate('/signin')}>
                  <Card className="border-dashed border-2 shadow-sm">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center gap-4">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                      <div className="text-center">
                        <h4 className="font-medium mb-1">Recomendações premium</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Crie uma conta para ver todas as recomendações personalizadas
                          e obter análises detalhadas.
                        </p>
                        <Button onClick={() => navigate('/signin')}>
                          <User className="h-4 w-4 mr-2" />
                          Criar conta gratuita
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </BlurredSection>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <div className="space-y-4">
              {recommendations
                .filter(rec => rec.type === 'seo')
                .slice(0, 3)
                .map((rec) => (
                  <RecommendationCard 
                    key={rec.id} 
                    recommendation={rec} 
                    isLoggedIn={isUserLoggedIn}
                    onClick={() => navigateTo('/suite/seo')}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="aio">
            <div className="space-y-4">
              {recommendations
                .filter(rec => rec.type === 'aio')
                .slice(0, 3)
                .map((rec) => (
                  <RecommendationCard 
                    key={rec.id} 
                    recommendation={rec} 
                    isLoggedIn={isUserLoggedIn}
                    onClick={() => navigateTo('/suite/aio')}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={itemVariants} id="quick-actions" className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Ferramentas Disponíveis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: "Análise de SEO", 
              icon: <BarChart2 className="h-5 w-5" />, 
              color: "blue", 
              description: "Inspeção técnica e otimização para motores de busca", 
              route: "/suite/seo",
              requiresLogin: false
            },
            { 
              title: "Recomendações de Conteúdo", 
              icon: <Zap className="h-5 w-5" />, 
              color: "amber", 
              description: "Ideias de conteúdo baseadas no seu site e nicho", 
              route: "/suite/recommender",
              requiresLogin: true
            },
            { 
              title: "AI Writing Assistant", 
              icon: <Brain className="h-5 w-5" />, 
              color: "purple", 
              description: "Gerador de conteúdo otimizado para humanos e IA", 
              route: "/suite/writer",
              requiresLogin: true
            },
            { 
              title: "Pesquisa de Keywords", 
              icon: <Search className="h-5 w-5" />, 
              color: "green", 
              description: "Descubra as melhores keywords para o seu negócio", 
              route: "/suite/keywords",
              requiresLogin: true
            },
          ].map((tool) => (
            <Card 
              key={tool.title} 
              className={`shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-${tool.color}-500 h-full`}
              onClick={() => navigateTo(tool.route)}
            >
              {tool.requiresLogin && !isUserLoggedIn ? (
                <BlurredSection noBackdrop>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {tool.icon}
                      {tool.title}
                      <Lock className="h-4 w-4 ml-auto text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </BlurredSection>
              ) : (
                <>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {tool.icon}
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RecommendationCard = ({ 
  recommendation, 
  isLoggedIn,
  onClick 
}: { 
  recommendation: RecommendationType; 
  isLoggedIn: boolean;
  onClick: () => void;
}) => {
  const impactColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700'
  };

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium">{recommendation.title}</h4>
          <div className={`px-2 py-1 text-xs rounded-full ${impactColors[recommendation.impact]}`}>
            {recommendation.impact === 'high' ? 'Alto impacto' : 
             recommendation.impact === 'medium' ? 'Médio impacto' : 'Baixo impacto'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase font-medium text-muted-foreground">
            {recommendation.type === 'seo' ? 'Otimização SEO' : 'Otimização AIO'}
          </span>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver detalhes <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
