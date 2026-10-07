import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools, getTool } from '../../../lib/tools';
import ToolClient from '../../../components/ToolClient';

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTool(params.slug);
  if (!t) return {};
  return {
    title: `${t.name} | Free Online Tool by Vibeans Solutions`,
    description: t.desc,
    alternates: { canonical: `/tools/${t.slug}/` },
    openGraph: {
      title: `${t.name} | Free Online Tool | DocBrio by Vibeans Solutions`,
      description: t.desc,
    },
  };
}

// Smart Recommendation Engine based on tool category and function
function getRecommendations(currentTool) {
  const slug = currentTool.slug;
  const cat = currentTool.cat;

  // Handcrafted curated matches for top tools
  const curatedMap = {
    'pdf-to-word': ['word-to-pdf', 'pdf-to-excel', 'merge-pdf', 'edit-pdf'],
    'pdf-to-excel': ['pdf-to-word', 'word-to-pdf', 'merge-pdf', 'edit-pdf'],
    'word-to-pdf': ['pdf-to-word', 'pdf-to-excel', 'powerpoint-to-pdf', 'merge-pdf'],
    'merge-pdf': ['edit-pdf', 'sign-pdf', 'crop-pdf', 'pdf-to-word'],
    'edit-pdf': ['sign-pdf', 'crop-pdf', 'merge-pdf', 'pdf-to-word'],
    'sign-pdf': ['edit-pdf', 'merge-pdf', 'crop-pdf', 'word-to-pdf'],
    'crop-pdf': ['edit-pdf', 'sign-pdf', 'merge-pdf', 'image-compressor'],
    'powerpoint-to-pdf': ['pdf-to-powerpoint', 'word-to-pdf', 'pdf-to-word', 'merge-pdf'],
    'pdf-to-powerpoint': ['powerpoint-to-pdf', 'pdf-to-word', 'pdf-to-excel', 'merge-pdf'],
    'image-compressor': ['png-to-webp', 'webp-to-jpg', 'png-to-ico', 'jpg-to-png'],
    'qr-code-generator': ['password-generator', 'word-counter', 'case-converter', 'image-compressor'],
    'password-generator': ['qr-code-generator', 'word-counter', 'case-converter', 'image-compressor'],
    'word-counter': ['case-converter', 'password-generator', 'qr-code-generator', 'pdf-to-word'],
    'case-converter': ['word-counter', 'password-generator', 'qr-code-generator', 'pdf-to-word'],
  };

  if (curatedMap[slug]) {
    return curatedMap[slug].map((s) => getTool(s)).filter(Boolean);
  }

  // Fallback: match by category, then any remaining tools
  const sameCat = tools.filter((x) => x.cat === cat && x.slug !== slug);
  if (sameCat.length >= 4) return sameCat.slice(0, 4);

  const others = tools.filter((x) => x.slug !== slug && !sameCat.includes(x));
  return [...sameCat, ...others].slice(0, 4);
}

export default function ToolPage({ params }) {
  const t = getTool(params.slug);
  if (!t) notFound();

  const recommendedTools = getRecommendations(t);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      {/* Main Interactive Tool Workspace */}
      <div className="panel" style={{ borderTop: '3px solid var(--vibeans-blue)' }}>
        <div className="tool-header-block">
          <div className={`badge ${t.cls}`} style={{ width: 44, height: 44, fontSize: 13, flexShrink: 0 }}>
            {t.badge}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 26px)' }}>{t.title.split(/ - | \| |: /)[0]}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span className="tool-security-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                In Browser Client Sandbox • Zero Server Upload
              </span>
            </div>
          </div>
        </div>

        <p className="sub" style={{ marginTop: 8 }}>{t.sub}</p>

        {/* Dynamic Tool Interface */}
        <div style={{ marginTop: 20 }}>
          <ToolClient slug={t.slug} />
        </div>
      </div>

      {/* "You Might Also Like" Recommendation Section */}
      <div className="panel info" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>You Might Also Like</h2>
          <span style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>Curated for your workflow</span>
        </div>
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: 18 }}>
          Discover complementary tools engineered by Vibeans Solutions to accelerate your document tasks.
        </p>

        <div className="related-grid">
          {recommendedTools.map((rec) => (
            <Link key={rec.slug} href={`/tools/${rec.slug}/`} className="related-card">
              <div className={`badge ${rec.cls}`} style={{ width: 34, height: 34, fontSize: 11, borderRadius: 8 }}>
                {rec.badge}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {rec.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 400 }}>
                  {rec.cat} Tool
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--vibeans-blue-light)' }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Technical Specifications & Value Highlights */}
      <div className="tool-spec-grid">
        <div className="card" style={{ flexDirection: 'column' }}>
          <div style={{ color: '#34d399', marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <b>Zero Data Retention</b>
          <span style={{ WebkitLineClamp: 3 }}>
            Files are processed strictly in your local device RAM. No server transmission or persistent cache exists.
          </span>
        </div>

        <div className="card" style={{ flexDirection: 'column' }}>
          <div style={{ color: '#60a5fa', marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <b>Instant Execution</b>
          <span style={{ WebkitLineClamp: 3 }}>
            Powered by modern WebAssembly and canvas rendering, eliminating internet upload wait times.
          </span>
        </div>

        <div className="card" style={{ flexDirection: 'column' }}>
          <div style={{ color: 'var(--vibeans-orange)', marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 14 14" />
            </svg>
          </div>
          <b>Enterprise Quality</b>
          <span style={{ WebkitLineClamp: 3 }}>
            Architected and maintained by Vibeans Solutions for seamless cross platform desktop & mobile use.
          </span>
        </div>
      </div>

      {/* Comprehensive Documentation, How-To, and FAQs */}
      <div className="panel info">
        <h2>About {t.name}</h2>
        <p>{t.about}</p>

        <h2>How to Use {t.name} Step by Step</h2>
        <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--ink-secondary)', marginTop: '10px' }}>
          {t.how.map((h, i) => (
            <li key={i} style={{ paddingLeft: '6px' }}>
              {h}
            </li>
          ))}
        </ol>

        <h2>Frequently Asked Questions</h2>
        {t.faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}

        <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Engineered by <b>Vibeans Solutions</b>
          </span>
          <Link href="/" className="btn alt" style={{ margin: 0, padding: '7px 14px', fontSize: '13px' }}>
            ← Back to All Tools
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
