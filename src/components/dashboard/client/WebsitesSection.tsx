
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Client } from '@/utils/api/types';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';
import WebsiteCard from './WebsiteCard';
import WebsitesStateDisplay from './WebsitesStateDisplay';
import { normalizeWebsiteData } from '@/utils/websiteUtils';

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
        <WebsitesStateDisplay 
          isLoading={isLoading} 
          isEmpty={!websites || websites.length === 0} 
        />
        
        {!isLoading && websites && websites.length > 0 && (
          <div className="space-y-4">
            {websites.map((website, index) => {
              const { url, status, lastAnalyzed } = normalizeWebsiteData(website);
              
              return (
                <WebsiteCard
                  key={index}
                  url={url}
                  status={status}
                  lastAnalyzed={lastAnalyzed}
                />
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
          userEmail={userEmail}
        />
      )}
    </Card>
  );
};

export default WebsitesSection;
