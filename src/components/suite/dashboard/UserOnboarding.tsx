
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
}

interface UserOnboardingProps {
  userName?: string;
  onClose: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ 
  userName = 'lá', 
  onClose 
}) => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione suas informações profissionais para desbloquear recomendações personalizadas.',
      completed: false,
      route: '/dashboard/settings'
    },
    {
      id: 'site',
      title: 'Analise seu primeiro site',
      description: 'Insira o URL do seu site principal para começar a análise completa.',
      completed: true,
      route: '/suite'
    },
    {
      id: 'recommendations',
      title: 'Explore recomendações',
      description: 'Veja as recomendações e entenda como melhorar seu site.',
      completed: false,
      route: '/suite/seo'
    },
    {
      id: 'content',
      title: 'Crie seu primeiro conteúdo',
      description: 'Use nossa ferramenta de IA para gerar conteúdo otimizado.',
      completed: false,
      route: '/suite/writer'
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepClick = (step: OnboardingStep) => {
    navigate(step.route);
    
    // Marcar o passo como completo
    setSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, completed: true } : s
    ));
  };

  return (
    <Card className="border-blue-100 bg-blue-50/50 mb-6">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          👋 Olá, {userName}! Vamos configurar sua conta
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso de configuração</span>
            <span className="font-medium">{completedSteps}/{steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                step.completed 
                  ? 'bg-green-50/50 border border-green-100' 
                  : 'bg-white border hover:bg-gray-50'
              }`}
              onClick={() => handleStepClick(step)}
            >
              <div className={`rounded-full p-1 ${
                step.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {step.completed ? <Check className="h-4 w-4" /> : <span className="h-4 w-4 block" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOnboarding;
