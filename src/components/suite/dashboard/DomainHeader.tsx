
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface DomainHeaderProps {
  domain: string;
  logoUrl?: string;
}

const DomainHeader: React.FC<DomainHeaderProps> = ({ domain, logoUrl }) => {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      className="flex items-center gap-4 mb-4"
    >
      <div className="w-12 h-12 rounded-full border shadow-sm flex items-center justify-center overflow-hidden bg-white">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${domain} logo`}
            className="w-full h-full object-contain" 
            onError={(e) => {
              // If logo fails to load, replace with a fallback icon
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('bg-gray-100');
              const icon = document.createElement('div');
              icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
              e.currentTarget.parentElement?.appendChild(icon);
            }}
          />
        ) : (
          <Globe className="h-6 w-6 text-gray-400" />
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{domain}</h2>
        <p className="text-muted-foreground">Dashboard de Análise</p>
      </div>
    </motion.div>
  );
};

export default DomainHeader;
