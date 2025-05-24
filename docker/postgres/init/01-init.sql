-- Initialize The Urlist database schema
-- This script will run automatically when the PostgreSQL container starts

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create url_lists table
CREATE TABLE IF NOT EXISTS url_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES url_lists(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(500),
    description TEXT,
    favicon_url TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_url_lists_slug ON url_lists(slug);
CREATE INDEX IF NOT EXISTS idx_url_lists_published ON url_lists(is_published);
CREATE INDEX IF NOT EXISTS idx_urls_list_id ON urls(list_id);
CREATE INDEX IF NOT EXISTS idx_urls_position ON urls(list_id, position);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_url_lists_updated_at 
    BEFORE UPDATE ON url_lists 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_urls_updated_at 
    BEFORE UPDATE ON urls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for development
INSERT INTO url_lists (title, slug, description, is_published) VALUES 
('Web Development Resources', 'web-dev-resources', 'A curated list of essential web development tools and resources', true),
('Design Inspiration', 'design-inspiration', 'Beautiful design examples and inspiration sources', true);

INSERT INTO urls (list_id, url, title, description, position) VALUES 
((SELECT id FROM url_lists WHERE slug = 'web-dev-resources'), 'https://developer.mozilla.org', 'MDN Web Docs', 'Comprehensive web development documentation', 1),
((SELECT id FROM url_lists WHERE slug = 'web-dev-resources'), 'https://astro.build', 'Astro', 'The web framework for content-driven websites', 2),
((SELECT id FROM url_lists WHERE slug = 'web-dev-resources'), 'https://tailwindcss.com', 'Tailwind CSS', 'A utility-first CSS framework', 3),
((SELECT id FROM url_lists WHERE slug = 'design-inspiration'), 'https://dribbble.com', 'Dribbble', 'Discover the world''s top designers & creatives', 1),
((SELECT id FROM url_lists WHERE slug = 'design-inspiration'), 'https://behance.net', 'Behance', 'Creative portfolios on Behance', 2);