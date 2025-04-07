
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LogoutButton from './buttons/LogoutButton';
import DashboardButton from './buttons/DashboardButton';
import LoginButton from './buttons/LoginButton';
import RegisterButton from './buttons/RegisterButton';

const AuthButtons = () => {
  const { user, role } = useUser();

  // Determine which dashboard path to use based on role
  const getDashboardPath = () => {
    return role === 'admin' ? '/dashboard' : '/dashboard/client';
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        // User is logged in, show logout and dashboard buttons
        <>
          <LogoutButton />
          <DashboardButton dashboardPath={getDashboardPath()} />
        </>
      ) : (
        // User is not logged in, show login and register buttons
        <>
          <LoginButton />
          <RegisterButton />
        </>
      )}
    </div>
  );
};

export default AuthButtons;
