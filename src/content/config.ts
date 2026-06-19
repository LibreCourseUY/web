// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  loader: async () => {
    const res = await fetch('https://api.github.com/orgs/LibreCourseUY/repos?per_page=100&sort=updated', {
      headers: {
        Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const repos = await res.json();
    return repos.map((repo: any) => ({
      id: repo.name,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      topics: repo.topics,
    }));
  },
  schema: z.object({
    name: z.string(),
    description: z.string().nullable(),
    url: z.string(),
    stars: z.number(),
    language: z.string().nullable(),
    updatedAt: z.string(),
    topics: z.array(z.string()),
  }),
});

export const collections = { projects };