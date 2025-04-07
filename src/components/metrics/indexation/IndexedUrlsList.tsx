
import React from 'react';

interface IndexedUrlsListProps {
  urls: string[];
}

const IndexedUrlsList: React.FC<IndexedUrlsListProps> = ({ urls }) => {
  if (urls.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">URLs indexadas ({urls.length})</h3>
      <div className="max-h-64 overflow-y-auto border rounded-md p-2">
        <ul className="space-y-1">
          {urls.map((url, index) => (
            <li key={index} className="text-sm truncate">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IndexedUrlsList;
