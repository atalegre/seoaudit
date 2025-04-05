
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, FileCheck2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
  urgent: boolean;
}

interface NotificationsSectionProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

const NotificationsSection = ({ notifications, onMarkAsRead }: NotificationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Atualizações e alertas sobre o seu site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification: any) => (
            <li 
              key={notification.id} 
              className={`flex gap-3 p-3 rounded-lg ${notification.read ? 'bg-muted/50' : 'bg-muted'} ${notification.urgent ? 'border-l-4 border-red-500' : ''}`}
            >
              <div className="flex-shrink-0 mt-1">
                {notification.urgent ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : notification.read ? (
                  <Bell className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Bell className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.date}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>
                {!notification.read && (
                  <div className="mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <FileCheck2 className="h-3 w-3 mr-1" />
                      Marcar como lida
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      {notifications.length > 3 && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todas as notificações
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationsSection;
