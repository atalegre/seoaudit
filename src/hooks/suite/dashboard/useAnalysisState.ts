
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook to manage analysis state and operations
 */
export function useAnalysisState() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Simulates running an analysis on the given URL
   */
  const runAnalysis = (
    url: string, 
    onSuccess: () => void,
    onStart?: () => void
  ) => {
    if (!url) {
      toast.error("Nenhum URL para analisar", {
        description: "Por favor, insira um URL para análise primeiro."
      });
      return;
    }

    setIsLoading(true);
    
    if (onStart) {
      onStart();
    }
    
    toast.info("Iniciando nova análise...", {
      description: "Este processo pode demorar alguns segundos."
    });
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      setIsLoading(false);
      
      toast.success("Análise concluída com sucesso!", {
        description: "Os resultados foram atualizados."
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 3000);
  };

  return {
    isLoading,
    setIsLoading,
    runAnalysis
  };
}
