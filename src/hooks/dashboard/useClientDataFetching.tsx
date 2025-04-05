
import { useState, useEffect } from 'react';
import { getClientsFromDatabase, getClientAnalysisHistory } from '@/utils/api';
import { Client } from '@/utils/api/types';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export interface ClientDataResult {
  clients: Client[];
  isLoading: boolean;
  selectedClientId: number | null;
  setSelectedClientId: (id: number | null) => void;
  fetchClientData: () => Promise<Client | null>;
}

export function useClientDataFetching(
  targetUrl: string,
  userEmail?: string,
  clientId?: number | null
): ClientDataResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const { toast: hookToast } = useToast();

  const fetchClientData = async (): Promise<Client | null> => {
    try {
      setIsLoading(true);
      console.log("=== Client Data Fetch Started ===");
      console.log("Target URL:", targetUrl);
      console.log("User email:", userEmail);
      
      // Get all client websites
      const clientsData = await getClientsFromDatabase();
      console.log("Fetched clients:", clientsData);
      
      // Filter clients by user account if available
      let userClients = userEmail 
        ? clientsData.filter((client: Client) => 
            client.account === userEmail || 
            client.contactEmail === userEmail)
        : clientsData;
      
      console.log("Filtered clients for user:", userClients);
      
      // If no clients found for this user but we have a targetUrl,
      // try finding it in all clients
      if ((!userClients || userClients.length === 0) && targetUrl) {
        console.log("No clients found for user, trying to find by URL:", targetUrl);
        
        // Normalize URLs for comparison
        const normalizeUrl = (url: string) => {
          if (!url) return '';
          return url.replace(/^https?:\/\//, '')
                   .replace(/\/$/, '')
                   .replace(/^www\./, '')
                   .toLowerCase();
        };
        
        const normalizedTargetUrl = normalizeUrl(targetUrl);
        console.log("Normalized target URL:", normalizedTargetUrl);
        
        const matchingClient = clientsData.find((client: Client) => {
          const clientUrl = client.website || '';
          const normalizedClientUrl = normalizeUrl(clientUrl);
          console.log(`Comparing: "${normalizedClientUrl}" with "${normalizedTargetUrl}"`);
          return normalizedClientUrl === normalizedTargetUrl;
        });
        
        if (matchingClient) {
          console.log("Found matching client by URL:", matchingClient);
          // If we found a matching client by URL, update its account to associate with current user
          if (userEmail && matchingClient.account !== userEmail) {
            try {
              // Associate with current user
              console.log("Updating client account to associate with current user");
              matchingClient.account = userEmail;
              // Ideally update this in the database too
            } catch (err) {
              console.error("Error updating client account:", err);
            }
          }
          userClients = [matchingClient];
        } else {
          console.log("No matching client found by URL");
          toast.error("Site não encontrado", {
            description: "O site analisado não foi encontrado no sistema."
          });
        }
      }
      
      setClients(userClients);
      
      if (!userClients || userClients.length === 0) {
        console.log("No clients found for this user");
        setIsLoading(false);
        return null;
      }
      
      // If no specific client ID is provided, use the first one or the selected one
      const targetClientId = clientId || selectedClientId || userClients[0]?.id;
      if (targetClientId) {
        setSelectedClientId(targetClientId);
      }
      
      console.log("Target client ID:", targetClientId);
      
      // Get the client data
      const clientData = userClients.find(c => c.id === targetClientId);
      if (!clientData) {
        console.log("Client not found with ID:", targetClientId);
        setIsLoading(false);
        return null;
      }
      
      console.log("Client found:", clientData);
      return clientData;
    } catch (error) {
      console.error('Error fetching client data:', error);
      hookToast({
        title: "Erro",
        description: "Não foi possível carregar os dados do cliente.",
        variant: "destructive"
      });
      toast.error("Erro ao carregar dados", {
        description: "Não foi possível carregar os dados do cliente."
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    selectedClientId,
    setSelectedClientId,
    fetchClientData
  };
}
