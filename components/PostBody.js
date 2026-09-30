export default function PostBody({ content }) {
  return content.map((b, i) => {
    if (b.h) return <h2 key={i}>{b.h}</h2>;
    if (b.p) return <p key={i}>{b.p}</p>;
    if (b.ul) return <ul key={i}>{b.ul.map((x) => <li key={x}>{x}</li>)}</ul>;
    if (b.ol) return <ol key={i}>{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
    return null;
  });
}
