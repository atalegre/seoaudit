
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
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="grid md:grid-cols-2 gap-6">
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
  );
};

export default ScoreCards;
