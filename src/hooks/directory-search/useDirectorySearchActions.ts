
import { useState, useRef, useCallback } from 'react';
import { createSeoAnalysisTask, pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';
import { DirectorySearchFormData, DirectorySearchResult } from './types';
import { 
  saveFormData, 
  saveResults, 
  saveTaskId, 
  saveSearchingState, 
  clearStorageData 
} from './storage';

export function useDirectorySearchActions(
  formData: DirectorySearchFormData,
  setFormData: React.Dispatch<React.SetStateAction<DirectorySearchFormData>>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
  setDirectoryResults: React.Dispatch<React.SetStateAction<DirectorySearchResult[] | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const lastTaskIdRef = useRef<string | null>(null);
  const searchInProgressRef = useRef(false);

  // Update form field handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      saveFormData(updated);
      return updated;
    });
  }, [setFormData]);

  const searchDirectories = useCallback(async (data = formData) => {
    // Prevent multiple concurrent searches
    if (searchInProgressRef.current) {
      console.log('Search already in progress, ignoring duplicate request');
      return;
    }

    // Validate form data
    if (!data.businessName || !data.address || !data.city) {
      toast.error("Informações incompletas", {
        description: "Por favor, preencha pelo menos o nome do negócio, endereço e cidade."
      });
      return;
    }

    // Reset state
    setDirectoryResults(null);
    setError(null);
    setIsSearching(true);
    searchInProgressRef.current = true;
    saveSearchingState(true);
    saveFormData(data);

    toast.info("Pesquisa agendada", {
      description: "A pesquisa de diretórios será executada em background via tarefa."
    });

    try {
      // Create the directory search task - now passing all the form data directly
      const { taskId } = await createSeoAnalysisTask({
        businessName: data.businessName,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        phoneNumber: data.phoneNumber,
        task_name: 'directory_search'
      });
      
      lastTaskIdRef.current = taskId;
      saveTaskId(taskId);
      toast.info("Tarefa de pesquisa agendada", { description: "Aguardando resultados..." });

      // Poll for task completion
      pollTaskUntilComplete(
        taskId,
        (res) => {
          if (res.results) {
            const results = res.results as DirectorySearchResult[];
            setDirectoryResults(results);
            saveResults(results);
          }
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          const results = finalRes.results as DirectorySearchResult[];
          setDirectoryResults(results);
          saveResults(results);
          toast.success("Pesquisa de diretórios concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "Directory search failed.");
          toast.error("Falha na pesquisa de diretórios", { description: finalRes.message });
        }
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        saveSearchingState(false);
      }).catch((err) => {
        setError(err?.message || 'Erro na pesquisa de diretórios');
        toast.error("Falha no polling da pesquisa");
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        saveSearchingState(false);
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar pesquisa de diretórios.");
      toast.error("Erro ao iniciar pesquisa", { description: err.message });
      setIsSearching(false);
      searchInProgressRef.current = false;
      saveSearchingState(false);
    }
  }, [formData, setDirectoryResults, setError, setIsSearching]);

  // Handler for form submission
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchDirectories();
  }, [searchDirectories]);

  // Handler for "new search" button
  const handleNewSearch = useCallback(() => {
    clearStorageData();
    setDirectoryResults(null);
    setError(null);
    toast.info("Iniciando nova pesquisa...");
  }, [setDirectoryResults, setError]);

  return {
    handleInputChange,
    handleSubmit,
    handleNewSearch,
    searchDirectories
  };
}
