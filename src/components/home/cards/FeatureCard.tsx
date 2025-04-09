
import React, { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  items: string[];
  linkText: string;
  linkUrl: string;
  linkColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  items,
  linkText,
  linkUrl,
  linkColor,
  gradientFrom,
  gradientTo
}: FeatureCardProps) => {
  return (
    <div className="group relative transition-all duration-300 hover:-translate-y-2">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${gradientFrom}/20 to-${gradientTo}/10 transform blur-xl transition-all duration-300 group-hover:scale-105`}></div>
      <div className="relative bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden h-full transition-all duration-300 z-10">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`}></div>
        <div className="p-8">
          <div className={`w-14 h-14 rounded-2xl bg-${gradientFrom}-50 flex items-center justify-center mb-6`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          
          <ul className="space-y-3 mb-6">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-sm">{item}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            variant="ghost" 
            className={`p-0 flex items-center text-${linkColor}-600 hover:text-${linkColor}-700 font-medium`} 
            asChild
          >
            <Link to={linkUrl}>
              {linkText} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
