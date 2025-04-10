
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Lock, User } from 'lucide-react';
import { BlurredSection } from './BlurredSection';
import { motion } from 'framer-motion';

interface RecommendationType {
  id: string; // Changed to match the SampleRecommendation type
  title: string;
  description: string;
  type: 'seo' | 'aio' | 'technical' | 'content' | 'structure' | 'ai';
  impact: 'high' | 'medium' | 'low';
}

interface DashboardRecommendationsProps {
  recommendations: RecommendationType[];
  isUserLoggedIn: boolean;
  navigateTo: (path: string) => void;
  onViewMoreRecommendations: () => void;
}

const DashboardRecommendations: React.FC<DashboardRecommendationsProps> = ({
  recommendations,
  isUserLoggedIn,
  navigateTo,
  onViewMoreRecommendations
}) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} id="dashboard-recommendations" className="mt-8">
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
              <BlurredSection onClick={() => navigateTo('/signin')}>
                <Card className="border-dashed border-2 shadow-sm">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center gap-4">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <h4 className="font-medium mb-1">Recomendações premium</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Crie uma conta para ver todas as recomendações personalizadas
                        e obter análises detalhadas.
                      </p>
                      <Button onClick={() => navigateTo('/signin')}>
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

export default DashboardRecommendations;
