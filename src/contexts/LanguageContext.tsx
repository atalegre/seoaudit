
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define available languages
export type Language = 'pt' | 'en';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    'home': 'Home',
    'how-it-works': 'Como Funciona',
    'faq': 'FAQ',
    'blog': 'Blog',
    'contact': 'Contacto',
    'resources': 'Recursos',
    'glossary': 'Glossário',
    'guides': 'Guias',
    'checklist': 'SEO AIO Checklist',
    
    // Auth
    'sign-in': 'Entrar',
    'sign-up': 'Registar',
    'sign-out': 'Sair',
    'dashboard': 'Dashboard',
    
    // Client Page
    'clients': 'Clientes',
    'manage-clients': 'Gerencie seus clientes e acesse seus relatórios',
    'search-clients': 'Pesquisar clientes...',
    'add-client': 'Adicionar Cliente',
    'add-client-soon': 'A adição de clientes será implementada em breve.',
    'feature-in-dev': 'Funcionalidade em desenvolvimento',
    
    // Common
    'last-update': 'Última atualização',
    'never': 'Nunca',
    'active': 'Ativo',
    'critical': 'Crítico',
    'improved': 'Melhorou',
    'healthy': 'Saudável',
    
    // FAQ
    'faq-title': 'Perguntas Frequentes',
    'faq-description': 'Encontre respostas para as dúvidas mais comuns sobre o SEO AI Checker e otimização para motores de busca e IA.',
    'faq-summary': 'Resumo Rápido',
    'faq-more-questions': 'Ainda tem questões?',
    'faq-help-text': 'A nossa equipe está disponível para o ajudar com qualquer dúvida adicional.',
    'faq-contact-us': 'Contacte-nos',
    'faq-analyze-site': 'Analisar site',
    
    // Glossary
    'glossary-title': 'Glossário SEO+AI',
    'glossary-description': 'Definições e explicações dos principais termos de SEO e Inteligência Artificial',
    'glossary-search': 'Procurar por termo...',
    'glossary-terms-found': 'termos encontrados',
    'glossary-term-found': 'termo encontrado',
    'glossary-no-terms': 'Nenhum termo encontrado',
    'glossary-try-again': 'Tente outra pesquisa',
    'glossary-by-letter': 'Navegar por letra',
    'glossary-popular': 'Termos populares',
    'glossary-numbers': 'Números e Símbolos',
    'glossary-about': 'Sobre este Glossário',
    'glossary-about-text': 'Este glossário foi criado para ajudar profissionais de marketing, criadores de conteúdo e empresários a entender os termos técnicos relacionados ao SEO e à otimização para inteligência artificial (AIO).',
    'glossary-evolution': 'Com a evolução dos motores de busca e o crescente papel dos LLMs (Large Language Models) como intermediários de informação, compreender estes conceitos tornou-se essencial para garantir visibilidade online.',
    'glossary-suggestion': 'Sugestão de termo faltando? Entre em',
    'glossary-contact': 'contato',
    'glossary-with-us': 'conosco.',
    
    // Report Form
    'report-title': 'Relatório de Análise',
    'report-name': 'Nome',
    'report-email': 'Email',
    'report-phone': 'Telefone',
    'report-send-email': 'Enviar relatório por email',
    'report-submit': 'Enviar Relatório',
    'report-seo-score': 'Pontuação SEO',
    'report-aio-score': 'Pontuação AIO',
    'report-success': 'Relatório enviado com sucesso!',
    'report-check-email': 'Verifique seu email para acessar o relatório completo.',
    'report-dashboard': 'Ver relatório completo',
    'report-new-analysis': 'Fazer nova análise',
    
    // Contact Page
    'contact-title': 'Entre em contacto connosco',
    'contact-description': 'Tem alguma dúvida sobre os nossos serviços? Quer saber mais sobre como podemos ajudar o seu negócio? Envie-nos uma mensagem e entraremos em contacto consigo o mais brevemente possível.',
    'contact-additional': 'Informações adicionais de contacto',
    'contact-hours': 'Horário de atendimento',
    'contact-hours-weekdays': 'Segunda a Sexta: 9h às 18h',
    'contact-hours-weekend': 'Fins de semana: Fechado',
    'contact-email': 'Email direto',
    
    // Blog Form
    'title': 'Título',
    'post-title': 'Título do post',
    'slug': 'Slug',
    'excerpt': 'Resumo',
    'excerpt-placeholder': 'Breve resumo do artigo para listagens',
    'content': 'Conteúdo (HTML)',
    'content-placeholder': '<h2>Introdução</h2><p>Conteúdo do artigo...</p>',
    'key-learning': 'Aprendizado Chave',
    'key-learning-placeholder': 'O que o leitor deve aprender com este artigo...',
    'category': 'Categoria',
    'select-category': 'Selecione uma categoria',
    'tags': 'Tags',
    'tags-placeholder': 'seo, ai, digital-marketing',
    'tags-help': 'Separe as tags com vírgulas',
    'image': 'Imagem',
    'upload-image': 'Carregar imagem',
    'change-image': 'Alterar imagem',
    'remove-image': 'Remover imagem',
    'drag-drop': 'Arraste e solte uma imagem ou clique para selecionar',
    'accepted-formats': 'Formatos aceitos: JPG, PNG, WebP, máx 2MB',
    'cancel': 'Cancelar',
    'saving': 'Salvando...',
    'update-post': 'Atualizar Post',
    'create-post': 'Criar Post',
    
    // Footer
    'footer-description': 'Otimize o seu site para motores de busca e modelos de IA.',
    'navigation': 'Navegação',
    'legal': 'Legal',
    'terms': 'Termos e Condições',
    'privacy': 'Política de Privacidade',
    'contact': 'Contacto',
    'rights-reserved': 'Todos os direitos reservados.',
    
    // Verification
    'verify-email': 'Verifique o seu email',
    'verify-sent': 'Enviámos um link de verificação para',
    'verify-click': 'Por favor clique no link enviado para o email para verificar a sua conta.',
    'verify-next': 'O que fazer a seguir:',
    'verify-step1': 'Verifique a sua caixa de entrada de email (e a pasta de spam)',
    'verify-step2': 'Clique no link "Confirmar conta" no email recebido',
    'verify-step3': 'Você será redirecionado automaticamente após a verificação',
    'verify-no-email': 'Não recebeu o email?',
    'verify-check-spam': 'Verifique a sua pasta de spam ou lixo eletrónico',
    'verify-add-contact': 'Adicione no-reply@seoaudit.pt aos seus contactos',
    'verify-wait': 'Aguarde alguns minutos, pois os emails podem demorar a chegar',
    'verify-resend': 'Reenviar email de verificação',
    'verify-resending': 'A reenviar...',
    'verify-email-sent': 'Email Enviado',
    'verify-email-success': 'Email reenviado com sucesso. Por favor verifique a sua caixa de entrada e pasta de spam.',
  },
  en: {
    // Navigation
    'home': 'Home',
    'how-it-works': 'How It Works',
    'faq': 'FAQ',
    'blog': 'Blog',
    'contact': 'Contact',
    'resources': 'Resources',
    'glossary': 'Glossary',
    'guides': 'Guides',
    'checklist': 'SEO AIO Checklist',
    
    // Auth
    'sign-in': 'Sign In',
    'sign-up': 'Sign Up',
    'sign-out': 'Sign Out',
    'dashboard': 'Dashboard',
    
    // Client Page
    'clients': 'Clients',
    'manage-clients': 'Manage your clients and access their reports',
    'search-clients': 'Search clients...',
    'add-client': 'Add Client',
    'add-client-soon': 'Client addition will be implemented soon.',
    'feature-in-dev': 'Feature in development',
    
    // Common
    'last-update': 'Last update',
    'never': 'Never',
    'active': 'Active',
    'critical': 'Critical',
    'improved': 'Improved',
    'healthy': 'Healthy',
    
    // FAQ
    'faq-title': 'Frequently Asked Questions',
    'faq-description': 'Find answers to the most common questions about SEO AI Checker and optimization for search engines and AI.',
    'faq-summary': 'Quick Summary',
    'faq-more-questions': 'Still have questions?',
    'faq-help-text': 'Our team is available to help you with any additional questions.',
    'faq-contact-us': 'Contact Us',
    'faq-analyze-site': 'Analyze site',
    
    // Glossary
    'glossary-title': 'SEO+AI Glossary',
    'glossary-description': 'Definitions and explanations of key SEO and Artificial Intelligence terms',
    'glossary-search': 'Search for term...',
    'glossary-terms-found': 'terms found',
    'glossary-term-found': 'term found',
    'glossary-no-terms': 'No terms found',
    'glossary-try-again': 'Try another search',
    'glossary-by-letter': 'Browse by letter',
    'glossary-popular': 'Popular terms',
    'glossary-numbers': 'Numbers and Symbols',
    'glossary-about': 'About this Glossary',
    'glossary-about-text': 'This glossary was created to help marketing professionals, content creators, and business owners understand the technical terms related to SEO and Artificial Intelligence Optimization (AIO).',
    'glossary-evolution': 'With the evolution of search engines and the growing role of LLMs (Large Language Models) as information intermediaries, understanding these concepts has become essential to ensure online visibility.',
    'glossary-suggestion': 'Missing term suggestion? Get in',
    'glossary-contact': 'contact',
    'glossary-with-us': 'with us.',
    
    // Report Form
    'report-title': 'Analysis Report',
    'report-name': 'Name',
    'report-email': 'Email',
    'report-phone': 'Phone',
    'report-send-email': 'Send report by email',
    'report-submit': 'Submit Report',
    'report-seo-score': 'SEO Score',
    'report-aio-score': 'AIO Score',
    'report-success': 'Report sent successfully!',
    'report-check-email': 'Check your email to access the full report.',
    'report-dashboard': 'View full report',
    'report-new-analysis': 'New analysis',
    
    // Contact Page
    'contact-title': 'Contact Us',
    'contact-description': 'Do you have any questions about our services? Want to know more about how we can help your business? Send us a message and we will get back to you as soon as possible.',
    'contact-additional': 'Additional contact information',
    'contact-hours': 'Office hours',
    'contact-hours-weekdays': 'Monday to Friday: 9am to 6pm',
    'contact-hours-weekend': 'Weekends: Closed',
    'contact-email': 'Direct email',
    
    // Blog Form
    'title': 'Title',
    'post-title': 'Post title',
    'slug': 'Slug',
    'excerpt': 'Excerpt',
    'excerpt-placeholder': 'Brief summary of the article for listings',
    'content': 'Content (HTML)',
    'content-placeholder': '<h2>Introduction</h2><p>Article content...</p>',
    'key-learning': 'Key Learning',
    'key-learning-placeholder': 'What the reader should learn from this article...',
    'category': 'Category',
    'select-category': 'Select a category',
    'tags': 'Tags',
    'tags-placeholder': 'seo, ai, digital-marketing',
    'tags-help': 'Separate tags with commas',
    'image': 'Image',
    'upload-image': 'Upload image',
    'change-image': 'Change image',
    'remove-image': 'Remove image',
    'drag-drop': 'Drag and drop an image or click to select',
    'accepted-formats': 'Accepted formats: JPG, PNG, WebP, max 2MB',
    'cancel': 'Cancel',
    'saving': 'Saving...',
    'update-post': 'Update Post',
    'create-post': 'Create Post',
    
    // Footer
    'footer-description': 'Optimize your website for search engines and AI models.',
    'navigation': 'Navigation',
    'legal': 'Legal',
    'terms': 'Terms and Conditions',
    'privacy': 'Privacy Policy',
    'contact': 'Contact',
    'rights-reserved': 'All rights reserved.',
    
    // Verification
    'verify-email': 'Verify your email',
    'verify-sent': 'We sent a verification link to',
    'verify-click': 'Please click on the link sent to your email to verify your account.',
    'verify-next': 'What to do next:',
    'verify-step1': 'Check your email inbox (and spam folder)',
    'verify-step2': 'Click on the "Confirm account" link in the received email',
    'verify-step3': 'You will be automatically redirected after verification',
    'verify-no-email': 'Didn\'t receive the email?',
    'verify-check-spam': 'Check your spam or junk email folder',
    'verify-add-contact': 'Add no-reply@seoaudit.pt to your contacts',
    'verify-wait': 'Wait a few minutes, as emails may take time to arrive',
    'verify-resend': 'Resend verification email',
    'verify-resending': 'Resending...',
    'verify-email-sent': 'Email Sent',
    'verify-email-success': 'Email resent successfully. Please check your inbox and spam folder.',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');
  
  useEffect(() => {
    // Try to detect user's language preference from browser or localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    
    if (storedLanguage && (storedLanguage === 'pt' || storedLanguage === 'en')) {
      setLanguageState(storedLanguage);
    } else {
      // Check if user is from Portugal using time zone as an approximation
      // This is a simplified approach - a more accurate method would use geolocation APIs
      detectUserLanguage().then(detectedLanguage => {
        setLanguageState(detectedLanguage);
        localStorage.setItem('language', detectedLanguage);
      });
    }
  }, []);
  
  // Function to detect user language based on timezone or navigator language
  const detectUserLanguage = async (): Promise<Language> => {
    try {
      // First try to use the browser's language
      const browserLang = navigator.language.toLowerCase();
      
      // Check if from a Portuguese-speaking region
      if (browserLang.startsWith('pt') || 
          (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Lisbon')) {
        return 'pt';
      }
      
      // Default to English for non-Portuguese visitors
      return 'en';
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en'; // Default to English on error
    }
  };
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
