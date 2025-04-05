import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ScoreOverview from '@/components/dashboard/ScoreOverview';
import AnalysisHistory from '@/components/dashboard/AnalysisHistory';
import WebsitesSection from '@/components/dashboard/client/WebsitesSection';
import SearchConsoleSection from '@/components/metrics/SearchConsoleSection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getClientFromDatabase } from '@/utils/api/clientService';
import { getClientAnalysisHistory } from '@/utils/api/supabaseClient';
import { getSearchConsolePerformance } from '@/utils/api/searchConsoleService';
import { Client } from '@/utils/api/types';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/integrations/firebase';
import { storeApiKey, getApiKey } from '@/utils/api/supabaseClient';
import { toast } from 'sonner';
import IndexationSection from '@/components/metrics/IndexationSection';

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast: uiToast } = useToast();
  const [googleAuth, setGoogleAuth] = useState<{ accessToken: string | null, refreshToken: string | null }>({ accessToken: null, refreshToken: null });
  const [searchConsoleData, setSearchConsoleData] = useState<any>(null);
  const [isSearchConsoleLoading, setIsSearchConsoleLoading] = useState(false);
  const [searchConsoleError, setSearchConsoleError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) {
        setError('Client ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch client data
        const clientData = await getClientFromDatabase(parseInt(id, 10));
        if (clientData) {
          setClient(clientData);
        } else {
          setError('Client not found.');
        }
        
        // Fetch analysis history
        const history = await getClientAnalysisHistory(parseInt(id, 10));
        setAnalysisHistory(history);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load client data.');
        console.error(err);
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [id]);
  
  useEffect(() => {
    const fetchSearchConsoleData = async () => {
      if (!client?.website || !googleAuth?.accessToken) return;
      
      setIsSearchConsoleLoading(true);
      try {
        const data = await getSearchConsolePerformance(client.website, googleAuth.accessToken);
        setSearchConsoleData(data);
      } catch (err: any) {
        setSearchConsoleError(err.message || 'Failed to load Search Console data.');
        console.error(err);
      } finally {
        setIsSearchConsoleLoading(false);
      }
    };
    
    fetchSearchConsoleData();
  }, [client?.website, googleAuth?.accessToken]);
  
  useEffect(() => {
    const loadGoogleAuth = async () => {
      if (user?.email && client?.website) {
        try {
          const apiKey = await getApiKey(user.email, client.website);
          if (apiKey) {
            setGoogleAuth({ accessToken: apiKey.apiKey, refreshToken: apiKey.refreshToken });
          }
        } catch (error) {
          console.error("Error loading API key:", error);
        }
      }
    };
    
    loadGoogleAuth();
  }, [user?.email, client?.website]);
  
  const handleWebsiteAdded = async () => {
    if (id) {
      try {
        setIsLoading(true);
        const clientData = await getClientFromDatabase(parseInt(id, 10));
        if (clientData) {
          setClient(clientData);
        }
      } catch (err) {
        setError('Failed to reload client data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const LoadingState = () => (
    <div className="py-8 px-4">
      <p>Loading client data...</p>
    </div>
  );
  
  const handleGoogleSignIn = async () => {
    if (!user?.email || !client?.website) {
      toast.error('User email or client website is not available.');
      return;
    }
    
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;
      const refreshToken = result.user.refreshToken;
      
      if (accessToken && refreshToken) {
        setGoogleAuth({ accessToken, refreshToken });
        await storeApiKey(user.email, client.website, accessToken, refreshToken);
        toast.success('Google account linked successfully!');
      } else {
        toast.error('Failed to retrieve access token from Google.');
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(`Google Sign-In Error: ${error.message}`);
    }
  };
  
  const handleGoogleSignOut = async () => {
    if (!user?.email || !client?.website) {
      toast.error('User email or client website is not available.');
      return;
    }
    
    try {
      await signOut(auth);
      setGoogleAuth({ accessToken: null, refreshToken: null });
      await storeApiKey(user.email, client.website, null, null);
      toast.success('Google account disconnected successfully!');
    } catch (error: any) {
      console.error("Google Sign-Out Error:", error);
      toast.error(`Google Sign-Out Error: ${error.message}`);
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="py-8 px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      ) : client ? (
        <>
          <DashboardHeader client={client} />
          <div className="px-4 py-6 md:px-6 space-y-8">
            <ScoreOverview client={client} />
            
            {/* Seções existentes do dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                {/* Painéis de métricas existentes */}
                <AnalysisHistory history={analysisHistory} />
                <WebsitesSection
                  websites={[client]}
                  isLoading={isLoading}
                  onWebsiteAdded={handleWebsiteAdded}
                  userEmail={user?.email}
                />
                
                {/* Nova seção para verificação de indexação */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Indexação no Google</h2>
                  <IndexationSection 
                    siteUrl={client.website} 
                    authToken={googleAuth?.accessToken}
                    isLoggedIn={!!user}
                  />
                </div>
                
                {/* Seção do Search Console já existente */}
                {googleAuth?.accessToken && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Search Console</h2>
                    <SearchConsoleSection 
                      data={searchConsoleData} 
                      isLoading={isSearchConsoleLoading}
                      error={searchConsoleError}
                    />
                  </div>
                )}
                
                {/* Google Authentication Section */}
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
              </div>
              
              <div className="space-y-6">
                {/* Sidebar panels can be added here if needed */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-8 px-4 text-center">
          <p>Cliente não encontrado</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientPage;
