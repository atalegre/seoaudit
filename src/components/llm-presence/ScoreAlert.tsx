
import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScoreAlertProps {
  score: number;
}

const ScoreAlert: React.FC<ScoreAlertProps> = ({ score }) => {
  const getAlertContent = () => {
    if (score > 70) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />,
        title: 'Boa presença em LLMs',
        message: 'O teu site é frequentemente referenciado nos modelos de linguagem.',
        badge: <Badge variant="success">Boa presença</Badge>
      };
    } else if (score > 40) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />,
        title: 'Presença parcial em LLMs',
        message: 'Presença parcial: algumas menções detectadas, mas há espaço para melhorias.',
        badge: <Badge variant="warning">Presença parcial</Badge>
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />,
        title: 'Visibilidade limitada em LLMs',
        message: 'Não encontrámos menções relevantes ao teu site nos modelos de linguagem.',
        badge: <Badge variant="destructive">Presença limitada</Badge>
      };
    }
  };

  const { icon, title, message, badge } = getAlertContent();

  return (
    <div className="bg-muted/50 p-4 rounded-md mb-4">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium mb-1">{title}</h4>
            {badge}
          </div>
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreAlert;
