import Link from 'next/link';
import { og } from '../../lib/tools';

const TITLE = 'About Us';
const DESC = 'Who builds DocBrio, why the tools process files in your browser instead of uploading them, and how to reach Vibeans Solutions.';
export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  openGraph: og(TITLE, DESC, '/about/'),
};

export default function AboutPage() {
  return (
    <>
      <div className="panel" style={{ borderTop: '3px solid var(--vibeans-orange)' }}>
        <div className="section-eyebrow">
          ENGINEERED BY VIBEANS SOLUTIONS
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)' }}>About DocBrio</h1>
        <p className="sub" style={{ fontSize: '16px' }}>
          DocBrio was built by <b>Vibeans Solutions</b> around one question: why should you have to upload a private document to somebody else&apos;s server just to convert or edit it?
        </p>

        <div className="about-pillars-grid">
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>🔒</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>Processing in Your Browser</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              Reading, converting and saving happen inside your browser, so your files are not uploaded. One tool is different: the Email Verifier looks up a domain name through public DNS.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>⚡</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>No Upload Wait</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              With no upload and no download from a server, the speed depends on your device and the size of the file.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>💎</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>Free to Use</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              No subscription, no signup and no watermark. The site is meant to be paid for by advertising.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', marginTop: 36 }}>Leadership & Engineering Team</h2>
        <p style={{ color: 'var(--ink-secondary)', marginBottom: 20 }}>
          The people behind DocBrio:
        </p>

        <div className="team-grid" style={{ margin: '0 0 36px' }}>
          <div className="team-card">
            <div className="team-card-head">
              <div className="team-avatar">HH</div>
              <div>
                <b>Hassan Hashmi</b>
                <span>Lead Architect & Developer</span>
              </div>
            </div>
            <p>
              Full stack web developer. Designed and built the DocBrio tools.
            </p>
            <a
              href="https://www.linkedin.com/in/hassan-hashmi-266b032a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="team-link"
            >
              <span>Connect on LinkedIn</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>

          <div className="team-card">
            <div className="team-card-head">
              <div className="team-avatar orange">TA</div>
              <div>
                <b>Tayyab Ali</b>
                <span>CEO @ Vibeans Solutions</span>
              </div>
            </div>
            <p>
              Leads Vibeans Solutions and its work in web software, AI integrations and consulting.
            </p>
            <a
              href="https://www.linkedin.com/in/code-with-deved/"
              target="_blank"
              rel="noopener noreferrer"
              className="team-link"
            >
              <span>Connect on LinkedIn</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>

        <div className="panel info" style={{ padding: '28px', margin: '30px 0 0', background: 'var(--bg-surface-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vibeans-logo.png"
              alt="Vibeans Solutions Crest"
              width="50"
              height="50"
              style={{ borderRadius: '50%', border: '2px solid rgba(255,122,0,0.5)', flexShrink: 0 }}
            />
            <div>
              <h2 style={{ fontSize: '20px', margin: 0 }}>About Vibeans Solutions</h2>
              <span style={{ fontSize: '11px', color: 'var(--vibeans-orange)', fontWeight: 700, letterSpacing: '0.04em' }}>WE BUILD • YOU GROW</span>
            </div>
          </div>
          <p style={{ color: 'var(--ink-secondary)' }}>
            <b>Vibeans Solutions</b> is a software development company that builds web applications, SaaS products and AI integrations for its clients.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
            <a
              href="https://www.vibeanssolutions.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ margin: 0 }}
            >
              <span>Explore Vibeans Solutions Website</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
            <a
              href="https://wa.me/923711191446"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-pill"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.884 2.79.885h.001c3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.375 8.188c-.141.398-.823.774-1.144.821-.321.047-.734.07-2.158-.518-1.713-.708-2.822-2.457-2.907-2.57-.085-.113-.694-.925-.694-1.765s.437-1.252.593-1.423c.155-.171.338-.214.451-.214s.226.002.324.007c.103.005.241-.039.377.288.141.339.48 1.171.522 1.257.042.086.07.186.014.299-.056.113-.085.184-.169.282-.085.099-.178.221-.254.296-.085.085-.173.177-.074.347.099.17.439.724.942 1.172.647.577 1.193.755 1.363.84.17.085.268.071.367-.043.099-.113.424-.494.537-.664.113-.17.226-.141.381-.085.155.056.988.466 1.157.551.17.085.283.127.324.198.043.071.043.41-.098.808z" />
              </svg>
              <span>Direct WhatsApp: +92 371 1191446</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
