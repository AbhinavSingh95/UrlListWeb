import type { APIRoute } from 'astro';
import { UrlListService } from '../../../lib/urlListService.js';
import { updateUrlListSchema } from '../../../lib/utils.js';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({
        error: 'List ID is required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urlList = await UrlListService.getById(id);
    
    if (!urlList) {
      return new Response(JSON.stringify({
        error: 'List not found'
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(urlList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching URL list:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({
        error: 'List ID is required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    
    // Validate input
    const validation = updateUrlListSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: validation.error.errors
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = validation.data;

    // Check if slug is available (if being updated)
    if (data.slug) {
      const isSlugAvailable = await UrlListService.isSlugAvailable(data.slug, id);
      if (!isSlugAvailable) {
        return new Response(JSON.stringify({
          error: 'Slug already exists'
        }), { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Update the URL list
    const urlList = await UrlListService.update(id, data);
    
    if (!urlList) {
      return new Response(JSON.stringify({
        error: 'List not found'
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(urlList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating URL list:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({
        error: 'List ID is required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await UrlListService.delete(id);
    
    if (!success) {
      return new Response(JSON.stringify({
        error: 'List not found'
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: 'List deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting URL list:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};