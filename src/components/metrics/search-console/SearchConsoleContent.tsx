
import React from 'react';
import { SearchConsoleData } from '@/utils/api/searchConsole/types';
import StatsCards from './StatsCards';
import QueriesChart from './QueriesChart';
import QueriesTable from './QueriesTable';

interface SearchConsoleContentProps {
  data: SearchConsoleData;
}

const SearchConsoleContent: React.FC<SearchConsoleContentProps> = ({ data }) => {
  return (
    <>
      <StatsCards data={data} />
      <QueriesChart queries={data.queries} />
      <QueriesTable queries={data.queries} />
    </>
  );
};

export default SearchConsoleContent;
