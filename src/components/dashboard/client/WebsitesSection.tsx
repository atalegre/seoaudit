
import React from 'react';
import WebsitesList from '@/components/dashboard/WebsitesList';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';
import { Client } from '@/utils/api/types';

interface WebsitesSectionProps {
  websites: Client[];
  isLoading: boolean;
  onWebsiteAdded: () => void;
  userEmail?: string;
}

const WebsitesSection = ({ websites, isLoading, onWebsiteAdded, userEmail }: WebsitesSectionProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Seus Websites</h2>
        <AddWebsiteDialog onWebsiteAdded={onWebsiteAdded} userId={userEmail} />
      </div>
      <WebsitesList websites={websites} isLoading={isLoading} />
    </div>
  );
};

export default WebsitesSection;
