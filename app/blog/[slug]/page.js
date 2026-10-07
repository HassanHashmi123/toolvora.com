import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost } from '../../../lib/posts';
import { getTool, SITE } from '../../../lib/tools';
import PostBody from '../../../components/PostBody';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} | DocBrio Guides by Vibeans Solutions`,
    description: p.desc,
    alternates: { canonical: `/blog/${p.slug}/` },
  };
}

export default function Post({ params }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const t = getTool(p.tool);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.desc,
    datePublished: p.date,
    mainEntityOfPage: `${SITE}/blog/${p.slug}/`,
    author: {
      '@type': 'Organization',
      name: 'Vibeans Solutions',
      url: 'https://www.vibeanssolutions.site/',
    },
  };

  return (
    <>
      <article className="panel" style={{ borderTop: '3px solid var(--vibeans-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="article-tag">
            Tutorial
          </span>
          <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Document Workflow Guide • By Vibeans Engineering</span>
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: 1.25, marginBottom: 14 }}>
          {p.title}
        </h1>

        <p className="sub" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: 28, color: 'var(--ink-secondary)' }}>
          {p.desc}
        </p>

        {t && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: 30,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <b style={{ color: '#fff', fontSize: '15px', display: 'block' }}>Try the Free In Browser Tool:</b>
              <span style={{ fontSize: '13.5px', color: 'var(--ink-secondary)' }}>
                {t.name} • No signup required, 100% private.
              </span>
            </div>
            <Link href={`/tools/${t.slug}/`} className="btn" style={{ margin: 0, padding: '8px 18px', fontSize: '13.5px' }}>
              Launch {t.name} →
            </Link>
          </div>
        )}

        <div style={{ color: 'var(--ink-secondary)', fontSize: '15.5px', lineHeight: 1.75 }}>
          <PostBody content={p.content} />
        </div>
      </article>

      <div className="panel info" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '20px', marginTop: 0 }}>Explore More Guides</h2>
        <div className="related-grid" style={{ marginTop: 16 }}>
          {posts
            .filter((x) => x.slug !== p.slug)
            .map((x) => (
              <Link key={x.slug} href={`/blog/${x.slug}/`} className="related-card">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                    {x.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--vibeans-orange)', fontWeight: 600 }}>
                    Walkthrough Guide
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--vibeans-blue-light)' }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
