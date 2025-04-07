
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é otimização para IA (AIO)?",
    answer: "A otimização para IA (AIO) é o processo de adaptar o conteúdo e a estrutura do seu site para ser melhor compreendido pelos novos modelos de inteligência artificial como ChatGPT, Claude e Bard. Isso envolve organizar o conteúdo de forma clara, fornecer contexto adequado e garantir que a informação seja precisa e confiável."
  },
  {
    question: "Qual a diferença entre SEO e AIO?",
    answer: "Enquanto o SEO (Search Engine Optimization) foca em otimizar seu site para os algoritmos tradicionais de busca como Google, o AIO (AI Optimization) prepara seu conteúdo para os novos modelos de linguagem que estão sendo usados em ferramentas de IA conversacionais e que obtêm informações de forma diferente dos buscadores tradicionais."
  },
  {
    question: "A ferramenta é mesmo gratuita?",
    answer: "Sim, a ferramenta básica de análise é totalmente gratuita e sem limitações. Oferecemos também planos premium com recursos avançados, monitoramento contínuo e consultoria personalizada para quem precisa de análises mais profundas."
  },
  {
    question: "Quanto tempo demora a análise?",
    answer: "A análise básica é quase instantânea, levando apenas alguns segundos. Análises mais profundas que verificam todos os aspectos do site podem levar até 2 minutos, dependendo do tamanho e complexidade do site."
  },
  {
    question: "Como posso melhorar meu site após a análise?",
    answer: "A análise fornece recomendações práticas e direcionadas que você pode implementar imediatamente. Para cada problema identificado, oferecemos sugestões específicas de correção. Nossos planos premium incluem ainda relatórios detalhados e consultoria para implementação das melhorias."
  }
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossa ferramenta de análise
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
