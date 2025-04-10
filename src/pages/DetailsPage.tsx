
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Database, Zap, BarChart3, Sparkles, Search } from 'lucide-react';

const DetailsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Como o SEOaudit.pt funciona</h1>
            <p className="text-lg text-gray-600 mb-12 text-center">
              Nossa plataforma oferece uma solução completa para otimização de websites, tanto para motores de busca tradicionais quanto para novas plataformas de IA.
            </p>
            
            <Tabs defaultValue="seo" className="mb-12">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="seo">SEO Tradicional</TabsTrigger>
                <TabsTrigger value="ai">IA Optimization</TabsTrigger>
                <TabsTrigger value="tools">Ferramentas Avançadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="seo" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="text-blue-600" />
                      Análise SEO Completa
                    </CardTitle>
                    <CardDescription>
                      Entenda como seu site é avaliado pelos motores de busca
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 text-lg">O que analisamos:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Core Web Vitals (LCP, FID, CLS) em dispositivos móveis e desktop</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Estrutura de meta tags, headings e conteúdo</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Verificação de problemas técnicos como redirecionamentos e links quebrados</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Otimização para dispositivos móveis e velocidade de carregamento</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 text-lg">Benefícios:</h3>
                        <p className="text-gray-700">
                          Nossa análise SEO completa ajuda a identificar problemas técnicos que podem estar impedindo seu site de alcançar melhores posições nos resultados de busca. Com recomendações personalizadas, você pode implementar melhorias que aumentarão sua visibilidade orgânica.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="text-purple-600" />
                      Otimização para Plataformas de IA
                    </CardTitle>
                    <CardDescription>
                      Prepare seu conteúdo para a nova era das pesquisas baseadas em IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 text-lg">O que analisamos:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Como ChatGPT, Perplexity e Meta AI interpretam seu conteúdo</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Identificação de informações desatualizadas nas plataformas de IA</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Análise competitiva de como sua marca aparece em comparação com concorrentes</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Mapeamento da jornada do cliente em consultas relacionadas ao seu negócio</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 text-lg">Benefícios:</h3>
                        <p className="text-gray-700">
                          Com o crescimento das consultas baseadas em IA, é essencial garantir que sua marca seja apresentada corretamente. Nossa ferramenta ajuda a identificar e corrigir informações incorretas, melhorar a presença da sua marca em modelos de IA e entender como os clientes interagem com seu negócio através dessas novas plataformas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tools" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="text-amber-600" />
                      Ferramentas Avançadas
                    </CardTitle>
                    <CardDescription>
                      Recursos exclusivos para impulsionar sua estratégia digital
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 text-lg">Nossas ferramentas:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Gerador de conteúdo otimizado para SEO e IA</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Pesquisa de palavras-chave com volume de buscas e dificuldade</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Monitoramento de presença em diretórios locais</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Dashboard completo com métricas e recomendações personalizadas</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2 text-lg">Benefícios:</h3>
                        <p className="text-gray-700">
                          Nossas ferramentas avançadas ajudam a economizar tempo e recursos, permitindo que você se concentre no crescimento do seu negócio. Com acesso a recursos de geração de conteúdo, pesquisa de palavras-chave e monitoramento contínuo, você pode implementar estratégias eficazes de marketing digital com facilidade.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Comece agora mesmo</h2>
              <p className="mb-6">
                Experimente nossa análise gratuita e descubra como podemos ajudar a melhorar a presença digital do seu negócio.
              </p>
              <div className="flex justify-center">
                <div className="relative max-w-md w-full">
                  <input
                    type="url"
                    placeholder="https://seusite.com"
                    className="w-full pr-16 pl-10 py-3 border border-gray-300 rounded-md shadow-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700"
                  >
                    Analisar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DetailsPage;
