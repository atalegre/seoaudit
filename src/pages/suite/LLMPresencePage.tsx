
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import SuiteLayout from '@/components/suite/SuiteLayout';
import LLMPresenceAudit from '@/components/LLMPresenceAudit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Sparkles, Brain, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LLMPresencePage = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('seoaudit.pt');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleRerunAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis completion after 2 seconds
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const goToContentWriter = () => {
    navigate('/suite/writer');
  };
  
  return (
    <SuiteLayout 
      title="A tua presença nos Modelos de IA" 
      domain={domain}
      lastAnalysisDate="28 Mar 2025"
      onRerunAnalysis={handleRerunAnalysis}
      isAnalyzing={isAnalyzing}
    >
      <Helmet>
        <title>Presença em Modelos de IA | SEOAudit</title>
        <meta 
          name="description" 
          content="Análise de como a tua marca aparece em modelos de linguagem como ChatGPT, Gemini e outros." 
        />
      </Helmet>
      
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Introdução */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Descobre como o teu site aparece (ou não) nas respostas geradas por modelos como ChatGPT, 
            Gemini, Perplexity e outros. Aumenta a tua visibilidade onde as pessoas procuram respostas.
          </p>
        </div>
        
        {/* Componente principal de análise LLM */}
        <LLMPresenceAudit url={`https://${domain}`} autoStart={true} />
        
        {/* Fontes analisadas */}
        <Card>
          <CardHeader>
            <CardTitle>Fontes analisadas</CardTitle>
            <CardDescription>Modelos de linguagem verificados nesta análise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-aio" />
                    <span>ChatGPT</span>
                  </div>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <Progress value={82} className="h-2" indicatorClassName="bg-aio" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-aio" />
                    <span>Gemini</span>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" indicatorClassName="bg-amber-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-aio" />
                    <span>Perplexity</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <Progress value={10} className="h-2" indicatorClassName="bg-red-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-aio" />
                    <span>Claude</span>
                  </div>
                  <span className="text-sm font-medium">5%</span>
                </div>
                <Progress value={5} className="h-2" indicatorClassName="bg-red-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-aio" />
                    <span>Bing Copilot</span>
                  </div>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <Progress value={0} className="h-2" indicatorClassName="bg-red-500" />
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-muted/50 rounded-md text-sm">
              <p className="text-muted-foreground">O teu domínio é mencionado 3 vezes nos últimos 90 dias nas respostas de IA.</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Oportunidades de melhoria */}
        <Card>
          <CardHeader>
            <CardTitle>Como melhorar a tua presença?</CardTitle>
            <CardDescription>Recomendações para aumentar a visibilidade em modelos de IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Criar conteúdo relevante com nome da marca</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Publique conteúdo que mencione explicitamente o nome da sua marca e responda a perguntas comuns.
                  </p>
                  <Button size="sm" variant="outline" onClick={goToContentWriter}>
                    Começar agora
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Ter página "Sobre" bem estruturada</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Inclua informações detalhadas sobre sua empresa, produtos e diferenciais em formato semântico.
                  </p>
                  <Button size="sm" variant="outline" onClick={goToContentWriter}>
                    Começar agora
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Estar em diretórios confiáveis</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Registre sua empresa em diretórios autoritativos que os modelos de IA utilizam como fontes.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/suite/directories')}>
                    Começar agora
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Criar FAQ com linguagem natural</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Desenvolva seções de perguntas frequentes que reflitam como as pessoas realmente perguntam sobre seus produtos.
                  </p>
                  <Button size="sm" variant="outline" onClick={goToContentWriter}>
                    Começar agora
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Obter menções noutros sites</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Promova sua marca em sites autoritativos do seu setor para aumentar as chances de citação.
                  </p>
                  <Button size="sm" variant="outline" onClick={goToContentWriter}>
                    Começar agora
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Seção integração com Writer */}
        <Card className="bg-gradient-to-br from-aio/5 to-aio/20 border-none">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Transforma estas sugestões em conteúdo</h2>
              <p className="text-muted-foreground mb-6">
                Usa o nosso Gerador de Conteúdo com IA para melhorar o posicionamento do teu site nos modelos de linguagem.
              </p>
              <Button onClick={goToContentWriter} className="gap-2" size="lg">
                <Sparkles className="h-4 w-4" />
                Criar conteúdo com IA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuiteLayout>
  );
};

export default LLMPresencePage;
