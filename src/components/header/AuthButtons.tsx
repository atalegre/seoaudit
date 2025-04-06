
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LogoutButton from './buttons/LogoutButton';
import DashboardButton from './buttons/DashboardButton';

const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {user && <LogoutButton />}
      
      {/* Dashboard button */}
      <DashboardButton />
    </div>
  );
};

export default AuthButtons;
