
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, ArrowRight, Search, BarChart3, FileText } from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Como Funciona</h1>
          
          <div className="space-y-12 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">1. Introduza o URL do seu site</h2>
                <p className="text-muted-foreground">
                  Insira o endereço do seu website na página inicial e clique em "Analisar agora gratuitamente" para iniciar o processo.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">2. Análise automática</h2>
                <p className="text-muted-foreground">
                  O nosso sistema irá avaliar o seu site em dois aspectos: otimização para motores de busca (SEO) e para modelos de inteligência artificial (AIO).
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">3. Receba os resultados</h2>
                <p className="text-muted-foreground">
                  Em poucos segundos, apresentamos uma análise detalhada com pontuações e recomendações específicas para melhorar a visibilidade do seu site.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-3">4. Relatório completo</h2>
                <p className="text-muted-foreground">
                  Obtenha um relatório detalhado com todas as recomendações por email, proporcionando um guia prático para otimizar o seu site.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">O que avaliamos</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="text-seo mr-2">SEO</span> 
                    <span>- Otimização para Motores de Busca</span>
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Velocidade de carregamento (desktop e mobile)',
                      'Compatibilidade com dispositivos móveis',
                      'Otimização de imagens',
                      'Estrutura de headings (H1, H2, H3)',
                      'Meta tags e meta descriptions',
                      'Segurança do site (HTTPS)',
                      'Links internos e externos'
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle2 className="h-5 w-5 text-seo mr-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="text-aio mr-2">AIO</span>
                    <span>- Otimização para Inteligência Artificial</span>
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Clareza do conteúdo',
                      'Estrutura lógica da informação',
                      'Legibilidade e fluidez do texto',
                      'Identificação de tópicos e contexto',
                      'Linguagem objetiva e factual',
                      'Deteção de áreas confusas ou irrelevantes',
                      'Acessibilidade do conteúdo para IA'
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle2 className="h-5 w-5 text-aio mr-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
              <p className="mb-6 text-muted-foreground">Analise o seu site agora e descubra como melhorar a sua presença digital.</p>
              <a 
                href="/"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Analisar agora <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
