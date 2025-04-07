
import React from 'react';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import SearchConsoleContent from './SearchConsoleContent';

interface SearchConsoleSectionProps {
  data: SearchConsoleData | null;
  isLoading?: boolean;
  error?: string | null;
}

const SearchConsoleSection = ({ data, isLoading, error }: SearchConsoleSectionProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!data) {
    return <EmptyState />;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dados do Search Console</CardTitle>
        <CardDescription>
          Dados de {data.startDate} até {data.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchConsoleContent data={data} />
      </CardContent>
    </Card>
  );
};

export default SearchConsoleSection;
