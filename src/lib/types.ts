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

export interface ProjectsGitHubType {
  data: {
    id: string;
    name: string;
    description: string;
    url: string;
    stars: number,
    language: string;
    updatedAt: string;
    topics: string[];
  }
}