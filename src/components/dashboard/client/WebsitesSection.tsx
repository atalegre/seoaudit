
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus } from 'lucide-react';
import { Client } from '@/utils/api/types';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';
import { useState } from 'react';

export interface WebsiteData {
  url: string;
  status?: string;
  lastAnalyzed?: string;
  name?: string;
  id?: number;
  website?: string;
  lastAnalysis?: Date | string | null;
}

export interface WebsitesSectionProps {
  websites: WebsiteData[] | Client[];
  isLoading?: boolean;
  onWebsiteAdded?: () => void;
  userEmail?: string;
}

const WebsitesSection: React.FC<WebsitesSectionProps> = ({ 
  websites, 
  isLoading = false,
  onWebsiteAdded,
  userEmail
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddWebsiteClick = () => {
    setShowAddDialog(true);
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
  };

  const handleWebsiteAdded = () => {
    if (onWebsiteAdded) {
      onWebsiteAdded();
    }
    setShowAddDialog(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Websites</CardTitle>
        {onWebsiteAdded && (
          <Button variant="outline" size="sm" onClick={handleAddWebsiteClick} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Website
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Carregando websites...</p>
        ) : websites.length === 0 ? (
          <p className="text-muted-foreground">Nenhum website adicionado.</p>
        ) : (
          <div className="space-y-4">
            {websites.map((website, index) => {
              // Handle both WebsiteData and Client types
              const url = 'website' in website ? website.website : website.url;
              const status = website.status || 'Ativo';
              const lastAnalyzed = 'lastAnalysis' in website 
                ? typeof website.lastAnalysis === 'string' 
                  ? website.lastAnalysis 
                  : website.lastAnalysis?.toISOString()
                : 'lastAnalyzed' in website ? website.lastAnalyzed : 'Nunca';
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <h3 className="font-medium">{url}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>Status: {status}</span>
                      <span>Última análise: {lastAnalyzed || 'Nunca'}</span>
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
              );
            })}
          </div>
        )}
      </CardContent>

      {showAddDialog && (
        <AddWebsiteDialog
          isOpen={showAddDialog}
          onClose={handleDialogClose}
          onAddWebsite={handleWebsiteAdded}
        />
      )}
    </Card>
  );
};

export default WebsitesSection;
