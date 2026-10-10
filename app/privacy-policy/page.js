import Link from 'next/link';
import { og } from '../../lib/tools';

const DESC = 'How DocBrio handles data: files are processed in your browser and not uploaded, what the Email Verifier sends, and how Google AdSense uses cookies.';
export const metadata = {
  title: 'Privacy Policy',
  description: DESC,
  alternates: { canonical: '/privacy-policy/' },
  openGraph: og('Privacy Policy', DESC, '/privacy-policy/'),
};

export default function Page() {
  return (
    <>
      <div className="panel" style={{ borderTop: '3px solid #10b981' }}>
        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)' }}>Privacy Policy</h1>
        <p className="sub">Last updated: 10 October 2026 • DocBrio is operated by Vibeans Solutions</p>

        <h2>1. Files you process</h2>
        <p>
          <b>The files you open in a DocBrio tool are not uploaded.</b> PDFs, Office documents and images are read and converted by your own browser, on your device. We do not receive them, and we cannot see or store them. The same applies to text you type into the Word Counter, the Case Converter, the QR Code Generator and the Password Generator. When you close or reload the page, the data is gone from it.
        </p>

        <h2>2. What does use the network</h2>
        <p>
          <b>Code libraries.</b> Several tools need open source libraries, for example to read PDFs or to create ZIP files. Your browser downloads these from public content delivery networks (cdnjs.cloudflare.com, cdn.jsdelivr.net and unpkg.com) when you first use such a tool. As with any download, those networks see your IP address and the name of the library that was requested. They do not receive your files.
        </p>
        <p>
          <b>Email Verifier.</b> This tool is the exception to the rule above. To find out whether a domain can receive mail, your browser sends the domain part of the address you entered (the part after the @ sign) to the public DNS service of Google (dns.google) and, if that does not answer, to the one of Cloudflare (cloudflare-dns.com). The part before the @ sign is not sent. DocBrio does not receive or store the address. The privacy policies of those DNS services apply to the lookups.
        </p>
        <p>
          <b>Hosting.</b> The site is delivered through Cloudflare. Like every web host, Cloudflare processes technical data such as your IP address, your browser type and the pages requested, in order to deliver the site and protect it from abuse.
        </p>

        <h2>3. Advertising and cookies</h2>
        <p>
          DocBrio shows advertisements from Google AdSense to pay for the service. Third party vendors, including Google, use cookies to serve ads based on your earlier visits to this website or to other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and other sites on the internet.
        </p>
        <p>
          You can switch off personalised advertising in{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. How Google uses information from sites that use its services is explained at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>. You can also opt out of personalised advertising by many other vendors at{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
        </p>

        <h2>4. Analytics</h2>
        <p>
          We do not run our own analytics or tracking script on DocBrio. If we add an analytics service in the future, we will name it here before it is switched on.
        </p>

        <h2>5. Messages you send us</h2>
        <p>
          The form on the contact page does not send anything to a DocBrio server. It opens a Gmail compose window in a new tab, with your message filled in, and the WhatsApp button opens a chat. If you then send it, we receive what you wrote together with your email address or phone number, and we use it only to answer you.
        </p>

        <h2>6. Children</h2>
        <p>
          DocBrio is a general purpose tool site and is not directed at children under 13. We do not knowingly collect personal information from children.
        </p>

        <h2>7. Changes to this policy</h2>
        <p>
          When the way the site handles data changes, we update this page and the date at the top.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about privacy can be sent to <a href="mailto:vibeanssolutions@gmail.com">vibeanssolutions@gmail.com</a> or through the <Link href="/contact/">contact page</Link>.
        </p>
      </div>
    </>
  );
}
