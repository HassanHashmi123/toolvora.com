'use client';
import { useState } from 'react';
import { lib, mk, base, formatBytes, useRun, Drop, Out, NOTE, openPdf } from './shared';

const PAGE = { a4: [595.28, 841.89], letter: [612, 792] };
const MARGIN = 28; // points, about 1 cm
const TOO_BIG = 'is too large for your browser to process. Try a smaller image.';

// The EXIF orientation of a JPEG: 1 = stored upright, 0 = not a JPEG. pdf-lib embeds the bytes as they are and ignores it
function jpegOrientation(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return 0;
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  for (let i = 2; i + 4 < b.length && b[i] === 0xff && b[i + 1] !== 0xda;) {
    const len = v.getUint16(i + 2);
    if (b[i + 1] === 0xe1 && i + 18 < b.length && v.getUint32(i + 4) === 0x45786966) {
      const t = i + 10, le = v.getUint16(t) === 0x4949, ifd = t + v.getUint32(t + 4, le);
      if (ifd + 2 > b.length) return 1;
      for (let k = 0, n = v.getUint16(ifd, le); k < n && ifd + 14 + k * 12 <= b.length; k++) {
        const e = ifd + 2 + k * 12;
        if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le);
      }
      return 1;
    }
    i += 2 + len;
  }
  return 1;
}

// Drawn by the browser, which turns the picture upright, and saved again as a JPG
async function redraw(file) {
  const img = await new Promise((res, rej) => {
    const i = new Image(), u = URL.createObjectURL(file);
    i.onload = () => { URL.revokeObjectURL(u); res(i); };
    i.onerror = () => { URL.revokeObjectURL(u); rej(new Error('could not be opened. It may be damaged or not an image.')); };
    i.src = u;
  });
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
  const b = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
  c.width = 0;
  if (!b) throw new Error(TOO_BIG);
  return new Uint8Array(await b.arrayBuffer());
}

