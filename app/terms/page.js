import { og } from '../../lib/tools';

const DESC = 'Terms of service and acceptable use for the DocBrio document and image tools.';
export const metadata = {
  title: 'Terms of Service',
  description: DESC,
  alternates: { canonical: '/terms/' },
  openGraph: og('Terms of Service', DESC, '/terms/'),
};

export default function Page() {
  return (
    <>
      <div className="panel" style={{ borderTop: '3px solid var(--vibeans-blue)' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)' }}>Terms of Service</h1>
        <p className="sub">Last updated: October 2026 • Product by Vibeans Solutions</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using DocBrio, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
        </p>

        <h2>2. Permitted Use</h2>
        <p>
          DocBrio tools are provided for lawful, productive purposes. You may use our tools for personal, educational, and commercial document tasks. Because your files are processed on your own device, you remain responsible for the content and legality of the documents you process.
        </p>

        <h2>3. Disclaimer of Warranties</h2>
        <p>
          DocBrio is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We work to make conversions accurate, but results can contain errors. Check every result before you rely on it, and keep the original copies of your files.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          DocBrio, its design system, code, and branding are the intellectual property of <b>Vibeans Solutions</b>. Your files and the results you create with the tools remain yours.
        </p>
      </div>
    </>
  );
}
