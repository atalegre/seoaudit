
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Sparkles } from 'lucide-react';

interface Suggestion {
  topic: string;
  reason: string;
  keywords: string[];
  selected?: boolean;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  index: number;
  onToggleSelection: (index: number) => void;
  onCopyToClipboard: (text: string) => void;
  onSaveToIdeasList: (topic: string) => void;
  onSendToWriter: (topic: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  index,
  onToggleSelection,
  onCopyToClipboard,
  onSaveToIdeasList,
  onSendToWriter
}) => {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-start gap-4 py-4">
        <Checkbox 
          id={`suggestion-${index}`}
          checked={suggestion.selected}
          onCheckedChange={() => onToggleSelection(index)}
        />
        <div className="flex-1">
          <label 
            htmlFor={`suggestion-${index}`}
            className="font-medium text-lg cursor-pointer"
          >
            {suggestion.topic}
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{suggestion.reason}</p>
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          {suggestion.keywords.map((keyword, i) => (
            <span key={i} className="bg-muted px-2 py-1 rounded">{keyword}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onCopyToClipboard(suggestion.topic)}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button variant="outline" onClick={() => onSaveToIdeasList(suggestion.topic)}>
            Guardar na Lista
          </Button>
          <Button variant="secondary" onClick={() => onSendToWriter(suggestion.topic)}>
            <Sparkles className="h-4 w-4 mr-2" />
            Enviar para o Writer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
