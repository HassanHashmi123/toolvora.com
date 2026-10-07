import ContactClient from '../../components/ContactClient';

export const metadata = {
  title: 'Contact Engineering & Vibeans Solutions',
  description:
    'Get in touch with the DocBrio development team and Vibeans Solutions for support, feature requests, partnership, or custom enterprise software development.',
};

export default function ContactPage() {
  return (
    <>
      <div className="contact-page-header">
        <h1 className="contact-hero-title">Get in Touch with Our Team</h1>
        <p className="contact-hero-sub">
          Have feedback on a document tool, found a bug, or looking to architect custom enterprise software with <b>Vibeans Solutions</b>? We respond promptly across all official channels.
        </p>

        <div className="contact-trust-row">
          <div className="contact-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Fast Response Time (&lt; 4 Hours)</span>
          </div>
          <span className="trust-sep">•</span>
          <div className="contact-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Direct Engineering Access</span>
          </div>
          <span className="trust-sep">•</span>
          <div className="contact-trust-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Zero Automated Gatekeepers</span>
          </div>
        </div>
      </div>

      {/* Interactive Contact Hub */}
      <ContactClient />
    </>
  );
}
