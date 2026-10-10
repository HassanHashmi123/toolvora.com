import Link from 'next/link';

export const metadata = {
  title: '404: Page Not Found',
  description: 'The requested tool or page was not found.',
};

export default function NotFound() {
  return (
    <div className="panel" style={{ textAlign: 'center', padding: '60px 24px', borderTop: '3px solid var(--vibeans-orange)' }}>
      <div className="vibeans-badge-pill" style={{ margin: '0 auto 16px' }}>
        <span>●</span>
        <span>404 Error</span>
      </div>
      <h1 style={{ fontSize: '76px', margin: '0 0 10px', color: 'var(--vibeans-orange)', fontWeight: 900, letterSpacing: '-0.03em' }}>
        404
      </h1>
      <h2 style={{ fontSize: '26px', margin: '0 0 14px', color: '#fff', fontWeight: 800 }}>
        Document or Page Not Found
      </h2>
      <p className="sub" style={{ maxWidth: '520px', margin: '0 auto 28px' }}>
        The link you followed may be outdated, or the tool has moved. Explore our popular tools below or return to the main dashboard.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <Link href="/" className="btn">
          Back to All Tools
        </Link>
        <Link href="/tools/pdf-to-word/" className="btn alt">
          PDF to Word
        </Link>
        <Link href="/tools/image-compressor/" className="btn alt">
          Compress Image
        </Link>
      </div>
    </div>
  );
}
