import { z } from 'zod';

// Validation schemas
export const createUrlListSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000, 'Description too long').optional(),
});

export const updateUrlListSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  is_published: z.boolean().optional(),
});

export const createUrlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().max(500, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  position: z.number().int().min(0).optional(),
});

export const updateUrlSchema = z.object({
  url: z.string().url('Please enter a valid URL').optional(),
  title: z.string().max(500, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  position: z.number().int().min(0).optional(),
});

// Utility functions
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function generateRandomSlug(): string {
  const adjectives = ['cool', 'awesome', 'amazing', 'fantastic', 'brilliant', 'wonderful', 'excellent', 'great', 'super', 'nice'];
  const nouns = ['list', 'collection', 'links', 'resources', 'bookmarks', 'urls', 'sites', 'pages', 'finds', 'picks'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}-${noun}-${number}`;
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 80); // Limit length
}