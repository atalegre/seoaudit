
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language } = useLanguage();
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        {language === 'pt' ? 'Cancelar' : 'Cancel'}
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (language === 'pt' ? "Salvando..." : "Saving...") 
          : isEditing 
            ? (language === 'pt' ? "Atualizar Post" : "Update Post") 
            : (language === 'pt' ? "Criar Post" : "Create Post")}
      </Button>
    </div>
  );
};

export default BlogFormActions;
