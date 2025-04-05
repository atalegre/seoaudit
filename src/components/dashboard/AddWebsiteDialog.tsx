
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddWebsiteForm from './AddWebsiteForm';

interface AddWebsiteDialogProps {
  userId?: string;
  onWebsiteAdded?: () => void;
}

const AddWebsiteDialog = ({ userId, onWebsiteAdded }: AddWebsiteDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onWebsiteAdded) {
      onWebsiteAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Website</DialogTitle>
          <DialogDescription>
            Adicione um novo website para análise. Iremos analisar o SEO e o AIO do seu website.
          </DialogDescription>
        </DialogHeader>
        <AddWebsiteForm onSuccess={handleSuccess} userId={userId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddWebsiteDialog;
