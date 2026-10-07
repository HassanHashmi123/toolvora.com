'use client';
import { useState } from 'react';
import { lib, base, formatBytes, useRun, Drop, Out, NOTE } from './shared';

// q: default quality for formats that lose detail. Phones hide files of types they do not know, so ICO and AVIF accept any image
const F = {
  png: { name: 'PNG', an: 'a', mime: 'image/png', accept: '.png,image/png' },
  jpg: { name: 'JPG', an: 'a', mime: 'image/jpeg', accept: '.jpg,.jpeg,image/jpeg', q: 90 },
  webp: { name: 'WebP', an: 'a', mime: 'image/webp', accept: '.webp,image/webp', q: 85 },
  avif: { name: 'AVIF', an: 'an', mime: 'image/avif', accept: '.avif,image/avif,image/*', q: 60 },
  ico: { name: 'ICO', an: 'an', mime: 'image/x-icon', accept: '.ico,image/x-icon,image/vnd.microsoft.icon,image/*' },
};
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];
// Encoders no browser has built in (AVIF everywhere, WebP in Safari). Loaded only when such a file is actually made
const WASM = { avif: 'https://unpkg.com/@jsquash/avif@2.1.1/encode.js?module', webp: 'https://unpkg.com/@jsquash/webp@1.5.0/encode.js?module' };
const kb = (n) => formatBytes(n);

const loadImg = (blob) => new Promise((res, rej) => {
  const i = new Image(), url = URL.createObjectURL(blob);
  i.onload = () => res(i); i.onerror = () => { URL.revokeObjectURL(url); rej(new Error('open')); }; i.src = url;
});

// An .ico holds several sizes of the same icon. Take the largest one, as a file a browser can open
async function icoLargest(file) {
  const b = new Uint8Array(await file.arrayBuffer()), v = new DataView(b.buffer);
  if (b.length < 22 || v.getUint16(0, true) !== 0 || v.getUint16(2, true) !== 1) return file;
  let best = null;
  for (let i = 0, n = v.getUint16(4, true); i < n && 22 + i * 16 <= b.length; i++) {
    const o = 6 + i * 16, e = { o, w: b[o] || 256, bpp: v.getUint16(o + 6, true), size: v.getUint32(o + 8, true), off: v.getUint32(o + 12, true) };
    if (e.off + e.size <= b.length && (!best || e.w > best.w || (e.w === best.w && e.bpp > best.bpp))) best = e;
  }
  if (!best) return file;
  const data = b.subarray(best.off, best.off + best.size);
  if (data[0] === 0x89 && data[1] === 0x50) return new Blob([data], { type: 'image/png' });
  // An old-style bitmap entry: wrap it as an .ico with just this one size, so the browser decodes exactly it
  const head = new Uint8Array(22); head[2] = 1; head[4] = 1; head.set(b.subarray(best.o, best.o + 12), 6); new DataView(head.buffer).setUint32(18, 22, true);
  return new Blob([head, data], { type: 'image/x-icon' });
}

function draw(img, w, h, white) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
  if (white) { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); }
  // Keep the shape of the picture: centred, with empty space on the short side (only matters for square icons)
  const k = Math.min(w / img.naturalWidth, h / img.naturalHeight), dw = img.naturalWidth * k, dh = img.naturalHeight * k;
  x.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return c;
}
const TOO_BIG = 'This image is too large for your browser to convert. Try a smaller image.';
const toBlob = (c, mime, q) => new Promise((res) => c.toBlob(res, mime, q));
async function wasmEncode(c, to, q) {
  let px; try { px = c.getContext('2d').getImageData(0, 0, c.width, c.height); } catch { throw new Error(TOO_BIG); }
  let enc; try { enc = (await import(/* webpackIgnore: true */ WASM[to])).default; } catch { throw new Error('Could not load the converter. Check your internet connection and try again.'); }
  return new Blob([await enc(px, to === 'avif' ? { quality: q, speed: 8 } : { quality: q })], { type: F[to].mime });
}
async function makeIco(img) {
  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  // Sizes far above the picture's own size would only be blurry and make the file big
  const pngs = [];
  for (const s of ICO_SIZES.filter((n) => n <= Math.max(48, longest))) {
    const b = await toBlob(draw(img, s, s), 'image/png'); if (!b) throw new Error(TOO_BIG);
    pngs.push([s, new Uint8Array(await b.arrayBuffer())]);
  }
  const head = new Uint8Array(6 + 16 * pngs.length), v = new DataView(head.buffer); let off = head.length;
  v.setUint16(2, 1, true); v.setUint16(4, pngs.length, true);
  pngs.forEach(([s, d], i) => {
    const o = 6 + i * 16; head[o] = head[o + 1] = s === 256 ? 0 : s;
    v.setUint16(o + 4, 1, true); v.setUint16(o + 6, 32, true); v.setUint32(o + 8, d.length, true); v.setUint32(o + 12, off, true); off += d.length;
  });
  return new Blob([head, ...pngs.map((p) => p[1])], { type: F.ico.mime });
}

