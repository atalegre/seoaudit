
import React from 'react';
import { Image, Zap, Smartphone, Lock, BrainCircuit, Globe, MessageSquare, AlertTriangle } from 'lucide-react';

interface RecommendationIconProps {
  suggestion: string;
}

const RecommendationIcon: React.FC<RecommendationIconProps> = ({ suggestion }) => {
  const lowerSuggestion = suggestion.toLowerCase();
  
  if (lowerSuggestion.includes('imagem') || lowerSuggestion.includes('image')) {
    return <Image className="h-4 w-4 text-blue-500" />;
  } else if (lowerSuggestion.includes('carregamento') || lowerSuggestion.includes('velocidade') || 
             lowerSuggestion.includes('speed') || lowerSuggestion.includes('performance')) {
    return <Zap className="h-4 w-4 text-orange-500" />;
  } else if (lowerSuggestion.includes('mobile') || lowerSuggestion.includes('móvel')) {
    return <Smartphone className="h-4 w-4 text-green-500" />;
  } else if (lowerSuggestion.includes('https') || lowerSuggestion.includes('segurança') || 
             lowerSuggestion.includes('security')) {
    return <Lock className="h-4 w-4 text-red-500" />;
  } else if (lowerSuggestion.includes('heading') || lowerSuggestion.includes('título') || 
             lowerSuggestion.includes('estrutura')) {
    return <BrainCircuit className="h-4 w-4 text-purple-500" />;
  } else if (lowerSuggestion.includes('meta') || lowerSuggestion.includes('seo') || 
             lowerSuggestion.includes('search')) {
    return <Globe className="h-4 w-4 text-blue-500" />;
  } else if (lowerSuggestion.includes('linguagem') || lowerSuggestion.includes('conteúdo') || 
             lowerSuggestion.includes('parágrafo') || lowerSuggestion.includes('texto')) {
    return <MessageSquare className="h-4 w-4 text-purple-500" />;
  }
  
  return <AlertTriangle className="h-4 w-4 text-amber-500" />;
};

export default RecommendationIcon;
