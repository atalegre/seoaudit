
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
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        {t('cancel')}
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? t('saving') 
          : isEditing 
            ? t('update-post')
            : t('create-post')}
      </Button>
    </div>
  );
};

export default BlogFormActions;
