
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserOnboardingCard from './onboarding/UserOnboardingCard';
import OnboardingProgress from './onboarding/OnboardingProgress';
import OnboardingStepsList from './onboarding/OnboardingStepsList';
import { useOnboardingSteps } from './onboarding/useOnboardingSteps';
import { toast } from 'sonner';

interface UserOnboardingProps {
  userName?: string;
  onClose: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ userName, onClose }) => {
  const navigate = useNavigate();
  const { steps, completedSteps, totalSteps, markStepAsComplete } = useOnboardingSteps();

  const handleStepClick = (step: any) => {
    // If it's profile step, navigate to the profile page
    if (step.id === 'profile') {
      navigate('/suite/profile');
    } 
    // If it's content step, navigate to the writer
    else if (step.id === 'content') {
      navigate('/suite/writer');
    }
    // For any other step, just mark it as completed
    else {
      toast.info(`Etapa "${step.title}" em progresso`, {
        description: "Continue a explorar a plataforma."
      });
    }
    
    // Mark the step as complete
    markStepAsComplete(step.id);
  };

  return (
    <UserOnboardingCard userName={userName} onClose={onClose}>
      <OnboardingProgress 
        completedSteps={completedSteps} 
        totalSteps={totalSteps} 
      />
      
      <OnboardingStepsList 
        steps={steps} 
        onStepClick={handleStepClick} 
      />
    </UserOnboardingCard>
  );
};

export default UserOnboarding;
