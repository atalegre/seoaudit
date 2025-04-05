
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisHistoryProps {
  history: any[];
}

const AnalysisHistory = ({ history }: AnalysisHistoryProps) => {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Análises</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma análise realizada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Análises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">
                  SEO: {item.seoScore || 'N/A'} | AIO: {item.aioScore || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
