
import React from 'react';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';

interface StatsCardsProps {
  data: SearchConsoleData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-500">Cliques</p>
        <p className="text-2xl font-bold">{data.clicks.toLocaleString()}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-500">Impressões</p>
        <p className="text-2xl font-bold">{data.impressions.toLocaleString()}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-500">CTR</p>
        <p className="text-2xl font-bold">{(data.ctr * 100).toFixed(2)}%</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-500">Posição média</p>
        <p className="text-2xl font-bold">{data.position.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default StatsCards;
