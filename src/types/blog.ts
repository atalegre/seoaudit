
export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  keyLearning?: string;
  category?: string;
  tags?: string[]; // Changed from "string[] | string" to just "string[]" to match DB schema
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
