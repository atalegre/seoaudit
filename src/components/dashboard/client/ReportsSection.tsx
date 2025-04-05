
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

export interface Report {
  id: number;
  name: string;
  date: string;
  status: string;
  type: string;
  url?: string;
  logoUrl?: string;
}

export interface ReportsSectionProps {
  reports: Report[];
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ reports }) => {
  const handleGenerateReport = () => {
    toast.info("Preparando novo relatório", {
      description: "O relatório será gerado com os dados mais recentes."
    });
  };
  
  const handleDownload = (report: Report) => {
    // In a real implementation, this would download the actual report
    toast.success("Iniciando download", {
      description: `Relatório de ${report.name} sendo preparado.`
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast.info("Download concluído", {
        description: "O relatório foi salvo no seu dispositivo."
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Relatórios</CardTitle>
        <Button variant="outline" className="h-8 gap-1" onClick={handleGenerateReport}>
          <Calendar className="h-4 w-4" />
          <span>Gerar relatório</span>
        </Button>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            <p>Nenhum relatório disponível.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {report.logoUrl ? (
                    <img 
                      src={report.logoUrl} 
                      alt={`Logo de ${report.url}`}
                      className="w-8 h-8 object-contain border rounded-md"
                    />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground/70" />
                  )}
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
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={() => handleDownload(report)}
                >
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
