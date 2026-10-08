'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

const CATEGORY_ORDER = ['PDF', 'Convert', 'Image', 'Generators', 'Text'];

const CATEGORY_META = {
  PDF: {
    id: 'PDF',
    name: 'Manage & Edit PDF',
    tabLabel: 'PDF Suite',
    desc: 'Merge, edit, sign, and crop PDF documents with zero server uploads.',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.14)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  Convert: {
    id: 'Convert',
    name: 'Document & Office Converters',
    tabLabel: 'Converters',
    desc: 'High fidelity conversion between PDF, Word DOCX, Excel spreadsheets, and PowerPoint presentations.',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.14)',
    border: 'rgba(59, 130, 246, 0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  Image: {
    id: 'Image',
    name: 'Image Studio & Converters',
    tabLabel: 'Image Studio',
    desc: 'High speed image compression and format conversion across WebP, PNG, JPG, AVIF, and ICO.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  Generators: {
    id: 'Generators',
    name: 'Security, QR & Verification',
    tabLabel: 'Generators',
    desc: 'Cryptographic password generation, scannable QR codes, and intelligent email verification created entirely on device.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.14)',
    border: 'rgba(16, 185, 129, 0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  Text: {
    id: 'Text',
    name: 'Text & Content Utilities',
    tabLabel: 'Text Tools',
    desc: 'Analyze word counts, sentence metrics, reading speed, and transform letter casing styles.',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.14)',
    border: 'rgba(139, 92, 246, 0.3)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
};

export default function HomeClient({ tools }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const input = document.getElementById('global-tool-search');
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const featuredSlugs = ['pdf-to-word', 'edit-pdf', 'image-compressor', 'sign-pdf', 'word-to-pdf', 'merge-pdf'];

  const categoriesList = useMemo(() => {
    return [
      { id: 'All', label: `All ${tools.length} Tools`, count: tools.length },
      ...CATEGORY_ORDER.map((c) => ({
        id: c,
        label: CATEGORY_META[c].tabLabel,
        count: tools.filter((t) => t.cat === c).length,
      })),
    ];
  }, [tools]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return tools.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.sub.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.cat.toLowerCase().includes(q)
    );
  }, [tools, search]);

  const renderToolCard = (t) => {
    const isFeatured = featuredSlugs.includes(t.slug);
    return (
      <Link key={t.slug} className="card" href={`/tools/${t.slug}/`}>
        <div className={`badge ${t.cls}`}>{t.badge}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <b>{t.name}</b>
            {isFeatured && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255, 122, 0, 0.15)',
                  color: 'var(--vibeans-orange)',
                  border: '1px solid rgba(255, 122, 0, 0.3)',
                }}
              >
                Popular
              </span>
            )}
          </div>
          <span>{t.sub}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: '12px', color: 'var(--vibeans-blue-light)', fontWeight: 600 }}>
            <span>Launch Tool</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
  };

  const renderCategorySection = (catKey) => {
    const meta = CATEGORY_META[catKey];
    if (!meta) return null;
    const catTools = tools.filter((t) => t.cat === catKey);
    return (
      <div key={catKey} className="category-section" id={`category-${catKey.toLowerCase()}`}>
        <div className="category-section-header">
          <div className="category-header-left">
            <div
              className="category-icon-box"
              style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}
            >
              {meta.icon}
            </div>
            <div>
              <div className="category-title-row">
                <h2 className="category-section-title">{meta.name}</h2>
                <span
                  className="category-count-badge"
                  style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                >
                  {catTools.length} Tools
                </span>
              </div>
              <p className="category-section-desc">{meta.desc}</p>
            </div>
          </div>
          {activeCat !== 'All' && (
            <button
              type="button"
              className="cat-view-all-btn"
              onClick={() => setActiveCat('All')}
            >
              <span>View All Categories</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid">
          {catTools.map((t) => renderToolCard(t))}
        </div>
      </div>
    );
  };

  return (
    <section id="tools-section" className="filter-section" style={{ scrollMarginTop: '90px' }}>
      {/* Sleek Search Bar */}
      <div className="search-input-wrap">
        <div className="search-icon-box" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          id="global-tool-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 27+ tools (e.g. Email Verifier, PDF to Word, Compress, WebP, Sign...)"
          className="search-input"
          aria-label="Search tools"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="search"
          spellCheck="false"
        />
        {search ? (
          <button
            onClick={() => setSearch('')}
            className="search-clear-btn"
            title="Clear search"
            aria-label="Clear search input"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <div className="search-kbd-hint" aria-hidden="true">
            <kbd className="kbd-key">⌘</kbd>
            <kbd className="kbd-key">K</kbd>
          </div>
        )}
      </div>

      {/* Interactive Category Filter Tabs */}
      <div className="category-tabs" role="tablist">
        {categoriesList.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={activeCat === c.id}
            className={`cat-tab ${activeCat === c.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCat(c.id);
              if (search) setSearch('');
            }}
          >
            {c.label} <span style={{ opacity: 0.7, fontSize: '11px', marginLeft: 4 }}>({c.count})</span>
          </button>
        ))}
      </div>

      {/* Categorized Tools Directory / Search View */}
      <div className="tools-directory-content">
        {searchResults !== null ? (
          searchResults.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', padding: '50px 20px', margin: '30px 0' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>No matching tools found</h3>
              <p style={{ color: 'var(--ink-muted)', marginBottom: '18px' }}>
                We could not find any tool matching &quot;{search}&quot;. Try searching for &quot;PDF&quot;, &quot;Word&quot;, &quot;Image&quot;, or &quot;Convert&quot;.
              </p>
              <button
                className="btn"
                onClick={() => {
                  setSearch('');
                  setActiveCat('All');
                }}
              >
                View All {tools.length} Tools
              </button>
            </div>
          ) : (
            <div>
              <div className="search-results-header">
                <div>
                  <h2 className="search-results-title">Search Results for &quot;{search}&quot;</h2>
                  <span className="search-results-count">
                    Found <b>{searchResults.length}</b> {searchResults.length === 1 ? 'matching tool' : 'matching tools'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn alt"
                  style={{ margin: 0, padding: '7px 14px', fontSize: '13px' }}
                  onClick={() => setSearch('')}
                >
                  Clear Search
                </button>
              </div>
              <div className="grid">
                {searchResults.map((t) => renderToolCard(t))}
              </div>
            </div>
          )
        ) : activeCat === 'All' ? (
          <div>
            {CATEGORY_ORDER.map((catKey) => renderCategorySection(catKey))}
          </div>
        ) : (
          renderCategorySection(activeCat)
        )}
      </div>
    </section>
  );
}
