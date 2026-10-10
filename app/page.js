import Link from 'next/link';
import { tools, BRAND } from '../lib/tools';
import HomeClient from '../components/HomeClient';

export const metadata = {
  title: 'Free PDF, Office and Image Tools in Your Browser | DocBrio',
  description: 'Free online tools for PDF, Word, Excel, PowerPoint and images: convert, merge, edit, sign and compress. Files are processed in your browser, not uploaded.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Free PDF, Office and Image Tools in Your Browser | DocBrio', description: 'Free online tools for PDF, Word, Excel, PowerPoint and images: convert, merge, edit, sign and compress. Files are processed in your browser, not uploaded.', url: '/', siteName: BRAND, type: 'website' },
};

export default function Home() {
  const faqs = [
    {
      q: 'Are my files uploaded when I use DocBrio?',
      a: 'No. The tools read and convert your files inside your browser, so the files are not sent to DocBrio. Two things do use the network: the code libraries that some tools need are downloaded from public CDNs, and the Email Verifier looks up the domain of an address through a public DNS service.',
    },
    {
      q: 'Is DocBrio free, and are there limits?',
      a: 'It is free, with no signup and no watermark. There is no fixed file size limit, but very large files are limited by the memory of your device. The site is meant to be paid for by advertising.',
    },
    {
      q: 'Who makes DocBrio?',
      a: 'DocBrio is built and maintained by Vibeans Solutions, a software company. It was developed by Hassan Hashmi, and the company is led by Tayyab Ali.',
    },
    {
      q: 'Can I use DocBrio on a phone or tablet?',
      a: 'Yes. The pages adapt to small screens and work in current browsers on Android, iPhone and iPad, as well as on Windows and Mac. No app is needed. Large files can be slow on older phones.',
    },
    {
      q: 'Can DocBrio read scanned PDFs?',
      a: 'Partly. PDF to Word and PDF to Excel use OCR in your browser for pages that are scans. The OCR recognises English text, is slower than a normal conversion and can make mistakes, so always check the result.',
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
          Convert, compress, edit, merge and sign PDFs, Office files and images.
          The work is done by your browser, so your files are not uploaded.
        </p>

        <div className="hero-cta-group">
          <a href="#tools-section" className="btn">
            <span>Explore All {tools.length} Tools</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </a>
          <a href="#why-docbrio" className="btn alt">
            <span>Why In Your Browser?</span>
          </a>
        </div>

        {/* Hero Trust Highlights Bar */}
        <div className="hero-trust-bar">
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Files Are Not Uploaded</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Runs on Your Device</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>No Upload Wait</span>
          </div>
          <span className="hero-trust-sep">•</span>
          <div className="hero-trust-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--vibeans-orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Free, No Signup</span>
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
            Three steps, the same for every tool.
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
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Conversion in Your Browser</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
              The tool reads and converts the file on your own device. Some tools first download the code library they need.
            </p>
          </div>

          <div className="panel" style={{ padding: '28px', margin: 0, textAlign: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, margin: '0 auto 14px' }}>
              3
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Download the Result</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
              Save the result to your device. The site keeps no copy, and the file is gone from the page when you close the tab.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose DocBrio by Vibeans Solutions Section */}
      <section id="why-docbrio" style={{ margin: '60px 0 40px', scrollMarginTop: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Why Use DocBrio
          </h2>
          <p style={{ color: 'var(--ink-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            Most online converters upload your file to a server. DocBrio does the work in your browser instead.
          </p>
        </div>

        <div className="pillars-grid">
          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'grid', placeItems: 'center', color: '#34d399', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <b>Files Stay on Your Device</b>
            <span style={{ WebkitLineClamp: 4 }}>
              Contracts, CVs and identity documents are processed by your browser and are not sent to DocBrio or to anyone else.
            </span>
          </div>

          <div className="card" style={{ flexDirection: 'column' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', display: 'grid', placeItems: 'center', color: '#60a5fa', marginBottom: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <b>No Upload Wait</b>
            <span style={{ WebkitLineClamp: 4 }}>
              Because nothing is uploaded, speed depends on your device and the size of the file, not on your internet connection.
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
              No account, no watermark and no fixed size limit. Very large files are limited by the memory of your device.
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
            <b>Works on Phone and Computer</b>
            <span style={{ WebkitLineClamp: 4 }}>
              The tools run in current browsers on Android, iPhone, Windows and Mac. Nothing has to be installed.
            </span>
          </div>
        </div>
      </section>

      {/* How a file moves through a tool */}
      <section id="vibeans-showcase" className="vibeans-arch-section" style={{ scrollMarginTop: '90px' }}>
        <div className="vibeans-arch-header">
          <h2 className="vibeans-arch-title">
            Engineered by Vibeans Solutions
          </h2>
          <p className="vibeans-arch-subtitle">
            How a file moves through a DocBrio tool, from the moment you choose it to the download.
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
            <h3 className="pipeline-card-title">Your Browser Reads the File</h3>
            <p className="pipeline-card-desc">
              When you choose a file, your browser reads it from your device. The file is not sent to a server.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">RUNTIME:</span>
              <span className="spec-val">Your browser</span>
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
            <h3 className="pipeline-card-title">Processing on Your Device</h3>
            <p className="pipeline-card-desc">
              Open source libraries, loaded from public CDNs, do the conversion with JavaScript and, for some tools, WebAssembly.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">UPLOAD:</span>
              <span className="spec-val">None for your files</span>
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
            <h3 className="pipeline-card-title">Nothing Is Kept</h3>
            <p className="pipeline-card-desc">
              The result is offered as a download. DocBrio stores no copy, and the data is released when you close the tab.
            </p>
            <div className="pipeline-spec-chip">
              <span className="spec-label">STORAGE:</span>
              <span className="spec-val">No copy on our side</span>
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
                Software studio building web applications, AI integrations and browser based tools.
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
