'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

export default function HomeClient({ tools }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    function handleKeyDown(e) {
      // Check for Cmd+K, Ctrl+K, or slash key when not in an active input
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

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(tools.map((t) => t.cat))];
    return cats;
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = activeCat === 'All' || t.cat === activeCat;
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query) ||
        t.sub.toLowerCase().includes(query) ||
        t.slug.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [tools, activeCat, search]);

  const featuredSlugs = ['pdf-to-word', 'edit-pdf', 'image-compressor', 'sign-pdf', 'word-to-pdf', 'merge-pdf'];

  return (
    <section id="tools-section" className="filter-section" style={{ scrollMarginTop: '90px' }}>
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
          placeholder="Search 26+ tools (e.g. PDF to Word, Compress, WebP, Sign, Merge, Crop...)"
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

      <div className="category-tabs" role="tablist">
        {categories.map((c) => {
          const count = c === 'All' ? tools.length : tools.filter((t) => t.cat === c).length;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={activeCat === c}
              className={`cat-tab ${activeCat === c ? 'active' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c} <span style={{ opacity: 0.7, fontSize: '11px', marginLeft: 4 }}>({count})</span>
            </button>
          );
        })}
      </div>

      <div className="tools-header-row">
        <h2 className="cat" style={{ margin: 0 }}>
          {activeCat === 'All' ? 'Available Document & Media Tools' : `${activeCat} Tools`}
        </h2>
        <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
          Showing <b>{filteredTools.length}</b> of {tools.length} tools
        </span>
      </div>

      {filteredTools.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '50px 20px', margin: '30px 0' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>No matching tools found</h3>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '18px' }}>
            We couldn't find any tool matching &quot;{search}&quot;. Try searching for &quot;PDF&quot;, &quot;Word&quot;, &quot;Image&quot;, or &quot;Convert&quot;.
          </p>
          <button className="btn" onClick={() => { setSearch(''); setActiveCat('All'); }}>
            View All Tools
          </button>
        </div>
      ) : (
        <div className="grid">
          {filteredTools.map((t) => {
            const isFeatured = featuredSlugs.includes(t.slug);
            return (
              <Link key={t.slug} className="card" href={`/tools/${t.slug}/`}>
                <div className={`badge ${t.cls}`}>
                  {t.badge}
                </div>
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
          })}
        </div>
      )}
    </section>
  );
}
