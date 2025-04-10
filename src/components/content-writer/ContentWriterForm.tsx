
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import our form field components
import KeywordField from './form-fields/KeywordField';
import LanguageField from './form-fields/LanguageField';
import ToneField from './form-fields/ToneField';
import ContentTypeField from './form-fields/ContentTypeField';
import SizeField from './form-fields/SizeField';

// Export the schema so it can be imported in child components
export const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Palavra-chave é obrigatória' }),
  language: z.string().min(1, { message: 'Selecione um idioma' }),
  tone: z.string().min(1, { message: 'Selecione um tom de voz' }),
  contentType: z.string().min(1, { message: 'Selecione um tipo de conteúdo' }),
  size: z.string().min(1, { message: 'Selecione um tamanho' }),
});

export type FormValues = z.infer<typeof formSchema>;

interface ContentWriterFormProps {
  onSubmit: (data: FormValues) => void;
  onShowExample?: () => void;
  initialData?: Partial<FormValues>;
}

const ContentWriterForm: React.FC<ContentWriterFormProps> = ({ 
  onSubmit, 
  onShowExample,
  initialData
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: initialData?.keyword || '',
      language: initialData?.language || 'PT',
      tone: initialData?.tone || 'Profissional',
      contentType: initialData?.contentType || 'Post de blog',
      size: initialData?.size || 'Médio',
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Gerador de Conteúdo</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para gerar conteúdo otimizado para SEO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Bloco 1: Sobre o seu conteúdo */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">📌 Sobre o seu conteúdo</h3>
              <div className="space-y-5 pl-1">
                {/* Palavra-chave principal */}
                <KeywordField form={form} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Tipo de conteúdo */}
                  <ContentTypeField form={form} />

                  {/* Tamanho aproximado */}
                  <SizeField form={form} />
                </div>
              </div>
            </div>

            {/* Bloco 2: Como deseja que soe? */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">🎙️ Como deseja que soe?</h3>
              <div className="space-y-5 pl-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Idioma */}
                  <LanguageField form={form} />

                  {/* Tom de voz */}
                  <ToneField form={form} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="w-full sm:flex-1" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                🚀 Gerar conteúdo otimizado
              </Button>
              
              {onShowExample && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={onShowExample}
                  size="lg"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  👀 Ver exemplo
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentWriterForm;
