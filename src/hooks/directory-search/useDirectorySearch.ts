
import { useState, useEffect } from 'react';
import { pollTaskUntilComplete } from '@/utils/api/seoTaskManager';
import { toast } from 'sonner';
import { DirectorySearchFormData, DirectorySearchResult } from './types';
import { useDirectorySearchActions } from './useDirectorySearchActions';
import { 
  loadFormData,
  loadResults,
  loadTaskId,
  loadSearchingState,
  saveResults,
  saveSearchingState
} from './storage';

const DEFAULT_FORM_DATA: DirectorySearchFormData = {
  businessName: '',
  address: '',
  postalCode: '',
  city: '',
  phoneNumber: ''
};

export function useDirectorySearch() {
  const [formData, setFormData] = useState<DirectorySearchFormData>(DEFAULT_FORM_DATA);
  const [isSearching, setIsSearching] = useState(false);
  const [directoryResults, setDirectoryResults] = useState<DirectorySearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { 
    handleInputChange,
    handleSubmit,
    handleNewSearch,
    searchDirectories
  } = useDirectorySearchActions(
    formData, 
    setFormData, 
    setIsSearching, 
    setDirectoryResults, 
    setError
  );

  // On mount: check for stored results and form data in sessionStorage
  useEffect(() => {
    const storedFormData = loadFormData();
    const storedResults = loadResults(); 
    const storedTaskId = loadTaskId();
    const storedSearchingState = loadSearchingState();
    
    // Restore previous form data if available
    if (storedFormData) {
      setFormData(storedFormData);
    }
    
    // Restore previous results if available
    if (storedResults) {
      setDirectoryResults(storedResults);
    }
    
    // Check if we were in the middle of searching
    if (storedSearchingState && storedTaskId) {
      // Resume polling for in-progress task
      setIsSearching(true);
      
      pollTaskUntilComplete(
        storedTaskId,
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
        saveSearchingState(false);
      }).catch((err) => {
        setError(err?.message || 'Erro na pesquisa de diretórios');
        toast.error("Falha no polling da pesquisa");
        
        setIsSearching(false);
        saveSearchingState(false);
      });
    }
  }, []);

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

export type { DirectorySearchFormData, DirectorySearchResult };
