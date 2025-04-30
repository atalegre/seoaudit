
import React from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import AuthRequiredRoute from '@/components/auth/AuthRequiredRoute';
import { useReports } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { formatDate } from '@/utils/formatUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

const ReportsPage = () => {
  const { reports, isLoading, generateReport, refreshReports } = useReports();
  
  // Content that requires authentication
  const pageContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshReports} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => generateReport(window.location.origin)}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Novo Relatório
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <p className="text-center py-12 text-muted-foreground">Carregando relatórios...</p>
      )}
      
      {!isLoading && reports?.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum relatório disponível. Gere seu primeiro relatório para análise completa.
          </p>
          <Button onClick={() => generateReport(window.location.origin)}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Primeiro Relatório
          </Button>
        </Card>
      )}
      
      {!isLoading && reports?.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.url}</TableCell>
                  <TableCell>{formatDate(report.created_at)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status === 'completed' ? 'Concluído' : 
                       report.status === 'pending' ? 'Processando' : 
                       report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={report.status !== 'completed' || !report.file_url}
                    >
                      <Download className="mr-1 h-3 w-3" /> 
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <SuiteLayout title="Relatórios">
      <AuthRequiredRoute>
        {pageContent}
      </AuthRequiredRoute>
    </SuiteLayout>
  );
};

export default ReportsPage;
