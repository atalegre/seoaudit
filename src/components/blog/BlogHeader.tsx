
import React from 'react';

interface BlogHeaderProps {
  title: string;
  description: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default BlogHeader;
