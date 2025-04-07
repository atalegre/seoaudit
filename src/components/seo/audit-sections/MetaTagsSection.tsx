
import React from 'react';
import { FileText } from 'lucide-react';
import MetaTagItem from './MetaTagItem';

interface MetaTagsSectionProps {
  metaTags: {
    title: string;
    description: string;
    titleLength: number;
    descriptionLength: number;
  };
}

const MetaTagsSection = ({ metaTags }: MetaTagsSectionProps) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-emerald-600" />
        Meta Tags
      </h3>
      
      <div className="space-y-5">
        <MetaTagItem
          title="Meta Title"
          content={metaTags.title}
          contentLength={metaTags.titleLength}
          minLength={30}
          maxLength={60}
        />
        
        <MetaTagItem
          title="Meta Description"
          content={metaTags.description}
          contentLength={metaTags.descriptionLength}
          minLength={70}
          maxLength={160}
        />
      </div>
    </div>
  );
};

export default MetaTagsSection;
