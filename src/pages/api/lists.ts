import type { APIRoute } from 'astro';
import { UrlListService } from '../../lib/urlListService.js';
import { createUrlListSchema } from '../../lib/utils.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = createUrlListSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: validation.error.errors
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { title, slug, description } = validation.data;

    // Check if slug is available
    const isSlugAvailable = await UrlListService.isSlugAvailable(slug);
    if (!isSlugAvailable) {
      return new Response(JSON.stringify({
        error: 'Slug already exists'
      }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create the URL list
    const urlList = await UrlListService.create({
      title,
      slug,
      description
    });

    return new Response(JSON.stringify(urlList), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating URL list:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  try {
    const urlLists = await UrlListService.getAll();
    
    return new Response(JSON.stringify(urlLists), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching URL lists:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};