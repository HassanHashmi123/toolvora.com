import './globals.css';
import Link from 'next/link';
import { tools, SITE } from '../lib/tools';
import Nav from '../components/Nav';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'ToolBoxFree - Free Online PDF, Word, Excel and Image Tools', template: '%s | ToolBoxFree' },
  description: 'Free online tools: PDF to Word, PDF to Excel, Word to PDF, merge PDF, compress images, QR codes and more. No signup. Files stay in your browser.',
};

export default function RootLayout({ children }) {
  const ad = process.env.NEXT_PUBLIC_ADSENSE_ID;
  return (
    <html lang="en">
      <head>
        {ad && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ad}`} crossOrigin="anonymous" />}
      </head>
      <body>
        <header><div className="bar">
          <Link className="logo" href="/"><i>T</i>ToolBoxFree</Link>
          <Nav links={[...tools.slice(0, 6).map((t) => ({ href: `/tools/${t.slug}/`, name: t.name })), { href: '/blog/', name: 'Blog' }]} />
        </div></header>
        <main>{children}</main>
        <footer>
          <Link href="/blog/">Blog</Link><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy-policy/">Privacy Policy</Link><Link href="/terms/">Terms</Link>
          <div style={{ marginTop: 8 }}>&copy; {new Date().getFullYear()} ToolBoxFree</div>
        </footer>
      </body>
    </html>
  );
}
