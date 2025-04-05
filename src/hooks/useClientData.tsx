
import { useState, useEffect } from 'react';
import { Client, AnalysisResult } from '@/utils/api/types';
import { getClientFromDatabase } from '@/utils/api/clientService';
import { getClientAnalysisHistory } from '@/utils/api/supabaseClient';
import { toast } from 'sonner';

export function useClientData(clientId: string | undefined) {
  const [client, setClient] = useState<Client | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
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
          
          // Fetch analysis history
          const history = await getClientAnalysisHistory(parseInt(clientId, 10));
          
          // Sort analysis history by timestamp (most recent first)
          const sortedHistory = history.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA;
          });
          
          console.log('Loaded analysis history:', sortedHistory);
          
          setAnalysisHistory(sortedHistory);
        } else {
          setError('Cliente não encontrado.');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading client data:', err);
        setError('Falha ao carregar dados do cliente.');
        toast.error('Erro ao carregar dados', {
          description: 'Não foi possível carregar os dados completos do cliente.'
        });
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [clientId]);

  const handleWebsiteAdded = async () => {
    if (clientId) {
      try {
        setIsLoading(true);
        toast.info('Atualizando dados do cliente...');
        
        const clientData = await getClientFromDatabase(parseInt(clientId, 10));
        if (clientData) {
          setClient(clientData);
          
          // Reload analysis history
          const history = await getClientAnalysisHistory(parseInt(clientId, 10));
          const sortedHistory = history.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA;
          });
          
          setAnalysisHistory(sortedHistory);
          toast.success('Dados atualizados com sucesso!');
        }
      } catch (err) {
        console.error('Failed to reload client data:', err);
        toast.error('Falha ao atualizar dados', {
          description: 'Não foi possível atualizar os dados do cliente.'
        });
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
