'use client';
import { useEffect, useState } from 'react';

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
const LIBS = {
  pdflib: [CDN + 'pdf-lib/1.17.1/pdf-lib.min.js', 'PDFLib'],
  pdfjs: [CDN + 'pdf.js/3.11.174/pdf.min.js', 'pdfjsLib'],
  xlsx: [CDN + 'xlsx/0.18.5/xlsx.full.min.js', 'XLSX'],
  mammoth: [CDN + 'mammoth/1.6.0/mammoth.browser.min.js', 'mammoth'],
  html2pdf: [CDN + 'html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf'],
  qr: [CDN + 'qrcode-generator/1.4.4/qrcode.min.js', 'qrcode'],
  tesseract: ['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'Tesseract'],
};
const pending = {};
function lib(name) {
  const [src, g] = LIBS[name];
  if (window[g]) return Promise.resolve(window[g]);
  if (!pending[name]) pending[name] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => res(window[g]); s.onerror = () => rej(new Error('Could not load tool library. Check your internet connection.'));
    document.head.appendChild(s);
  });
  return pending[name];
}
const mk = (blob, name) => ({ url: URL.createObjectURL(blob), name });
const base = (f) => f.name.replace(/\.[^.]+$/, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function useRun(fn) {
  const [st, setSt] = useState({});
  const run = async () => {
    setSt({ msg: 'Working...' });
    try { setSt(await fn((msg) => setSt({ msg }))); } catch (e) { setSt({ msg: e.message || 'Something went wrong.' }); }
  };
  return [st, run];
}
function Drop({ accept, multiple, files, setFiles, label }) {
  const [over, setOver] = useState(false);
  // A file dropped outside the box would make the browser open it and leave the site
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    window.addEventListener('dragover', stop); window.addEventListener('drop', stop);
    return () => { window.removeEventListener('dragover', stop); window.removeEventListener('drop', stop); };
  }, []);
  const drop = (e) => {
    e.preventDefault(); setOver(false);
    const list = [...e.dataTransfer.files];
    if (list.length) setFiles(multiple ? list : list.slice(0, 1));
  };
  return (
    <label className={over ? 'drop over' : 'drop'} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={drop}>
      <input type="file" accept={accept} multiple={multiple} onChange={(e) => setFiles([...e.target.files])} />
      <b>{label}</b>
      <span>{files.length ? files.map((f) => f.name).join(', ') : 'Click to choose a file, or drag it here'}</span>
    </label>
  );
}
function Out({ st }) {
  return (
    <div className="out" aria-live="polite">
      {st.msg && <p>{st.msg}</p>}
      {st.file && <a className="btn" href={st.file.url} download={st.file.name}>Download {st.file.name}</a>}
      {st.img && <img className="prev" src={st.img} alt="Result preview" />}
    </div>
  );
}
const NOTE = (t) => <div className="note">{t}</div>;

// items: { s, x, y, w } in PDF points (y grows upwards) -> lines of items, top to bottom, left to right
function toLines(items, tol) {
  items.sort((a, b) => (Math.abs(b.y - a.y) > tol ? b.y - a.y : a.x - b.x));
  const lines = []; let cur = null;
  items.forEach((it) => { if (!cur || Math.abs(cur.y - it.y) > tol) { cur = { y: it.y, its: [] }; lines.push(cur); } cur.its.push(it); });
  lines.forEach((l) => l.its.sort((a, b) => a.x - b.x));
  return lines;
}

// Image-only pages (scans, or PDFs made from screenshots) have no text layer, so read them with OCR
async function ocrPage(page, getWorker) {
  const sc = 2, vp = page.getViewport({ scale: sc });
  const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: x, viewport: vp }).promise;
  const { data } = await (await getWorker()).recognize(c);
  // Table borders come back as "|" characters; drop them so they don't end up in the text
  const words = (data.words || []).map((w) => ({ ...w, text: w.text.replace(/[|¦]/g, '').trim() })).filter((w) => w.text && w.confidence > 30);
  const hs = words.map((w) => w.bbox.y1 - w.bbox.y0).sort((a, b) => a - b);
  const tol = hs.length ? hs[hs.length >> 1] / sc / 2 : 3;
  return toLines(words.map((w) => ({ s: w.text, x: w.bbox.x0 / sc, y: (vp.height - (w.bbox.y0 + w.bbox.y1) / 2) / sc, w: (w.bbox.x1 - w.bbox.x0) / sc })), tol);
}

async function readPdf(file, say = () => {}) {
  const pdfjs = await lib('pdfjs');
  pdfjs.GlobalWorkerOptions.workerSrc = CDN + 'pdf.js/3.11.174/pdf.worker.min.js';
  let pdf;
  try { pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise; }
  catch { throw new Error('Could not open this PDF. It may be password-protected or damaged.'); }
  let worker = null;
  const getWorker = () => (worker ||= lib('tesseract').then((T) => T.createWorker('eng')));
  const pages = [];
  try {
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const tc = await page.getTextContent();
      const items = tc.items.filter((i) => i.str.trim()).map((i) => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0 }));
      if (items.length) { pages.push(toLines(items, 3)); continue; }
      say(`Page ${n} of ${pdf.numPages} is an image, reading its text with OCR... (this can take a few seconds per page)`);
      try { pages.push(await ocrPage(page, getWorker)); }
      catch { throw new Error('Could not read the text in this scanned PDF. Check your internet connection and try again.'); }
    }
  } finally { if (worker) worker.then((w) => w.terminate()).catch(() => {}); }
  return pages;
}

