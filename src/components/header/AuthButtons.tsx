
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LogoutButton from './buttons/LogoutButton';
import LoginButton from './buttons/LoginButton';
import RegisterButton from './buttons/RegisterButton';
import AdminLoginButton from './buttons/AdminLoginButton';

const AuthButtons = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-4">
      {user ? (
        // User is logged in, show logout button
        <>
          <LogoutButton />
        </>
      ) : (
        // User is not logged in, show login and register buttons
        <>
          <LoginButton />
          <RegisterButton />
          <AdminLoginButton />
        </>
      )}
    </div>
  );
};

export default AuthButtons;
