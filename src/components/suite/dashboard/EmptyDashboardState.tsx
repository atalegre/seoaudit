
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Sparkles, BarChart2, Brain, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmptyDashboardStateProps {
  analyzeDomain: string;
  setAnalyzeDomain: (domain: string) => void;
}

const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({
  analyzeDomain,
  setAnalyzeDomain,
}) => {
  // Handler para submeter o formulário de análise
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyzeDomain.trim()) return;
    
    // Normalizar o domínio se necessário
    let domain = analyzeDomain.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain;
    }
    
    // Salvar no localStorage
    localStorage.setItem('lastAnalyzedUrl', domain);
    
    // Criar um projectId (numa implementação real, isto seria feito no servidor)
    const projectId = `${domain.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    
    // Recarregar a página com o parâmetro de URL
    window.location.href = `/suite?url=${encodeURIComponent(domain)}&projectId=${projectId}`;
  };

  // Array de features para mostrar ao utilizador
  const features = [
    {
      icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
      title: "Análise SEO Completa",
      description: "Obtenha insights técnicos detalhados sobre o desempenho do seu site nos motores de busca.",
      tooltip: "Inclui Core Web Vitals, estrutura, metadata e mais."
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Otimização para IA",
      description: "Descubra como o seu conteúdo é interpretado pelos modelos de IA atuais.",
      tooltip: "Saiba como o ChatGPT, Gemini e outros modelos veem o seu site."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      title: "Geração de Conteúdo",
      description: "Crie conteúdo otimizado para humanos e IA com recomendações personalizadas.",
      tooltip: "Sugestões de artigos, títulos e keywords com base na sua indústria."
    }
  ];

  return (
    <motion.div 
      className="max-w-4xl mx-auto py-8 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Bem-vindo à <span className="text-violet-600">SEOaudit</span> Suite
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Descubra como o seu website se comporta nos motores de busca e nos novos modelos de inteligência artificial com uma análise completa e gratuita.
        </p>
        
        {/* Formulário de análise */}
        <Card className="max-w-xl mx-auto mb-8 shadow-md border-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analisar website</CardTitle>
            <CardDescription>
              Insira a URL do seu website para começar a análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={analyzeDomain}
                  onChange={(e) => setAnalyzeDomain(e.target.value)}
                  placeholder="seuwebsite.com"
                  className="w-full pl-10 py-2 px-4 rounded-md border border-input bg-background"
                />
              </div>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
                Analisar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Features destacadas */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <TooltipProvider>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Card className="h-full hover:shadow-md transition-shadow border-transparent">
                    <CardHeader>
                      <div className="rounded-full w-10 h-10 flex items-center justify-center bg-muted mb-3">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-60">{feature.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </TooltipProvider>
      </div>
      
      {/* Informação adicional */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 max-w-2xl mx-auto">
        <Info className="h-5 w-5 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-medium text-blue-700 mb-1">Análise sem registro</h3>
          <p className="text-sm">
            Você pode analisar seu site gratuitamente sem criar uma conta. 
            Contudo, para acessar recursos avançados, salvar histórico e 
            obter recomendações personalizadas, considere criar uma conta.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyDashboardState;
