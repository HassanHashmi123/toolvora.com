import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | DocBrio by Vibeans Solutions',
  description: 'Terms of service and acceptable use guidelines for the DocBrio document productivity suite.',
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
          DocBrio tools are provided for lawful, productive purposes. You may use our tools for personal, educational, and commercial document tasks. Because all operations execute locally on your device, you remain solely responsible for the content and legality of the documents you process.
        </p>

        <h2>3. Disclaimer of Warranties</h2>
        <p>
          DocBrio is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. While we strive for high conversion fidelity and numerical precision across all formats, we recommend always retaining original backup copies of your files.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          DocBrio, its design system, code, and branding are the intellectual property of <b>Vibeans Solutions</b>. Your files and converted output remain 100% your exclusive property at all times.
        </p>
      </div>
    </>
  );
}
