
import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialAuthProps {
  onGoogleClick: () => void;
  onGitHubClick: () => void;
  buttonText: string;
}

// This component is now empty as we're removing social authentication
const SocialAuth = ({ onGoogleClick, onGitHubClick, buttonText }: SocialAuthProps) => {
  return null;
};

export default SocialAuth;
