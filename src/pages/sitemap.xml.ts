---
const baseUrl = 'https://urlist.co'; // Update this with your actual domain

const staticPages = [
  '',
  '/discover',
  '/dashboard',
  '/create'
];

const response = new Response(
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`,
  {
    headers: {
      'Content-Type': 'application/xml',
    },
  }
);

export async function GET() {
  return response;
}
---
