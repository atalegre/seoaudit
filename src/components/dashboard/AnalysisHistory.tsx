
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { SeoAnalysisRequest } from '@/hooks/useSeoAnalysisHistory';

interface AnalysisHistoryProps {
  history: SeoAnalysisRequest[];
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
          {history.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.url}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()} • {formatDistance(new Date(item.created_at), new Date(), { addSuffix: true })}
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
