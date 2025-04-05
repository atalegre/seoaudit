
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { SuccessViewProps } from './types';

const SuccessView: React.FC<SuccessViewProps> = ({ 
  sendByEmail, 
  compact, 
  onDashboardClick 
}) => {
  return (
    <Card className={`w-full animate-scale-in ${compact ? 'p-2' : ''}`}>
      <CardHeader className={compact ? 'p-3' : ''}>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          Relatório Processado
        </CardTitle>
        <CardDescription>
          A sua análise foi processada com sucesso
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? 'p-3' : ''}>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-center text-sm text-gray-600 max-w-sm">
            {sendByEmail ? 
              'Enviámos o relatório para o seu email e ' : 
              ''}
            estamos a redirecioná-lo para o seu dashboard...
          </p>
        </div>
      </CardContent>
      <CardFooter className={`flex justify-center ${compact ? 'p-3' : ''}`}>
        <Button 
          variant="default" 
          onClick={onDashboardClick}
          className="flex items-center gap-2"
          size={compact ? "sm" : "default"}
        >
          Ir para o Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuccessView;
