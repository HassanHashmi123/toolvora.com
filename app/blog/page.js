import Link from 'next/link';
import { posts } from '../../lib/posts';

export const metadata = { title: 'Blog - Guides for PDF, Images and Everyday Tools', description: 'Simple step-by-step guides on converting PDFs, compressing images, merging documents and staying secure online.', alternates: { canonical: '/blog/' } };

export default function Blog() {
  return (
    <>
      <div className="hero"><h1>Guides and tutorials</h1><p>Practical how-to articles for everyday document and file tasks.</p></div>
      <div className="grid">
        {posts.map((p) => (
          <Link key={p.slug} className="card" href={`/blog/${p.slug}/`}>
            <div><b>{p.title}</b><span>{p.desc}</span></div>
          </Link>
        ))}
      </div>
    </>
  );
}
