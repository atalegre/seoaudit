
export interface LLMPresenceAuditProps {
  url: string;
  autoStart?: boolean;
}

export interface ModelPresence {
  name: string;
  score: number;
  lastMention?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface LLMMention {
  model: string;
  query: string;
  response: string;
  hasMention: boolean;
  needsCorrection: boolean;
  date?: string;
}

export interface LLMReport {
  score: number;
  totalMentions: number;
  accuracyScore: number;
  models: ModelPresence[];
  mentions: LLMMention[];
  recommendations: string[];
  outdatedInfo: string[];
  competitors: string[];
}
