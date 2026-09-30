import { SITE } from '../lib/tools';
export const dynamic = 'force-static';
export default function robots() { return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE}/sitemap.xml` }; }
