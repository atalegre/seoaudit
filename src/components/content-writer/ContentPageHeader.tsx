
import React from 'react';

interface ContentPageHeaderProps {
  title: string;
  subtitle: string;
}

const ContentPageHeader: React.FC<ContentPageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};

export default ContentPageHeader;
