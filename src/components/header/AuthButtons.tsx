
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import LogoutButton from './buttons/LogoutButton';
import LoginButton from './buttons/LoginButton';
import RegisterButton from './buttons/RegisterButton';

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
        </>
      )}
    </div>
  );
};

export default AuthButtons;
