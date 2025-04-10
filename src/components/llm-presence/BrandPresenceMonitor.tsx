
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/contexts/UserContext';
import { useLLMPresence } from './useLLMPresence';
import ScoreCircle from './ScoreCircle';
import ScoreAlert from './ScoreAlert';
import ModelCard from './ModelCard';
import { BrainCircuit, TrendingUp, Users, FileText } from 'lucide-react';
import CompetitorAnalysis from './CompetitorAnalysis';
import KnowledgeHub from './KnowledgeHub';
import CustomerJourney from './CustomerJourney';

interface BrandPresenceMonitorProps {
  url: string;
  autoStart?: boolean;
}

const BrandPresenceMonitor: React.FC<BrandPresenceMonitorProps> = ({ 
  url, 
  autoStart = false 
}) => {
  const [activeTab, setActiveTab] = useState('presence');
  const { user } = useUser();
  
  const {
    loading,
    error,
    presenceScore,
    report,
    domain,
    modelPresence,
    handleCheckPresence
  } = useLLMPresence({ url, autoStart });

  const isUserLoggedIn = !!user;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="h-5 w-5 text-green-600" />
          Monitorização da Presença nos Modelos de IA
        </CardTitle>
        <CardDescription>
          Analise e otimize como a sua marca aparece em plataformas de IA como ChatGPT, Perplexity e Meta AI
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="presence" className="flex items-center gap-1">
              <BrainCircuit className="h-4 w-4" />
              <span className="hidden sm:inline">Presença</span>
            </TabsTrigger>
            <TabsTrigger 
              value="competitors" 
              className="flex items-center gap-1"
              disabled={!isUserLoggedIn}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Concorrência</span>
            </TabsTrigger>
            <TabsTrigger 
              value="knowledge" 
              className="flex items-center gap-1"
              disabled={!isUserLoggedIn}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Conhecimento</span>
            </TabsTrigger>
            <TabsTrigger 
              value="journey" 
              className="flex items-center gap-1"
              disabled={!isUserLoggedIn}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Jornada</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presence" className="mt-0">
            {/* Presença nos Modelos section - reuse existing components */}
            {loading ? (
              <div className="py-4 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {presenceScore !== null && (
                  <>
                    <ScoreCircle score={presenceScore} />
                    <ScoreAlert score={presenceScore} />
                    
                    <h3 className="text-sm font-medium mt-6 mb-3">Presença por plataforma</h3>
                    <div className="space-y-4 mb-4">
                      {modelPresence && modelPresence.map((model, index) => (
                        <ModelCard 
                          key={index} 
                          modelName={model.name} 
                          presencePercentage={model.score} 
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="competitors" className="mt-0">
            <CompetitorAnalysis 
              domain={domain} 
              competitors={report?.competitors || []} 
              isLoggedIn={isUserLoggedIn}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-0">
            <KnowledgeHub 
              domain={domain}
              report={report}
              isLoggedIn={isUserLoggedIn} 
            />
          </TabsContent>

          <TabsContent value="journey" className="mt-0">
            <CustomerJourney 
              domain={domain}
              isLoggedIn={isUserLoggedIn} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrandPresenceMonitor;
