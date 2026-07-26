import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  loader: async () => {
    try {
      const res = await fetch('https://api.github.com/orgs/LibreCourseUY/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `Bearer ${import.meta.env.GH_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      });
      if (!res.ok) {
        console.warn(`GitHub API error: ${res.status} ${res.statusText}`);
        return [];
      }
      const repos: any[] = await res.json();
      if (!Array.isArray(repos)) {
        console.warn(`Unexpected GitHub API response: ${JSON.stringify(repos)}`);
        return [];
      }
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
    } catch (err) {
      console.warn('Failed to fetch GitHub repos:', err);
      return [];
    }
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
