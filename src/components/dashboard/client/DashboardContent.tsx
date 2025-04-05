
import React from 'react';
import ScoreOverview from './ScoreOverview';
import ReportsSection from './ReportsSection';
import NotificationsSection from './NotificationsSection';
import WebsitesSection from './WebsitesSection';
import LoadingState from './LoadingState';
import { Client } from '@/utils/api/types';

interface DashboardContentProps {
  isLoading: boolean;
  clients: Client[];
  selectedClientId: number | null;
  seoScore: number;
  aioScore: number;
  scoreDiff: { seo: number; aio: number };
  lastUpdate: string;
  implementedRecommendations: number;
  totalRecommendations: number;
  clientReports: any[];
  notifications: any[];
  handleMarkAsRead: (id: number) => void;
  onWebsiteAdded: () => void;
  userEmail?: string;
}

const DashboardContent = ({
  isLoading,
  clients,
  selectedClientId,
  seoScore,
  aioScore,
  scoreDiff,
  lastUpdate,
  implementedRecommendations,
  totalRecommendations,
  clientReports,
  notifications,
  handleMarkAsRead,
  onWebsiteAdded,
  userEmail
}: DashboardContentProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      {clients.length > 0 && selectedClientId ? (
        <>
          <ScoreOverview 
            seoScore={seoScore}
            aioScore={aioScore}
            scoreDiff={scoreDiff}
            lastUpdate={lastUpdate}
            implementedRecommendations={implementedRecommendations}
            totalRecommendations={totalRecommendations}
          />
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
            <ReportsSection reports={clientReports} />
            <NotificationsSection 
              notifications={notifications} 
              onMarkAsRead={handleMarkAsRead} 
            />
          </div>
        </>
      ) : null}
      
      <WebsitesSection 
        websites={clients} 
        isLoading={isLoading} 
        onWebsiteAdded={onWebsiteAdded}
        userEmail={userEmail}
      />
    </>
  );
};

export default DashboardContent;
