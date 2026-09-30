import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tools, getTool } from '../../../lib/tools';
import ToolClient from '../../../components/ToolClient';

// Note: `dynamicParams = false` yahan mat lagana - Next 14 dev server output: 'export' ke saath 500 deta hai
export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }
export function generateMetadata({ params }) {
  const t = getTool(params.slug);
  if (!t) return {};
  return { title: t.title, description: t.desc, alternates: { canonical: `/tools/${t.slug}/` } };
}

export default function ToolPage({ params }) {
  const t = getTool(params.slug);
  if (!t) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return (
    <>
      <div className="crumb"><Link href="/">Home</Link> / {t.name}</div>
      <div className="panel">
        <h1>{t.title.split(' - ')[0]}</h1>
        <p className="sub">{t.sub}</p>
        <ToolClient slug={t.slug} />
      </div>
      <div className="panel info">
        <h2>About this tool</h2><p>{t.about}</p>
        <h2>How to use</h2><ol>{t.how.map((h) => <li key={h}>{h}</li>)}</ol>
        <h2>Frequently asked questions</h2>
        {t.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        <h2>More free tools</h2>
        <div className="related">{tools.filter((x) => x.slug !== t.slug).map((x) => <Link key={x.slug} href={`/tools/${x.slug}/`}>{x.name}</Link>)}</div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
