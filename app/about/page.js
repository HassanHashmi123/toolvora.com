import Link from 'next/link';

export const metadata = {
  title: 'About DocBrio & Vibeans Solutions | Enterprise Document Engine',
  description:
    'Learn about DocBrio, the in browser document processing suite engineered by Vibeans Solutions (Top IT Company & AI Agency). Meet our developer Hassan Hashmi and CEO.',
};

export default function AboutPage() {
  return (
    <>
      <div className="panel" style={{ borderTop: '3px solid var(--vibeans-orange)' }}>
        <div className="section-eyebrow">
          ENGINEERED BY VIBEANS SOLUTIONS
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)' }}>Empowering Document Privacy with In Browser Computing</h1>
        <p className="sub" style={{ fontSize: '16px' }}>
          DocBrio was conceived and built by <b>Vibeans Solutions</b> to solve a pervasive digital dilemma: why should you hand over private documents, confidential contracts, and personal identities to third party cloud servers just to convert or edit them?
        </p>

        <div className="about-pillars-grid">
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>🔒</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>100% Local Processing</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              All parsing, rendering, and file encoding happens inside your browser using WebAssembly. Nothing is ever sent across the wire.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>⚡</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>Sub Second Latency</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              Eliminating the cloud upload and download bottleneck means conversions execute immediately against your local machine.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--line)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>💎</div>
            <b style={{ color: '#fff', fontSize: '16px', display: 'block', marginBottom: 4 }}>Forever Free & Clean</b>
            <p style={{ color: 'var(--ink-muted)', fontSize: '13.5px', margin: 0 }}>
              No subscriptions, no artificial page limits, and zero watermark injections. High quality tools built for everyday productivity.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', marginTop: 36 }}>Leadership & Engineering Team</h2>
        <p style={{ color: 'var(--ink-secondary)', marginBottom: 20 }}>
          Meet the minds behind DocBrio&apos;s architecture and Vibeans Solutions&apos; product division:
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
              Specializing in full stack web architectures, client side Wasm systems, and cognitive UX design. Architected DocBrio&apos;s core file processing pipeline.
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
              Leading Vibeans Solutions into the future of enterprise software, bespoke AI integrations, and high impact digital consulting for international enterprises.
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
            <b>Vibeans Solutions</b> is a premier software development house & AI agency recognized for crafting scalable enterprise applications, modern SaaS platforms, and intelligent machine learning solutions.
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
