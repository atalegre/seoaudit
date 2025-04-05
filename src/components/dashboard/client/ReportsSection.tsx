
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';

export interface Report {
  id: number;
  name: string;
  date: string;
  status: string;
  type: string;
}

export interface ReportsSectionProps {
  reports: Report[];
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ reports }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Relatórios</CardTitle>
        <Button variant="outline" className="h-8 gap-1">
          <Calendar className="h-4 w-4" />
          <span>Gerar relatório</span>
        </Button>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Nenhum relatório disponível.
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{report.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      report.type === 'SEO' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Gerado em: {report.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
