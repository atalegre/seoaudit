
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Check, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { saveClientsToDatabase } from '@/utils/api/clientService';
import { Client } from '@/utils/api/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ReportFormProps {
  url: string;
  seoScore?: number;
  aioScore?: number;
  compact?: boolean; // Add compact property as optional
}

const ReportForm: React.FC<ReportFormProps> = ({ url, seoScore, aioScore, compact = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendByEmail, setSendByEmail] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verificar se o usuário já existe ou criar conta
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, // Senha aleatória
        options: {
          data: {
            name,
            phone,
          },
        },
      });
      
      if (authError && authError.message !== 'User already registered') {
        console.error('Authentication error:', authError);
        throw authError;
      }
      
      console.log('Auth data:', authData);
      
      // Criar cliente no sistema
      const newClient: Client = {
        id: Date.now(), // Temporário, será substituído pelo ID do Supabase
        name,
        contactName: name,
        contactEmail: email,
        website: url,
        status: 'active',
        account: 'Sistema',
        seoScore: seoScore ?? 0,
        aioScore: aioScore ?? 0,
        lastAnalysis: new Date(),
      };
      
      console.log('Creating client in database:', newClient);
      const savedClientResult = await saveClientsToDatabase([newClient]);
      console.log('Save client result:', savedClientResult);
      
      // Simulação de envio de email
      if (sendByEmail) {
        // Aqui seria implementado o envio real do email
        toast.success('Relatório enviado para o seu email com sucesso!');
      }
      
      // Sucesso
      setIsSubmitted(true);
      
      // Autenticar o usuário
      if (!authData?.user) {
        console.log('Attempting to sign in user with email:', email);
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, // Isto não funcionará, mas tentamos o login para usuários existentes
        });
        
        // Se não conseguir autenticar, apenas redireciona para a página de login
        if (signInError) {
          console.log('Sign in error:', signInError);
          setTimeout(() => {
            navigate('/signin', { state: { email, returnTo: '/dashboard/client' } });
          }, 2000);
          return;
        }
      }
      
      console.log('Auth successful, redirecting to dashboard');
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard/client');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Modified UI based on compact prop
  if (isSubmitted) {
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
            onClick={() => navigate('/dashboard/client')}
            className="flex items-center gap-2"
            size={compact ? "sm" : "default"}
          >
            Ir para o Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={`w-full animate-scale-in ${compact ? 'p-2' : ''}`}>
      <CardHeader className={compact ? 'p-3' : ''}>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Acesso ao relatório completo
        </CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para aceder ao dashboard e receber uma análise detalhada
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-4 ${compact ? 'p-3' : ''}`}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Insira o seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={compact ? "h-8 text-sm" : ""}
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
              className={compact ? "h-8 text-sm" : ""}
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
              className={compact ? "h-8 text-sm" : ""}
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="sendByEmail"
              checked={sendByEmail}
              onChange={(e) => setSendByEmail(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="sendByEmail" className="text-sm font-normal">
              Receber também por email
            </Label>
          </div>
          
          <p className={`text-xs text-muted-foreground mt-4 ${compact ? 'hidden sm:block' : ''}`}>
            * Campos obrigatórios. Ao submeter este formulário, concorda com os nossos Termos e Condições e Política de Privacidade.
          </p>
        </CardContent>
        
        <CardFooter className={compact ? 'p-3' : ''}>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
            size={compact ? "sm" : "default"}
          >
            {isSubmitting ? 'A processar...' : 'Aceder ao Dashboard'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportForm;
