
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import AddWebsiteForm from './AddWebsiteForm';

export interface AddWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWebsite: () => void;
  userEmail?: string;
}

const AddWebsiteDialog: React.FC<AddWebsiteDialogProps> = ({
  isOpen,
  onClose,
  onAddWebsite,
  userEmail
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Website</DialogTitle>
          <DialogDescription>
            Insira as informações do website que deseja analisar.
          </DialogDescription>
        </DialogHeader>
        <AddWebsiteForm 
          onSuccess={() => {
            onAddWebsite();
            onClose();
          }} 
          userId={userEmail}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWebsiteDialog;
