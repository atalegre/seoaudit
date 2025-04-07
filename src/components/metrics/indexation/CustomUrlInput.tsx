
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface CustomUrlInputProps {
  onAddUrl: (url: string) => void;
  isLoading: boolean;
}

const CustomUrlInput: React.FC<CustomUrlInputProps> = ({ onAddUrl, isLoading }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onAddUrl(urlInput);
      setUrlInput('');
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="ex: /contato ou /blog/post-1"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleAddUrl} disabled={isLoading}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CustomUrlInput;
