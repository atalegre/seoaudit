
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserOnboardingCard from './onboarding/UserOnboardingCard';
import OnboardingProgress from './onboarding/OnboardingProgress';
import OnboardingStepsList from './onboarding/OnboardingStepsList';
import { useOnboardingSteps } from './onboarding/useOnboardingSteps';

interface UserOnboardingProps {
  userName?: string;
  onClose: () => void;
}

const UserOnboarding: React.FC<UserOnboardingProps> = ({ userName, onClose }) => {
  const navigate = useNavigate();
  const { steps, completedSteps, totalSteps, markStepAsComplete } = useOnboardingSteps();

  const handleStepClick = (step: any) => {
    navigate(step.route);
    
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
