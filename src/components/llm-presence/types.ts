
export interface LLMPresenceAuditProps {
  url?: string;
  autoStart?: boolean;
}

export interface LLMPresenceReport {
  domain: string;
  score: number;
  report: string;
  isDomainMentioned: boolean;
}
