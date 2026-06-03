export interface ProjectType {
  title: string;
  description: string;
  autor: {
    name: string;
    link: string;
  };
  image?: string | null;
  stack: string[];
  pj_link: string;
}
