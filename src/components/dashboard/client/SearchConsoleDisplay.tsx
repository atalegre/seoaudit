
import React, { useState, useEffect } from 'react';
import SearchConsoleSection from '@/components/metrics/SearchConsoleSection';
import { getSearchConsolePerformance } from '@/utils/api/searchConsoleService';

interface SearchConsoleDisplayProps {
  website: string;
  authToken: string | null;
}

export default function SearchConsoleDisplay({ website, authToken }: SearchConsoleDisplayProps) {
  const [searchConsoleData, setSearchConsoleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSearchConsoleData = async () => {
      if (!website || !authToken) return;
      
      setIsLoading(true);
      try {
        const data = await getSearchConsolePerformance(website, authToken);
        setSearchConsoleData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load Search Console data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchConsoleData();
  }, [website, authToken]);

  if (!authToken) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Search Console</h2>
      <SearchConsoleSection 
        data={searchConsoleData} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
