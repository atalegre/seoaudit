
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Send } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Formulário incompleto",
        description: "Por favor preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending email...", { name, email, subject, message });
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { name, email, message, subject },
      });
      
      if (error) throw error;

      console.log("Email sent response:", data);
      
      toast({
        title: "Mensagem enviada",
        description: "Recebemos a sua mensagem. Entraremos em contacto em breve.",
      });
      
      // Reset form and show success state
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setSubject('');
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar a sua mensagem. Por favor tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Mensagem Enviada!</CardTitle>
          <CardDescription className="text-center">
            Obrigado por entrar em contacto connosco.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-center">
              Recebemos a sua mensagem e responderemos com a maior brevidade possível.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => setIsSubmitted(false)}
          >
            Enviar outra mensagem
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Entre em contacto</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para nos enviar uma mensagem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto da mensagem"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a sua mensagem aqui..."
              rows={5}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'A enviar...' : 'Enviar mensagem'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
