
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import ClientPageContent from '@/components/dashboard/client/ClientPageContent';

const ClientPage = () => {
  const { id } = useParams<{ id: string }>();
  const { client, analysisHistory, isLoading, error, handleWebsiteAdded } = useClientData(id);
  
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium">Carregando dados do cliente...</p>
      <p className="text-sm text-muted-foreground mt-2">
        Aguarde enquanto buscamos as informações mais recentes.
      </p>
    </div>
  );

  const ErrorState = () => (
    <div className="py-8 px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>
          {error || "Não foi possível carregar os dados do cliente. Tente novamente mais tarde."}
        </AlertDescription>
      </Alert>
    </div>
  );

  const EmptyState = () => (
    <div className="py-8 px-4 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
        <p className="text-muted-foreground mb-6">
          Não encontramos informações para o cliente solicitado.
        </p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : client ? (
        <ClientPageContent 
          client={client} 
          analysisHistory={analysisHistory}
          onWebsiteAdded={handleWebsiteAdded}
        />
      ) : (
        <EmptyState />
      )}
    </DashboardLayout>
  );
};

export default ClientPage;
