export const proposalHome = '/new_index.html';

export function isProposalPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '');
  return path === '/new_index' || path === proposalHome || path.startsWith('/new/');
}

export function currentPathForProposal(pathname: string): string {
  const path = pathname.replace(/\/+$/, '');
  if (path === '/new_index' || path === proposalHome) return '/';
  return pathname.replace(/^\/new\//, '/') || '/';
}

export function proposalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (href === '/') return proposalHome;
  return `/new${href}`;
}
