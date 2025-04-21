
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Download } from 'lucide-react';
import SuiteLayout from '@/components/suite/SuiteLayout';

// Mockup data for reports
const mockReports = [
  {
    id: '1',
    url: 'https://example.com',
    analysisDate: '2024-04-21T14:30:00Z',
    downloadUrl: '#'
  },
  {
    id: '2',
    url: 'https://test.com',
    analysisDate: '2024-04-20T10:15:00Z',
    downloadUrl: '#'
  },
  {
    id: '3',
    url: 'https://demo.com',
    analysisDate: '2024-04-19T16:45:00Z',
    downloadUrl: '#'
  }
];

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('https://example.com'); // This would be populated from context/state

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Logic for report generation will be implemented later
  };

  return (
    <SuiteLayout title="Relatórios de Análise">
      <div className="space-y-8">
        {/* Introduction section */}
        <div className="prose dark:prose-invert">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Análise</h1>
          <p className="text-muted-foreground">
            Gere e baixe relatórios detalhados das suas análises de SEO. 
            Os relatórios em PDF incluem métricas detalhadas, recomendações 
            e insights para melhorar o desempenho do seu site.
          </p>
        </div>

        {/* Generate report section */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Gerar Novo Relatório</h2>
          <form onSubmit={handleGenerateReport} className="flex gap-4">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Digite a URL do site"
              className="flex-1"
              disabled={isGenerating}
            />
            <Button type="submit" disabled={isGenerating}>
              Gerar Relatório
            </Button>
          </form>
        </div>

        {/* Reports table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL Analisada</TableHead>
                <TableHead>Data da Análise</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.url}</TableCell>
                  <TableCell>
                    {new Date(report.analysisDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(report.downloadUrl, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download report</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SuiteLayout>
  );
};

export default ReportsPage;
