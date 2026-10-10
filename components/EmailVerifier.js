'use client';
import { useState } from 'react';
import { copyText } from './shared';

// Common disposable / burner email domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamailblock.com',
  'yopmail.com', 'trashmail.com', 'sharklasers.com', 'dispostable.com',
  'getairmail.com', 'throwawaymail.com', 'burnermail.io', 'getnada.com',
  'fakeinbox.com', 'mohmal.com', 'temp-mail.org', 'fakemailgenerator.com',
  'generator.email', 'emailondeck.com', 'mytemp.email', 'crazymailing.com',
  'maildrop.cc', 'inboxkitten.com', 'tempmailo.com', 'zillamail.com',
  'nada.ltd', 'tempinbox.com', 'binkmail.com', 'bobmail.info', 'chacuo.net',
  'dropmail.me', 'harakirimail.com', 'mailcatch.com', 'mailnesia.com',
  'meltmail.com', 'mytrashmail.com', 'mytempemail.com', 'trashmail.net',
  'trashmail.org', 'trashmail.me', 'wegwerfmail.de', 'wegwerfmail.net',
  'deadaddress.com', 'spambog.com', 'spambox.us', 'temporaryemail.net',
  'throwawayemailaddress.com', 'jetable.org', 'tempail.com', 'tmail.ws'
]);

// Organizational & role accounts mapping
const ROLE_ACCOUNTS = {
  admin: { label: 'Administrator', desc: 'System & IT Administration' },
  administrator: { label: 'Administrator', desc: 'System & IT Administration' },
  support: { label: 'Support Desk', desc: 'Customer & Technical Support' },
  help: { label: 'Help Desk', desc: 'Customer Assistance' },
  helpdesk: { label: 'Help Desk', desc: 'Customer Assistance' },
  connectdesk: { label: 'Connect Desk', desc: 'Customer Operations & Inquiries' },
  servicedesk: { label: 'Service Desk', desc: 'Client Services' },
  frontdesk: { label: 'Front Desk', desc: 'Reception & Operations' },
  desk: { label: 'Front Desk', desc: 'Operations Desk' },
  info: { label: 'Information Desk', desc: 'General Corporate Inquiries' },
  contact: { label: 'Contact Desk', desc: 'General Communication' },
  inquiry: { label: 'Inquiry Desk', desc: 'General Communication' },
  inquiries: { label: 'Inquiries Desk', desc: 'General Communication' },
  sales: { label: 'Sales Team', desc: 'Business Development & Sales' },
  billing: { label: 'Billing Desk', desc: 'Finance & Payments' },
  finance: { label: 'Finance Desk', desc: 'Accounting & Payroll' },
  legal: { label: 'Legal Counsel', desc: 'Legal & Compliance' },
  marketing: { label: 'Marketing Team', desc: 'Brand & Growth' },
  press: { label: 'Press & Media', desc: 'Public Relations' },
  media: { label: 'Media Relations', desc: 'Public Relations' },
  jobs: { label: 'Talent Acquisition', desc: 'Recruitment & HR' },
  careers: { label: 'Careers Desk', desc: 'Human Resources' },
  hr: { label: 'Human Resources', desc: 'People Operations' },
  team: { label: 'General Team', desc: 'Internal Collaborative Mailbox' },
  hello: { label: 'Greetings Desk', desc: 'Direct Inquiries' },
  feedback: { label: 'Feedback Desk', desc: 'Product Feedback' },
  office: { label: 'Front Office', desc: 'Administrative Operations' },
  security: { label: 'Security Operations', desc: 'Cybersecurity & Safety' },
  noreply: { label: 'System Automated', desc: 'No Reply Automated Notifications' },
  'no-reply': { label: 'System Automated', desc: 'No Reply Automated Notifications' },
};

