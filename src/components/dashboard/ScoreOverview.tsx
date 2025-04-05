
import React from 'react';
import { Client } from '@/utils/api/types';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreOverviewProps {
  client: Client;
}

const ScoreOverview = ({ client }: ScoreOverviewProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">SEO Score</h3>
            <div className="text-3xl font-bold">{client.seoScore || 0}</div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">AIO Score</h3>
            <div className="text-3xl font-bold">{client.aioScore || 0}</div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-1">Status</h3>
            <div className="text-lg font-medium">{client.status || 'pending'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreOverview;
