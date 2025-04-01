
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  keyLearning?: string;
  category?: string;
  tags?: string[] | string; // Can be either an array or comma-separated string
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
