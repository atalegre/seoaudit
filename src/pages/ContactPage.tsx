
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In a real application, this would send the form data to a backend
    toast({
      title: "Mensagem enviada",
      description: "Obrigado pelo seu contacto. Responderemos brevemente.",
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Contacto</h1>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-lg mb-6">
                Estamos disponíveis para esclarecer qualquer dúvida ou fornecer mais informações sobre como o SEO AI Checker pode ajudar a melhorar a presença digital do seu negócio.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@seoaichecker.pt</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-muted-foreground">+351 910 123 456</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium">Morada</h3>
                    <p className="text-muted-foreground">
                      Avenida da Liberdade, 110<br />
                      1269-046 Lisboa<br />
                      Portugal
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-xl">
                <h3 className="font-medium mb-2">Horário de Atendimento</h3>
                <p className="text-muted-foreground mb-4">A nossa equipe está disponível durante:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Segunda a Sexta: 9h00 - 18h00</li>
                  <li>Sábado: 10h00 - 15h00</li>
                  <li>Domingo: Fechado</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-6">Envie-nos uma mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input id="phone" placeholder="+351 912 345 678" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" placeholder="Assunto da mensagem" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Escreva sua mensagem aqui..." 
                    className="min-h-[120px]" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Ao enviar este formulário, você concorda com nossa {" "}
                  <a href="/privacidade" className="underline hover:text-primary">
                    política de privacidade
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
