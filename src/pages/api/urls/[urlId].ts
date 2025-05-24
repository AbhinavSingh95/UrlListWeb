import type { APIRoute } from 'astro';
import { UrlService } from '../../../lib/urlService';
import { updateUrlSchema } from '../../../lib/utils';

export const GET: APIRoute = async ({ params }) => {
  try {
    const urlId = params.urlId;
    if (!urlId) {
      return new Response(JSON.stringify({ error: 'URL ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = await UrlService.getById(urlId);

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(url), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const urlId = params.urlId;
    if (!urlId) {
      return new Response(JSON.stringify({ error: 'URL ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    
    // Validate the input
    const validationResult = updateUrlSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedUrl = await UrlService.update(urlId, validationResult.data);

    if (!updatedUrl) {
      return new Response(JSON.stringify({ error: 'URL not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updatedUrl), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const urlId = params.urlId;
    if (!urlId) {
      return new Response(JSON.stringify({ error: 'URL ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await UrlService.delete(urlId);

    if (!success) {
      return new Response(JSON.stringify({ error: 'URL not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};