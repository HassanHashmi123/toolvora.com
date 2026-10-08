import Link from 'next/link';
import { tools } from '../lib/tools';
import HomeClient from '../components/HomeClient';

export const metadata = {
  title: 'DocBrio by Vibeans Solutions | Free Online PDF, Office & Image Suite',
  description: 'Enterprise grade in browser PDF, Word, Excel, and Image tools engineered by Vibeans Solutions. 100% client side privacy, zero server uploads, unlimited free conversions.',
};

export default function Home() {
  const faqs = [
    {
      q: 'How does DocBrio ensure 100% file privacy?',
      a: 'Unlike standard conversion websites that upload your files to remote cloud servers, DocBrio runs entirely inside your browser using WebAssembly and client side JavaScript. Your files never leave your device memory, meaning zero third party exposure for legal, financial, or personal documents.',
    },
    {
      q: 'Are there any hidden costs, subscriptions, or file size limits?',
      a: 'DocBrio is 100% free with no watermarks, no registration, and no artificial restrictions. The only practical limit is your device hardware and memory capacity.',
    },
    {
      q: 'Who engineered DocBrio?',
      a: 'DocBrio is developed and maintained by Vibeans Solutions (Top IT Company & AI Agency), architected by Hassan Hashmi and led by Tayyab Ali (CEO @ Vibeans Solutions).',
    },
    {
      q: 'Can I use DocBrio on my mobile phone or tablet?',
      a: 'Yes! The entire interface is built to be 110% responsive across Android, iPhone, iPad, Windows, and Mac devices without requiring any app download.',
    },
    {
      q: 'Can DocBrio process scanned PDFs with images?',
      a: 'Yes. Our tools integrate in browser OCR (Optical Character Recognition) to extract text from scanned documents directly inside your browser.',
    },
  ];

  return (
    <>
      {/* SaaS Hero Section */}
      <section className="hero">
        <h1>
          Every Document & PDF Tool You Need,{' '}
          <span className="gradient-text-blue">Right in Your Browser</span>
        </h1>

        <p>
          Convert, compress, edit, merge, and sign PDFs, Office files, and images at hardware speed.
          100% private in memory processing: zero files are ever uploaded to any server.
        </p>

        <div className="hero-cta-group">
          <a href="#tools-section" className="btn">
            <span>Explore All 27+ Tools</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </a>
          <a href="#why-docbrio" className="btn alt">
            <span>Why 100% Client Side?</span>
          </a>
        </div>

        {/* Hero Trust Highlights Bar */}
        <div className="hero-trust-bar">
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Zero Server Uploads</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Hardware Accelerated (Wasm)</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Instant In Memory Speed</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--vibeans-orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Forever Free & Unlimited</span>
          </div>
        </div>
      </section>

      {/* Interactive Tools Search & Category Filter Section */}
      <HomeClient tools={tools} />

      {/* 3 Step Interactive Workflow */}
      <section id="how-it-works" style={{ margin: '60px 0 40px', scrollMarginTop: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            How DocBrio Works in 3 Quick Steps
          </h2>
          <p style={{ color: 'var(--ink-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            Simple, frictionless workflow designed to save you hours of document handling.
          </p>
        </div>

        <div className="workflow-grid">
          <div className="panel" style={{ padding: '28px', margin: 0, textAlign: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--vibeans-gradient-blue)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, margin: '0 auto 14px' }}>
              1
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Select or Drop Document</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
              Drag your PDF, Word document, spreadsheet, or image right into the tool workspace on your screen.
            </p>
          </div>

          <div className="panel" style={{ padding: '28px', margin: 0, textAlign: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--vibeans-gradient-orange)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, margin: '0 auto 14px' }}>
              2
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Local In Memory Conversion</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
              Our client side engine parses, processes, or alters the document directly in your browser without any network delays.
            </p>
          </div>

          <div className="panel" style={{ padding: '28px', margin: 0, textAlign: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, margin: '0 auto 14px' }}>
              3
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Instant One Click Download</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
              Download your clean result file immediately to your device. When you close the tab, all memory is instantly purged.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose DocBrio by Vibeans Solutions Section */}
      <section id="why-docbrio" style={{ margin: '60px 0 40px', scrollMarginTop: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Why Professionals Prefer DocBrio
          </h2>
          <p style={{ color: 'var(--ink-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            Engineered to overcome the slow uploads, strict limits, and severe privacy hazards of cloud based document utilities.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'grid', placeItems: 'center', color: '#34d399', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <b>Zero Remote Transmission</b>
            <span style={{ WebkitLineClamp: 4 }}>
              Your confidential contracts, tax returns, and identity cards never touch an external server or third party cloud storage.
            </span>
          </div>

          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', display: 'grid', placeItems: 'center', color: '#60a5fa', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <b>Hardware Acceleration</b>
            <span style={{ WebkitLineClamp: 4 }}>
              Powered by modern WebAssembly and in browser Canvas manipulation, rendering files in fractions of a second with zero network lag.
            </span>
          </div>

          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255, 122, 0, 0.15)', border: '1px solid rgba(255, 122, 0, 0.3)', display: 'grid', placeItems: 'center', color: 'var(--vibeans-orange)', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <b>No File Limits or Watermarks</b>
            <span style={{ WebkitLineClamp: 4 }}>
              No arbitrary 10MB limits, forced account creations, or annoying watermark overlays. Pure, unadulterated productivity for free.
            </span>
          </div>

          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'grid', placeItems: 'center', color: '#a78bfa', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <b>Enterprise Architecture</b>
            <span style={{ WebkitLineClamp: 4 }}>
              Crafted by Vibeans Solutions with strict cognitive UX design, ergonomic responsiveness, and reliable memory safety.
            </span>
          </div>
        </div>
      </section>

      {/* Vibeans Solutions Enterprise Architecture Showcase */}
      <section id="vibeans-showcase" className="vibeans-arch-section" style={{ scrollMarginTop: '90px' }}>
        <div className="vibeans-arch-header">
          <h2 className="vibeans-arch-title">
            Engineered by Vibeans Solutions
          </h2>
          <p className="vibeans-arch-subtitle">
            DocBrio executes entirely inside client side browser memory. Discover how our zero telemetry architecture guarantees absolute confidentiality for every document.
          </p>
        </div>

        {/* 3 Stage Architectural Pipeline */}
        <div className="vibeans-pipeline-grid">
          {/* Stage 1 */}
          <div className="vibeans-pipeline-card">
            <div className="pipeline-card-top">
              <div className="pipeline-icon blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="pipeline-step-badge">STAGE 01</span>
            </div>
            <h3 className="pipeline-card-title">Isolated Local Ingestion</h3>
            <p className="pipeline-card-desc">
              Files are streamed directly into your browser V8 sandbox. Zero network packets or file chunks are ever transmitted across external cloud servers.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">RUNTIME:</span>
              <span className="spec-val">100% In Browser RAM</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="vibeans-pipeline-card">
            <div className="pipeline-card-top">
              <div className="pipeline-icon purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="pipeline-step-badge">STAGE 02</span>
            </div>
            <h3 className="pipeline-card-title">WebAssembly Acceleration</h3>
            <p className="pipeline-card-desc">
              Compiled WebAssembly binaries execute document parsing, rasterization, and vector transformations with near native desktop CPU performance.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">LATENCY:</span>
              <span className="spec-val">Zero Server Roundtrips</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="vibeans-pipeline-card">
            <div className="pipeline-card-top">
              <div className="pipeline-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span className="pipeline-step-badge">STAGE 03</span>
            </div>
            <h3 className="pipeline-card-title">Instant Memory Eviction</h3>
            <p className="pipeline-card-desc">
              All allocated document buffers and canvas objects are immediately dereferenced upon task completion or tab close. Zero persistence, zero tracking.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">STORAGE:</span>
              <span className="spec-val">Zero Cloud Footprint</span>
            </div>
          </div>
        </div>

        {/* Agency Studio Callout Bar */}
        <div className="vibeans-agency-dock">
          <div className="agency-dock-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vibeans-logo.png"
              alt="Vibeans Solutions Logo"
              width="44"
              height="44"
              className="agency-dock-logo"
            />
            <div>
              <div className="agency-dock-name-row">
                <h4 className="agency-dock-name">Vibeans Solutions</h4>
                <span className="agency-dock-tag">WE BUILD • YOU GROW</span>
              </div>
              <p className="agency-dock-desc">
                Premier software engineering studio architecting enterprise AI platforms, bespoke web software, and high performance client systems.
              </p>
            </div>
          </div>

          <div className="agency-dock-actions">
            <a
              href="https://www.vibeanssolutions.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="agency-dock-btn primary"
            >
              <span>Visit Agency Site</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
            <Link href="/contact/" className="agency-dock-btn secondary">
              <span>Contact Engineering &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section id="faqs" className="panel info" style={{ maxWidth: '980px', margin: '40px auto', scrollMarginTop: '90px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Frequently Asked Questions
        </h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '20px' }}>
          Everything you need to know about DocBrio&apos;s privacy model, features, and file security.
        </p>

        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
