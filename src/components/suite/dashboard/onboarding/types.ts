
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
