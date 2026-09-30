import Link from 'next/link';
import { tools } from '../lib/tools';

export default function Home() {
  const cats = [...new Set(tools.map((t) => t.cat))];
  return (
    <>
      <div className="hero">
        <h1>Free online tools for PDF, Word, Excel and images</h1>
        <p>No signup and no watermark. Your files are processed in your browser and never uploaded.</p>
      </div>
      {cats.map((c) => (
        <section key={c}>
          <h2 className="cat">{c}</h2>
          <div className="grid">
            {tools.filter((t) => t.cat === c).map((t) => (
              <Link key={t.slug} className="card" href={`/tools/${t.slug}/`}>
                <div className={`badge ${t.cls}`}>{t.badge}</div>
                <div><b>{t.name}</b><span>{t.sub}</span></div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
