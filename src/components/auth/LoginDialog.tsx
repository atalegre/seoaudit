
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Acesso Necessário</DialogTitle>
          <DialogDescription className="text-center">
            Inicie sessão ou registe-se para aceder a todas as recomendações
          </DialogDescription>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
