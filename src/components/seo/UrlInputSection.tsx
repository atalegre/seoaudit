
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UrlInputSectionProps {
  url: string;
  isAnalyzing: boolean;
  extractDomain: (url: string) => string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReanalyze: () => void;
}

const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  url,
  isAnalyzing,
  extractDomain,
  onUrlChange,
  onReanalyze
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Site em análise: {url ? extractDomain(url) : 'Nenhum site'}</CardTitle>
        <CardDescription>
          Resultados da análise com Google PageSpeed Insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="https://exemplo.com"
            value={url}
            onChange={onUrlChange}
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button 
            onClick={onReanalyze} 
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Analisar novamente
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UrlInputSection;
