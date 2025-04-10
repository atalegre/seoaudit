
import React from 'react';
import { motion } from 'framer-motion';

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
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt={`${domain} logo`} 
          className="w-12 h-12 rounded-full border shadow-sm" 
        />
      )}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{domain}</h2>
        <p className="text-muted-foreground">Dashboard de Análise</p>
      </div>
    </motion.div>
  );
};

export default DomainHeader;
