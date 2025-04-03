
export interface DirectoryListing {
  domains: string[];
  name: string;
  phone: string;
  url: string;
  paiUrl: string;
}

export interface DirectoryPresenceProps {
  url: string;
  companyName?: string;
}

export interface DirectoryPresenceResult {
  found: boolean;
  name?: string;
  phone?: string;
  url?: string;
  paiUrl?: string;
  nameMatch?: boolean;
  phoneMatch?: boolean;
  urlMatch?: boolean;
}
