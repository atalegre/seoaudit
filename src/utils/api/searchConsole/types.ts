
/**
 * Interface for Search Console data
 */
export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  startDate?: string;
  endDate?: string;
  queries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export interface SearchConsoleError {
  error: {
    code: number;
    message: string;
  }
}

export interface IndexationResult {
  [key: string]: boolean;
}
