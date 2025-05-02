
import React from 'react';
import SuiteLayout from '@/components/suite/SuiteLayout';
import AuthRequiredRoute from '@/components/auth/AuthRequiredRoute';
import { useDirectorySearch, DirectorySearchResult } from '@/hooks/useDirectorySearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin, Building, Phone } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const DirectoriesPage = () => {
  const { 
    formData,
    isSearching,
    directoryResults,
    error,
    handleInputChange,
    handleSubmit,
    handleNewSearch
  } = useDirectorySearch();

  // Content that requires authentication
  const pageContent = (
    <div className="space-y-6">
      <Card className="mb-6 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Presença em Diretórios Locais</h2>
          <p className="text-muted-foreground">
            Verifique a presença do seu negócio em diretórios online importantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                Nome do Negócio
              </label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Ex: Café Lisboa"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={isSearching}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Endereço
              </label>
              <Input
                id="address"
                name="address"
                placeholder="Ex: Rua Augusta, 123"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isSearching}
                required
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                Código Postal
              </label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Ex: 1100-000"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={isSearching}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                Cidade
              </label>
              <Input
                id="city"
                name="city"
                placeholder="Ex: Lisboa"
                value={formData.city}
                onChange={handleInputChange}
                disabled={isSearching}
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                Número de Telefone
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Ex: 210 000 000"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isSearching}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="mt-2"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pesquisando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verificar Diretórios
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-xl font-medium mb-1">Verificando diretórios</h3>
          <p className="text-muted-foreground">
            Estamos verificando a presença do seu negócio em diretórios locais...
          </p>
        </div>
      )}

      {/* Error State */}
      {!isSearching && error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <h3 className="text-lg font-medium text-destructive mb-1">Erro na pesquisa</h3>
          <p className="text-sm">{error}</p>
          <Button variant="destructive" onClick={handleNewSearch} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Empty State when no search has been performed */}
      {!isSearching && !error && !directoryResults && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Verifique a presença do seu negócio</h3>
          <p className="text-muted-foreground mb-6">
            Insira as informações do seu negócio para verificar a presença em diretórios locais.
          </p>
        </div>
      )}

      {/* Results Table */}
      {!isSearching && !error && directoryResults && directoryResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Resultados da Pesquisa</h3>
            <Button variant="outline" onClick={handleNewSearch}>
              Nova Pesquisa
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Diretório</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directoryResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.directory}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={result.status.toLowerCase() === 'good' ? 'success' : 'destructive'}
                      >
                        {result.status.toLowerCase() === 'good' ? 'Encontrado' : 'Não Encontrado'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">{formData.businessName}</h4>
                <p className="text-sm text-gray-600">{formData.address}</p>
                <p className="text-sm text-gray-600">
                  {formData.postalCode} {formData.city}
                </p>
                {formData.phoneNumber && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-1" /> {formData.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SuiteLayout title="Presença em Diretórios">
      <AuthRequiredRoute>
        {pageContent}
      </AuthRequiredRoute>
    </SuiteLayout>
  );
};

export default DirectoriesPage;
