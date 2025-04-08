
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BarChart3, 
  FileText, 
  Sparkles, 
  Cpu,
  Shield,
  Zap,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorksPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-6">Como funciona o SEOAudit</h1>
              <p className="text-xl text-gray-600 mb-8">
                Conheça o processo passo a passo da nossa ferramenta de análise para otimização de websites para motores de busca e inteligência artificial.
              </p>
            </div>
          </div>
        </div>
        
        {/* Process Steps */}
        <div className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-20">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">1</div>
                      <h2 className="text-2xl font-bold">Introduza o URL do seu site</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Na página inicial, insira o endereço do seu website no campo de pesquisa e clique em "Analisar". Nossa ferramenta aceita qualquer domínio público acessível, sem necessidade de instalação de software adicional.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">Análise disponível para qualquer website público</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">Processamento imediato sem fila de espera</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 bg-gray-50 p-8 rounded-xl">
                    <div className="relative">
                      <div className="border rounded-lg bg-white shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Search className="h-5 w-5 text-gray-400" />
                          <div className="h-10 bg-gray-100 rounded flex-1 px-4 py-2 text-gray-500">
                            www.seusite.pt
                          </div>
                          <Button size="sm">Analisar</Button>
                        </div>
                        <div className="text-xs text-gray-500 flex gap-4 justify-center">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                            Análise gratuita
                          </span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                            Resultados rápidos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2 order-2 md:order-1 bg-gray-50 p-8 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded shadow-sm">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                          <h4 className="font-medium">Análise SEO</h4>
                        </div>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-blue-600 rounded-full w-[75%]"></div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-bold">75</span>/100
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded shadow-sm">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                          <h4 className="font-medium">Análise AIO</h4>
                        </div>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-purple-600 rounded-full w-[68%]"></div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-bold">68</span>/100
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded shadow-sm col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Pontuação global</h4>
                          <span className="text-amber-600 text-sm font-medium">Precisa melhorar</span>
                        </div>
                        <div className="mt-2 h-3 bg-gray-100 rounded-full">
                          <div className="h-3 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[72%]"></div>
                        </div>
                        <div className="mt-2 text-center text-lg">
                          <span className="font-bold">72</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 order-1 md:order-2">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">2</div>
                      <h2 className="text-2xl font-bold">Análise automática em dupla dimensão</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Nosso sistema analisa automaticamente seu site sob duas perspectivas essenciais no ambiente digital atual:
                    </p>
                    <ul className="mt-4 space-y-4">
                      <li className="flex items-start">
                        <div className="rounded-full bg-blue-50 p-1.5 text-blue-600 mr-3 mt-0.5">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">SEO - Otimização para Motores de Busca</span>
                          <span className="text-gray-600 text-sm">Avaliaremos mais de 20 métricas técnicas importantes para o Google e outros buscadores.</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-purple-50 p-1.5 text-purple-600 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">AIO - Otimização para Inteligência Artificial</span>
                          <span className="text-gray-600 text-sm">Analisamos como modelos como ChatGPT interpretam e avaliam seu conteúdo, crucial para visibilidade futura.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">3</div>
                      <h2 className="text-2xl font-bold">Receba recomendações personalizadas</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Nossa ferramenta não apenas identifica problemas, mas fornece recomendações acionáveis para melhorar a pontuação do seu site em ambas as dimensões:
                    </p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">Recomendações técnicas para SEO com nível de prioridade</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">Sugestões para melhorar a legibilidade e estrutura para IA</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600">Orientações específicas para cada página analisada</span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 bg-gray-50 p-8 rounded-xl">
                    <div className="bg-white p-4 rounded shadow-sm mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Shield className="h-5 w-5 text-amber-500" />
                          <h4 className="font-medium">Melhorar HTTPS e segurança</h4>
                        </div>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Alta prioridade</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Detecção de conteúdo misto no site. Garanta que todos os recursos (scripts, imagens) sejam carregados via HTTPS.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Cpu className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">Estruturação para IA</h4>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Média prioridade</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Adicione cabeçalhos (H2, H3) mais descritivos para os principais tópicos que melhoram a interpretação do conteúdo pela IA.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2 order-2 md:order-1 bg-gray-50 p-8 rounded-xl">
                    <div className="bg-white p-6 rounded shadow-sm">
                      <div className="flex items-center justify-center mb-6">
                        <FileText className="h-12 w-12 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-medium text-center mb-2">Relatório completo enviado para seu email</h4>
                      <div className="border-t my-4"></div>
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Análise detalhada página a página</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Lista completa de recomendações</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Guia passo a passo para implementação</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>Acesso ao dashboard para acompanhamento</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="md:w-1/2 order-1 md:order-2">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">4</div>
                      <h2 className="text-2xl font-bold">Relatório completo e dashboard</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Obtenha um relatório detalhado por email e acesso ao nosso dashboard para monitorar o progresso ao longo do tempo:
                    </p>
                    <ul className="space-y-4 mt-4">
                      <li className="flex items-start">
                        <div className="rounded-full bg-green-50 p-1.5 text-green-600 mr-3 mt-0.5">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Relatório detalhado por email</span>
                          <span className="text-gray-600 text-sm">Receba um PDF completo com todas as análises e recomendações para referência.</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-blue-50 p-1.5 text-blue-600 mr-3 mt-0.5">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Dashboard de monitoramento</span>
                          <span className="text-gray-600 text-sm">Acesse ferramenta online para acompanhar evolução e verificar novas recomendações.</span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-purple-50 p-1.5 text-purple-600 mr-3 mt-0.5">
                          <Lightbulb className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Ferramentas adicionais</span>
                          <span className="text-gray-600 text-sm">Acesso a ferramentas como gerador de conteúdo IA, verificador de diretórios e mais.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* What We Analyze Section */}
        <div className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">O que avaliamos</h2>
              
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="rounded-full bg-blue-100 p-2 mr-3">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold">SEO - Otimização para Motores de Busca</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    {[
                      'Velocidade de carregamento (desktop e mobile)',
                      'Compatibilidade com dispositivos móveis',
                      'Otimização de imagens e recursos',
                      'Estrutura de headings (H1, H2, H3)',
                      'Meta tags e meta descriptions',
                      'Segurança do site (HTTPS)',
                      'Links internos e externos',
                      'Schema markup e dados estruturados',
                      'Oportunidades de Core Web Vitals',
                      'Textos alternativos em imagens'
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center mb-6">
                    <div className="rounded-full bg-purple-100 p-2 mr-3">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold">AIO - Otimização para Inteligência Artificial</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    {[
                      'Clareza do conteúdo para modelos de IA',
                      'Estrutura lógica da informação',
                      'Legibilidade e fluidez do texto',
                      'Identificação de tópicos e contexto',
                      'Linguagem objetiva e factual',
                      'Deteção de áreas confusas ou irrelevantes',
                      'Acessibilidade do conteúdo para IA',
                      'Consistência da terminologia',
                      'Qualidade das definições e explicações',
                      'Organização hierárquica da informação'
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle2 className="h-5 w-5 text-purple-600 mr-3 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits Section */}
        <div className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Por que escolher o SEOAudit?</h2>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Nossa plataforma foi desenvolvida por especialistas em SEO e IA, combinando o melhor de ambos os mundos para potencializar a sua presença digital.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Análise dupla exclusiva</h3>
                  <p className="text-gray-600">
                    Somos os únicos a oferecer análise combinada de SEO tradicional e otimização para IA em uma única ferramenta.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="rounded-full bg-green-100 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Recomendações práticas</h3>
                  <p className="text-gray-600">
                    Fornecemos orientações específicas e implementáveis que realmente impactam seu desempenho nos buscadores e modelos de IA.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="rounded-full bg-amber-100 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ferramenta completa</h3>
                  <p className="text-gray-600">
                    Além da análise, oferecemos ferramentas para criação de conteúdo, pesquisa de palavras-chave e monitoramento contínuo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-12 bg-blue-50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para analisar seu site?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Descubra como o seu website está a performar para motores de busca e IA, de forma totalmente gratuita.
              </p>
              <Button size="lg" className="px-8" asChild>
                <a href="/">
                  Analisar meu site <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
