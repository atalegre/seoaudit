
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

const CTACard: React.FC<CTACardProps> = ({ title, description, buttonText, linkTo }) => {
  return (
    <div className="bg-primary text-primary-foreground p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{description}</p>
      <Button asChild variant="secondary" className="w-full">
        <Link to={linkTo} className="flex items-center justify-center gap-2">
          {buttonText} <span className="ml-2">→</span>
        </Link>
      </Button>
    </div>
  );
};

export default CTACard;
