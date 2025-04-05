
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, FileText, ExternalLink } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  date: string;
  status: string;
  type: string;
}

interface ReportsSectionProps {
  reports: Report[];
}

const ReportsSection = ({ reports }: ReportsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
        <CardDescription>
          Lista de relatórios disponíveis para o seu site
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
          <ul className="space-y-4">
            {reports.map((report: any) => (
              <li key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {report.type === 'SEO' ? (
                    <BarChart2 className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-purple-500" />
                  )}
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Ainda não há relatórios disponíveis.</p>
            <p className="mt-2">Faça sua primeira análise para ver os resultados aqui.</p>
          </div>
        )}
      </CardContent>
      {reports.length > 0 && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todos os relatórios
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReportsSection;
