import { pool } from './db.js';
import type { UrlList, CreateUrlListData, UpdateUrlListData } from './db.js';

export class UrlListService {
  // Create a new URL list
  static async create(data: CreateUrlListData): Promise<UrlList> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO url_lists (title, slug, description) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [data.title, data.slug, data.description]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Get a URL list by slug
  static async getBySlug(slug: string): Promise<UrlList | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM url_lists WHERE slug = $1',
        [slug]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get a URL list by ID
  static async getById(id: string): Promise<UrlList | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM url_lists WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Update a URL list
  static async update(id: string, data: UpdateUrlListData): Promise<UrlList | null> {
    const client = await pool.connect();
    try {
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (data.title !== undefined) {
        updates.push(`title = $${paramIndex++}`);
        values.push(data.title);
      }
      if (data.slug !== undefined) {
        updates.push(`slug = $${paramIndex++}`);
        values.push(data.slug);
      }
      if (data.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(data.description);
      }
      if (data.is_published !== undefined) {
        updates.push(`is_published = $${paramIndex++}`);
        values.push(data.is_published);
      }

      if (updates.length === 0) {
        return await this.getById(id);
      }

      values.push(id);
      const result = await client.query(
        `UPDATE url_lists SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Delete a URL list
  static async delete(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM url_lists WHERE id = $1',
        [id]
      );
      return result.rowCount! > 0;
    } finally {
      client.release();
    }
  }

  // Check if slug is available
  static async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      let query = 'SELECT id FROM url_lists WHERE slug = $1';
      const params = [slug];
      
      if (excludeId) {
        query += ' AND id != $2';
        params.push(excludeId);
      }
      
      const result = await client.query(query, params);
      return result.rows.length === 0;
    } finally {
      client.release();
    }
  }

  // Generate a unique slug
  static async generateSlug(title: string): Promise<string> {
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
    
    if (!baseSlug) {
      baseSlug = 'list';
    }

    let slug = baseSlug;
    let counter = 1;
    
    while (!(await this.isSlugAvailable(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Get all URL lists
  static async getAll(): Promise<UrlList[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM url_lists ORDER BY created_at DESC'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Publish a URL list
  static async publish(id: string): Promise<UrlList | null> {
    return await this.update(id, { is_published: true });
  }

  // Unpublish a URL list
  static async unpublish(id: string): Promise<UrlList | null> {
    return await this.update(id, { is_published: false });
  }
}