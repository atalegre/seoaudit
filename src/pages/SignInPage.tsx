import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthError from '@/components/auth/AuthError';
import SignInForm from '@/components/auth/SignInForm';
import { ensureAdminUser } from '@/utils/auth/createDefaultUsers';

const SignInPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const locationState = location.state as { email?: string; returnTo?: string } | null;

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User is already logged in:", session.user);
          
          // Check if user exists in users table, if not, it could be a newly signed-up user
          const { data: userInTable } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (!userInTable) {
            console.log("User exists in auth but not in users table");
            
            // If the email is atalegre@me.com, make them an admin
            if (session.user.email === 'atalegre@me.com') {
              const success = await ensureAdminUser(session.user.id, session.user.email);
              if (success) {
                toast({
                  title: "Admin privileges granted",
                  description: "Your account has been set up with admin privileges.",
                });
              }
            } else {
              // For other users, add them as regular users
              await supabase.from('users').insert([
                {
                  id: session.user.id,
                  name: session.user.user_metadata?.full_name || 'User',
                  email: session.user.email,
                  role: 'user'
                }
              ]);
            }
          } else if (session.user.email === 'atalegre@me.com' && userInTable.role !== 'admin') {
            // Ensure this user is always an admin
            await supabase
              .from('users')
              .update({ role: 'admin' })
              .eq('id', session.user.id);
            
            toast({
              title: "Admin privileges granted",
              description: "Your account has been updated with admin privileges.",
            });
          }
          
          // Redirect to the appropriate dashboard based on role
          if (userInTable?.role === 'admin' || session.user.email === 'atalegre@me.com') {
            navigate('/dashboard');
          } else {
            navigate('/dashboard/client');
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (session) {
          console.log("User logged in:", session.user);
          
          // Check if user exists in users table
          const { data: userInTable } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (!userInTable) {
            // If the email is atalegre@me.com, make them an admin
            if (session.user.email === 'atalegre@me.com') {
              await ensureAdminUser(session.user.id, session.user.email);
            } else {
              // For other users, add them as regular users
              await supabase.from('users').insert([
                {
                  id: session.user.id,
                  name: session.user.user_metadata?.full_name || 'User',
                  email: session.user.email,
                  role: 'user'
                }
              ]);
            }
          }
          
          // Redirect based on role
          if (userInTable?.role === 'admin' || session.user.email === 'atalegre@me.com') {
            navigate('/dashboard');
          } else {
            navigate('/dashboard/client');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const footerContent = (
    <p className="text-sm text-muted-foreground">
      Não tem uma conta?{' '}
      <Link to="/signup" className="text-primary hover:underline font-medium">
        Registre-se
      </Link>
    </p>
  );

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Verificando sessão...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard 
        title="Entrar"
        description="Digite suas credenciais para entrar na sua conta"
        footer={footerContent}
      >
        <AuthError error={authError} />
        
        <SignInForm 
          email={locationState?.email} 
          returnTo={locationState?.returnTo}
          setAuthError={setAuthError}
        />
        
        <div className="mt-4 text-center text-sm">
          <Link to="/recuperar-password" className="text-primary hover:underline">
            Esqueceu a password?
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignInPage;
