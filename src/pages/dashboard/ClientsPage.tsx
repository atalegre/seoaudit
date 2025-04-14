
import React, { useState, useEffect } from 'react';
import { Client } from '@/utils/api/types';
import { getClientsFromDatabase } from '@/utils/api/clientService';
import { toast } from 'sonner';
import ClientsHeader from '@/components/dashboard/clients/ClientsHeader';
import ClientsSearch from '@/components/dashboard/clients/ClientsSearch';
import ClientsTable from '@/components/dashboard/clients/ClientsTable';
import { useLanguage } from '@/contexts/LanguageContext';

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await getClientsFromDatabase();
        console.log('Fetched clients:', clientsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error(t('language') === 'pt' ? 'Erro ao buscar clientes' : 'Error fetching clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [t]);
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <ClientsHeader 
        title={t('clients')}
        description={t('manage-clients')}
      />
      
      <ClientsSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <ClientsTable 
        clients={clients}
        filteredClients={filteredClients}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ClientsPage;
