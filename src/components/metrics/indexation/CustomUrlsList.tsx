
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface CustomUrlsListProps {
  urls: string[];
  indexationStatus: {[key: string]: boolean};
  onRemoveUrl: (url: string) => void;
  onCheckIndexation: () => void;
  isLoading: boolean;
  authToken?: string;
}

const CustomUrlsList: React.FC<CustomUrlsListProps> = ({ 
  urls, 
  indexationStatus, 
  onRemoveUrl, 
  onCheckIndexation, 
  isLoading,
  authToken
}) => {
  if (urls.length === 0) return null;
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">URLs para verificar ({urls.length})</h4>
        <Button 
          onClick={onCheckIndexation} 
          disabled={isLoading || !authToken}
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar indexação'
          )}
        </Button>
      </div>
      
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {urls.map((url, index) => (
          <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
            <div className="flex items-center gap-2 truncate">
              {indexationStatus[url] !== undefined && (
                indexationStatus[url] ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )
              )}
              <span className="text-sm truncate">{url}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveUrl(url)}
              disabled={isLoading}
            >
              Remover
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomUrlsList;
