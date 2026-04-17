import type { APIRoute } from 'astro';
import Fuse from 'fuse.js';
import searchIndex from '../../../public/search-index.json';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fuse = new Fuse(searchIndex, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.15 },
      { name: 'phaseLabel', weight: 0.05 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
  });

  const results = fuse.search(query).map(r => ({
    // @ts-ignore
    slug: r.item.slug,
    // @ts-ignore
    title: r.item.title,
    // @ts-ignore
    description: r.item.description,
    // @ts-ignore
    icon: r.item.icon,
    // @ts-ignore
    phase: r.item.phase,
    score: r.score,
  }));

  return new Response(JSON.stringify(results.slice(0, 10)), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
