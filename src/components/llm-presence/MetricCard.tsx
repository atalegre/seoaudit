
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, PenLine } from 'lucide-react';

interface MetricCardProps {
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, description, status }) => {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="p-2 rounded-full bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        );
      case 'warning':
        return (
          <div className="p-2 rounded-full bg-amber-100">
            <PenLine className="h-5 w-5 text-amber-600" />
          </div>
        );
      case 'error':
        return (
          <div className="p-2 rounded-full bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          {getIcon()}
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
