import type { APIRoute } from 'astro';
import { UrlService } from '../../../../lib/urlService';
import { createUrlSchema } from '../../../../lib/utils';

export const GET: APIRoute = async ({ params }) => {
  try {
    const listId = params.id;
    if (!listId) {
      return new Response(JSON.stringify({ error: 'List ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urls = await UrlService.getByListId(listId);

    return new Response(JSON.stringify(urls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const listId = params.id;
    if (!listId) {
      return new Response(JSON.stringify({ error: 'List ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    
    // Validate the input
    const validationResult = createUrlSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urlData = { ...validationResult.data, list_id: listId };
    const newUrl = await UrlService.create(urlData);

    return new Response(JSON.stringify(newUrl), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};