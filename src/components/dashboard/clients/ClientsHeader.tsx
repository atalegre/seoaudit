
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClientsHeaderProps {
  title: string;
  description: string;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({ 
  title, 
  description 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddClient = () => {
    toast({
      title: t('feature-in-dev'),
      description: t('add-client-soon'),
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <Button onClick={handleAddClient}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {t('add-client')}
      </Button>
    </div>
  );
};

export default ClientsHeader;
