
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Lock, 
  Search, 
  ShoppingCart, 
  ThumbsUp, 
  MessageSquare,
  User
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomerJourneyProps {
  domain: string;
  isLoggedIn: boolean;
}

const CustomerJourney: React.FC<CustomerJourneyProps> = ({ domain, isLoggedIn }) => {
  const [selectedPersona, setSelectedPersona] = useState('newCustomer');
  
  if (!isLoggedIn) {
    return (
      <div className="py-12 px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-amber-100 p-3">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-medium">Funcionalidade Premium</h3>
          <p className="text-muted-foreground max-w-md">
            O Mapeamento da Jornada do Cliente permite visualizar como diferentes personas 
            interagem com a sua marca através de plataformas de IA.
            Faça login para aceder a esta funcionalidade.
          </p>
          <Button>Entrar na Conta</Button>
        </div>
      </div>
    );
  }
  
  // Sample personas
  const personas = [
    {
      id: 'newCustomer',
      name: 'Novo Cliente',
      icon: <User className="h-4 w-4" />,
      description: 'Utilizador que procura informações iniciais sobre o produto/serviço'
    },
    {
      id: 'existingCustomer',
      name: 'Cliente Atual',
      icon: <ThumbsUp className="h-4 w-4" />,
      description: 'Cliente que já utiliza o produto/serviço e busca suporte ou novas funcionalidades'
    },
    {
      id: 'researchPhase',
      name: 'Fase de Pesquisa',
      icon: <Search className="h-4 w-4" />,
      description: 'Utilizador que compara diferentes opções no mercado'
    }
  ];
  
  // Sample journey stages and interactions for each persona
  const journeys = {
    newCustomer: [
      {
        stage: 'Descoberta',
        icon: <Search className="h-5 w-5 text-blue-500" />,
        query: 'O que é [sua marca]?',
        aiResponse: 'Resposta resumida sobre a empresa e principais produtos/serviços',
        status: 'positive',
        improvement: 'A resposta está correta, mas poderia mencionar o diferencial competitivo'
      },
      {
        stage: 'Consideração',
        icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
        query: 'Como [sua marca] se compara com concorrentes?',
        aiResponse: 'Comparação incompleta, menciona apenas 2 de 5 pontos fortes da marca',
        status: 'warning',
        improvement: 'Criar conteúdo destacando vantagens competitivas e casos de uso'
      },
      {
        stage: 'Decisão',
        icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
        query: 'Como contratar [sua marca]?',
        aiResponse: 'Informação desatualizada sobre preços e planos disponíveis',
        status: 'negative',
        improvement: 'Atualizar informações de preços e disponibilizar uma página de planos estruturada'
      }
    ],
    existingCustomer: [
      {
        stage: 'Suporte',
        icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
        query: 'Como resolver [problema comum] com [sua marca]?',
        aiResponse: 'Resposta detalhada e precisa com passos para solução',
        status: 'positive',
        improvement: 'Incluir link para base de conhecimento mais completa'
      },
      {
        stage: 'Expansão',
        icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
        query: 'Outros produtos da [sua marca]?',
        aiResponse: 'Lista incompleta de produtos/serviços oferecidos',
        status: 'warning',
        improvement: 'Criar página com portfolio completo e melhorar estruturação'
      }
    ],
    researchPhase: [
      {
        stage: 'Comparação',
        icon: <Search className="h-5 w-5 text-orange-500" />,
        query: 'Melhor solução para [problema que sua marca resolve]',
        aiResponse: 'Sua marca mencionada apenas brevemente entre várias alternativas',
        status: 'negative',
        improvement: 'Criar conteúdo de autoridade sobre a solução específica que oferece'
      },
      {
        stage: 'Avaliação',
        icon: <ThumbsUp className="h-5 w-5 text-blue-500" />,
        query: 'Avaliações de [sua marca]',
        aiResponse: 'Menciona alguns reviews positivos mas sem detalhes',
        status: 'warning',
        improvement: 'Publicar casos de sucesso detalhados e solicitar reviews em plataformas relevantes'
      }
    ]
  };
  
  const currentJourney = journeys[selectedPersona as keyof typeof journeys];
  
  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Mapeamento da Jornada do Cliente</h3>
        <p className="text-sm text-muted-foreground">
          Visualize como diferentes personas interagem com a sua marca através de plataformas de IA
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Selecione uma Persona</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPersona} onValueChange={setSelectedPersona}>
            <TabsList className="w-full grid grid-cols-3">
              {personas.map(persona => (
                <TabsTrigger key={persona.id} value={persona.id} className="text-xs gap-1">
                  {persona.icon}
                  <span className="hidden sm:inline">{persona.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {personas.map(persona => (
              <TabsContent key={persona.id} value={persona.id} className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">{persona.description}</p>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Jornada em Plataformas de IA</h4>
        
        <div className="relative">
          {/* Journey path line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 z-0"></div>
          
          {/* Journey stages */}
          <div className="space-y-8 relative z-10">
            {currentJourney.map((stage, index) => (
              <div key={index} className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 
                  ${stage.status === 'positive' ? 'bg-green-100' : 
                    stage.status === 'warning' ? 'bg-amber-100' : 'bg-red-100'}`}>
                  {stage.icon}
                </div>
                
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">{stage.stage}</CardTitle>
                      <Badge variant={
                        stage.status === 'positive' ? 'default' : 
                        stage.status === 'warning' ? 'outline' : 'destructive'
                      }>
                        {stage.status === 'positive' ? 'Bem Posicionado' : 
                         stage.status === 'warning' ? 'Pode Melhorar' : 'Necessita Atenção'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Consulta:</span> 
                      <span className="text-muted-foreground ml-1">{stage.query}</span>
                    </div>
                    <div>
                      <span className="font-medium">Resposta IA:</span>
                      <span className="text-muted-foreground ml-1">{stage.aiResponse}</span>
                    </div>
                    <div>
                      <span className="font-medium">Recomendação:</span>
                      <span className="text-muted-foreground ml-1">{stage.improvement}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-sm text-blue-800">
          <span className="font-medium">Resumo da jornada para {personas.find(p => p.id === selectedPersona)?.name}:</span> {' '}
          {selectedPersona === 'newCustomer' 
            ? 'Necessário melhorar o posicionamento no estágio de decisão de compra.' 
            : selectedPersona === 'existingCustomer'
            ? 'Boa experiência para utilizadores atuais, com oportunidade de melhorar materiais sobre produtos adicionais.' 
            : 'Necessário fortalecer o posicionamento entre concorrentes e destacar diferencial exclusivo.'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CustomerJourney;
