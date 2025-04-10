
export interface TourStep {
  title: string;
  description: string;
  targetId: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  cta?: {
    text: string;
    action?: () => void;
  };
}

export interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
  icon?: React.ElementType;
  action?: () => void;
}
