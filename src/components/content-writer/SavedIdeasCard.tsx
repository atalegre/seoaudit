
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Sparkles, X, ArrowRight } from 'lucide-react';
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Ideias guardadas para usar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedIdeas.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
            <p className="mb-3">
              Ainda não guardaste nenhuma ideia. Usa o gerador de sugestões para começar.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full gap-2"
              onClick={() => navigate('/suite/recommender')}
            >
              <ArrowRight className="h-4 w-4" />
              Ver sugestões de conteúdo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedIdeas.map((idea, index) => (
              <div key={index} className="relative p-4 border border-border hover:border-primary/20 rounded-md transition-all group">
                <button 
                  onClick={() => onRemoveIdea(idea)}
                  className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground opacity-50 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover ideia"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-sm font-medium pr-6 mb-3">{idea}</p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs gap-1"
                    onClick={() => onEditIdea(idea)}
                  >
                    <Edit className="h-3 w-3" />
                    Editar inputs
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="flex-1 text-xs gap-1"
                    onClick={() => onGenerateFromIdea(idea)}
                  >
                    <Sparkles className="h-3 w-3" />
                    Usar agora com IA
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {savedIdeas.length > 0 && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full gap-2"
              onClick={() => navigate('/suite/recommender')}
            >
              <ArrowRight className="h-4 w-4" />
              Ver mais sugestões de conteúdo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedIdeasCard;
