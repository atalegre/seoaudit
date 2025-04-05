
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LoginButton from './buttons/LoginButton';
import RegisterButton from './buttons/RegisterButton';
import LogoutButton from './buttons/LogoutButton';
import DashboardButton from './buttons/DashboardButton';

const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {!user ? (
        <>
          <LoginButton />
          <RegisterButton />
        </>
      ) : (
        <LogoutButton />
      )}
      
      {/* Dashboard button that requires login */}
      <DashboardButton />
    </div>
  );
};

export default AuthButtons;
