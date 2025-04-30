
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  returnTo?: string;
}

const LoginDialog = ({ isOpen, onClose, returnTo }: LoginDialogProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleSuccessfulAuth = () => {
    onClose();
    if (returnTo) {
      navigate(returnTo);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="signin">{t('sign-in')}</TabsTrigger>
          <TabsTrigger value="signup">{t('sign-up')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="space-y-4">
          <SignInForm 
            setAuthError={() => {}} 
            returnTo={returnTo}
            onSuccess={handleSuccessfulAuth}
          />
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          <SignUpForm 
            setAuthError={() => {}} 
            onSuccess={handleSuccessfulAuth}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginDialog;
