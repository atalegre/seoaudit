
import { useState, useEffect, useCallback, useRef } from 'react';
import { createSeoAnalysisTask, pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';

export interface DirectorySearchResult {
  directory: string;
  status: string;
}

export interface DirectorySearchFormData {
  businessName: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
}

export function useDirectorySearch() {
  const [formData, setFormData] = useState<DirectorySearchFormData>({
    businessName: '',
    address: '',
    postalCode: '',
    city: '',
    phoneNumber: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [directoryResults, setDirectoryResults] = useState<DirectorySearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastTaskIdRef = useRef<string | null>(null);
  const searchInProgressRef = useRef(false);

  // On mount: check for stored results and form data in sessionStorage
  useEffect(() => {
    const storedFormData = sessionStorage.getItem('directory_search_form');
    const storedResults = sessionStorage.getItem('directory_search_results');
    const storedTaskId = sessionStorage.getItem('directory_search_task_id');
    const storedSearchingState = sessionStorage.getItem('directory_searching_state');
    
    // Restore previous form data if available
    if (storedFormData) {
      try {
        setFormData(JSON.parse(storedFormData));
      } catch (err) {
        console.error('Failed to parse stored form data:', err);
      }
    }
    
    // Restore previous results if available
    if (storedResults) {
      try {
        setDirectoryResults(JSON.parse(storedResults));
      } catch (err) {
        console.error('Failed to parse stored directory results:', err);
      }
    }
    
    // Restore task ID if available
    if (storedTaskId) {
      lastTaskIdRef.current = storedTaskId;
    }
    
    // Check if we were in the middle of searching
    if (storedSearchingState === 'true' && storedTaskId) {
      // Resume polling for in-progress task
      setIsSearching(true);
      searchInProgressRef.current = true;
      
      pollTaskUntilComplete(
        storedTaskId,
        (res) => {
          if (res.results) {
            const results = res.results as DirectorySearchResult[];
            setDirectoryResults(results);
            sessionStorage.setItem('directory_search_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          const results = finalRes.results as DirectorySearchResult[];
          setDirectoryResults(results);
          sessionStorage.setItem('directory_search_results', JSON.stringify(results));
          toast.success("Pesquisa de diretórios concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "Directory search failed.");
          toast.error("Falha na pesquisa de diretórios", { description: finalRes.message });
        }
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        sessionStorage.setItem('directory_searching_state', 'false');
      }).catch((err) => {
        setError(err?.message || 'Erro na pesquisa de diretórios');
        toast.error("Falha no polling da pesquisa");
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        sessionStorage.setItem('directory_searching_state', 'false');
      });
    }
  }, []);

  // Update form field handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      sessionStorage.setItem('directory_search_form', JSON.stringify(updated));
      return updated;
    });
  }, []);

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
    sessionStorage.setItem('directory_searching_state', 'true');
    sessionStorage.setItem('directory_search_form', JSON.stringify(data));

    toast.info("Pesquisa agendada", {
      description: "A pesquisa de diretórios será executada em background via tarefa."
    });

    try {
      // Create the directory search task - now passing all the form data directly
      const { taskId } = await createSeoAnalysisTask({
        ...data,
        task_name: 'directory_search' 
      });
      
      lastTaskIdRef.current = taskId;
      sessionStorage.setItem('directory_search_task_id', taskId);
      toast.info("Tarefa de pesquisa agendada", { description: "Aguardando resultados..." });

      // Poll for task completion
      pollTaskUntilComplete(
        taskId,
        (res) => {
          if (res.results) {
            const results = res.results as DirectorySearchResult[];
            setDirectoryResults(results);
            sessionStorage.setItem('directory_search_results', JSON.stringify(results));
          }
        }
      ).then((finalRes) => {
        if (finalRes.status === 'success' && finalRes.results) {
          const results = finalRes.results as DirectorySearchResult[];
          setDirectoryResults(results);
          sessionStorage.setItem('directory_search_results', JSON.stringify(results));
          toast.success("Pesquisa de diretórios concluída");
        } else if (finalRes.status === 'failed') {
          setError(finalRes.message || "Directory search failed.");
          toast.error("Falha na pesquisa de diretórios", { description: finalRes.message });
        }
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        sessionStorage.setItem('directory_searching_state', 'false');
      }).catch((err) => {
        setError(err?.message || 'Erro na pesquisa de diretórios');
        toast.error("Falha no polling da pesquisa");
        
        setIsSearching(false);
        searchInProgressRef.current = false;
        sessionStorage.setItem('directory_searching_state', 'false');
      });
    } catch (err: any) {
      setError(err.message || "Erro ao agendar pesquisa de diretórios.");
      toast.error("Erro ao iniciar pesquisa", { description: err.message });
      setIsSearching(false);
      searchInProgressRef.current = false;
      sessionStorage.setItem('directory_searching_state', 'false');
    }
  }, [formData]);

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchDirectories();
  };

  // Handler for "new search" button
  const handleNewSearch = () => {
    // Clean cache
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('directory_')) sessionStorage.removeItem(key);
    });
    setDirectoryResults(null);
    setError(null);
    toast.info("Iniciando nova pesquisa...");
  };

  return {
    formData,
    isSearching,
    directoryResults,
    error,
    handleInputChange,
    handleSubmit,
    handleNewSearch,
    searchDirectories
  };
}
