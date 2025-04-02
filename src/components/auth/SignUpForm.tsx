import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createUser } from '@/utils/api/userService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import EmailField from './EmailField';
import PasswordField from './PasswordField';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome é obrigatório' }),
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Password deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Password deve conter pelo menos uma letra maiúscula' })
    .regex(/[0-9]/, { message: 'Password deve conter pelo menos um número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password deve conter pelo menos um caractere especial' }),
  acceptTerms: z.boolean().refine(val => val, {
    message: 'Deve aceitar os termos e condições',
  }),
});

type SignUpFormProps = {
  setAuthError: (error: string | null) => void;
};

const SignUpForm = ({ setAuthError }: SignUpFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsRegistering(true);
    setAuthError(null);
    
    try {
      // Step 1: Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: 'user', // Default role for new users
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Registration error:", error);
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Erro no registo",
          description: error.message,
        });
      } else {
        // Success - try to create a user record, but don't block on it
        try {
          if (data?.user) {
            await createUser({
              id: data.user.id,
              name: values.name,
              email: values.email,
              role: 'user'
            });
          }
        } catch (usersError) {
          console.error("User record creation error:", usersError);
          // Don't block signup if this fails
        }
        
        if (data?.session) {
          // User was signed in automatically
          toast({
            title: "Registo bem-sucedido",
            description: "A sua conta foi criada com sucesso!",
          });
          // Always redirect to client dashboard
          navigate('/dashboard/client');
        } else {
          // Email confirmation required
          toast({
            title: "Registo iniciado",
            description: "Por favor verifique o seu email para confirmar a sua conta.",
          });
        }
      }
    } catch (error: any) {
      console.error("Exception during registration:", error);
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Seu Nome"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <EmailField form={form} />
        <PasswordField form={form} name="password" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>A senha deve conter:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Pelo menos 8 caracteres</li>
            <li>Pelo menos uma letra maiúscula</li>
            <li>Pelo menos um número</li>
            <li>Pelo menos um caractere especial</li>
          </ul>
        </div>
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Aceito os <Link to="/termos" className="text-primary hover:underline">termos e condições</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>Registando...</>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Registrar
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
