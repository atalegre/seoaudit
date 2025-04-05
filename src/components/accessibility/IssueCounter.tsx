
import React from 'react';

interface IssueCounterProps {
  count: number;
  label: string;
  icon: React.ReactNode;
}

const IssueCounter = ({ count, label, icon }: IssueCounterProps) => {
  return (
    <div className="flex flex-col items-center p-2 border rounded-md">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-lg font-bold">{count}</span>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export default IssueCounter;