async function convert(file, from, to, q) {
  let img;
  try { img = await loadImg(from === 'ico' ? await icoLargest(file) : file); }
  catch { throw new Error(from === 'avif' ? 'could not be opened. The file may be damaged, or your browser is too old to read AVIF.' : 'could not be opened. It may be damaged or not an image.'); }
  if (!img.naturalWidth) throw new Error('is empty.');
  let out;
  if (to === 'ico') out = await makeIco(img);
  else {
    const c = draw(img, img.naturalWidth, img.naturalHeight, to === 'jpg');
    if (to === 'avif') out = await wasmEncode(c, to, q);
    else {
      out = await toBlob(c, F[to].mime, q / 100);
      if (!out) throw new Error(TOO_BIG);
      // Safari answers with a PNG when asked for WebP
      if (out.type !== F[to].mime) out = await wasmEncode(c, to, q);
    }
    c.width = 0;
  }
  URL.revokeObjectURL(img.src);
  return out;
}

export function ImgConvert({ from, to }) {
  const [files, setFiles] = useState([]), [q, setQ] = useState(F[to].q || 0), [res, setRes] = useState([]);
  const A = F[from], B = F[to];
  const [st, run] = useRun(async (say) => {
    setRes([]);
    if (!files.length) return { msg: `Please choose ${A.an} ${A.name} image first.` };
    const done = [], bad = [], used = {};
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      say(`Converting ${files.length > 1 ? `image ${i + 1} of ${files.length}` : 'your image'}...${to === 'avif' ? ' AVIF takes a few seconds per image.' : ''}`);
      try {
        const blob = await convert(f, from, to, q);
        let name = base(f); if (used[name]) name += `_${++used[name]}`; else used[name] = 1;
        done.push({ name: `${name}.${to}`, url: URL.createObjectURL(blob), blob, before: f.size });
        setRes([...done]);
      } catch (e) { bad.push(/^(could|is) /.test(e.message) ? `${f.name} ${e.message}` : e.message); }
    }
    const ok = done.length ? `${done.length} ${done.length > 1 ? 'images' : 'image'} converted to ${B.name}.` : '';
    return { msg: [ok, ...new Set(bad)].filter(Boolean).join(' ') };
  });
  const [zs, zip] = useRun(async () => {
    const z = new (await lib('jszip'))(); res.forEach((r) => z.file(r.name, r.blob));
    const a = document.createElement('a'); a.href = URL.createObjectURL(await z.generateAsync({ type: 'blob' })); a.download = `${from}_to_${to}.zip`; a.click();
    return {};
  });
  const note = { jpg: 'JPG has no transparency, so transparent areas become white.',
    ico: `The .ico file contains the icon in several sizes (${ICO_SIZES[0]} to ${ICO_SIZES[ICO_SIZES.length - 1]} pixels), ready to use as a website favicon or a Windows icon. Square images work best.`,
    avif: 'Making AVIF is slower than other formats: allow a few seconds per image. The first image also loads the AVIF encoder.',
    webp: 'Transparency is kept. A lower quality gives a smaller file.', png: 'PNG keeps every pixel exactly, including transparency, so the file can be larger than the original.' }[to];
  return (
    <>
      <Drop accept={A.accept} multiple files={files} setFiles={(f) => { setFiles(f); setRes([]); }} label={`Choose ${A.name} images`} />
      {B.q && <div className="row"><label htmlFor="icq">Quality: <b>{q}</b>%</label><input id="icq" type="range" min="30" max="100" value={q} onChange={(e) => setQ(+e.target.value)} /></div>}
      <button className="btn" onClick={run}>Convert to {B.name}</button>
      <Out st={st} />
      {res.length > 0 && <ul className="ic-list">
        {res.map((r) => (
          <li key={r.url}>
            <img src={r.url} alt="" />
            <span><b>{r.name}</b>{kb(r.before)} &rarr; {kb(r.blob.size)}</span>
            <a className="btn" href={r.url} download={r.name}>Download</a>
          </li>
        ))}
      </ul>}
      {res.length > 1 && <><button className="btn alt" onClick={zip}>Download all as ZIP</button><Out st={zs} /></>}
      {NOTE(`You can choose several images at once. ${note}`)}
    </>
  );
}
