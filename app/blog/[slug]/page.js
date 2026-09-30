import Link from 'next/link';
import { notFound } from 'next/navigation';
import { posts, getPost } from '../../../lib/posts';
import { getTool, SITE } from '../../../lib/tools';
import PostBody from '../../../components/PostBody';

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.desc, alternates: { canonical: `/blog/${p.slug}/` } };
}

export default function Post({ params }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const t = getTool(p.tool);
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc,
    datePublished: p.date, mainEntityOfPage: `${SITE}/blog/${p.slug}/` };
  return (
    <>
      <div className="crumb"><Link href="/">Home</Link> / <Link href="/blog/">Blog</Link></div>
      <article className="panel info">
        <h1>{p.title}</h1>
        <p className="sub">Published {p.date}</p>
        <PostBody content={p.content} />
        {t && <div className="note">Try it now: <Link href={`/tools/${t.slug}/`}>{t.name}</Link> (free, no signup)</div>}
      </article>
      <div className="panel info">
        <h2>More guides</h2>
        <div className="related">{posts.filter((x) => x.slug !== p.slug).map((x) => <Link key={x.slug} href={`/blog/${x.slug}/`}>{x.title}</Link>)}</div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
