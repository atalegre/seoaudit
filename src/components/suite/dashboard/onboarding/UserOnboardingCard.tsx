
import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UserOnboardingCardProps {
  userName?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const UserOnboardingCard: React.FC<UserOnboardingCardProps> = ({ 
  userName = 'lá', 
  onClose,
  children
}) => {
  return (
    <Card className="border-blue-100 bg-blue-50/50 max-w-xs fixed bottom-4 right-4 z-40 shadow-lg">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">
          👋 Olá, {userName}!
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="py-2 px-3">
        {children}
      </CardContent>
    </Card>
  );
};

export default UserOnboardingCard;
