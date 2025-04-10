
import { useState } from 'react';

export interface SampleRecommendation {
  id: string; // Changed from number | string to just string
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai' | 'seo' | 'aio';
}

/**
 * Hook for handling recommendations based on analysis scores
 */
export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<SampleRecommendation[]>([]);

  /**
   * Generates recommendations based on the scores
   */
  const generateRecommendations = (
    seoScore: number, 
    aioScore: number, 
    performanceScore: number
  ) => {
    const newRecommendations: SampleRecommendation[] = [];
    
    // SEO recommendations
    if (seoScore < 50) {
      newRecommendations.push({
        id: 'seo1',
        title: 'Melhorar tempos de carregamento',
        description: 'O site está lento, especialmente em mobile. Otimize imagens e considere um CDN.',
        type: 'seo',
        impact: 'high'
      });
    }
    
    if (seoScore < 70) {
      newRecommendations.push({
        id: 'seo2',
        title: 'Otimizar meta tags',
        description: 'As meta descrições estão ausentes ou são muito longas. Adicione descrições concisas.',
        type: 'seo',
        impact: 'medium'
      });
    }
    
    if (performanceScore < 60) {
      newRecommendations.push({
        id: 'seo3',
        title: 'Reduzir JavaScript não utilizado',
        description: 'Existe código JavaScript que está bloqueando o carregamento da página.',
        type: 'seo',
        impact: 'medium'
      });
    }
    
    // AIO recommendations
    if (aioScore < 60) {
      newRecommendations.push({
        id: 'aio1',
        title: 'Melhorar estrutura de headings',
        description: 'A hierarquia de H1-H6 não está clara. Reorganize para ajudar modelos de IA a entender o conteúdo.',
        type: 'aio',
        impact: 'high'
      });
    }
    
    if (aioScore < 70) {
      newRecommendations.push({
        id: 'aio2',
        title: 'Adicionar FAQ schema markup',
        description: 'Implemente marcação de dados estruturados para perguntas frequentes para melhorar visibilidade em IA.',
        type: 'aio',
        impact: 'medium'
      });
    }
    
    newRecommendations.push({
      id: 'aio3',
      title: 'Adicionar conteúdo explicativo',
      description: 'Crie textos mais detalhados explicando conceitos-chave que os modelos de IA podem referenciar.',
      type: 'aio',
      impact: 'medium'
    });
    
    // Always add some general recommendations
    newRecommendations.push({
      id: 'general1',
      title: 'Criar página "Sobre"',
      description: 'Adicione uma página detalhada sobre sua empresa e missão para melhorar a presença em modelos de IA.',
      type: 'aio',
      impact: 'low'
    });
    
    newRecommendations.push({
      id: 'general2',
      title: 'Melhorar links internos',
      description: 'Adicione mais links entre páginas relacionadas para melhorar a navegação e indexação.',
      type: 'seo',
      impact: 'medium'
    });
    
    setRecommendations(newRecommendations);
  };

  return {
    recommendations,
    generateRecommendations
  };
}

