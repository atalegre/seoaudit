
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Save, RotateCw, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GeneratedContent {
  title: string;
  content: string;
}

interface GeneratedContentCardProps {
  content: GeneratedContent;
  onCreateNewVersion: () => void;
}

const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ 
  content,
  onCreateNewVersion
}) => {
  const { toast } = useToast();
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content.content);
    toast({
      title: "Conteúdo copiado!",
      description: "O texto foi copiado para a área de transferência.",
      duration: 3000,
    });
  };
  
  const handleSave = () => {
    // Simulação de salvamento - em uma implementação real, isto salvaria no banco de dados
    toast({
      title: "Conteúdo salvo!",
      description: "O conteúdo foi salvo com sucesso.",
      duration: 3000,
    });
  };
  
  const handleExportToTxt = () => {
    // Criar um blob com o conteúdo
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Criar um link para download e clicar nele automaticamente
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Arquivo exportado!",
      description: "O conteúdo foi exportado como arquivo de texto.",
      duration: 3000,
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md mb-4">
          <Textarea 
            value={content.content} 
            readOnly 
            className="min-h-[300px] resize-none bg-muted border-none focus-visible:ring-0" 
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportToTxt}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
        <Button size="sm" onClick={onCreateNewVersion}>
          <RotateCw className="h-4 w-4 mr-2" />
          Criar nova versão
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneratedContentCard;
