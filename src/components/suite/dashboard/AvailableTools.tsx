
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, Zap, Brain, Search, Lock } from 'lucide-react';
import { BlurredSection } from './BlurredSection';
import { motion } from 'framer-motion';

interface AvailableToolsProps {
  isUserLoggedIn: boolean;
  navigateTo: (path: string) => void;
}

const AvailableTools: React.FC<AvailableToolsProps> = ({
  isUserLoggedIn,
  navigateTo
}) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} id="quick-actions" className="mt-10">
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
  );
};

export default AvailableTools;
