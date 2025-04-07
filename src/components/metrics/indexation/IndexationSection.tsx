
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useIndexation } from './useIndexation';
import LoginRequiredAlert from './LoginRequiredAlert';
import IndexedUrlsList from './IndexedUrlsList';
import CustomUrlInput from './CustomUrlInput';
import CustomUrlsList from './CustomUrlsList';

interface IndexationSectionProps {
  siteUrl: string;
  authToken?: string;
  isLoggedIn: boolean;
}

const IndexationSection = ({ siteUrl, authToken, isLoggedIn }: IndexationSectionProps) => {
  const {
    isLoading,
    indexedUrls,
    customUrls,
    indexationStatus,
    handleGetAllIndexedUrls,
    handleAddCustomUrl,
    handleRemoveCustomUrl,
    handleCheckIndexation
  } = useIndexation(siteUrl, authToken);
  
  if (!isLoggedIn) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Verificação de Indexação</CardTitle>
          <CardDescription>Verifique se suas páginas estão indexadas no Google</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginRequiredAlert />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Verificação de Indexação</CardTitle>
        <CardDescription>Verifique se suas páginas estão indexadas no Google</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Seção para verificar todas as URLs indexadas */}
          <div>
            <Button 
              onClick={handleGetAllIndexedUrls} 
              disabled={isLoading || !authToken}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando URLs...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Consultar todas URLs indexadas
                </>
              )}
            </Button>
            
            <IndexedUrlsList urls={indexedUrls} />
          </div>
          
          <div className="h-px bg-gray-200 my-4"></div>
          
          {/* Seção para verificar URLs específicas */}
          <div>
            <h3 className="text-sm font-medium mb-2">Verificar indexação de URLs específicas</h3>
            
            <CustomUrlInput 
              onAddUrl={handleAddCustomUrl}
              isLoading={isLoading}
            />
            
            <CustomUrlsList 
              urls={customUrls}
              indexationStatus={indexationStatus}
              onRemoveUrl={handleRemoveCustomUrl}
              onCheckIndexation={handleCheckIndexation}
              isLoading={isLoading}
              authToken={authToken}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexationSection;
