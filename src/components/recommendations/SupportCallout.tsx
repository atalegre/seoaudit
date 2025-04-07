
import React from 'react';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupportCallout: React.FC = () => {
  return (
    <div className="mt-6">
      <div className="bg-muted p-4 rounded-md">
        <div className="flex items-start gap-2">
          <div className="p-2 bg-background rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Quer ajuda para implementar estas melhorias?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Nossa equipe de especialistas pode ajudar a implementar estas recomendações e melhorar seu posicionamento online.
            </p>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Falar com a equipa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCallout;
