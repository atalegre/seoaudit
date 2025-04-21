
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { useReports } from '@/hooks/useReports';

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('https://example.com');
  const { reports, isLoading, generateReport } = useReports();

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      await generateReport(urlInput);
    } finally {
      setIsGenerating(false);
    }
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No reports generated yet
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.url}</TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={!report.content || report.status !== 'completed'}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download report</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SuiteLayout>
  );
};

export default ReportsPage;
