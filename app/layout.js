import './globals.css';
import Link from 'next/link';
import { SITE } from '../lib/tools';
import Nav from '../components/Nav';
import DocBrioLogo from '../components/DocBrioLogo';
import ScrollControls from '../components/ScrollControls';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'DocBrio by Vibeans Solutions | Free Online PDF, Office & Image Suite',
    template: '%s | DocBrio by Vibeans Solutions',
  },
  description:
    'Free enterprise grade online tools: PDF to Word, PDF to Excel, Word to PDF, Merge PDF, Edit PDF, Compress Images, QR codes and more. 100% in browser processing with zero server uploads.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'DocBrio by Vibeans Solutions | Free Online PDF & Document Suite',
    description: '100% in browser file conversion and PDF tools. Fast, private, zero server logs.',
    url: SITE,
    siteName: 'DocBrio by Vibeans Solutions',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
};

export default function RootLayout({ children }) {
  const ad = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        {ad && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ad}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <header>
          <div className="bar">
            <Link className="logo" href="/" aria-label="DocBrio Home">
              <DocBrioLogo size={36} showWordmark={true} />
            </Link>

            <Nav />
          </div>
        </header>

        <main>{children}</main>

        <footer>
          <div className="footer-inner">
            <div className="footer-grid">
              {/* Column 1: Brand & Engineering Excellence */}
              <div className="footer-col footer-col-brand">
                <Link className="logo" href="/" style={{ marginBottom: 14 }} aria-label="DocBrio Home">
                  <DocBrioLogo size={30} showWordmark={true} />
                </Link>
                <p className="footer-brand-desc">
                  DocBrio is a high performance in browser document processing suite engineered by <b>Vibeans Solutions</b>. All computations execute inside client side memory with zero server uploads.
                </p>
                <div className="footer-accreditation-card">
                  <div className="accreditation-header">
                    <span className="accreditation-dot" />
                    <span className="accreditation-title">ENGINEERING LEADERSHIP</span>
                  </div>
                  <div className="accreditation-members">
                    <a
                      href="https://www.linkedin.com/in/hassan-hashmi-266b032a4/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accreditation-chip"
                      title="Hassan Hashmi on LinkedIn"
                    >
                      <span className="chip-avatar blue">HH</span>
                      <span className="chip-details">
                        <span className="chip-name">Hassan Hashmi</span>
                        <span className="chip-role">Lead Architect</span>
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chip-arrow">
                        <path d="M7 17l9.2-9.2M17 17V8H8" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/code-with-deved/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accreditation-chip"
                      title="Tayyab Ali on LinkedIn"
                    >
                      <span className="chip-avatar orange">TA</span>
                      <span className="chip-details">
                        <span className="chip-name">Tayyab Ali</span>
                        <span className="chip-role">CEO</span>
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="chip-arrow">
                        <path d="M7 17l9.2-9.2M17 17V8H8" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 2: Document & PDF Suite */}
              <div className="footer-col">
                <h3 className="footer-col-title">Document Suite</h3>
                <ul className="footer-links">
                  <li><Link href="/tools/pdf-to-word/">PDF to Word</Link></li>
                  <li><Link href="/tools/pdf-to-excel/">PDF to Excel</Link></li>
                  <li><Link href="/tools/word-to-pdf/">Word to PDF</Link></li>
                  <li><Link href="/tools/powerpoint-to-pdf/">PowerPoint to PDF</Link></li>
                  <li><Link href="/tools/merge-pdf/">Merge PDF</Link></li>
                  <li><Link href="/tools/edit-pdf/">Edit PDF</Link></li>
                  <li><Link href="/tools/sign-pdf/">Sign PDF</Link></li>
                  <li><Link href="/tools/crop-pdf/">Crop PDF</Link></li>
                </ul>
              </div>

              {/* Column 3: Media & Utility Tools */}
              <div className="footer-col">
                <h3 className="footer-col-title">Media & Utilities</h3>
                <ul className="footer-links">
                  <li><Link href="/tools/image-compressor/">Image Compressor</Link></li>
                  <li><Link href="/tools/png-to-webp/">PNG to WebP</Link></li>
                  <li><Link href="/tools/webp-to-jpg/">WebP to JPG</Link></li>
                  <li><Link href="/tools/jpg-to-png/">JPG to PNG</Link></li>
                  <li><Link href="/tools/qr-code-generator/">QR Code Generator</Link></li>
                  <li><Link href="/tools/password-generator/">Password Generator</Link></li>
                  <li><Link href="/tools/word-counter/">Word Counter</Link></li>
                  <li><Link href="/tools/case-converter/">Case Converter</Link></li>
                </ul>
              </div>

              {/* Column 4: Agency Connect & Direct Access */}
              <div className="footer-col footer-col-agency">
                <div className="footer-agency-head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/vibeans-logo.png"
                    alt="Vibeans Solutions Logo"
                    width="44"
                    height="44"
                    className="footer-agency-avatar"
                  />
                  <div>
                    <h3 className="footer-agency-name">Vibeans Solutions</h3>
                    <span className="footer-agency-tag">
                      WE BUILD • YOU GROW
                    </span>
                  </div>
                </div>
                <p className="footer-agency-desc">
                  Partner with our engineering team for enterprise AI, bespoke web apps, and modern SaaS architecture.
                </p>

                <div className="footer-contact-actions">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=vibeanssolutions@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-action email"
                    title="Compose on Gmail"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="action-label">vibeanssolutions@gmail.com</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="action-external">
                      <path d="M7 17l9.2-9.2M17 17V8H8" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/923711191446"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-action whatsapp"
                    title="Chat on WhatsApp"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 0C5.396 0 .016 5.38.016 12.015c0 2.119.553 4.186 1.603 6.009L0 24l6.169-1.618a11.968 11.968 0 0 0 5.862 1.516h.005c6.634 0 12.016-5.38 12.016-12.016 0-3.208-1.25-6.223-3.518-8.491A11.936 11.936 0 0 0 12.031 0zm-.005 21.892h-.004a9.92 9.92 0 0 1-5.056-1.385l-.363-.215-3.754.985 1.002-3.66-.236-.376a9.946 9.946 0 0 1-1.528-5.226c0-5.485 4.463-9.948 9.95-9.948 2.657 0 5.155 1.036 7.033 2.915 1.877 1.88 2.911 4.378 2.91 7.037-.001 5.486-4.464 9.948-9.954 9.948z" />
                    </svg>
                    <span className="action-label">WhatsApp (+92 371 1191446)</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="action-external">
                      <path d="M7 17l9.2-9.2M17 17V8H8" />
                    </svg>
                  </a>
                </div>

                <div className="footer-social-grid">
                  <a href="https://www.vibeanssolutions.site/" target="_blank" rel="noopener noreferrer" className="footer-social-card" title="Official Website">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Website</span>
                  </a>
                  <a href="https://www.linkedin.com/company/vibeanssolutions" target="_blank" rel="noopener noreferrer" className="footer-social-card" title="LinkedIn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.67-.75 1.67-1.67s-.75-1.67-1.67-1.67-1.67.75-1.67 1.67.75 1.67 1.67 1.67m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://www.instagram.com/vibeanssolutions/" target="_blank" rel="noopener noreferrer" className="footer-social-card" title="Instagram">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61593058145041" target="_blank" rel="noopener noreferrer" className="footer-social-card" title="Facebook">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-bottom-copy">
                &copy; {new Date().getFullYear()} <b>DocBrio</b>. Precision engineered by{' '}
                <a href="https://www.vibeanssolutions.site/" target="_blank" rel="noopener noreferrer" className="footer-agency-link">
                  Vibeans Solutions
                </a>
                . All rights reserved.
              </div>

              <div className="footer-bottom-links">
                <Link href="/privacy-policy/">Privacy Policy</Link>
                <span className="footer-link-dot">•</span>
                <Link href="/terms/">Terms of Service</Link>
                <span className="footer-link-dot">•</span>
                <Link href="/contact/">Contact Engineering</Link>
                <span className="footer-link-dot">•</span>
                <Link href="/about/">About Agency</Link>
                <span className="footer-link-dot">•</span>
                <Link href="/blog/">Guides</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Smart Top-to-Bottom & Bottom-to-Top Navigation Dock */}
        <ScrollControls />
      </body>
    </html>
  );
}
