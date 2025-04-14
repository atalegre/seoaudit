
import { BlogPost } from '@/types/blog';
import { createBlogPost } from '@/utils/supabaseBlogClient';

/**
 * Generate e-commerce blog posts
 * @returns Promise<boolean> indicating success or failure
 */
export const generateEcommercePosts = async (): Promise<boolean> => {
  try {
    // E-commerce topics
    const ecommerceTopics = [
      {
        title: 'Como Otimizar a Taxa de Conversão da Sua Loja Virtual',
        slug: 'otimizar-taxa-conversao-loja-virtual',
        category: 'E-commerce',
        excerpt: 'Estratégias práticas para aumentar a taxa de conversão da sua loja online e maximizar suas vendas.',
        content: 'Conteúdo detalhado sobre como otimizar a taxa de conversão da sua loja virtual...',
        keyLearning: 'Aplique técnicas de CRO para aumentar suas vendas online.',
        tags: ['E-commerce', 'Conversão', 'Vendas']
      },
      {
        title: 'Guia Completo de SEO para E-commerce',
        slug: 'guia-completo-seo-ecommerce',
        category: 'E-commerce',
        excerpt: 'Aprenda a otimizar sua loja virtual para os motores de busca e aumentar o tráfego orgânico.',
        content: 'Conteúdo detalhado sobre SEO para e-commerce...',
        keyLearning: 'Implemente estratégias de SEO específicas para e-commerce.',
        tags: ['E-commerce', 'SEO', 'Tráfego Orgânico']
      },
      {
        title: 'Estratégias de Fidelização de Clientes para E-commerce',
        slug: 'estrategias-fidelizacao-clientes-ecommerce',
        category: 'E-commerce',
        excerpt: 'Descubra como transformar compradores de primeira viagem em clientes fiéis que retornam constantemente.',
        content: 'Conteúdo detalhado sobre estratégias de fidelização de clientes para e-commerce...',
        keyLearning: 'Desenvolva programas de fidelidade eficazes para sua loja virtual.',
        tags: ['E-commerce', 'Fidelização', 'Cliente Recorrente']
      },
      {
        title: 'Tendências de E-commerce para 2025',
        slug: 'tendencias-ecommerce-2025',
        category: 'E-commerce',
        excerpt: 'Fique à frente da concorrência conhecendo as principais tendências que moldarão o comércio eletrônico em 2025.',
        content: 'Conteúdo detalhado sobre tendências de e-commerce para 2025...',
        keyLearning: 'Prepare sua loja para as futuras tendências do mercado online.',
        tags: ['E-commerce', 'Tendências', '2025']
      }
    ];

    // Save each post to the database
    for (const topic of ecommerceTopics) {
      const result = await createBlogPost(topic as BlogPost);
      if (!result) {
        console.error(`Failed to create e-commerce post: ${topic.title}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in generateEcommercePosts:', error);
    return false;
  }
};
