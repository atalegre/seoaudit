
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnsplashPaginationProps {
  currentPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const UnsplashPagination: React.FC<UnsplashPaginationProps> = ({ 
  currentPage, 
  onPreviousPage, 
  onNextPage, 
  onRefresh,
  loading 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onPreviousPage}
        disabled={currentPage <= 1 || loading}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {language === 'pt' ? 'Anterior' : 'Previous'}
      </Button>
      
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        {language === 'pt' ? 'Atualizar' : 'Refresh'}
      </Button>
      
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onNextPage}
        disabled={loading}
      >
        {language === 'pt' ? 'Próximo' : 'Next'}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default UnsplashPagination;
