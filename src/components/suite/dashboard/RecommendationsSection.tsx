
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import RecommendationCard from '@/components/suite/dashboard/RecommendationCard';
import { ArrowRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import LoginDialog from '@/components/auth/LoginDialog';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'technical' | 'content' | 'structure' | 'ai';
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  onViewMore: () => void;
}

const RecommendationsSection = ({ recommendations, onViewMore }: RecommendationsSectionProps) => {
  const { user } = useUser();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const handleViewMoreClick = () => {
    if (user) {
      // User is logged in, proceed to view more
      onViewMore();
    } else {
      // User is not logged in, show login dialog
      setShowLoginDialog(true);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recomendações Principais</h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewMoreClick}
        >
          Ver todas 
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map(rec => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            description={rec.description}
            impact={rec.impact}
            type={rec.type}
            onLearnMore={handleViewMoreClick}
          />
        ))}
      </div>

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={() => setShowLoginDialog(false)}
        returnTo="/suite/recommendations"
      />
    </div>
  );
};

export default RecommendationsSection;
