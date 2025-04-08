
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingContent: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Gerando conteúdo otimizado...</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Nossa IA está trabalhando para criar um conteúdo relevante e otimizado para SEO.
            Isso pode levar alguns segundos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingContent;
