
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  keyLearning?: string;
  category?: string;
  tags?: string[] | string;
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
