
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import OverallScore from '@/components/suite/dashboard/OverallScore';
import ScoreCardsGrid from '@/components/suite/dashboard/ScoreCardsGrid';
import RecommendationsSection from '@/components/suite/dashboard/RecommendationsSection';
import { Button } from '@/components/ui/button';
import { SampleRecommendation } from '@/hooks/suite/useDashboardState';

interface DashboardContentProps {
  domain: string;
  logoUrl: string;
  totalScore: number;
  seoScore: number;
  aioScore: number;
  llmScore: number;
  performanceScore: number;
  directoryScore: number;
  keywordScore: number;
  recommendations: SampleRecommendation[];
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
  return (
    <div className="space-y-8">
      {/* Hero/Welcome Card */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none">
        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center">
          <div className="space-y-4 mb-6 md:mb-0">
            <h1 className="text-2xl font-bold">Gerencie seu projeto em um toque</h1>
            <p className="text-indigo-100 max-w-md">
              Obtenha insights detalhados de seu projeto e optimize seu site para SEO e IA.
            </p>
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
              Ver análise completa
            </Button>
          </div>
          <div className="w-64 h-48 relative hidden md:block">
            <img 
              src="/lovable-uploads/736c41e2-fce3-4842-9205-2864b22eee19.png" 
              alt="Dashboard illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Scores and Analytics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Pontuação Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallScore 
              totalScore={totalScore} 
              logoUrl={logoUrl} 
              domain={domain} 
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Distribuição de Pontuação</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreCardsGrid 
              seoScore={seoScore}
              aioScore={aioScore}
              llmScore={llmScore}
              performanceScore={performanceScore}
              directoryScore={directoryScore}
              keywordScore={keywordScore}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recommendations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recomendações Principais</CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            Ver todas <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <RecommendationsSection 
            recommendations={recommendations}
            onViewMore={onViewMoreRecommendations}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
