
import React from 'react';
import { Button } from '@/components/ui/button';

interface BlogFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const BlogFormActions: React.FC<BlogFormActionsProps> = ({ 
  isSubmitting, 
  isEditing, 
  onCancel 
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 
          "Salvando..." : 
          isEditing ? "Atualizar Post" : "Criar Post"}
      </Button>
    </div>
  );
};

export default BlogFormActions;
