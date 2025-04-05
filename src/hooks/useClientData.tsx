
import { useState, useEffect } from 'react';
import { Client } from '@/utils/api/types';
import { getClientFromDatabase } from '@/utils/api/clientService';
import { getClientAnalysisHistory } from '@/utils/api/supabaseClient';

export function useClientData(clientId: string | undefined) {
  const [client, setClient] = useState<Client | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId) {
        setError('Client ID is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Fetch client data
        const clientData = await getClientFromDatabase(parseInt(clientId, 10));
        if (clientData) {
          setClient(clientData);
        } else {
          setError('Client not found.');
        }
        
        // Fetch analysis history
        const history = await getClientAnalysisHistory(parseInt(clientId, 10));
        setAnalysisHistory(history);
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load client data.');
        console.error(err);
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId]);

  const handleWebsiteAdded = async () => {
    if (clientId) {
      try {
        setIsLoading(true);
        const clientData = await getClientFromDatabase(parseInt(clientId, 10));
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

  return {
    client,
    analysisHistory,
    isLoading,
    error,
    handleWebsiteAdded
  };
}
