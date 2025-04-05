
import React from 'react';
import IndexationSection from '@/components/metrics/IndexationSection';

interface WebsiteIndexationSectionProps {
  siteUrl: string;
  authToken: string | null;
  isLoggedIn: boolean;
}

export default function WebsiteIndexationSection({ 
  siteUrl, 
  authToken, 
  isLoggedIn 
}: WebsiteIndexationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Indexação no Google</h2>
      <IndexationSection 
        siteUrl={siteUrl} 
        authToken={authToken}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
