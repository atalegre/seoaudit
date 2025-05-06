
import { DirectorySearchFormData, DirectorySearchResult } from './types';

const STORAGE_KEYS = {
  FORM_DATA: 'directory_search_form',
  RESULTS: 'directory_search_results',
  TASK_ID: 'directory_search_task_id',
  SEARCHING_STATE: 'directory_searching_state'
};

export function loadFormData(): DirectorySearchFormData | null {
  const storedFormData = sessionStorage.getItem(STORAGE_KEYS.FORM_DATA);
  
  if (storedFormData) {
    try {
      return JSON.parse(storedFormData);
    } catch (err) {
      console.error('Failed to parse stored form data:', err);
      return null;
    }
  }
  
  return null;
}

export function loadResults(): DirectorySearchResult[] | null {
  const storedResults = sessionStorage.getItem(STORAGE_KEYS.RESULTS);
  
  if (storedResults) {
    try {
      return JSON.parse(storedResults);
    } catch (err) {
      console.error('Failed to parse stored directory results:', err);
      return null;
    }
  }
  
  return null;
}

export function loadTaskId(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.TASK_ID);
}

export function loadSearchingState(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.SEARCHING_STATE) === 'true';
}

export function saveFormData(formData: DirectorySearchFormData): void {
  sessionStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
}

export function saveResults(results: DirectorySearchResult[]): void {
  sessionStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

export function saveTaskId(taskId: string): void {
  sessionStorage.setItem(STORAGE_KEYS.TASK_ID, taskId);
}

export function saveSearchingState(isSearching: boolean): void {
  sessionStorage.setItem(STORAGE_KEYS.SEARCHING_STATE, isSearching ? 'true' : 'false');
}

export function clearStorageData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
}