function capitalizeWord(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Smart Name Extraction Heuristic
function extractPersonName(localPart) {
  if (!localPart) {
    return {
      firstName: 'Unknown',
      lastName: 'Unknown',
      fullName: 'Unknown',
      isRole: false,
    };
  }

  // Strip alias extension (e.g. user+tag)
  const cleanLocal = localPart.split('+')[0].trim().toLowerCase();

  // Check role accounts first
  if (ROLE_ACCOUNTS[cleanLocal]) {
    const r = ROLE_ACCOUNTS[cleanLocal];
    return {
      firstName: r.label,
      lastName: 'Role Mailbox',
      fullName: r.label,
      isRole: true,
    };
  }

  // Check compound desk suffixes (e.g. connectdesk, helpdesk)
  if (cleanLocal.endsWith('desk') && cleanLocal.length > 5) {
    const prefix = cleanLocal.slice(0, -4);
    const formatted = `${capitalizeWord(prefix)} Desk`;
    return {
      firstName: formatted,
      lastName: 'Role Mailbox',
      fullName: formatted,
      isRole: true,
    };
  }

  // Strip trailing numbers (e.g. john.doe99 -> john.doe)
  const withoutTrailingNumbers = cleanLocal.replace(/[0-9]+$/, '');

  // Split on common delimiters (. _ -)
  let tokens = withoutTrailingNumbers
    .split(/[\._\-]+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^a-z]/gi, ''))
    .filter((w) => w.length > 0);

  // If single token, test for camelCase (e.g. tayyabAli)
  if (tokens.length === 1 && localPart.length > 2) {
    const camelParts = localPart.split('+')[0].replace(/[0-9]+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    if (camelParts.length > 1) {
      tokens = camelParts.filter(Boolean);
    }
  }

  if (tokens.length >= 2) {
    const firstName = capitalizeWord(tokens[0]);
    const lastName = capitalizeWord(tokens[tokens.length - 1]);
    const middleTokens = tokens.slice(1, -1).map(capitalizeWord);
    const fullName = [firstName, ...middleTokens, lastName].join(' ');
    return {
      firstName,
      lastName,
      fullName,
      isRole: false,
    };
  }

  if (tokens.length === 1) {
    const single = capitalizeWord(tokens[0]);
    return {
      firstName: single,
      lastName: 'Not Specified',
      fullName: single,
      isRole: false,
    };
  }

  return {
    firstName: capitalizeWord(localPart),
    lastName: 'Not Specified',
    fullName: capitalizeWord(localPart),
    isRole: false,
  };
}

