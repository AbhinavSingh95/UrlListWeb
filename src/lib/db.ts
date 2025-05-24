import pg from 'pg';
const { Pool } = pg;

// Database connection configuration
const pool = new Pool({
  connectionString: 'postgresql://urlist_user:urlist_password@localhost:5432/urlist_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };

// Database types
export interface UrlList {
  id: string;
  title: string;
  slug: string;
  description?: string;
  is_published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Url {
  id: string;
  list_id: string;
  url: string;
  title?: string;
  description?: string;
  favicon_url?: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUrlListData {
  title: string;
  slug: string;
  description?: string;
}

export interface CreateUrlData {
  list_id: string;
  url: string;
  title?: string;
  description?: string;
  favicon_url?: string;
  position?: number;
}

export interface UpdateUrlListData {
  title?: string;
  slug?: string;
  description?: string;
  is_published?: boolean;
}

export interface UpdateUrlData {
  url?: string;
  title?: string;
  description?: string;
  favicon_url?: string;
  position?: number;
}