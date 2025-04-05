
import React from 'react';
import { MessageSquare } from 'lucide-react';
import TopicTag from './TopicTag';

interface TopicsSectionProps {
  topics: string[];
}

const TopicsSection: React.FC<TopicsSectionProps> = ({ topics }) => {
  return (
    <div className="pt-2">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4 text-purple-500" />
        Tópicos Detetados
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {topics.map((topic, index) => (
          <TopicTag key={index} topic={topic} />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Tópicos que a IA identificou como principais no seu conteúdo.
      </p>
    </div>
  );
};

export default TopicsSection;
