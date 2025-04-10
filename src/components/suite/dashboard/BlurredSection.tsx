
import React from 'react';

interface BlurredSectionProps {
  children: React.ReactNode;
  onClick?: () => void;
  noBackdrop?: boolean;
}

const BlurredSection: React.FC<BlurredSectionProps> = ({ 
  children, 
  onClick,
  noBackdrop = false
}) => {
  return (
    <div 
      className="relative cursor-pointer transition-all hover:scale-[1.01]"
      onClick={onClick}
    >
      {children}
      <div 
        className={`absolute inset-0 flex items-center justify-center ${
          noBackdrop ? 'bg-white/5 backdrop-blur-[1px]' : 'bg-white/40 backdrop-blur-[2px]'
        } rounded-md overflow-hidden`}
      >
        {!noBackdrop && (
          <div className="bg-white/90 px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            Disponível com conta
          </div>
        )}
      </div>
    </div>
  );
};

export default BlurredSection;
