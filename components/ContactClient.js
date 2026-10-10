'use client';

import { useState } from 'react';

export default function ContactClient() {
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState('Technical Support');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const officialEmail = 'vibeanssolutions@gmail.com';
  const whatsappNumber = '+92 371 1191446';
  const whatsappLink = 'https://wa.me/923711191446';
  const agencyUrl = 'https://www.vibeanssolutions.site/';

  const handleCopyEmail = async () => {
    try { await navigator.clipboard.writeText(officialEmail); } catch { return; }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus('Please enter a brief message before sending.');
      return;
    }

    const emailSubject = encodeURIComponent(`[DocBrio: ${topic}] ${subject.trim() || 'Engineering Inquiry'}`);
    const emailBody = encodeURIComponent(
      `Name: ${name.trim() || 'Anonymous'}\nEmail: ${email.trim() || 'Not specified'}\nTopic: ${topic}\n\nMessage:\n${message.trim()}`
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${officialEmail}&su=${emailSubject}&body=${emailBody}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setStatus('Gmail composer launched with your message details ready!');
  };

  const topics = [
    'Technical Support',
    'Bug Report',
    'Custom Software',
    'Feature Request',
    'Partnership',
  ];

  return (
    <div className="contact-premium-wrapper">
      {/* 3 Core Communication Channels */}
      <div className="contact-channels-grid">
        {/* Card 1: Official Email */}
        <div className="contact-card">
          <div className="contact-card-top">
            <div className="contact-icon-badge blue" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <span className="contact-eyebrow">PRIMARY INBOX</span>
              <h3 className="contact-card-title">Official Email</h3>
            </div>
          </div>

          <p className="contact-card-desc">
            Email for partnerships, software consulting, security reports and formal requests.
          </p>

          <div className="contact-email-box">
            <span className="contact-email-text">{officialEmail}</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="contact-copy-btn"
              title="Copy email address"
              aria-label="Copy official email address"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ color: '#34d399' }}>Copied</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="contact-card-action">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${officialEmail}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-action blue"
              title="Compose on Gmail"
            >
              <span>Compose Email</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>

        {/* Card 2: WhatsApp Channel */}
        <div className="contact-card">
          <div className="contact-card-top">
            <div className="contact-icon-badge green" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 0C5.396 0 .016 5.38.016 12.015c0 2.119.553 4.186 1.603 6.009L0 24l6.169-1.618a11.968 11.968 0 0 0 5.862 1.516h.005c6.634 0 12.016-5.38 12.016-12.016 0-3.208-1.25-6.223-3.518-8.491A11.936 11.936 0 0 0 12.031 0zm-.005 21.892h-.004a9.92 9.92 0 0 1-5.056-1.385l-.363-.215-3.754.985 1.002-3.66-.236-.376a9.946 9.946 0 0 1-1.528-5.226c0-5.485 4.463-9.948 9.95-9.948 2.657 0 5.155 1.036 7.033 2.915 1.877 1.88 2.911 4.378 2.91 7.037-.001 5.486-4.464 9.948-9.954 9.948z" />
              </svg>
            </div>
            <div>
              <span className="contact-eyebrow">FASTEST RESPONSE</span>
              <h3 className="contact-card-title">Direct WhatsApp</h3>
            </div>
          </div>

          <p className="contact-card-desc">
            Direct line to our engineering team for rapid troubleshooting, bug reproduction, and instant conversational support.
          </p>

          <div className="contact-number-box">
            <span className="contact-number-label">Direct Line:</span>
            <span className="contact-number-text">{whatsappNumber}</span>
          </div>

          <div className="contact-card-action">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-action green"
            >
              <span>Chat on WhatsApp</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>

        {/* Card 3: Vibeans Solutions Agency Hub */}
        <div className="contact-card agency-card">
          <div className="contact-card-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/vibeans-logo.png"
              alt="Vibeans Solutions"
              width="44"
              height="44"
              className="contact-agency-mark"
            />
            <div>
              <span className="contact-eyebrow orange">SOFTWARE & AI AGENCY</span>
              <h3 className="contact-card-title">Vibeans Solutions</h3>
            </div>
          </div>

          <p className="contact-card-desc">
            See the services of Vibeans Solutions: web applications, browser based software and AI integrations.
          </p>

          <div className="contact-tagline-box">
            <span>WE BUILD • YOU GROW</span>
          </div>

          <div className="contact-card-action">
            <a
              href={agencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-agency-portal"
            >
              <span>Visit Agency Site</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Direct Message Composer */}
      <div className="contact-form-panel">
        <div className="contact-form-head">
          <span className="contact-eyebrow">DIRECT INQUIRY COMPOSER</span>
          <h2 className="contact-form-title">Send a Structured Message</h2>
          <p className="contact-form-sub">
            Choose a subject category, enter your details, and prepare your message to dispatch directly to our engineering desk.
          </p>
        </div>

        <form onSubmit={handleSendMessage} className="contact-form">
          {/* Category Pills */}
          <div className="contact-topics-row">
            <span className="topics-label">Topic:</span>
            <div className="topics-list">
              {topics.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`topic-pill ${topic === t ? 'active' : ''}`}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="contact-fields-grid">
            <div className="field-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="contact-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="contact-email">Your Email Address</label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@company.com"
                className="contact-input"
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="contact-subject">Subject (Optional)</label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={`e.g. Inquiring regarding ${topic}`}
              className="contact-input"
            />
          </div>

          <div className="field-group">
            <label htmlFor="contact-message">Message Details *</label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry, bug details, or project requirements..."
              className="contact-input contact-textarea"
              required
            />
          </div>

          {status && (
            <div className="contact-status-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{status}</span>
            </div>
          )}

          <div className="contact-form-actions">
            <button type="submit" className="btn-contact-submit">
              <span>Compose in Gmail</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <span className="contact-direct-hint">
              Direct dispatch via Gmail • Zero third party logging
            </span>
          </div>
        </form>
      </div>

      {/* Verified Leadership & Official Corporate Presence */}
      <div className="contact-leadership-section">
        <div className="contact-form-head" style={{ marginBottom: 20 }}>
          <span className="contact-eyebrow">VERIFIED PROFILES</span>
          <h2 className="contact-form-title">Executive Leadership & Official Channels</h2>
          <p className="contact-form-sub">
            Connect directly with the architects and executive directors behind DocBrio and Vibeans Solutions.
          </p>
        </div>

        <div className="leadership-cards-grid">
          {/* Leadership Card 1: Hassan Hashmi */}
          <div className="leadership-card">
            <div className="leadership-head">
              <div className="leader-avatar blue">HH</div>
              <div>
                <b className="leader-name">Hassan Hashmi</b>
                <span className="leader-role">Lead Architect & Developer</span>
              </div>
            </div>
            <p className="leader-desc">
              Engineered the client side parsing pipeline, memory optimization, and UI system for DocBrio.
            </p>
            <a
              href="https://www.linkedin.com/in/hassan-hashmi-266b032a4/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-leader-link linkedin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.67-.75 1.67-1.67s-.75-1.67-1.67-1.67-1.67.75-1.67 1.67.75 1.67 1.67 1.67m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
              <span>Hassan Hashmi on LinkedIn</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>

          {/* Leadership Card 2: Tayyab Ali */}
          <div className="leadership-card">
            <div className="leadership-head">
              <div className="leader-avatar orange">TA</div>
              <div>
                <b className="leader-name">Tayyab Ali</b>
                <span className="leader-role">CEO @ Vibeans Solutions</span>
              </div>
            </div>
            <p className="leader-desc">
              Leads strategy, AI consulting and project delivery at Vibeans Solutions.
            </p>
            <a
              href="https://www.linkedin.com/in/code-with-deved/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-leader-link linkedin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.67-.75 1.67-1.67s-.75-1.67-1.67-1.67-1.67.75-1.67 1.67.75 1.67 1.67 1.67m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
              <span>Tayyab Ali on LinkedIn</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>

          {/* Leadership Card 3: Vibeans Solutions Corporate */}
          <div className="leadership-card">
            <div className="leadership-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vibeans-logo.png"
                alt="Vibeans Solutions"
                width="44"
                height="44"
                className="contact-agency-mark"
              />
              <div>
                <b className="leader-name">Vibeans Solutions</b>
                <span className="leader-role">Official Company Page</span>
              </div>
            </div>
            <p className="leader-desc">
              Software development and AI consulting company.
            </p>
            <a
              href="https://www.linkedin.com/company/vibeanssolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-leader-link linkedin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.67-.75 1.67-1.67s-.75-1.67-1.67-1.67-1.67.75-1.67 1.67.75 1.67 1.67 1.67m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
              <span>Company on LinkedIn</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>

          {/* Leadership Card 4: Instagram */}
          <div className="leadership-card instagram">
            <div className="leadership-head">
              <div className="leader-avatar instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <b className="leader-name">Instagram</b>
                <span className="leader-role">@vibeanssolutions</span>
              </div>
            </div>
            <p className="leader-desc">
              Visual showcases, agency engineering culture, UI design releases, and product updates.
            </p>
            <a
              href="https://www.instagram.com/vibeanssolutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-leader-link instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Follow on Instagram</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>

          {/* Leadership Card 5: Facebook */}
          <div className="leadership-card facebook">
            <div className="leadership-head">
              <div className="leader-avatar facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <b className="leader-name">Facebook</b>
                <span className="leader-role">Official Page</span>
              </div>
            </div>
            <p className="leader-desc">
              Join the Vibeans Solutions community for official announcements, releases, and discussions.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61593058145041"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-leader-link facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Connect on Facebook</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17l9.2-9.2M17 17V8H8" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