// Provider Intelligence Classifier
function identifyProvider(domain, mxRecords = []) {
  const d = (domain || '').toLowerCase();
  const mxStr = mxRecords.map((r) => (r.host || '').toLowerCase()).join(' ');

  // 1. Google Ecosystem
  if (d === 'gmail.com' || d === 'googlemail.com') {
    return {
      name: 'Google Gmail',
      brand: 'Google',
      tier: 'Consumer Webmail',
      badgeColor: '#ea4335',
    };
  }
  if (mxStr.includes('google.com') || mxStr.includes('googlemail.com') || mxStr.includes('l.google.com')) {
    return {
      name: 'Google Workspace',
      brand: 'Google',
      tier: 'Enterprise Cloud Suite',
      badgeColor: '#4285f4',
    };
  }

  // 2. Microsoft Ecosystem
  if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com'].includes(d)) {
    return {
      name: 'Microsoft Outlook',
      brand: 'Microsoft',
      tier: 'Consumer Webmail',
      badgeColor: '#0078d4',
    };
  }
  if (mxStr.includes('protection.outlook.com') || mxStr.includes('office365.com')) {
    return {
      name: 'Microsoft 365 / Exchange',
      brand: 'Microsoft',
      tier: 'Enterprise Cloud Mail',
      badgeColor: '#0078d4',
    };
  }

  // 3. Yahoo Mail
  if (['yahoo.com', 'ymail.com', 'rocketmail.com', 'myyahoo.com'].includes(d) || mxStr.includes('yahoodns.net')) {
    return {
      name: 'Yahoo Mail',
      brand: 'Yahoo',
      tier: 'Consumer Webmail',
      badgeColor: '#6001d2',
    };
  }

  // 4. Apple iCloud
  if (['icloud.com', 'me.com', 'mac.com'].includes(d) || mxStr.includes('mail.icloud.com')) {
    return {
      name: 'Apple iCloud Mail',
      brand: 'Apple',
      tier: 'Apple Cloud Account',
      badgeColor: '#a3aaae',
    };
  }

  // 5. Proton Mail
  if (['proton.me', 'protonmail.com', 'pm.me'].includes(d) || mxStr.includes('protonmail.ch')) {
    return {
      name: 'Proton Mail',
      brand: 'Proton',
      tier: 'Encrypted Privacy Mail',
      badgeColor: '#6d4aff',
    };
  }

  // 6. Zoho Mail
  if (d === 'zoho.com' || mxStr.includes('zoho.com')) {
    return {
      name: 'Zoho Mail',
      brand: 'Zoho',
      tier: 'Business Workplace Suite',
      badgeColor: '#1389e4',
    };
  }

  // 7. Fastmail
  if (d === 'fastmail.com' || mxStr.includes('messagingengine.com')) {
    return {
      name: 'Fastmail',
      brand: 'Fastmail',
      tier: 'Independent Cloud Email',
      badgeColor: '#0c4a6e',
    };
  }

  // 8. Amazon SES / AWS
  if (mxStr.includes('amazonses.com') || mxStr.includes('aws.')) {
    return {
      name: 'Amazon Web Services (SES)',
      brand: 'Amazon',
      tier: 'Cloud Infrastructure Mail',
      badgeColor: '#ff9900',
    };
  }

  // 9. Custom / Private Enterprise Server
  return {
    name: 'Custom Corporate Mail Server',
    brand: 'Private Domain',
    tier: 'Dedicated Mail Exchange',
    badgeColor: '#10b981',
  };
}

// MX lookup over DNS-over-HTTPS. This sends the domain (never the part before the @) to Google, then Cloudflare as a fallback
async function fetchMxRecords(domain) {
  try {
    const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`;
    const res = await fetch(googleUrl, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data.Status === 3) {
        return { status: 'nxdomain', records: [] };
      }
      if (data.Answer && Array.isArray(data.Answer)) {
        const mxList = data.Answer.filter((ans) => ans.type === 15).map((ans) => {
          const parts = (ans.data || '').trim().split(/\s+/);
          const priority = parts.length > 1 ? parseInt(parts[0], 10) : 10;
          const host = (parts.length > 1 ? parts[1] : parts[0]).replace(/\.$/, '');
          return { priority, host };
        }).sort((a, b) => a.priority - b.priority);

        if (mxList.length > 0) {
          return { status: 'ok', records: mxList };
        }
      }
    }
  } catch (err) {
    // Fallback below
  }

  try {
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`;
    const res = await fetch(cfUrl, { headers: { Accept: 'application/dns-json' } });
    if (res.ok) {
      const data = await res.json();
      if (data.Status === 3) {
        return { status: 'nxdomain', records: [] };
      }
      if (data.Answer && Array.isArray(data.Answer)) {
        const mxList = data.Answer.filter((ans) => ans.type === 15).map((ans) => {
          const parts = (ans.data || '').trim().split(/\s+/);
          const priority = parts.length > 1 ? parseInt(parts[0], 10) : 10;
          const host = (parts.length > 1 ? parts[1] : parts[0]).replace(/\.$/, '');
          return { priority, host };
        }).sort((a, b) => a.priority - b.priority);

        if (mxList.length > 0) {
          return { status: 'ok', records: mxList };
        }
      }
    }
  } catch (err) {
    return { status: 'network_blocked', records: [] };
  }

  return { status: 'no_mx', records: [] };
}

