
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FormSubmitButtonProps {
  label: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ label }) => {
  return (
    <Button type="submit" className="w-full">
      <Sparkles className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export default FormSubmitButton;
