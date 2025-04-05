
import { useState } from 'react';

export interface NotificationsData {
  notifications: any[];
  handleMarkAsRead: (notificationId: number) => void;
  generateNotifications: (latestReport: any, defaultNotification: any) => void;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const generateNotifications = (latestReport: any = null, defaultNotification: any = null) => {
    if (!latestReport) {
      setNotifications(defaultNotification ? [defaultNotification] : [{
        id: 1,
        title: 'Bem-vindo ao Dashboard',
        description: 'Adicione o seu primeiro website para começar as análises.',
        date: new Date().toLocaleDateString(),
        read: false,
        urgent: false
      }]);
      return;
    }

    const newNotifications = [];
    
    if ((latestReport.seo?.score || 0) < 60) {
      newNotifications.push({
        id: 1,
        title: 'Score SEO baixo',
        description: 'Seu site precisa de melhorias urgentes de SEO.',
        date: new Date(latestReport.timestamp).toLocaleDateString(),
        read: false,
        urgent: true
      });
    }
    
    if (latestReport.recommendations && latestReport.recommendations.length > 0) {
      newNotifications.push({
        id: 2,
        title: 'Novas recomendações disponíveis',
        description: `${latestReport.recommendations.length} recomendações para melhorar seu site.`,
        date: new Date(latestReport.timestamp).toLocaleDateString(),
        read: false,
        urgent: false
      });
    }
    
    if (newNotifications.length > 0) {
      setNotifications(newNotifications);
    } else {
      setNotifications([{
        id: 1,
        title: 'Bem-vindo ao Dashboard',
        description: 'Aqui você pode acompanhar o desempenho do seu site.',
        date: new Date().toLocaleDateString(),
        read: false,
        urgent: false
      }]);
    }
  };

  return {
    notifications,
    handleMarkAsRead,
    generateNotifications
  };
}
