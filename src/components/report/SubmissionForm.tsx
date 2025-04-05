
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
import SuccessView from './SuccessView';
import { sendReportByEmail } from './utils/emailService';

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    console.log("=== Submission Form - Submit Started ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("URL:", url);
    console.log("SEO Score:", seoScore);
    console.log("AIO Score:", aioScore);
    
    try {
      // Store URL in local storage to ensure it's available after redirect
      localStorage.setItem('lastAnalyzedUrl', url);
      console.log("Saved analyzed URL to localStorage:", url);
      
      // Check if user is already logged in
      if (user) {
        console.log("User already logged in:", user);
        // Create client directly associated with this user
        const newClient: Client = {
          id: Date.now(), // Temporary, will be replaced by Supabase ID
          name,
          contactName: name,
          contactEmail: email,
          website: url,
          status: 'active',
          account: user.email || email, // Make sure to link to the user's email
          seoScore: seoScore,
          aioScore: aioScore,
          lastAnalysis: new Date(),
        };
        
        await saveClientsToDatabase([newClient]);
        
        // Send email if requested
        if (sendByEmail) {
          await sendReportByEmail(email, name, seoScore, aioScore, url);
          toast.success('Relatório enviado para o seu email com sucesso!');
        }
        
        // Set as submitted and redirect to dashboard with URL parameter
        setIsSubmitted(true);
        setTimeout(() => {
          navigate(`/dashboard/client?url=${encodeURIComponent(url)}`);
        }, 2000);
        return;
      }
      
      // If not logged in, create a new account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, // Random password
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
      
      // Create client in the system with complete information
      const newClient: Client = {
        id: Date.now(), // Temporary, will be replaced by Supabase ID
        name,
        contactName: name,
        contactEmail: email,
        website: url,
        status: 'active',
        account: email, // Critical - use email as account to link the client to this user
        seoScore: seoScore,
        aioScore: aioScore,
        lastAnalysis: new Date(),
      };
      
      console.log('Creating client in database:', newClient);
      const savedClientResult = await saveClientsToDatabase([newClient]);
      console.log('Save client result:', savedClientResult);
      
      // Send email with report if requested
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
      
      // Success
      setIsSubmitted(true);
      toast.success('Conta criada com sucesso!');
      
      // Authenticate the user
      if (!authData?.user) {
        console.log('Attempting to sign in user with email:', email);
        // Redirect to login page with URL as parameter
        setTimeout(() => {
          navigate('/signin', { 
            state: { 
              email, 
              returnTo: `/dashboard/client?url=${encodeURIComponent(url)}` 
            } 
          });
        }, 2000);
        return;
      }
      
      console.log('Auth successful, redirecting to dashboard with URL parameter');
      // Redirect to dashboard after 2 seconds
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