export default function EmailVerifier() {
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = async (text, key) => {
    if (!text || !(await copyText(text))) return;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = async (emailToTest) => {
    const target = (emailToTest || emailInput).trim();
    if (!target) return;

    setLoading(true);
    setResult(null);

    // 1. Basic RFC 5322 Syntax Assessment
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    const isBasicSyntaxValid = emailRegex.test(target);
    const parts = target.split('@');
    const localPart = parts[0] || '';
    const domainPart = (parts[1] || '').toLowerCase();

    const hasNoConsecutiveDots = !localPart.includes('..') && !domainPart.includes('..');
    const lengthValid = localPart.length <= 64 && target.length <= 254;
    const domainHasDot = domainPart.includes('.');
    const tld = domainPart.split('.').pop() || '';
    const tldValid = tld.length >= 2 && !/[^a-z]/i.test(tld);

    const isSyntaxStrict = isBasicSyntaxValid && hasNoConsecutiveDots && lengthValid && domainHasDot && tldValid;

    // Subfeature 2: Extract Person's First and Last Name
    const nameData = extractPersonName(localPart);

    // Subfeature 3: Website Domain Details
    const cleanDomain = domainPart.replace(/^\.+|\.+$/g, '');
    const domainUrl = cleanDomain ? `https://${cleanDomain}` : '';

    // Subfeature 1 & 4 Pre-checks
    const isDisposable = DISPOSABLE_DOMAINS.has(cleanDomain);

    if (!isSyntaxStrict || !cleanDomain) {
      setResult({
        email: target,
        localPart,
        domain: cleanDomain,
        domainUrl,
        nameData,
        overallStatus: 'invalid',
        deliverabilityScore: 0,
        badgeText: 'Invalid Format',
        badgeClass: 'ev-badge-invalid',
        provider: {
          name: 'Unidentifiable Provider',
          tier: 'Invalid Address Format',
        },
        summaryVerdict: 'This email is improperly formatted and cannot receive messages.',
      });
      setLoading(false);
      return;
    }

    // Subfeature 1: Live DNS Query for MX Records
    const dnsRes = await fetchMxRecords(cleanDomain);

    // Subfeature 4: Identify Provider (Google, Microsoft, Yahoo, etc.)
    const provider = identifyProvider(cleanDomain, dnsRes.records);

    let overallStatus = 'verified';
    let deliverabilityScore = 98;
    let badgeText = 'Format Valid, Domain Accepts Mail';
    let badgeClass = 'ev-badge-verified';
    let summaryVerdict = 'The address is correctly written and its domain has mail servers. This does not prove that this exact mailbox exists.';

    if (dnsRes.status === 'nxdomain') {
      overallStatus = 'invalid';
      deliverabilityScore = 0;
      badgeText = 'Domain Does Not Exist';
      badgeClass = 'ev-badge-invalid';
      summaryVerdict = 'This domain does not exist or has expired. Mail sent here is unreachable.';
    } else if (dnsRes.status === 'no_mx') {
      overallStatus = 'invalid';
      deliverabilityScore = 15;
      badgeText = 'Unreachable Mailbox';
      badgeClass = 'ev-badge-invalid';
      summaryVerdict = 'The domain exists on the web, but no active mail servers are configured.';
    } else if (isDisposable) {
      overallStatus = 'risky';
      deliverabilityScore = 35;
      badgeText = 'Disposable Burner Mailbox';
      badgeClass = 'ev-badge-risky';
      summaryVerdict = 'This domain belongs to a disposable mail service. Mail sent there is usually deleted after a short time.';
    } else if (dnsRes.status === 'network_blocked') {
      // Checked before the role branch: without a DNS answer nothing can be called reachable
      overallStatus = 'verified';
      deliverabilityScore = 50;
      badgeText = 'Format Valid, Domain Not Checked';
      badgeClass = 'ev-badge-verified';
      summaryVerdict = 'The format is valid, but the mail servers of the domain could not be looked up from your network.';
    } else if (nameData.isRole) {
      deliverabilityScore = 96;
      badgeText = 'Format Valid, Domain Accepts Mail';
      badgeClass = 'ev-badge-verified';
      summaryVerdict = 'This looks like a shared role address, and its domain has mail servers. This does not prove that the mailbox exists.';
    }

    setResult({
      email: target,
      localPart,
      domain: cleanDomain,
      domainUrl,
      nameData,
      overallStatus,
      deliverabilityScore,
      badgeText,
      badgeClass,
      provider,
      summaryVerdict,
    });

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="email-verifier-wrap">
      {/* Sleek Minimalist Search Bar */}
      <form
        className="ev-form-bar"
        // The tool does its own checking: the browser's check would block the button for exactly the addresses it should report as invalid
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
      >
        <div className="ev-input-container">
          <svg className="ev-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="email-verify-input"
            type="email"
            className="ev-input-field"
            placeholder="e.g. john.doe@gmail.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
            spellCheck="false"
          />
          {emailInput && (
            <button
              type="button"
              className="ev-clear-btn"
              onClick={() => {
                setEmailInput('');
                setResult(null);
              }}
              title="Clear input"
              aria-label="Clear input"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn ev-action-btn"
          disabled={loading || !emailInput.trim()}
        >
          {loading ? (
            <>
              <span className="ev-spinner" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Verify Email Address</span>
            </>
          )}
        </button>
      </form>

      {/* Unified Executive Results Card */}
      {result && (
        <div className="ev-executive-panel">
          {/* Top Primary Verdict Banner */}
          <div className="ev-panel-header">
            <div className="ev-header-main">
              <div className="ev-badge-row">
                <span className={`ev-status-pill ${result.badgeClass}`}>
                  <span className="ev-status-dot" />
                  {result.badgeText}
                </span>
                <span className="ev-type-tag">
                  {result.nameData.isRole ? 'Corporate Department' : 'Personal Account'}
                </span>
              </div>

              <div className="ev-email-display-row">
                <h2 className="ev-email-title" style={{ margin: 0 }}>{result.email}</h2>
                <button
                  type="button"
                  className="ev-copy-email-btn"
                  onClick={() => handleCopy(result.email, 'email')}
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ color: '#34d399' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="ev-verdict-text">{result.summaryVerdict}</p>
            </div>

            {/* Deliverability Score Meter */}
            <div className="ev-score-badge-card">
              <div className="ev-score-top">
                <span className="ev-score-pct">{result.deliverabilityScore}%</span>
                <span className="ev-score-sub">Estimate</span>
              </div>
              <div className="ev-score-track">
                <div
                  className={`ev-score-fill ${result.overallStatus}`}
                  style={{ width: `${result.deliverabilityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Core Relevant Intelligence Cards */}
          <div className="ev-metrics-grid">
            {/* Metric 1: Recipient Identity */}
            <div className="ev-metric-card">
              <div className="ev-metric-label">Recipient Name</div>
              <div className="ev-metric-val-row">
                <b className="ev-metric-val">{result.nameData.fullName}</b>
              </div>
              <div className="ev-metric-sub">
                {result.nameData.isRole ? 'Department Mailbox' : (result.nameData.lastName !== 'Not Specified' ? `${result.nameData.firstName} ${result.nameData.lastName}` : result.nameData.firstName)}
              </div>
            </div>

            {/* Metric 2: Email Service Provider */}
            <div className="ev-metric-card">
              <div className="ev-metric-label">Email Provider</div>
              <div className="ev-metric-val-row">
                <b className="ev-metric-val">{result.provider.name}</b>
              </div>
              <div className="ev-metric-sub">{result.provider.tier}</div>
            </div>

            {/* Metric 3: Associated Website Domain */}
            <div className="ev-metric-card">
              <div className="ev-metric-label">Website Domain</div>
              <div className="ev-metric-val-row">
                <b className="ev-metric-val">{result.domain || 'None'}</b>
              </div>
              {result.domainUrl ? (
                <a
                  href={result.domainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ev-website-inline-link"
                >
                  <span>Visit Website</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (
                <div className="ev-metric-sub">No Web Domain</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
