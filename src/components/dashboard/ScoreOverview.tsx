
import React from 'react';
import { Client } from '@/utils/api/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScoreOverviewProps {
  client: Client;
  showDetailedReport?: boolean;
}

const ScoreOverview = ({ client, showDetailedReport = false }: ScoreOverviewProps) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Pontuação Digital</CardTitle>
        <CardDescription>Resultados da análise para {client.website}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Score SEO</h3>
            <div className="text-3xl font-bold">{client.seoScore || 0}</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Score AIO</h3>
            <div className="text-3xl font-bold text-purple-700">{client.aioScore || 0}</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <div className="text-lg font-medium text-blue-700">{client.status || 'Pendente'}</div>
          </div>
        </div>

        {!showDetailedReport && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">Aceda ao relatório completo</h4>
            <p className="text-sm text-gray-600 mb-4">
              Para ver um relatório detalhado com recomendações específicas, registe-se na nossa plataforma.
            </p>
            <Button 
              onClick={() => navigate('/signin')} 
              className="w-full flex items-center justify-center gap-2"
            >
              Ver relatório completo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      {client.lastAnalysis && (
        <CardFooter className="text-xs text-gray-500">
          Última análise: {new Date(client.lastAnalysis).toLocaleDateString()}
        </CardFooter>
      )}
    </Card>
  );
};

export default ScoreOverview;
