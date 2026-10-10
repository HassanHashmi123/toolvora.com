import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools, getTool, og } from '../../../lib/tools';
import { getPost } from '../../../lib/posts';
import ToolClient from '../../../components/ToolClient';

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTool(params.slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.desc,
    alternates: { canonical: `/tools/${t.slug}/` },
    openGraph: og(t.title, t.desc, `/tools/${t.slug}/`),
  };
}

// Smart Recommendation Engine based on tool category and function
function getRecommendations(currentTool) {
  const slug = currentTool.slug;
  const cat = currentTool.cat;

  // The tools a page links to in its own text come first, then others of the same kind
  if (currentTool.links) {
    const own = currentTool.links.map(([s]) => getTool(s)).filter(Boolean);
    const rest = tools.filter((x) => x.cat === cat && x.slug !== slug && !own.includes(x));
    return [...own, ...rest].slice(0, 4);
  }

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
    'qr-code-generator': ['password-generator', 'email-verifier', 'word-counter', 'case-converter'],
    'password-generator': ['email-verifier', 'qr-code-generator', 'word-counter', 'case-converter'],
    'email-verifier': ['password-generator', 'qr-code-generator', 'word-counter', 'case-converter'],
    'word-counter': ['case-converter', 'email-verifier', 'password-generator', 'qr-code-generator'],
    'case-converter': ['word-counter', 'email-verifier', 'password-generator', 'qr-code-generator'],
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
  const about = [].concat(t.about);
  const guide = t.guide && getPost(t.guide[0]);
  // The Email Verifier looks up the domain through public DNS, so it does not get the "nothing leaves your browser" wording
  const dns = t.slug === 'email-verifier';

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
                {dns ? 'Runs in your browser • The domain is looked up through public DNS' : 'Runs in your browser • Your files are not uploaded'}
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
          <span style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>Related tools</span>
        </div>
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', marginBottom: 18 }}>
          Other DocBrio tools that are often used together with {t.name}.
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
          <b>{dns ? 'What Leaves Your Browser' : 'Files Stay on Your Device'}</b>
          <span style={{ WebkitLineClamp: 3 }}>
            {dns ? 'Only the domain after the @ sign is sent, to a public DNS service. DocBrio does not store the address.' : 'The work is done by your browser. Your file is not sent to DocBrio or to any other server.'}
          </span>
        </div>

        <div className="card" style={{ flexDirection: 'column' }}>
          <div style={{ color: '#60a5fa', marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <b>No Upload Wait</b>
          <span style={{ WebkitLineClamp: 3 }}>
            Nothing has to be uploaded or downloaded again, so speed depends on your device and the size of the file.
          </span>
        </div>

        <div className="card" style={{ flexDirection: 'column' }}>
          <div style={{ color: 'var(--vibeans-orange)', marginBottom: 6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 14 14" />
            </svg>
          </div>
          <b>Free, No Signup</b>
          <span style={{ WebkitLineClamp: 3 }}>
            No account and no watermark. Works in current browsers on phones, tablets and computers.
          </span>
        </div>
      </div>

      {/* Comprehensive Documentation, How-To, and FAQs */}
      <div className="panel info">
        <h2>About {t.name}</h2>
        {about.map((p) => (
          <p key={p}>{p}</p>
        ))}

        {t.when && (
          <>
            <h2>When Should I Use This?</h2>
            <p>{t.when}</p>
          </>
        )}

        <h2>How to Use {t.name} Step by Step</h2>
        <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--ink-secondary)', marginTop: '10px' }}>
          {t.how.map((h, i) => (
            <li key={i} style={{ paddingLeft: '6px' }}>
              {h}
            </li>
          ))}
        </ol>

        {t.limits && (
          <>
            <h2>Limitations</h2>
            <p>{t.limits}</p>
          </>
        )}

        {t.links && (
          <>
            <h2>Related Tools and Guide</h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--ink-secondary)', marginTop: '10px' }}>
              {t.links.map(([slug, why]) => (
                <li key={slug} style={{ paddingLeft: '6px' }}>
                  <Link href={`/tools/${slug}/`}>{getTool(slug).name}</Link> {why}.
                </li>
              ))}
              {guide && (
                <li style={{ paddingLeft: '6px' }}>
                  Guide: <Link href={`/blog/${guide.slug}/`}>{t.guide[1]}</Link>.
                </li>
              )}
            </ul>
          </>
        )}

        <h2>Frequently Asked Questions</h2>
        {t.faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}

        <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Built by <b>Vibeans Solutions</b>
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
