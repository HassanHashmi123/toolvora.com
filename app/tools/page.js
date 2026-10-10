import Link from 'next/link';
import { tools, og } from '../../lib/tools';

const TITLE = 'All Tools';
const DESC = 'Every DocBrio tool on one page: PDF tools, document converters, image converters, generators and text tools. Free, with no signup.';
export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/tools/' },
  openGraph: og(TITLE, DESC, '/tools/'),
};

const GROUPS = [
  ['PDF', 'PDF Tools'],
  ['Convert', 'Document Converters'],
  ['Image', 'Image Tools'],
  ['Generators', 'Generators and Checks'],
  ['Text', 'Text Tools'],
];

export default function ToolsIndex() {
  return (
    <>
      <div className="hero" style={{ padding: '24px 0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
          All {tools.length} Tools
        </h1>
        <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15.5px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
          Pick a tool to open it. Your files are processed in your browser and are not uploaded.
        </p>
      </div>

      {GROUPS.map(([cat, label]) => (
        <section key={cat} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: 14 }}>{label}</h2>
          <div className="related-grid">
            {tools.filter((t) => t.cat === cat).map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="related-card">
                <div className={`badge ${t.cls}`} style={{ width: 34, height: 34, fontSize: 11, borderRadius: 8 }}>
                  {t.badge}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
