
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const ForgotPasswordPage = () => {
  const [authError, setAuthError] = useState<string | null>(null);

  const footerContent = (
    <p className="text-sm text-muted-foreground">
      Lembrou sua password?{' '}
      <Link to="/signin" className="text-primary hover:underline font-medium">
        Voltar ao login
      </Link>
    </p>
  );

  return (
    <AuthLayout>
      <AuthCard 
        title="Recuperar Password"
        description="Insira seu email para receber um link de redefinição"
        footer={footerContent}
      >
        <AuthError error={authError} />
        <PasswordResetForm setAuthError={setAuthError} />
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
