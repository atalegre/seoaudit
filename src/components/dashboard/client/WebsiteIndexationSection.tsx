
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WebsiteData } from './WebsitesSection';

export interface WebsiteIndexationSectionProps {
  websites: WebsiteData[];
}

const WebsiteIndexationSection: React.FC<WebsiteIndexationSectionProps> = ({ websites }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Indexação dos Websites</CardTitle>
      </CardHeader>
      <CardContent>
        {websites.length === 0 ? (
          <p className="text-muted-foreground">Nenhum website para mostrar indexação.</p>
        ) : (
          <div className="space-y-4">
            {websites.map((website, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <h3 className="font-medium">{website.url}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span>Status de indexação: Não verificado</span>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                    Pendente
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteIndexationSection;
