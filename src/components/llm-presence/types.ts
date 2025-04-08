
export interface LLMPresenceAuditProps {
  url?: string;
  autoStart?: boolean;
}

export interface ModelPresence {
  name: string;
  score: number;
}

export interface LLMPresenceReport {
  domain: string;
  score: number;
  report: string;
  isDomainMentioned: boolean;
  modelPresence?: ModelPresence[];
}

export interface RecommendationType {
  title: string;
  description: string;
  actionUrl: string;
}
