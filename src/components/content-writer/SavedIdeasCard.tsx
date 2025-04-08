
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface SavedIdeasCardProps {
  savedIdeas: string[];
  onRemoveIdea: (idea: string) => void;
  onEditIdea: (idea: string) => void;
  onGenerateFromIdea: (idea: string) => void;
}

const SavedIdeasCard: React.FC<SavedIdeasCardProps> = ({
  savedIdeas,
  onRemoveIdea,
  onEditIdea,
  onGenerateFromIdea,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ideias Guardadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedIdeas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Guarde ideias a partir da página de Sugestões para aceder aqui.
          </p>
        ) : (
          <div className="space-y-4">
            {savedIdeas.map((idea, index) => (
              <div key={index} className="relative p-3 border rounded-md">
                <button 
                  onClick={() => onRemoveIdea(idea)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-sm font-medium pr-6 mb-2">{idea}</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => onEditIdea(idea)}
                  >
                    Editar inputs
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="text-xs"
                    onClick={() => onGenerateFromIdea(idea)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Gerar com IA
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => navigate('/suite/recommender')}
          >
            Ver mais sugestões de conteúdo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedIdeasCard;
