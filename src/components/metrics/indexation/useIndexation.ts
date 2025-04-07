
import { useState } from 'react';
import { toast } from 'sonner';
import { getAllIndexedUrls, checkIndexedUrls } from '@/utils/api/searchConsole';

export function useIndexation(siteUrl: string, authToken?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [indexedUrls, setIndexedUrls] = useState<string[]>([]);
  const [customUrls, setCustomUrls] = useState<string[]>([]);
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
  
  const handleAddCustomUrl = (urlInput: string) => {
    // Adiciona o caminho relativo da URL
    let path = urlInput.trim();
    
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

  return {
    isLoading,
    indexedUrls,
    customUrls,
    indexationStatus,
    handleGetAllIndexedUrls,
    handleAddCustomUrl,
    handleRemoveCustomUrl,
    handleCheckIndexation
  };
}
