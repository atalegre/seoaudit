import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight } from 'lucide-react';

const FAQPage = () => {
  const { language, t } = useLanguage();
  
  const faqs = {
    pt: [
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
        answer: "Após receber o relatório completo por email, você pode entrar em contato com nossa equipe de especialistas que oferece serviços de consultoria e implementação para ajudar a melhorar seu site conforme as recomendações fornecidas. Basta responder ao email do relatório ou utilizar nosso formulário de contacto."
      },
      {
        question: "O que é Schema Markup e por que é importante?",
        answer: "Schema Markup é um código semântico que você adiciona ao seu HTML para ajudar os motores de busca a entender melhor o conteúdo do seu site. É especialmente importante para a otimização de IA, pois fornece contexto estruturado que os sistemas de IA podem interpretar com mais precisão, melhorando a visibilidade em resultados de pesquisa semântica."
      },
      {
        question: "Como a IA está mudando os motores de busca?",
        answer: "Os motores de busca estão evoluindo de simples indexadores para assistentes inteligentes que respondem perguntas e compreendem contextos. Estão priorizando conteúdo que responde diretamente às perguntas dos usuários e é otimizado para interpretação por IA. Esta mudança torna a otimização para IA (AIO) tão importante quanto o SEO tradicional para garantir visibilidade."
      }
    ],
    en: [
      {
        question: "What is SEO AI Checker?",
        answer: "SEO AI Checker is a free online tool that analyzes websites in two dimensions: search engine optimization (SEO) and artificial intelligence optimization (AIO). The tool provides valuable insights to improve the visibility and effectiveness of your site in both contexts."
      },
      {
        question: "How does the SEO analysis work?",
        answer: "The SEO analysis evaluates various technical and content aspects of your site, such as loading speed, mobile compatibility, heading structure, meta tags, HTTPS security, among other factors that affect positioning in search engines like Google."
      },
      {
        question: "What does AI optimization (AIO) mean?",
        answer: "AI optimization, or AIO, refers to how artificial intelligence models interpret and understand your site's content. This includes aspects such as text clarity, logical information structure, objective and factual language, and content organization in a way that AI systems can understand and properly value."
      },
      {
        question: "Why should I care about AI optimization?",
        answer: "With the increasing use of virtual assistants and AI-based search engines, optimization for these systems becomes increasingly important. AI-optimized sites are more likely to be recommended by virtual assistants and appear in AI-based search results, increasing their visibility and reach."
      },
      {
        question: "Is the service really free?",
        answer: "Yes, the basic analysis of SEO AI Checker is completely free and without commitment. For more detailed analyses or personalized consultations, we offer premium services that can be discussed after the initial analysis."
      },
      {
        question: "How can I improve my site's score?",
        answer: "After the analysis, you will receive a report with specific recommendations to improve both the SEO and AIO of your site. These may include technical improvements, content adjustments, or structural optimizations. Implementing these recommendations will help improve the scores and visibility of your site."
      },
      {
        question: "How often should I analyze my site?",
        answer: "We recommend performing regular analyses, ideally every 3-6 months, or after implementing significant changes to your site. This helps monitor progress and identify new optimization opportunities, especially considering that SEO and AI algorithms are constantly evolving."
      },
      {
        question: "Are the analysis results accurate?",
        answer: "Our tool uses advanced methodologies and updated parameters to evaluate websites. However, SEO and AIO involve many variables and algorithms are always evolving. The results should be considered as valuable guidance, but may vary according to the specificities of your site and changes in algorithms."
      },
      {
        question: "Why do I receive different scores for SEO and AIO?",
        answer: "SEO and AIO evaluate different aspects of online presence. A site may be well optimized for traditional search engines, but not necessarily for AI systems, and vice versa. The different scores help identify specific areas that need attention in each context."
      },
      {
        question: "How can I get help implementing the recommendations?",
        answer: "After receiving the full report by email, you can contact our team of experts who offer consulting and implementation services to help improve your site according to the recommendations provided. Simply reply to the report email or use our contact form."
      },
      {
        question: "What is Schema Markup and why is it important?",
        answer: "Schema Markup is semantic code that you add to your HTML to help search engines better understand your site's content. It's especially important for AI optimization as it provides structured context that AI systems can interpret more accurately, improving visibility in semantic search results."
      },
      {
        question: "How is AI changing search engines?",
        answer: "Search engines are evolving from simple indexers to intelligent assistants that answer questions and understand contexts. They are prioritizing content that directly answers users' questions and is optimized for AI interpretation. This change makes AI optimization (AIO) as important as traditional SEO to ensure visibility."
      }
    ]
  };

  const currentFaqs = language === 'pt' ? faqs.pt : faqs.en;

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": currentFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    script.textContent = JSON.stringify(faqStructuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [currentFaqs]);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{t('faq-title')} | SEO AI Checker</title>
        <meta name="description" content={t('faq-description')} />
        <meta name="keywords" content={language === 'pt' ? 
          "FAQ, perguntas frequentes, SEO, AIO, otimização para IA, SEO AI Checker" : 
          "FAQ, frequently asked questions, SEO, AIO, AI optimization, SEO AI Checker"} />
        <link rel="canonical" href="https://seoaichecker.com/faq" />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">{t('home')}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('faq-title')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('faq-title')}</h1>
            <p className="text-lg text-muted-foreground">{t('faq-description')}</p>
          </div>
          
          <div className="mb-8 p-4 border rounded-lg bg-secondary/20">
            <h2 className="text-lg font-semibold mb-2">{t('faq-summary')}</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{t('faq-summary-1')}</li>
              <li>{t('faq-summary-2')}</li>
              <li>{t('faq-summary-3')}</li>
              <li>{t('faq-summary-4')}</li>
            </ul>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {currentFaqs.map((faq, index) => (
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
            <h2 className="text-2xl font-bold mb-4">{t('faq-more-questions')}</h2>
            <p className="mb-6 text-muted-foreground">{t('faq-help-text')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={language === 'pt' ? '/contacto' : '/contact'} 
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                {t('faq-contact-us')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors"
              >
                {t('faq-analyze-site')}
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
