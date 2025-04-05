
import React from 'react';
import { Button } from '@/components/ui/button';
import AddWebsiteDialog from '@/components/dashboard/AddWebsiteDialog';

interface DashboardHeaderProps {
  handleLogout: () => void;
  onWebsiteAdded: () => void;
  userEmail?: string;
}

const DashboardHeader = ({ handleLogout, onWebsiteAdded, userEmail }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard do Cliente</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo à sua área de cliente</p>
      </div>
      <div className="flex gap-4">
        <AddWebsiteDialog onWebsiteAdded={onWebsiteAdded} userId={userEmail} />
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
