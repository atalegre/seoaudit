
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart2, Brain, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreCardsProps {
  seoScore: number;
  aioScore: number;
  navigateTo: (path: string) => void;
}

const ScoreCards: React.FC<ScoreCardsProps> = ({
  seoScore,
  aioScore,
  navigateTo
}) => {
  const getSEOGradient = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-blue-400 to-blue-600";
    if (score >= 40) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  const getAIOGradient = (score: number) => {
    if (score >= 80) return "from-violet-400 to-violet-600";
    if (score >= 60) return "from-purple-400 to-purple-600";
    if (score >= 40) return "from-fuchsia-400 to-fuchsia-600";
    return "from-pink-400 to-pink-600";
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="grid md:grid-cols-2 gap-4">
      <Card className="shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100">
              <BarChart2 className="h-4 w-4 text-blue-600" />
            </div>
            Pontuação SEO
          </CardTitle>
          <CardDescription>Performance em motores de busca</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xl font-bold text-blue-600">{seoScore}</span>
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              {seoScore >= 80 ? 'Excelente' : seoScore >= 60 ? 'Bom' : seoScore >= 40 ? 'Razoável' : 'Fraco'}
            </div>
          </div>
          <Progress value={seoScore} className="h-2 mb-2 bg-blue-100" indicatorClassName={`bg-gradient-to-r ${getSEOGradient(seoScore)}`} />
        </CardContent>
        <CardFooter className="border-t border-blue-100 pt-3 pb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs w-full text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            onClick={() => navigateTo('/suite/seo')}
          >
            Ver análise SEO detalhada <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-white border-violet-100">
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-400 to-purple-600"></div>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-violet-100">
              <Brain className="h-4 w-4 text-violet-600" />
            </div>
            Pontuação AIO
          </CardTitle>
          <CardDescription>Otimização para IA</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xl font-bold text-violet-600">{aioScore}</span>
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
              {aioScore >= 80 ? 'Excelente' : aioScore >= 60 ? 'Bom' : aioScore >= 40 ? 'Razoável' : 'Fraco'}
            </div>
          </div>
          <Progress value={aioScore} className="h-2 mb-2 bg-violet-100" indicatorClassName={`bg-gradient-to-r ${getAIOGradient(aioScore)}`} />
        </CardContent>
        <CardFooter className="border-t border-violet-100 pt-3 pb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs w-full text-violet-700 hover:bg-violet-50 hover:text-violet-800"
            onClick={() => navigateTo('/suite/aio')}
          >
            Ver otimização para IA <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ScoreCards;
