
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
  urgent: boolean;
}

export interface NotificationsSectionProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  onMarkAsRead
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Não há notificações no momento.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-white border-primary/20'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {notification.urgent && (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.date}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span>Marcar como lida</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