function PdfToWord() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async (say) => {
    if (!files[0]) return { msg: 'Please choose a PDF first.' };
    const pages = await readPdf(files[0], say); let h = '', n = 0;
    pages.forEach((lines, i) => {
      lines.forEach((l) => {
        let t = '', p = null;
        l.its.forEach((it) => { if (p && it.x - (p.x + p.w) > 1.5) t += ' '; t += it.s; p = it; });
        if (t) { h += `<p>${esc(t)}</p>`; n++; }
      });
      if (i < pages.length - 1) h += '<br clear=all style="page-break-before:always">';
    });
    if (!n) return { msg: 'No text found in this PDF.' };
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body>${h}</body></html>`;
    return { file: mk(new Blob(['\ufeff', html], { type: 'application/msword' }), base(files[0]) + '.doc') };
  });
  return <><Drop accept=".pdf,application/pdf" files={files} setFiles={setFiles} label="Choose a PDF file" /><button className="btn" onClick={run}>Convert to Word</button><Out st={st} />{NOTE('Text is extracted. Complex layouts, images and tables may not be preserved. Scanned or image-only PDFs are read with OCR (English), which is slower and may contain small mistakes.')}</>;
}

function PdfToExcel() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async (say) => {
    if (!files[0]) return { msg: 'Please choose a PDF first.' };
    const pages = await readPdf(files[0], say); const X = await lib('xlsx');
    const wb = X.utils.book_new(); let n = 0;
    pages.forEach((lines, i) => {
      const rows = lines.map((l) => {
        const cells = []; let c = '', p = null;
        l.its.forEach((it) => {
          const gap = p ? it.x - (p.x + p.w) : 0;
          if (p && gap > 12) { cells.push(c); c = it.s; } else c += (p && gap > 1.5 ? ' ' : '') + it.s;
          p = it;
        });
        cells.push(c); n += cells.length;
        // "9,500" -> 9500 so Excel can sum it; keep leading-zero values (phone numbers, IDs) as text
        return cells.map((v) => (/^-?(0|[1-9][\d,]*)(\.\d+)?$/.test(v.trim()) ? +v.replace(/,/g, '') : v));
      });
      if (rows.length) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(rows), 'Page ' + (i + 1));
    });
    if (!n) return { msg: 'No text found in this PDF.' };
    const arr = X.write(wb, { bookType: 'xlsx', type: 'array' });
    return { file: mk(new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), base(files[0]) + '.xlsx') };
  });
  return <><Drop accept=".pdf,application/pdf" files={files} setFiles={setFiles} label="Choose a PDF file" /><button className="btn" onClick={run}>Convert to Excel</button><Out st={st} />{NOTE('Columns are detected from text position, so simple tables work best. Each PDF page becomes a sheet. Scanned PDFs are read with OCR (English).')}</>;
}

function WordToPdf() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async () => {
    const f = files[0];
    if (!f) return { msg: 'Please choose a .docx file first.' };
    if (!/\.docx$/i.test(f.name)) return { msg: 'Only .docx files are supported.' };
    const m = await lib('mammoth'); const h = await lib('html2pdf');
    const r = await m.convertToHtml({ arrayBuffer: await f.arrayBuffer() });
    if (!r.value.trim()) return { msg: 'This document looks empty. Nothing to convert.' };
    // Hide the wrapper, not d: html2pdf clones d with its inline styles, so an off-screen d renders a blank PDF
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden';
    const d = document.createElement('div');
    d.style.cssText = 'width:700px;padding:10px;background:#fff;color:#000;font:14px/1.6 Arial,sans-serif';
    d.innerHTML = '<style>table{border-collapse:collapse}td,th{border:1px solid #999;padding:4px}img{max-width:100%}</style>' + r.value;
    wrap.appendChild(d); document.body.appendChild(wrap);
    try {
      const blob = await h().set({ margin: 12, html2canvas: { scale: 2, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 }, jsPDF: { unit: 'mm', format: 'a4' } }).from(d).outputPdf('blob');
      return { file: mk(blob, base(f) + '.pdf') };
    } finally { document.body.removeChild(wrap); }
  });
  return <><Drop accept=".docx" files={files} setFiles={setFiles} label="Choose a Word (.docx) file" /><button className="btn" onClick={run}>Convert to PDF</button><Out st={st} />{NOTE('Only .docx is supported. Headings, lists and tables are kept; special fonts and text boxes may differ.')}</>;
}

function MergePdf() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async () => {
    if (files.length < 2) return { msg: 'Choose at least 2 PDF files.' };
    const P = await lib('pdflib'); const out = await P.PDFDocument.create();
    for (const f of files) {
      let d; try { d = await P.PDFDocument.load(await f.arrayBuffer()); } catch { return { msg: f.name + ' is damaged or password-protected.' }; }
      (await out.copyPages(d, d.getPageIndices())).forEach((p) => out.addPage(p));
    }
    return { file: mk(new Blob([await out.save()], { type: 'application/pdf' }), 'merged.pdf') };
  });
  return <><Drop accept="application/pdf" multiple files={files} setFiles={setFiles} label="Choose 2 or more PDF files" /><button className="btn" onClick={run}>Merge PDFs</button><Out st={st} /></>;
}

function ImageCompressor() {
  const [files, setFiles] = useState([]); const [q, setQ] = useState(70);
  const [st, run] = useRun(async () => {
    const f = files[0]; if (!f) return { msg: 'Please choose an image first.' };
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('This file is not a valid image.')); i.src = URL.createObjectURL(f); });
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
    const b = await new Promise((r) => c.toBlob(r, 'image/jpeg', q / 100));
    return { msg: `Before: ${(f.size / 1024).toFixed(0)} KB  ->  After: ${(b.size / 1024).toFixed(0)} KB`, file: mk(b, base(f) + '-compressed.jpg'), img: URL.createObjectURL(b) };
  });
  return <><Drop accept="image/*" files={files} setFiles={setFiles} label="Choose an image" /><div className="row"><label htmlFor="q">Quality: <b>{q}</b>%</label><input id="q" type="range" min="20" max="95" value={q} onChange={(e) => setQ(+e.target.value)} /></div><button className="btn" onClick={run}>Compress</button><Out st={st} /></>;
}

function QrGen() {
  const [t, setT] = useState(''); const [url, setUrl] = useState('');
  const gen = async () => { if (!t.trim()) return; const q = (await lib('qr'))(0, 'M'); q.addData(t.trim()); q.make(); setUrl(q.createDataURL(8, 4)); };
  return <><input type="text" value={t} onChange={(e) => setT(e.target.value)} placeholder="https://example.com" aria-label="Link or text" /><button className="btn" onClick={gen}>Generate QR</button>
    {url && <div className="out"><img src={url} alt="QR code" width="220" /><br /><a className="btn" href={url} download="qr-code.png">Download PNG</a></div>}</>;
}

function WordCounter() {
  const [v, setV] = useState(''); const t = v.trim(); const w = t ? t.split(/\s+/).length : 0;
  const s = t ? (t.match(/[.!?\u06D4]+/g) || [t]).length : 0;
  return <><textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="Paste or type your text here..." aria-label="Text" />
    <div className="stats"><div><b>{w}</b>Words</div><div><b>{v.length}</b>Characters</div><div><b>{s}</b>Sentences</div><div><b>{w ? Math.max(1, Math.round(w / 200)) : 0}</b>Min read</div></div></>;
}

function CaseConverter() {
  const [v, setV] = useState('');
  const f = { u: (s) => s.toUpperCase(), l: (s) => s.toLowerCase(),
    t: (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    s: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (a, b, c) => b + c.toUpperCase()) };
  return <><textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="Type or paste text..." aria-label="Text" />
    <button className="btn" onClick={() => setV(f.u(v))}>UPPERCASE</button><button className="btn" onClick={() => setV(f.l(v))}>lowercase</button>
    <button className="btn" onClick={() => setV(f.t(v))}>Title Case</button><button className="btn" onClick={() => setV(f.s(v))}>Sentence case</button>
    <button className="btn alt" onClick={() => navigator.clipboard.writeText(v)}>Copy</button></>;
}

function PasswordGen() {
  const [len, setLen] = useState(16), [num, setNum] = useState(true), [sym, setSym] = useState(true), [pw, setPw] = useState('');
  const gen = () => {
    let s = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; if (num) s += '23456789'; if (sym) s += '!@#$%^&*-_?';
    const r = new Uint32Array(len); crypto.getRandomValues(r); setPw([...r].map((n) => s[n % s.length]).join(''));
  };
  return <><div className="row"><label htmlFor="pl">Length: <b>{len}</b></label><input id="pl" type="range" min="8" max="40" value={len} onChange={(e) => setLen(+e.target.value)} /></div>
    <div className="row"><label><input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} /> Numbers</label><label><input type="checkbox" checked={sym} onChange={(e) => setSym(e.target.checked)} /> Symbols</label></div>
    <button className="btn" onClick={gen}>Generate</button><button className="btn alt" onClick={() => pw && navigator.clipboard.writeText(pw)}>Copy</button>
    <input type="text" readOnly value={pw} aria-label="Generated password" style={{ marginTop: 14, fontFamily: 'Consolas, monospace' }} /></>;
}

const MAP = { 'pdf-to-word': PdfToWord, 'pdf-to-excel': PdfToExcel, 'word-to-pdf': WordToPdf, 'merge-pdf': MergePdf,
  'image-compressor': ImageCompressor, 'qr-code-generator': QrGen, 'word-counter': WordCounter, 'case-converter': CaseConverter, 'password-generator': PasswordGen };
export default function ToolClient({ slug }) { const C = MAP[slug]; return <C />; }
