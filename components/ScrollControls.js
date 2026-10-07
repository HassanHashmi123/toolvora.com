'use client';

import { useState, useEffect } from 'react';

export default function ScrollControls() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show top button if scrolled down past 200px
      setShowTop(scrollY > 200);

      // Show bottom button if more than 200px from the bottom
      setShowBottom(scrollY < scrollHeight - clientHeight - 200);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Only render container if at least one button is useful or show unified smart dock
  return (
    <aside className="smart-scroll-controls" aria-label="Page scroll navigation">
      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`scroll-control-btn scroll-top-btn ${showTop ? 'visible' : 'disabled'}`}
        title="Scroll to top of page (Home)"
        aria-label="Scroll to top of page"
        disabled={!showTop}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      <div className="scroll-control-divider" aria-hidden="true" />

      {/* Scroll to Bottom Button */}
      <button
        type="button"
        onClick={scrollToBottom}
        className={`scroll-control-btn scroll-bottom-btn ${showBottom ? 'visible' : 'disabled'}`}
        title="Scroll to bottom of page (Footer & Links)"
        aria-label="Scroll to bottom of page"
        disabled={!showBottom}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </aside>
  );
}
