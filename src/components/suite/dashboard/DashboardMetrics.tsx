
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BlurredSection } from './BlurredSection';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardMetricsProps {
  performanceScore: number;
  llmScore: number;
  directoryScore: number;
  keywordScore: number;
  isUserLoggedIn: boolean;
  navigateTo: (path: string) => void;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  performanceScore,
  llmScore,
  directoryScore,
  keywordScore,
  isUserLoggedIn,
  navigateTo
}) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
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
            <BlurredSection onClick={() => navigateTo('/signin')}>
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer relative h-full">
                <CardContent className="pt-6 pb-4 text-center h-full flex flex-col items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Histórico</p>
                </CardContent>
              </Card>
            </BlurredSection>
            
            <BlurredSection onClick={() => navigateTo('/signin')}>
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
  );
};

export default DashboardMetrics;
