
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SuggestionCard from './SuggestionCard';

interface Suggestion {
  topic: string;
  reason: string;
  keywords: string[];
  selected?: boolean;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onToggleSelection: (index: number) => void;
  onCopyToClipboard: (text: string) => void;
  onSaveToIdeasList: (topic: string) => void;
  onSendToWriter: (topic: string) => void;
  onSendSelectedToWriter: () => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onToggleSelection,
  onCopyToClipboard,
  onSaveToIdeasList,
  onSendToWriter,
  onSendSelectedToWriter
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Recomendações de conteúdo ({suggestions.length})</h2>
      
      <div className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard 
            key={index}
            suggestion={suggestion}
            index={index}
            onToggleSelection={onToggleSelection}
            onCopyToClipboard={onCopyToClipboard}
            onSaveToIdeasList={onSaveToIdeasList}
            onSendToWriter={onSendToWriter}
          />
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={onSendSelectedToWriter} className="gap-2">
          Enviar selecionados para o Writer
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SuggestionsList;
