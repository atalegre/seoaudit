
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      question: "O que é o SEO AI Checker?",
      answer: "O SEO AI Checker é uma ferramenta online gratuita que analisa websites em duas dimensões: otimização para motores de busca (SEO) e otimização para modelos de inteligência artificial (AIO). A ferramenta oferece insights valiosos para melhorar a visibilidade e eficácia do seu site em ambos os contextos."
    },
    {
      question: "Como funciona a análise de SEO?",
      answer: "A análise de SEO avalia diversos aspectos técnicos e de conteúdo do seu site, como velocidade de carregamento, compatibilidade com dispositivos móveis, estrutura de headings, meta tags, segurança HTTPS, entre outros fatores que afetam o posicionamento nos motores de busca como o Google."
    },
    {
      question: "O que significa a otimização para IA (AIO)?",
      answer: "A otimização para IA, ou AIO (AI Optimization), refere-se a como os modelos de inteligência artificial interpretam e compreendem o conteúdo do seu site. Isso inclui aspectos como clareza do texto, estrutura lógica da informação, linguagem objetiva e factual, e organização do conteúdo de forma que os sistemas de IA possam entender e valorizar adequadamente."
    },
    {
      question: "Por que devo me preocupar com a otimização para IA?",
      answer: "Com o crescente uso de assistentes virtuais e motores de busca baseados em IA, a otimização para esses sistemas torna-se cada vez mais importante. Sites otimizados para IA têm maior probabilidade de serem recomendados por assistentes virtuais e aparecerem em resultados de busca baseados em IA, aumentando sua visibilidade e alcance."
    },
    {
      question: "O serviço é realmente gratuito?",
      answer: "Sim, a análise básica do SEO AI Checker é completamente gratuita e sem compromisso. Para análises mais detalhadas ou consultorias personalizadas, oferecemos serviços premium que podem ser discutidos após a análise inicial."
    },
    {
      question: "Como posso melhorar a pontuação do meu site?",
      answer: "Após a análise, você receberá um relatório com recomendações específicas para melhorar tanto o SEO quanto o AIO do seu site. Estas podem incluir melhorias técnicas, ajustes no conteúdo, ou otimizações estruturais. Implementar essas recomendações ajudará a melhorar as pontuações e a visibilidade do seu site."
    },
    {
      question: "Com que frequência devo analisar o meu site?",
      answer: "Recomendamos realizar análises regulares, idealmente a cada 3-6 meses, ou após implementar mudanças significativas no seu site. Isso ajuda a monitorar o progresso e identificar novas oportunidades de otimização, especialmente considerando que os algoritmos de SEO e IA estão em constante evolução."
    },
    {
      question: "Os resultados da análise são precisos?",
      answer: "Nossa ferramenta utiliza metodologias avançadas e parâmetros atualizados para avaliar sites. No entanto, SEO e AIO envolvem muitas variáveis e os algoritmos estão sempre evoluindo. Os resultados devem ser considerados como orientações valiosas, mas podem variar conforme as especificidades do seu site e as mudanças nos algoritmos."
    },
    {
      question: "Por que recebo pontuações diferentes para SEO e AIO?",
      answer: "SEO e AIO avaliam aspectos diferentes da presença online. Um site pode estar bem otimizado para motores de busca tradicionais, mas não necessariamente para sistemas de IA, e vice-versa. As pontuações diferentes ajudam a identificar áreas específicas que precisam de atenção em cada contexto."
    },
    {
      question: "Como posso obter ajuda para implementar as recomendações?",
      answer: "Após receber o relatório completo por email, você pode entrar em contacto com nossa equipe de especialistas que oferece serviços de consultoria e implementação para ajudar a melhorar seu site conforme as recomendações fornecidas. Basta responder ao email do relatório ou utilizar nosso formulário de contacto."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Perguntas Frequentes</h1>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 shadow-sm"
              >
                <AccordionTrigger className="text-lg font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 bg-slate-50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda tem questões?</h2>
            <p className="mb-6 text-muted-foreground">A nossa equipe está disponível para o ajudar com qualquer dúvida adicional.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto" 
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Contacte-nos <ArrowRight className="h-4 w-4" />
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors"
              >
                Analisar site
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
