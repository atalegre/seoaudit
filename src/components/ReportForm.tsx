
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReportFormProps {
  url: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ url }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Relatório enviado para o seu email com sucesso!');
    }, 1500);
  };
  
  if (isSubmitted) {
    return (
      <Card className="w-full animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Relatório Enviado
          </CardTitle>
          <CardDescription>
            Verificámos o seu email e enviámos o relatório completo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-center text-sm text-gray-600 max-w-sm">
              Um especialista irá contactá-lo em breve para ajudar a melhorar o seu site.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Editar informações
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Receba o relatório completo
        </CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para receber uma análise detalhada
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Insira o seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            * Campos obrigatórios. Ao submeter este formulário, concorda com os nossos Termos e Condições e Política de Privacidade.
          </p>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'A processar...' : 'Receber Relatório'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportForm;
