
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, 
  description, 
  actionLabel = "Começar agora", 
  onAction 
}) => {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-md">
      <div className="p-2 bg-green-100 rounded-full text-green-600">
        <CheckCircle className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        {onAction && (
          <Button size="sm" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
