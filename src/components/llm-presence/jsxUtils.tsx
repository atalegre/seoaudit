
import React from 'react';

// Highlight text with the domain name
export const highlightDomain = (text: string, domain: string): JSX.Element => {
  if (!domain || !text.includes(domain)) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${domain})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === domain.toLowerCase() ? 
          <span key={i} className="bg-yellow-100 font-medium">{part}</span> : part
      )}
    </>
  );
};
