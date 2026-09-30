import { tools, SITE } from '../../lib/tools';
export const dynamic = 'force-static';
// Route handler instead of app/sitemap.js: Next 14 dev server 500s on sitemap.js with output: 'export'
export function GET() {
  const pages = ['', 'about/', 'contact/', 'privacy-policy/', 'terms/', ...tools.map((t) => `tools/${t.slug}/`)];
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${SITE}/${p}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
