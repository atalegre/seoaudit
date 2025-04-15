
import { BlogPost } from '@/types/blog';
import { createBlogPost } from '@/utils/blog/postOperations';

// Generate a marketing-related blog post
export const generateEcommercePost = async (storeType: string, industry: string): Promise<BlogPost | null> => {
  try {
    // Simulate fetching content from an AI service
    const postContent = await fetchAIServiceContent(storeType, industry);

    if (!postContent) {
      console.error('Failed to fetch content from AI service.');
      return null;
    }

    // Create a BlogPost object
    const blogPost: BlogPost = {
      title: {
        pt: `Estratégias de E-commerce para ${industry} em ${storeType}`,
        en: `E-commerce Strategies for ${industry} in ${storeType}`
      },
      slug: `ecommerce-strategies-${industry.toLowerCase().replace(/\s+/g, '-')}-${storeType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      excerpt: {
        pt: `Descubra as melhores práticas de e-commerce para lojas de ${industry} em ${storeType}.`,
        en: `Discover e-commerce best practices for ${industry} stores in ${storeType}.`
      },
      content: {
        pt: postContent.pt,
        en: postContent.en
      },
      keyLearning: {
        pt: `Aprenda a otimizar sua loja de ${industry} para melhores resultados em ambientes ${storeType}.`,
        en: `Learn how to optimize your ${industry} store for better results in ${storeType} environments.`
      },
      category: 'E-commerce',
      tags: [industry, 'e-commerce', storeType, 'SEO'],
      date: new Date().toISOString().split('T')[0]
    };
    
    // Create the blog post using the createBlogPost function
    const createdPost = await createBlogPost(blogPost);
    return createdPost;
  } catch (error) {
    console.error('Error generating e-commerce post:', error);
    return null;
  }
};

// Simulate fetching content from an AI service
const fetchAIServiceContent = async (storeType: string, industry: string): Promise<{ pt: string; en: string; } | null> => {
  // Simulate the AI content generation process
  const ptContent = `
    <h2>Estratégias de E-commerce para ${industry} em ${storeType}</h2>
    <p>Este artigo explora as melhores práticas de e-commerce para lojas de ${industry} em ambientes ${storeType}.</p>
    <p>Inclui dicas sobre otimização de produtos, experiência do usuário e estratégias de marketing digital.</p>
  `;

  const enContent = `
    <h2>E-commerce Strategies for ${industry} in ${storeType}</h2>
    <p>This article explores the best e-commerce practices for ${industry} stores in ${storeType} environments.</p>
    <p>It includes tips on product optimization, user experience, and digital marketing strategies.</p>
  `;

  return { pt: ptContent, en: enContent };
};

// For compatibility with imports expecting generateEcommercePosts (plural)
export const generateEcommercePosts = generateEcommercePost;
