
import React from 'react';

export interface DashboardHeaderProps {
  clientName: string;
  clientWebsite: string;
  clientStatus: string;
  clientLastUpdate: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  clientName,
  clientWebsite,
  clientStatus,
  clientLastUpdate
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{clientName}</h1>
        <a 
          href={clientWebsite} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline mt-1 block"
        >
          {clientWebsite}
        </a>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
        <div className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            clientStatus === 'active' ? 'bg-green-100 text-green-800' : 
            clientStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {clientStatus}
          </span>
        </div>
        <div>
          <span className="font-medium mr-2">Última análise:</span>
          <span className="text-gray-600">{clientLastUpdate}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
