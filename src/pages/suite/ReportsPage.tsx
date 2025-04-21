import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Download, Loader2 } from 'lucide-react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import { useReports } from '@/hooks/useReports';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('https://example.com');
  const { reports, isLoading, generateReport, refreshReports } = useReports();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshReports();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshReports]);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to generate reports');
      return;
    }
    
    try {
      setIsGenerating(true);
      await generateReport(urlInput);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-500/80 capitalize">{status}</Badge>;
      case 'pending':
      case 'processing':
        return <Badge className="bg-amber-500 hover:bg-amber-500/80 capitalize">{status}</Badge>;
      case 'error':
      case 'failed':
        return <Badge className="bg-destructive hover:bg-destructive/80 capitalize">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
  };

  const handleDownload = async (report: any) => {
    if (!report.file_url || report.status.toLowerCase() !== 'success') {
      return;
    }

    try {
      window.open(report.file_url, '_blank');
    } catch (error) {
      console.error('Error opening report:', error);
      toast.error('Failed to open report');
    }
  };

  return (
    <SuiteLayout title="Relatórios de Análise">
      <div className="space-y-8">
        <div className="prose dark:prose-invert">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Análise</h1>
          <p className="text-muted-foreground">
            Gere e baixe relatórios detalhados das suas análises de SEO. 
            Os relatórios em PDF incluem métricas detalhadas, recomendações 
            e insights para melhorar o desempenho do seu site.
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Gerar Novo Relatório</h2>
          <form onSubmit={handleGenerateReport} className="flex gap-4">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Digite a URL do site"
              className="flex-1"
              disabled={isGenerating || !isAuthenticated}
            />
            <Button type="submit" disabled={isGenerating || !isAuthenticated}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Relatório'
              )}
            </Button>
          </form>
          {!isAuthenticated && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Você precisa estar logado para gerar relatórios.
            </p>
          )}
        </div>

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
                    {isAuthenticated 
                      ? "Nenhum relatório gerado ainda" 
                      : "Faça login para ver seus relatórios"}
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
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={!report.file_url || report.status.toLowerCase() !== 'success'}
                        onClick={() => handleDownload(report)}
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
