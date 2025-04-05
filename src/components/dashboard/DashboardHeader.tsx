
import React from 'react';
import { Client } from '@/utils/api/types';

interface DashboardHeaderProps {
  client: Client;
}

const DashboardHeader = ({ client }: DashboardHeaderProps) => {
  return (
    <div className="pb-4 border-b mb-6">
      <h1 className="text-3xl font-bold">{client.name}</h1>
      <div className="flex items-center mt-1">
        <a 
          href={client.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {client.website}
        </a>
      </div>
    </div>
  );
};

export default DashboardHeader;
