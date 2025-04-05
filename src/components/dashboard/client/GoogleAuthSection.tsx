
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { storeApiKey, getApiKey } from '@/utils/api/supabaseClient';
import { useUser } from '@/contexts/UserContext';
import { useState, useEffect } from 'react';

interface GoogleAuthProps {
  website: string;
}

export default function GoogleAuthSection({ website }: GoogleAuthProps) {
  const { user } = useUser();
  const [googleAuth, setGoogleAuth] = useState<{ accessToken: string | null; refreshToken: string | null }>({
    accessToken: null,
    refreshToken: null
  });

  // Load Google auth data
  useEffect(() => {
    const loadGoogleAuth = async () => {
      if (!user?.email || !website) return;
      
      try {
        const apiKey = await getApiKey(user.email, website);
        if (apiKey) {
          setGoogleAuth({
            accessToken: apiKey.apiKey,
            refreshToken: apiKey.refreshToken
          });
        }
      } catch (error) {
        console.error("Error loading API key:", error);
      }
    };
    
    loadGoogleAuth();
  }, [user?.email, website]);

  const handleGoogleSignIn = async () => {
    if (!user?.email || !website) {
      toast.error('User email or client website is not available.');
      return;
    }
    
    try {
      // For demo purposes, prompt user to manually provide a Google API token
      const accessToken = prompt('For demonstration purposes, please enter a Google API token:');
      
      if (accessToken) {
        setGoogleAuth({ accessToken, refreshToken: null });
        await storeApiKey(user.email, website, accessToken);
        toast.success('Google account linked successfully!');
      } else {
        toast.error('No access token provided.');
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(`Google Sign-In Error: ${error.message}`);
    }
  };
  
  const handleGoogleSignOut = async () => {
    if (!user?.email || !website) {
      toast.error('User email or client website is not available.');
      return;
    }
    
    try {
      setGoogleAuth({ accessToken: null, refreshToken: null });
      await storeApiKey(user.email, website, null);
      toast.success('Google account disconnected successfully!');
    } catch (error: any) {
      console.error("Google Sign-Out Error:", error);
      toast.error(`Google Sign-Out Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Autenticação Google</h2>
      {googleAuth?.accessToken ? (
        <Button variant="destructive" onClick={handleGoogleSignOut}>
          Desconectar Google
        </Button>
      ) : (
        <Button onClick={handleGoogleSignIn}>
          Conectar com Google
        </Button>
      )}
    </div>
  );
}
