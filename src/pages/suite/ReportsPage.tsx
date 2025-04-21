
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

  // Set up automatic refreshing every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshReports();
    }, 5000);
    
    // Clean up on unmount
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

  const handleDownload = (report: any) => {
    if (!report.content || report.status.toLowerCase() !== 'success') {
      return;
    }

    try {
      // Check if content is already a valid base64 string
      let base64Content = report.content;
      
      // If the content contains non-base64 characters, try to extract the base64 part
      if (base64Content.includes(',')) {
        base64Content = base64Content.split(',')[1];
      }
      
      // Remove any whitespace or line breaks that might cause issues
      base64Content = base64Content.trim();
      
      // Create a Blob from the base64 data
      const byteCharacters = atob(base64Content);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.url.replace(/https?:\/\//, '').replace(/[\/:.]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
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
                        disabled={!report.content || report.status.toLowerCase() !== 'success'}
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
