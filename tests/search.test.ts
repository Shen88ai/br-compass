import { describe, it, expect, vi } from 'vitest';
import { GET } from '../src/pages/api/search.json';

// Mock search index for stable testing
vi.mock('../public/search-index.json', () => ({
  default: [
    { slug: 'test-slug', title: 'Test Article', description: 'Testing content', tags: ['test'], phase: 'preparation' },
    { slug: 'brazil-tax', title: 'Brazil Tax Law', description: 'Major tax laws', tags: ['tax'], phase: 'foundation' }
  ]
}));

describe('Search API', () => {
  it('should return empty array if query is missing', async () => {
    const request = new Request('http://localhost/api/search.json');
    const response = await GET({ request } as any);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it('should return matched results for a valid query', async () => {
    const request = new Request('http://localhost/api/search.json?q=brazil');
    const response = await GET({ request } as any);
    const data = await response.json();
    
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].title).toContain('Brazil');
  });

  it('should return accurate results for tags', async () => {
    const request = new Request('http://localhost/api/search.json?q=tax');
    const response = await GET({ request } as any);
    const data = await response.json();
    
    expect(data[0].title).toBe('Brazil Tax Law');
  });

  it('should handle fuzzy matching', async () => {
    // Search for "Taxx" (typo)
    const request = new Request('http://localhost/api/search.json?q=Taxx');
    const response = await GET({ request } as any);
    const data = await response.json();
    
    // Taxx should be much closer to Tax Law
    expect(data[0].title).toBe('Brazil Tax Law');
  });
});
