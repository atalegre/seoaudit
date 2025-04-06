
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LogoutButton from './buttons/LogoutButton';
import DashboardButton from './buttons/DashboardButton';

const AuthButtons = () => {
  const { user, role } = useUser();

  // Determine which dashboard path to use based on role
  const getDashboardPath = () => {
    return role === 'admin' ? '/dashboard' : '/dashboard/client';
  };

  return (
    <div className="flex items-center gap-4">
      {user && <LogoutButton />}
      
      {/* Show dashboard button with the appropriate path based on user role */}
      {user && <DashboardButton dashboardPath={getDashboardPath()} />}
    </div>
  );
};

export default AuthButtons;
