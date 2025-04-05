
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TopicTagProps {
  topic: string;
}

const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };
  
  const backgroundColor = stringToColor(topic);
  const textColor = "hsl(0, 0%, 20%)";
  
  return (
    <Badge 
      variant="outline" 
      className="py-1 px-2 rounded-md font-normal border-none text-xs"
      style={{ backgroundColor, color: textColor }}
    >
      {topic}
    </Badge>
  );
};

export default TopicTag;
