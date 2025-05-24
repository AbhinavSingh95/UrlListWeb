import { pool } from './db.js';
import type { Url, CreateUrlData, UpdateUrlData } from './db.js';

export class UrlService {
  // Create a new URL
  static async create(data: CreateUrlData): Promise<Url> {
    const client = await pool.connect();
    try {
      // Get the next position if not provided
      let position = data.position;
      if (position === undefined) {
        const positionResult = await client.query(
          'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM urls WHERE list_id = $1',
          [data.list_id]
        );
        position = positionResult.rows[0].next_position;
      }

      const result = await client.query(
        `INSERT INTO urls (list_id, url, title, description, favicon_url, position) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [data.list_id, data.url, data.title, data.description, data.favicon_url, position]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Get URLs by list ID
  static async getByListId(listId: string): Promise<Url[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM urls WHERE list_id = $1 ORDER BY position ASC, created_at ASC',
        [listId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get a URL by ID
  static async getById(id: string): Promise<Url | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM urls WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Update a URL
  static async update(id: string, data: UpdateUrlData): Promise<Url | null> {
    const client = await pool.connect();
    try {
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (data.url !== undefined) {
        updates.push(`url = $${paramIndex++}`);
        values.push(data.url);
      }
      if (data.title !== undefined) {
        updates.push(`title = $${paramIndex++}`);
        values.push(data.title);
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(data.description);
      }
      if (data.favicon_url !== undefined) {
        updates.push(`favicon_url = $${paramIndex++}`);
        values.push(data.favicon_url);
      }
      if (data.position !== undefined) {
        updates.push(`position = $${paramIndex++}`);
        values.push(data.position);
      }

      if (updates.length === 0) {
        return await this.getById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE urls SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Delete a URL
  static async delete(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM urls WHERE id = $1',
        [id]
      );
      return result.rowCount! > 0;
    } finally {
      client.release();
    }
  }

  // Update positions for reordering
  static async updatePositions(updates: { id: string; position: number }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const update of updates) {
        await client.query(
          'UPDATE urls SET position = $1 WHERE id = $2',
          [update.position, update.id]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get URL metadata from the actual URL (basic implementation)
  static async fetchUrlMetadata(url: string): Promise<{ title?: string; description?: string; favicon_url?: string }> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Urlist/1.0; +https://urlist.com)'
        }
      });
      
      if (!response.ok) {
        return {};
      }
      
      const html = await response.text();
      
      // Basic HTML parsing for title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : undefined;
      
      // Basic parsing for meta description
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const description = descMatch ? descMatch[1].trim() : undefined;
      
      // Basic favicon detection
      const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i);
      let favicon_url = faviconMatch ? faviconMatch[1] : undefined;
      
      // If favicon is relative, make it absolute
      if (favicon_url && !favicon_url.startsWith('http')) {
        const urlObj = new URL(url);
        favicon_url = favicon_url.startsWith('/') 
          ? `${urlObj.protocol}//${urlObj.host}${favicon_url}`
          : `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
      }
      
      return { title, description, favicon_url };
    } catch (error) {
      console.error('Error fetching URL metadata:', error);
      return {};
    }
  }
}