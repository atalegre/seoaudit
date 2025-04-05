
import React from 'react';
import { Client } from '@/utils/api/types';
import { useUser } from '@/contexts/UserContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ScoreOverview from '@/components/dashboard/ScoreOverview';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';
import WebsitesSection from '@/components/dashboard/client/WebsitesSection';
import GoogleAuthSection from '@/components/dashboard/client/GoogleAuthSection';
import SearchConsoleDisplay from '@/components/dashboard/client/SearchConsoleDisplay';
import WebsiteIndexationSection from '@/components/dashboard/client/WebsiteIndexationSection';
import { getApiKey } from '@/utils/api/supabaseClient';
import { useState, useEffect } from 'react';

interface ClientPageContentProps {
  client: Client;
  analysisHistory: any[];
  onWebsiteAdded: () => void;
}

export default function ClientPageContent({
  client,
  analysisHistory,
  onWebsiteAdded
}: ClientPageContentProps) {
  const { user } = useUser();
  const [googleAuth, setGoogleAuth] = useState<{ accessToken: string | null; refreshToken: string | null }>({
    accessToken: null,
    refreshToken: null
  });

  // Load Google auth data
  useEffect(() => {
    const loadGoogleAuth = async () => {
      if (user?.email && client?.website) {
        try {
          const apiKey = await getApiKey(user.email, client.website);
          if (apiKey) {
            setGoogleAuth({
              accessToken: apiKey.apiKey,
              refreshToken: apiKey.refreshToken
            });
          }
        } catch (error) {
          console.error("Error loading API key:", error);
        }
      }
    };
    
    loadGoogleAuth();
  }, [user?.email, client?.website]);

  return (
    <>
      <DashboardHeader client={client} />
      <div className="px-4 py-6 md:px-6 space-y-8">
        <ScoreOverview client={client} />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <AnalysisHistory history={analysisHistory} />
            <WebsitesSection
              websites={[client]}
              isLoading={false}
              onWebsiteAdded={onWebsiteAdded}
              userEmail={user?.email}
            />
            
            <WebsiteIndexationSection 
              siteUrl={client.website} 
              authToken={googleAuth?.accessToken}
              isLoggedIn={!!user}
            />
            
            <SearchConsoleDisplay 
              website={client.website} 
              authToken={googleAuth?.accessToken}
            />
            
            <GoogleAuthSection website={client.website} />
          </div>
          
          <div className="space-y-6">
            {/* Sidebar panels can be added here if needed */}
          </div>
        </div>
      </div>
    </>
  );
}
