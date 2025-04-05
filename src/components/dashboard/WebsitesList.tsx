
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Client } from '@/utils/api/types';

interface WebsitesListProps {
  websites: Client[];
  isLoading: boolean;
}

const WebsitesList = ({ websites, isLoading }: WebsitesListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">A carregar websites...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (websites.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground mb-2">Ainda não tem websites adicionados.</p>
            <p className="text-muted-foreground text-sm">Adicione o seu primeiro website para começar a análise.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'crítico':
      case 'critical':
        return <Badge variant="destructive">{status}</Badge>;
      case 'melhorou':
      case 'improved':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'saudável':
      case 'healthy':
        return <Badge className="bg-green-700">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {websites.map((website) => (
        <Card key={website.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{website.name}</CardTitle>
            <CardDescription className="truncate">
              {website.website}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-2 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estado:</span>
              {getStatusBadge(website.status || 'pending')}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">SEO Score:</span>
              <span className={`font-bold ${website.seoScore && website.seoScore >= 70 ? 'text-green-500' : website.seoScore && website.seoScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {website.seoScore || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">AIO Score:</span>
              <span className={`font-bold ${website.aioScore && website.aioScore >= 70 ? 'text-green-500' : website.aioScore && website.aioScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {website.aioScore || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Última análise:</span>
              <span className="text-sm text-muted-foreground">
                {website.lastAnalysis ? new Date(website.lastAnalysis).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex gap-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={website.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Visitar</span>
              </a>
            </Button>
            <Button variant="default" size="sm" className="w-full" asChild>
              <Link to={`/dashboard/client/${website.id}`} className="flex items-center gap-1">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Relatório</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WebsitesList;