export function JpgToPdf() {
  const [items, setItems] = useState([]), [size, setSize] = useState('a4'), [margin, setMargin] = useState(false);
  const pick = (fs) => setItems((old) => { old.forEach((o) => URL.revokeObjectURL(o.url)); return fs.map((f) => ({ f, url: URL.createObjectURL(f) })); });
  const move = (i, d) => setItems((a) => { const b = [...a]; [b[i], b[i + d]] = [b[i + d], b[i]]; return b; });
  const [st, run] = useRun(async (say) => {
    if (!items.length) return { msg: 'Please choose one or more JPG images first.' };
    const P = await lib('pdflib'), doc = await P.PDFDocument.create();
    const m = margin ? MARGIN : 0;
    for (let n = 0; n < items.length; n++) {
      const f = items[n].f;
      say(`Adding image ${n + 1} of ${items.length}...`);
      let im;
      try {
        const bytes = new Uint8Array(await f.arrayBuffer());
        // An upright JPG goes into the PDF untouched. Anything else is redrawn first
        if (jpegOrientation(bytes) === 1) { try { im = await doc.embedJpg(bytes); } catch { /* redrawn below */ } }
        if (!im) im = await doc.embedJpg(await redraw(f));
      } catch (e) { return { msg: `${f.name} ${/^(could|is) /.test(e.message) ? e.message : 'could not be added to the PDF.'}`, isError: true }; }
      if (size === 'fit') {
        // 96 pixels per inch, the size a browser shows a picture at
        const w = im.width * 0.75, h = im.height * 0.75;
        doc.addPage([w + 2 * m, h + 2 * m]).drawImage(im, { x: m, y: m, width: w, height: h });
      } else {
        let [w, h] = PAGE[size]; if (im.width > im.height) [w, h] = [h, w];
        const k = Math.min((w - 2 * m) / im.width, (h - 2 * m) / im.height), dw = im.width * k, dh = im.height * k;
        doc.addPage([w, h]).drawImage(im, { x: (w - dw) / 2, y: (h - dh) / 2, width: dw, height: dh });
      }
    }
    const blob = new Blob([await doc.save()], { type: 'application/pdf' });
    return { msg: `PDF with ${items.length} ${items.length > 1 ? 'pages' : 'page'} created (${formatBytes(blob.size)}).`, file: mk(blob, items.length > 1 ? 'images.pdf' : base(items[0].f) + '.pdf') };
  });
  return (
    <>
      <Drop accept=".jpg,.jpeg,image/jpeg" multiple files={items.map((i) => i.f)} setFiles={pick} label="Choose JPG images" />
      {items.length > 1 && <ul className="ic-list">
        {items.map((it, i) => (
          <li key={it.url}>
            <img src={it.url} alt="" />
            <span><b>{it.f.name}</b>Page {i + 1}</span>
            <button className="btn alt" disabled={!i} onClick={() => move(i, -1)} aria-label={`Move ${it.f.name} up`}>Up</button>
            <button className="btn alt" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${it.f.name} down`}>Down</button>
          </li>
        ))}
      </ul>}
      <div className="row">
        <label htmlFor="jps">Page size</label>
        <select id="jps" value={size} onChange={(e) => setSize(e.target.value)} style={{ width: 'auto' }}>
          <option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Same as image</option>
        </select>
        <label><input type="checkbox" checked={margin} onChange={(e) => setMargin(e.target.checked)} /> White margin</label>
      </div>
      <button className="btn" onClick={run}>Create PDF</button>
      <Out st={st} />
      {NOTE('Each image becomes one page, in the order of the list. Upright JPG files are placed in the PDF without being compressed again. The pages are pictures, so their text cannot be selected or searched.')}
    </>
  );
}

const DPI = [[100, 'Screen (100 DPI)'], [150, 'Standard (150 DPI)'], [300, 'Print (300 DPI)']];
// Phones refuse to draw a canvas with more pixels than this
const MAX_PIXELS = 16000000;

export function PdfToJpg() {
  const [files, setFiles] = useState([]), [dpi, setDpi] = useState(150), [res, setRes] = useState([]);
  const [st, run] = useRun(async (say) => {
    setRes((old) => { old.forEach((r) => URL.revokeObjectURL(r.url)); return []; });
    if (!files[0]) return { msg: 'Please choose a PDF first.' };
    const pdf = await openPdf(files[0]), done = [], name = base(files[0]), digits = String(pdf.numPages).length;
    let reduced = 0;
    try {
      for (let n = 1; n <= pdf.numPages; n++) {
        say(`Saving page ${n} of ${pdf.numPages}...`);
        const page = await pdf.getPage(n);
        let vp = page.getViewport({ scale: dpi / 72 });
        if (vp.width * vp.height > MAX_PIXELS) { vp = page.getViewport({ scale: (dpi / 72) * Math.sqrt(MAX_PIXELS / (vp.width * vp.height)) }); reduced++; }
        const c = document.createElement('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
        const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
        await page.render({ canvasContext: x, viewport: vp }).promise;
        const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.9));
        const dim = `${c.width} x ${c.height}`;
        c.width = 0; page.cleanup();
        if (!blob) throw new Error(`Page ${n} is too large for your browser to save at this resolution. Choose a lower one and try again.`);
        done.push({ name: `${name}_page_${String(n).padStart(digits, '0')}.jpg`, url: URL.createObjectURL(blob), blob, dim });
        setRes([...done]);
      }
    } finally { pdf.destroy(); }
    return { msg: `${done.length} ${done.length > 1 ? 'pages' : 'page'} saved as JPG.${reduced ? ` ${reduced} very large ${reduced > 1 ? 'pages were' : 'page was'} saved at a lower resolution.` : ''}` };
  });
  const [zs, zip] = useRun(async () => {
    const z = new (await lib('jszip'))(); res.forEach((r) => z.file(r.name, r.blob));
    const a = document.createElement('a'); a.href = URL.createObjectURL(await z.generateAsync({ type: 'blob' })); a.download = `${base(files[0])}_jpg.zip`; a.click();
    return {};
  });
  return (
    <>
      <Drop accept=".pdf,application/pdf" files={files} setFiles={(f) => { setFiles(f); setRes([]); }} label="Choose a PDF file" />
      <div className="row">
        <label htmlFor="pjd">Resolution</label>
        <select id="pjd" value={dpi} onChange={(e) => setDpi(+e.target.value)} style={{ width: 'auto' }}>
          {DPI.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <button className="btn" onClick={run}>Convert to JPG</button>
      <Out st={st} />
      {res.length > 0 && <ul className="ic-list">
        {res.map((r) => (
          <li key={r.url}>
            <img src={r.url} alt="" />
            <span><b>{r.name}</b>{r.dim} pixels, {formatBytes(r.blob.size)}</span>
            <a className="btn" href={r.url} download={r.name}>Download</a>
          </li>
        ))}
      </ul>}
      {res.length > 1 && <><button className="btn alt" onClick={zip}>Download all as ZIP</button><Out st={zs} /></>}
      {NOTE('Every page becomes one JPG picture. A higher resolution gives a sharper and larger image. The text in the pictures can no longer be selected.')}
    </>
  );
}
