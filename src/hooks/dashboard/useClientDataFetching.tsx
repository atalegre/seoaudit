
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
      
      // Filter clients based on user email or admin status
      let filteredClients: Client[] = [];
      
      if (userEmail) {
        // Filter clients that belong to this user's account
        filteredClients = allClients.filter(
          client => client.account === userEmail || client.contactEmail === userEmail
        );
        console.log("Filtered clients for user:", filteredClients);
      } else {
        filteredClients = allClients;
      }
      
      setClients(filteredClients);
      
      // If we have clients and a target URL, try to find and select the matching client
      if (filteredClients.length > 0 && targetUrl) {
        // Normalize URLs for comparison (remove protocol, www, and trailing slashes)
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
          console.log("Target client ID:", targetClient.id);
          setSelectedClientId(targetClient.id);
          return targetClient; // Return for immediate use by caller
        } else if (clientId) {
          // If no match by URL but we have a requested client ID
          const clientById = filteredClients.find(c => c.id === clientId);
          if (clientById) {
            console.log("Client found by ID:", clientById);
            setSelectedClientId(clientId);
            return clientById;
          }
        } else if (filteredClients.length > 0) {
          // No match by URL or ID, select the most recent client
          console.log("No client match, selecting most recent:", filteredClients[0].id);
          setSelectedClientId(filteredClients[0].id);
          return filteredClients[0];
        }
      } else if (filteredClients.length > 0 && !selectedClientId) {
        // If no target URL but we have clients, select the first one
        console.log("No target URL, selecting first client:", filteredClients[0].id);
        setSelectedClientId(filteredClients[0].id);
      }
      
      // Return the first client or null if we have no clients
      return filteredClients.length > 0 ? filteredClients[0] : null;
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Erro ao carregar dados dos clientes", {
        description: "Tente novamente mais tarde."
      });
      return null;
    } finally {
      setIsLoading(false);
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
