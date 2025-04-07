
import { useState, useEffect } from 'react';
import { Client } from '@/utils/api/types';
import { getClientsFromDatabase } from '@/utils/api/clientService';
import { toast } from 'sonner';

export function useClientDataFetching(
  targetUrl: string | null = null,
  userEmail: string | null = null,
  clientId: number | null = null
) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(clientId);
  
  // Function to fetch client data
  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching client data with targetUrl:", targetUrl, "userEmail:", userEmail);
      
      const allClients = await getClientsFromDatabase();
      console.log("Fetched clients:", allClients);
      
      // Se não houver usuário logado, mostrar todos os clientes (para testes)
      if (!userEmail) {
        setClients(allClients);
        
        if (allClients.length > 0) {
          if (clientId) {
            const clientById = allClients.find(c => c.id === clientId);
            if (clientById) {
              setSelectedClientId(clientId);
              setIsLoading(false);
              return clientById;
            }
          }
          
          if (targetUrl) {
            // Normalize URLs for comparison (remove protocol, www, and trailing slashes)
            const normalizeUrl = (url: string) => {
              return url.replace(/^https?:\/\/(www\.)?/, '')
                     .replace(/\/$/, '');
            };
            
            const normalizedTargetUrl = normalizeUrl(targetUrl);
            
            // Find client with matching website
            const targetClient = allClients.find(client => {
              if (!client.website) return false;
              return normalizeUrl(client.website) === normalizedTargetUrl;
            });
            
            if (targetClient) {
              setSelectedClientId(targetClient.id);
              setIsLoading(false);
              return targetClient;
            }
          }
          
          // Default selection
          setSelectedClientId(allClients[0].id);
          setIsLoading(false);
          return allClients[0];
        }
      } else {
        // Filter clients based on user email
        let filteredClients = allClients.filter(
          client => client.account === userEmail || 
                   client.contactEmail === userEmail || 
                   userEmail === 'Admin' || 
                   userEmail === 'Sistema' ||
                   userEmail === 'admin'
        );
        
        console.log("Filtered clients for user:", filteredClients);
        
        if (filteredClients.length === 0) {
          // Se não houver clientes filtrados, use todos os clientes para fins de demonstração
          filteredClients = allClients;
        }
        
        setClients(filteredClients);
        
        if (filteredClients.length > 0) {
          if (clientId) {
            const clientById = filteredClients.find(c => c.id === clientId);
            if (clientById) {
              setSelectedClientId(clientId);
              setIsLoading(false);
              return clientById;
            }
          }
          
          if (targetUrl) {
            // Normalize URLs for comparison
            const normalizeUrl = (url: string) => {
              return url.replace(/^https?:\/\/(www\.)?/, '')
                     .replace(/\/$/, '');
            };
            
            const normalizedTargetUrl = normalizeUrl(targetUrl);
            
            // Find client with matching website
            const targetClient = filteredClients.find(client => {
              if (!client.website) return false;
              return normalizeUrl(client.website) === normalizedTargetUrl;
            });
            
            if (targetClient) {
              setSelectedClientId(targetClient.id);
              setIsLoading(false);
              return targetClient;
            }
          }
          
          // Default selection
          setSelectedClientId(filteredClients[0].id);
          setIsLoading(false);
          return filteredClients[0];
        }
      }
      
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Erro ao carregar dados dos clientes", {
        description: "Tente novamente mais tarde."
      });
      setIsLoading(false);
      return null;
    }
  };
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchClientData();
  }, [targetUrl, userEmail, clientId]);
  
  return {
    clients,
    isLoading,
    selectedClientId,
    setSelectedClientId,
    fetchClientData
  };
}
