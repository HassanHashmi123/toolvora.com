import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Zero Server Data Guarantee | DocBrio by Vibeans Solutions',
  description:
    'Our strict zero server privacy policy: DocBrio processes all PDF and document conversions 100% client side in your browser memory. We never store, inspect, or transfer your files.',
};

export default function Page() {
  return (
    <>
      <div className="panel" style={{ borderTop: '3px solid #10b981' }}>
        <div className="section-eyebrow" style={{ color: '#34d399' }}>
          100% IN BROWSER PRIVACY PROTECTION
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)' }}>Privacy Policy & Data Security Charter</h1>
        <p className="sub">Last updated: October 2026 • Maintained by Vibeans Solutions</p>

        <h2>1. Client Side Processing Architecture</h2>
        <p>
          At DocBrio, privacy is not an afterthought: it is the foundational architectural pillar of our platform. Every tool (PDF to Word, PDF to Excel, Merge PDF, Sign PDF, Image Compression, etc.) executes strictly inside your web browser’s memory using modern client side technologies such as WebAssembly and JavaScript.
        </p>
        <p>
          <b>Your documents, spreadsheets, images, and text inputs are never uploaded to any remote server or stored in the cloud.</b> Once you close your browser tab, all transient data in memory is purged immediately.
        </p>

        <h2>2. Cookies and Advertising</h2>
        <p>
          We use Google AdSense to serve non intrusive advertisements that help keep DocBrio free for everyone. Google and its advertising partners may use cookies to serve ads based on prior visits to this or other websites. You may manage or opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </p>

        <h2>3. Analytics and Performance Monitoring</h2>
        <p>
          We may gather aggregated, privacy first telemetry (such as page visit counts and browser types) to ensure cross device compatibility. No personal file data, document names, or user content is ever collected.
        </p>

        <h2>4. Engineering & Corporate Contact</h2>
        <p>
          For privacy inquiries, technical security reports, or questions regarding this charter, please reach out to our engineering team at <b>vibeanssolutions@gmail.com</b> or message <b>Vibeans Solutions</b> on WhatsApp at <b>+92 371 1191446</b>.
        </p>
      </div>
    </>
  );
}
