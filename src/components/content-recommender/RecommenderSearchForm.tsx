
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface RecommenderSearchFormProps {
  url: string;
  setUrl: (url: string) => void;
  competitor: string;
  setCompetitor: (competitor: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

const RecommenderSearchForm: React.FC<RecommenderSearchFormProps> = ({
  url,
  setUrl,
  competitor,
  setCompetitor,
  language,
  setLanguage,
  loading,
  onSubmit
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="space-y-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">URL do seu site</label>
            <Input
              id="url"
              placeholder="https://seusite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="competitor" className="text-sm font-medium">Concorrente principal (opcional)</label>
            <Input
              id="competitor"
              placeholder="https://concorrente.com"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-medium">Idioma</label>
            <Input
              id="language"
              placeholder="pt, en, es..."
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
        </div>
        
        <Button onClick={onSubmit} disabled={loading} className="w-full mt-2">
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              A gerar...
            </>
          ) : (
            'Gerar sugestões'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecommenderSearchForm;
