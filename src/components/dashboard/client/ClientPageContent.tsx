
import React, { useState } from 'react';
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

interface ClientPageContentProps {
  client: Client;
  analysisHistory: any[];
  onWebsiteAdded: () => void;
}

// Mock data for components that need it
const mockReports = [
  { id: 1, name: 'SEO Report', date: '2023-05-15', status: 'completed', type: 'SEO' },
  { id: 2, name: 'AIO Report', date: '2023-05-10', status: 'completed', type: 'AIO' }
];

const mockNotifications = [
  { id: 1, title: 'SEO Score Alert', description: 'Your SEO score has improved', date: '2023-05-15', read: false, urgent: false },
  { id: 2, title: 'New Recommendations', description: '3 new recommendations available', date: '2023-05-10', read: true, urgent: true }
];

// Mock websites data for WebsitesSection
const mockWebsites = [
  { id: 1, name: 'Main Website', url: 'https://example.com', status: 'active' }
];

const ClientPageContent: React.FC<ClientPageContentProps> = ({ 
  client, 
  analysisHistory,
  onWebsiteAdded
}) => {
  const [showAddWebsiteDialog, setShowAddWebsiteDialog] = useState(false);

  // Define the handleMarkAsRead function
  const handleMarkAsRead = (notificationId: number) => {
    console.log('Marking notification as read:', notificationId);
  };

  // Convert from Date to string if needed
  const lastAnalysisString = client.lastAnalysis 
    ? typeof client.lastAnalysis === 'string' 
      ? client.lastAnalysis 
      : client.lastAnalysis.toISOString()
    : 'Never';

  return (
    <div className="space-y-6">
      <DashboardHeader 
        clientName={client.name}
        clientWebsite={client.website}
        clientStatus={client.status}
        clientLastUpdate={lastAnalysisString}
      />
      
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
          <WebsitesSection websites={mockWebsites} />
          <GoogleAuthSection clientId={client.id} />
          <WebsiteIndexationSection websites={mockWebsites} />
        </TabsContent>
        
        <TabsContent value="search-console">
          <SearchConsoleDisplay clientId={client.id} />
        </TabsContent>
        
        <TabsContent value="reports">
          <ReportsSection reports={mockReports} />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSection 
            notifications={mockNotifications} 
            onMarkAsRead={handleMarkAsRead} 
          />
        </TabsContent>
      </Tabs>
      
      {/* Add Website Dialog */}
      {showAddWebsiteDialog && (
        <AddWebsiteDialog 
          isOpen={showAddWebsiteDialog}
          onClose={() => setShowAddWebsiteDialog(false)}
          onAddWebsite={onWebsiteAdded}
        />
      )}
    </div>
  );
};

export default ClientPageContent;
