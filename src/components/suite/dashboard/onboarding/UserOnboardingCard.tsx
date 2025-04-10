
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
    <Card className="border-blue-100 bg-blue-50/50 mb-4 max-w-2xl mx-auto">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          👋 Olá, {userName}! Vamos configurar sua conta
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-3">
        {children}
      </CardContent>
    </Card>
  );
};

export default UserOnboardingCard;
