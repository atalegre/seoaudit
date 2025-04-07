
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check, AlertCircle, Plus, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAllIndexedUrls, checkIndexedUrls } from '@/utils/api/searchConsole';
import { toast } from 'sonner';

interface IndexationSectionProps {
  siteUrl: string;
  authToken?: string;
  isLoggedIn: boolean;
}

const IndexationSection = ({ siteUrl, authToken, isLoggedIn }: IndexationSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [indexedUrls, setIndexedUrls] = useState<string[]>([]);
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [indexationStatus, setIndexationStatus] = useState<{[key: string]: boolean}>({});
  
  const handleGetAllIndexedUrls = async () => {
    if (!authToken) {
      toast.error('Necessário fazer login e configurar o Google Search Console');
      return;
    }
    
    setIsLoading(true);
    try {
      const urls = await getAllIndexedUrls(siteUrl, authToken);
      setIndexedUrls(urls);
      toast.success(`Encontradas ${urls.length} URLs indexadas`);
    } catch (error) {
      console.error('Erro ao obter URLs indexadas:', error);
      toast.error('Erro ao obter URLs indexadas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    
    // Adiciona o caminho relativo da URL
    let path = customUrlInput.trim();
    
    // Remove o domínio se incluído
    try {
      const url = new URL(path);
      if (url.hostname) {
        path = url.pathname + url.search + url.hash;
      }
    } catch {
      // Se não for uma URL completa, assume que é um caminho relativo
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
    }
    
    if (!customUrls.includes(path)) {
      setCustomUrls([...customUrls, path]);
      setCustomUrlInput('');
    }
  };
  
  const handleRemoveCustomUrl = (url: string) => {
    setCustomUrls(customUrls.filter(u => u !== url));
  };
  
  const handleCheckIndexation = async () => {
    if (!authToken) {
      toast.error('Necessário fazer login e configurar o Google Search Console');
      return;
    }
    
    if (customUrls.length === 0) {
      toast.info('Adicione URLs para verificar a indexação');
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await checkIndexedUrls(siteUrl, authToken, customUrls);
      setIndexationStatus(results);
      
      // Conta quantas URLs estão indexadas
      const indexedCount = Object.values(results).filter(Boolean).length;
      toast.success(`Verificação concluída: ${indexedCount} de ${customUrls.length} URLs indexadas`);
    } catch (error) {
      console.error('Erro ao verificar indexação:', error);
      toast.error('Erro ao verificar indexação das URLs');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Verificação de Indexação</CardTitle>
          <CardDescription>Verifique se suas páginas estão indexadas no Google</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login necessário</AlertTitle>
            <AlertDescription>
              Para verificar a indexação, faça login e configure o acesso ao Google Search Console.
            </AlertDescription>
          </Alert>
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
            
            {indexedUrls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">URLs indexadas ({indexedUrls.length})</h3>
                <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                  <ul className="space-y-1">
                    {indexedUrls.map((url, index) => (
                      <li key={index} className="text-sm truncate">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-px bg-gray-200 my-4"></div>
          
          {/* Seção para verificar URLs específicas */}
          <div>
            <h3 className="text-sm font-medium mb-2">Verificar indexação de URLs específicas</h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="ex: /contato ou /blog/post-1"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddCustomUrl} disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {customUrls.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">URLs para verificar ({customUrls.length})</h4>
                  <Button 
                    onClick={handleCheckIndexation} 
                    disabled={isLoading || !authToken}
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar indexação'
                    )}
                  </Button>
                </div>
                
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {customUrls.map((url, index) => (
                    <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                      <div className="flex items-center gap-2 truncate">
                        {indexationStatus[url] !== undefined && (
                          indexationStatus[url] ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )
                        )}
                        <span className="text-sm truncate">{url}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveCustomUrl(url)}
                        disabled={isLoading}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexationSection;
