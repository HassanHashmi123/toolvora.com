'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('manage');
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [path]);

  // Automatically close mobile menu if screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside listener for Tools dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setToolsOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Handle smooth scroll when navigating to hash from other pages
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const id = window.location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(handleHash, 180);
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [path]);

  // Smooth scroll handler for in-page anchors
  const handleNavScroll = (e, sectionId) => {
    setToolsOpen(false);
    setMobileOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }

    if (path === '/' || path === '') {
      e.preventDefault();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', `/#${sectionId}`);
        }
      }, 30);
    }
  };

  // Quick search action (focuses search input if on home, or navigates home with hash)
  const handleQuickSearch = () => {
    setToolsOpen(false);
    setMobileOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }

    const input = document.getElementById('global-tool-search') || document.querySelector('.search-input');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 350);
    } else {
      window.location.href = '/#tools-section';
    }
  };

  const toolCategories = [
    {
      id: 'manage',
      name: 'Manage & Edit PDF',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      items: [
        { name: 'Merge PDF', slug: 'merge-pdf', desc: 'Combine multiple PDFs into one document' },
        { name: 'Edit PDF', slug: 'edit-pdf', desc: 'Add text, whiteout mistakes & draw' },
        { name: 'Sign PDF', slug: 'sign-pdf', desc: 'Draw, type & place your signature' },
        { name: 'Crop PDF', slug: 'crop-pdf', desc: 'Trim margins or crop specific areas' },
      ],
    },
    {
      id: 'convert',
      name: 'Document Converters',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.15)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      items: [
        { name: 'PDF to Word', slug: 'pdf-to-word', desc: 'Convert PDF to editable .docx' },
        { name: 'Word to PDF', slug: 'word-to-pdf', desc: 'Convert .docx files to PDF' },
        { name: 'PDF to Excel', slug: 'pdf-to-excel', desc: 'Extract PDF tables to .xlsx sheets' },
        { name: 'PowerPoint to PDF', slug: 'powerpoint-to-pdf', desc: 'Turn .pptx slides into PDF' },
        { name: 'PDF to PowerPoint', slug: 'pdf-to-powerpoint', desc: 'Export PDF pages to .pptx slides' },
      ],
    },
    {
      id: 'image',
      name: 'Image Studio',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      items: [
        { name: 'Image Compressor', slug: 'image-compressor', desc: 'Reduce JPG & PNG size with preview' },
        { name: 'PNG to WebP', slug: 'png-to-webp', desc: 'Ultra small modern web images' },
        { name: 'WebP to JPG', slug: 'webp-to-jpg', desc: 'Universal device compatibility' },
        { name: 'JPG to PNG', slug: 'jpg-to-png', desc: 'Lossless format conversion' },
        { name: 'PNG to ICO', slug: 'png-to-ico', desc: 'Generate multi size favicons' },
        { name: 'AVIF to PNG', slug: 'avif-to-png', desc: 'Convert next gen AVIF to PNG' },
      ],
    },
    {
      id: 'tools',
      name: 'Security & Text',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      items: [
        { name: 'QR Code Generator', slug: 'qr-code-generator', desc: 'Generate high res scannable QR PNG' },
        { name: 'Password Generator', slug: 'password-generator', desc: 'Cryptographic secure passwords' },
        { name: 'Word Counter', slug: 'word-counter', desc: 'Words, characters & reading time' },
        { name: 'Case Converter', slug: 'case-converter', desc: 'Uppercase, lowercase, title case' },
      ],
    },
  ];

  return (
    <>
      {/* Desktop Main Navigation */}
      <nav className="saas-nav" aria-label="Main Navigation">
        {/* Tools Mega-Dropdown Trigger */}
        <div className="nav-dropdown-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`nav-link-btn ${toolsOpen ? 'active' : ''}`}
            onClick={() => setToolsOpen(!toolsOpen)}
            aria-expanded={toolsOpen}
            aria-haspopup="true"
          >
            <span>All Tools</span>
            <svg
              className={`chevron-icon ${toolsOpen ? 'rotate' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Solid Mega-Dropdown Panel */}
          {toolsOpen && (
            <div className="mega-dropdown" role="menu">
              <div className="mega-dropdown-grid">
                {toolCategories.map((cat) => (
                  <div key={cat.id} className="mega-col">
                    <div className="mega-col-header">
                      <div className="mega-col-icon" style={{ background: cat.bg }}>
                        {cat.icon}
                      </div>
                      <b>{cat.name}</b>
                    </div>
                    <div className="mega-items-list">
                      {cat.items.map((it, idx) => (
                        <Link
                          key={idx}
                          href={`/tools/${it.slug}/`}
                          className="mega-item"
                          onClick={() => setToolsOpen(false)}
                          role="menuitem"
                        >
                          <div className="mega-item-title">{it.name}</div>
                          <div className="mega-item-desc">{it.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mega-Dropdown Bottom Bar */}
              <div className="mega-bottom-bar">
                <div className="mega-bottom-info">
                  <span className="dot-pulse" />
                  <span>26+ In Browser Tools • 100% Client Side Privacy • Zero Server Uploads</span>
                </div>
                <Link
                  href="/#tools-section"
                  className="mega-all-link"
                  onClick={(e) => handleNavScroll(e, 'tools-section')}
                >
                  <span>View All 26 Tools Directory</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Top-Level SaaS Nav Links */}
        <Link
          href="/#how-it-works"
          onClick={(e) => handleNavScroll(e, 'how-it-works')}
          className="saas-nav-link nav-secondary"
        >
          How It Works
        </Link>

        <Link
          href="/#why-docbrio"
          onClick={(e) => handleNavScroll(e, 'why-docbrio')}
          className="saas-nav-link nav-secondary"
        >
          Why DocBrio
        </Link>

        <Link
          href="/#vibeans-showcase"
          onClick={(e) => handleNavScroll(e, 'vibeans-showcase')}
          className="saas-nav-link nav-secondary"
        >
          Architecture
        </Link>

        <Link
          href="/#faqs"
          onClick={(e) => handleNavScroll(e, 'faqs')}
          className="saas-nav-link"
        >
          FAQ
        </Link>

        <Link
          href="/blog/"
          className={`saas-nav-link ${path.startsWith('/blog') ? 'active' : ''}`}
        >
          Guides
        </Link>

        <Link
          href="/contact/"
          className={`saas-nav-link ${path === '/contact/' ? 'active' : ''}`}
        >
          Contact
        </Link>
      </nav>

      {/* Right Actions Cluster */}
      <div className="nav-actions-cluster">
        {/* Sleek Minimalist Search Icon Button */}
        <button
          type="button"
          onClick={handleQuickSearch}
          className="nav-search-icon-btn"
          title="Quick search tools (/ or ⌘K)"
          aria-label="Search all tools"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Vibeans Solutions Agency CTA */}
        <a
          href="https://www.vibeanssolutions.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="vibeans-brand-cta"
          title="Visit Vibeans Solutions official agency site"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vibeans-logo.png"
            alt=""
            width="18"
            height="18"
            style={{ borderRadius: '50%', flexShrink: 0 }}
          />
          <span>Vibeans Solutions</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l9.2-9.2M17 17V8H8" />
          </svg>
        </a>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`saas-menu-btn ${mobileOpen ? 'open' : ''}`}
          aria-label={mobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer (Portaled to document.body to escape header backdrop-filter containing block) */}
      {mounted && mobileOpen && createPortal(
        <div
          className="mobile-drawer-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="mobile-drawer-panel">
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-title">Browse DocBrio Suite</div>
              <button
                type="button"
                className="mobile-close-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={handleQuickSearch}
              className="mobile-search-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search any document or image tool...</span>
            </button>

            {/* Category Filter Tabs inside Mobile Menu */}
            <div className="mobile-tabs-row">
              {toolCategories.map((c) => (
                <button
                  key={c.id}
                  className={`mobile-tab-btn ${mobileTab === c.id ? 'active' : ''}`}
                  onClick={() => setMobileTab(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Selected Category Tools List */}
            <div className="mobile-tools-scroll">
              {toolCategories
                .find((c) => c.id === mobileTab)
                ?.items.map((it, idx) => (
                  <Link
                    key={idx}
                    href={`/tools/${it.slug}/`}
                    className="mobile-tool-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div>
                      <b className="mobile-tool-name">{it.name}</b>
                      <span className="mobile-tool-desc">{it.desc}</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
            </div>

            {/* General Site Links */}
            <div className="mobile-drawer-links">
              <Link href="/#tools-section" onClick={(e) => handleNavScroll(e, 'tools-section')}>All Tools Directory</Link>
              <Link href="/#how-it-works" onClick={(e) => handleNavScroll(e, 'how-it-works')}>How It Works</Link>
              <Link href="/#why-docbrio" onClick={(e) => handleNavScroll(e, 'why-docbrio')}>Why DocBrio</Link>
              <Link href="/#vibeans-showcase" onClick={(e) => handleNavScroll(e, 'vibeans-showcase')}>Vibeans Architecture</Link>
              <Link href="/#faqs" onClick={(e) => handleNavScroll(e, 'faqs')}>Frequently Asked Questions</Link>
              <Link href="/blog/" onClick={() => setMobileOpen(false)}>Guides & Tutorials</Link>
              <Link href="/about/" onClick={() => setMobileOpen(false)}>About Vibeans Solutions</Link>
              <Link href="/contact/" onClick={() => setMobileOpen(false)}>Contact & Support</Link>
            </div>

            {/* Bottom Actions */}
            <div className="mobile-drawer-footer">
              <a
                href="https://www.vibeanssolutions.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-vibeans-cta"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <span>Visit Vibeans Solutions</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
