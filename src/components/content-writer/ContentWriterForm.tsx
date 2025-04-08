
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Import our new component fields
import KeywordField from './form-fields/KeywordField';
import LanguageField from './form-fields/LanguageField';
import ToneField from './form-fields/ToneField';
import ContentTypeField from './form-fields/ContentTypeField';
import SizeField from './form-fields/SizeField';
import FormSubmitButton from './form-fields/FormSubmitButton';

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
}

const ContentWriterForm: React.FC<ContentWriterFormProps> = ({ onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      language: 'PT',
      tone: 'Profissional',
      contentType: 'Post de blog',
      size: 'Médio',
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Palavra-chave principal */}
            <KeywordField form={form} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Idioma */}
              <LanguageField form={form} />

              {/* Tom de voz */}
              <ToneField form={form} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de conteúdo */}
              <ContentTypeField form={form} />

              {/* Tamanho aproximado */}
              <SizeField form={form} />
            </div>

            <FormSubmitButton label="Gerar conteúdo com IA" />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContentWriterForm;
