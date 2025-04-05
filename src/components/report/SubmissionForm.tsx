
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { saveClientsToDatabase } from '@/utils/api/clientService';
import { Client } from '@/utils/api/types';
import { SubmissionFormProps } from './types';
import FormInputs from './FormInputs';

const SubmissionForm: React.FC<SubmissionFormProps> = ({ 
  url, 
  seoScore = 0, 
  aioScore = 0, 
  compact, 
  sendByEmail, 
  setSendByEmail, 
  setIsSubmitted,
  user
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Função para enviar o relatório por email
  async function sendReportByEmail(email: string, name: string, seoScore: number, aioScore: number, url: string) {
    try {
      // Construir o URL do relatório com os parâmetros
      const reportUrl = `${window.location.origin}/dashboard/client?url=${encodeURIComponent(url)}`;
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'report',
          email,
          name,
          reportUrl,
          seoScore,
          aioScore,
          websiteUrl: url
        }
      });

      if (error) {
        console.error("Erro ao enviar email com relatório:", error);
        return false;
      } else {
        console.log("Email com relatório enviado:", data);
        return true;
      }
    } catch (error) {
      console.error("Exceção ao enviar email com relatório:", error);
      return false;
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store URL in local storage to ensure it's available after redirect
      localStorage.setItem('lastAnalyzedUrl', url);
      console.log("Saved analyzed URL to localStorage:", url);
      
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
        account: email, // This is critical - use email as account to link the client to this user
        seoScore: seoScore,
        aioScore: aioScore,
        lastAnalysis: new Date(),
      };
      
      console.log('Creating client in database:', newClient);
      const savedClientResult = await saveClientsToDatabase([newClient]);
      console.log('Save client result:', savedClientResult);
      
      // Envio de email com relatório
      if (sendByEmail) {
        const emailSent = await sendReportByEmail(
          email, 
          name, 
          seoScore, 
          aioScore, 
          url
        );
        
        if (emailSent) {
          toast.success('Relatório enviado para o seu email com sucesso!');
        } else {
          toast.error('Não foi possível enviar o relatório por email. Tente novamente mais tarde.');
        }
      }
      
      // Sucesso
      setIsSubmitted(true);
      
      // Autenticar o usuário
      if (!authData?.user) {
        console.log('Attempting to sign in user with email:', email);
        // Redirecionar para a página de login
        setTimeout(() => {
          navigate('/signin', { state: { email, returnTo: `/dashboard/client?url=${encodeURIComponent(url)}` } });
        }, 2000);
        return;
      }
      
      console.log('Auth successful, redirecting to dashboard');
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        navigate(`/dashboard/client?url=${encodeURIComponent(url)}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className={compact ? 'p-2' : ''}>
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
          <FormInputs 
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            compact={compact || false}
          />
          
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="sendByEmail"
              checked={sendByEmail}
              onChange={(e) => setSendByEmail(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="sendByEmail" className="text-sm font-normal">
              Receber também por email
            </label>
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

export default SubmissionForm;
