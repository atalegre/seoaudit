
import React from 'react';
import { Client } from '@/utils/api/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import ScoreOverview from './ScoreOverview';
import WebsitesSection from './WebsitesSection';
import NotificationsSection from './NotificationsSection';
import ReportsSection from './ReportsSection';
import GoogleAuthSection from './GoogleAuthSection';
import WebsiteIndexationSection from './WebsiteIndexationSection';
import SearchConsoleDisplay from './SearchConsoleDisplay';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';
import { useState } from 'react';

interface ClientPageContentProps {
  client: Client;
  analysisHistory: any[];
  onWebsiteAdded: () => void;
}

const ClientPageContent: React.FC<ClientPageContentProps> = ({ 
  client, 
  analysisHistory,
  onWebsiteAdded
}) => {
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardHeader client={client} />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button onClick={() => setShowAddWebsiteDialog(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Website
        </Button>
      </div>
      
      <ScoreOverview 
        seoScore={client.seoScore || 0}
        aioScore={client.aioScore || 0}
        accessibilityScore={client.accessibilityScore || 0}
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="search-console">Search Console</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <WebsitesSection client={client} />
          <GoogleAuthSection clientId={client.id} />
          <WebsiteIndexationSection client={client} />
        </TabsContent>
        
        <TabsContent value="search-console">
          <SearchConsoleDisplay clientId={client.id} />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsSection />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSection />
        </TabsContent>
      </Tabs>
      
      {/* Add Website Dialog */}
      {showAddWebsiteDialog && (
        <AddWebsiteDialog 
          open={showAddWebsiteDialog}
          onClose={() => setShowAddWebsiteDialog(false)}
          onAddWebsite={onWebsiteAdded}
        />
      )}
    </div>
  );
};

export default ClientPageContent;
