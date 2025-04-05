
import React from 'react';
import { Button } from '@/components/ui/button';

interface CookieActionsProps {
  showPreferences: boolean;
  handleRejectAll: () => void;
  handleTogglePreferences: () => void;
  handleSavePreferences: () => void;
  handleAcceptAll: () => void;
}

const CookieActions: React.FC<CookieActionsProps> = ({
  showPreferences,
  handleRejectAll,
  handleTogglePreferences,
  handleSavePreferences,
  handleAcceptAll
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleRejectAll}>
        Rejeitar Todos
      </Button>
      <Button variant="outline" size="sm" onClick={handleTogglePreferences}>
        Preferências
      </Button>
      {showPreferences && (
        <Button variant="outline" size="sm" onClick={handleSavePreferences}>
          Guardar Preferências
        </Button>
      )}
      <Button variant="default" size="sm" onClick={handleAcceptAll}>
        Aceitar Todos
      </Button>
    </div>
  );
};

export default CookieActions;
