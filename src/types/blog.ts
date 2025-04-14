
export interface BlogPost {
  id?: string;
  title: {
    pt: string;
    en: string;
  };
  slug: string;
  excerpt?: {
    pt?: string;
    en?: string;
  };
  content?: {
    pt?: string;
    en?: string;
  };
  keyLearning?: {
    pt?: string;
    en?: string;
  };
  category?: string;
  tags: string[];
  imageSrc?: string;
  popularity?: number;
  date?: string;
  created_at?: string;
  headings?: {
    id: string;
    text: string;
    level: number;
  }[];
}
