
import React from 'react';
import { Button } from '@/components/ui/button';
import { useDashboardAccess } from '@/hooks/useDashboardAccess';

const DashboardButton = () => {
  const { handleDashboardAccess } = useDashboardAccess();
  
  return (
    <Button variant="default" onClick={handleDashboardAccess}>
      Acessar Dashboard
    </Button>
  );
};

export default DashboardButton;
