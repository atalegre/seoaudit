
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, LineChart, List } from 'lucide-react';

export interface HistoryTabsProps {
  isUserLoggedIn: boolean;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ isUserLoggedIn }) => {
  return (
    <div className="mb-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Visão geral</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2" disabled={!isUserLoggedIn}>
            <Calendar className="h-4 w-4" />
            <span>Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2" disabled={!isUserLoggedIn}>
            <List className="h-4 w-4" />
            <span>Relatórios</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default HistoryTabs;
