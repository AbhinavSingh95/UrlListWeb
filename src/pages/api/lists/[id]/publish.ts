import type { APIRoute } from 'astro';
import { UrlListService } from '../../../../lib/urlListService';

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const listId = params.id;
    if (!listId) {
      return new Response(JSON.stringify({ error: 'List ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { published } = body;

    if (typeof published !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Published status must be a boolean' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const urlListService = new UrlListService();
    const updatedList = await UrlListService.update(listId, { is_published: published });

    if (!updatedList) {
      return new Response(JSON.stringify({ error: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updatedList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating list publish status:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};