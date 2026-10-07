import Link from 'next/link';
import { posts } from '../../lib/posts';
import { getTool } from '../../lib/tools';

export const metadata = {
  title: 'Guides & Document Tutorials | DocBrio by Vibeans Solutions',
  description:
    'Simple, actionable step by step guides on converting PDFs, compressing images, merging documents and staying secure online without uploading files.',
  alternates: { canonical: '/blog/' },
};

export default function Blog() {
  return (
    <>
      <div className="hero" style={{ padding: '24px 0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
          Practical Guides & Document Tutorials
        </h1>
        <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15.5px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
          Expert tips, format breakdowns, and step by step walkthroughs for all 26 document, office, and image utilities.
        </p>
      </div>

      <div className="guides-grid">
        {posts.map((p) => {
          const t = getTool(p.tool);
          return (
            <Link key={p.slug} className="card" href={`/blog/${p.slug}/`} style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '11px', color: 'var(--vibeans-orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t ? t.name : 'Guide'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--ink-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                  Walkthrough
                </span>
              </div>
              <b style={{ fontSize: '17px', lineHeight: 1.4, marginBottom: 10, color: '#fff' }}>{p.title}</b>
              <span style={{ WebkitLineClamp: 3, marginBottom: 16, color: 'var(--ink-muted)', fontSize: '13.5px', lineHeight: 1.55 }}>
                {p.desc}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--vibeans-blue-light)', fontWeight: 600, marginTop: 'auto' }}>
                <span>Read Article</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
