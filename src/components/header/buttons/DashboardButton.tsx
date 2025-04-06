
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

interface DashboardButtonProps {
  dashboardPath?: string;
}

const DashboardButton = ({ dashboardPath = '/dashboard' }: DashboardButtonProps) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <Button asChild size="sm" variant="outline">
      <Link to={dashboardPath} className="flex items-center gap-2">
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
    </Button>
  );
};

export default DashboardButton;
