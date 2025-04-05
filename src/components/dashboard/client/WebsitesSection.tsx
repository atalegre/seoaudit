
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export interface WebsiteData {
  url: string;
  status?: string;
  lastAnalyzed?: string;
}

export interface WebsitesSectionProps {
  websites: WebsiteData[];
}

const WebsitesSection: React.FC<WebsitesSectionProps> = ({ websites }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Websites</CardTitle>
      </CardHeader>
      <CardContent>
        {websites.length === 0 ? (
          <p className="text-muted-foreground">Nenhum website adicionado.</p>
        ) : (
          <div className="space-y-4">
            {websites.map((website, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <h3 className="font-medium">{website.url}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>Status: {website.status || 'Ativo'}</span>
                    <span>Última análise: {website.lastAnalyzed || 'Nunca'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    Visitar
                  </Button>
                  <Button variant="outline" size="sm">Analisar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsitesSection;
