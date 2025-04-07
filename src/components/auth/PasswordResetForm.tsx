
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Mail } from 'lucide-react';
import { resetPassword } from '@/utils/auth/passwordService';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' })
});

type FormValues = z.infer<typeof schema>;

type PasswordResetFormProps = {
  setAuthError: (error: string | null) => void;
};

const PasswordResetForm = ({ setAuthError }: PasswordResetFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await resetPassword(values.email);
      
      if (result.success) {
        toast({
          title: "Email enviado",
          description: "Verifique seu email para redefinir sua password",
        });
        
        navigate('/signin', { 
          state: { 
            message: "Um email de recuperação foi enviado. Verifique sua caixa de entrada."
          }
        });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setAuthError(error.message || "Erro ao enviar email de recuperação");
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível enviar o email de recuperação",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando email...</>
          ) : (
            "Recuperar Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
