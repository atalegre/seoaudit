
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ClientsSearch: React.FC<ClientsSearchProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={t('search-clients')}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientsSearch;
