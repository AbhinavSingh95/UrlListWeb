---
const robotsContent = `User-agent: *
Allow: /

Sitemap: https://urlist.co/sitemap.xml

# Allow search engines to crawl public sharing pages
Allow: /share/

# Allow crawling of discovery page
Allow: /discover

# Disallow crawling of dashboard and create pages (private functionality)
Disallow: /dashboard
Disallow: /create
Disallow: /api/`;

export async function GET() {
  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
---
