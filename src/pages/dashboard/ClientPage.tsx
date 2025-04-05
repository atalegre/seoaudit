
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import ClientPageContent from '@/components/dashboard/client/ClientPageContent';

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const { client, analysisHistory, isLoading, error, handleWebsiteAdded } = useClientData(id);
  
  const LoadingState = () => (
    <div className="py-8 px-4">
      <p>Loading client data...</p>
    </div>
  );

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
        <ClientPageContent 
          client={client} 
          analysisHistory={analysisHistory}
          onWebsiteAdded={handleWebsiteAdded}
        />
      ) : (
        <div className="py-8 px-4 text-center">
          <p>Cliente não encontrado</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientPage;
