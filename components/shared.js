'use client';
import { useEffect, useState } from 'react';

export const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
const LIBS = {
  pdflib: [CDN + 'pdf-lib/1.17.1/pdf-lib.min.js', 'PDFLib'],
  pdfjs: [CDN + 'pdf.js/3.11.174/pdf.min.js', 'pdfjsLib'],
  xlsx: [CDN + 'xlsx/0.18.5/xlsx.full.min.js', 'XLSX'],
  mammoth: [CDN + 'mammoth/1.6.0/mammoth.browser.min.js', 'mammoth'],
  html2pdf: [CDN + 'html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf'],
  qr: [CDN + 'qrcode-generator/1.4.4/qrcode.min.js', 'qrcode'],
  jszip: [CDN + 'jszip/3.10.1/jszip.min.js', 'JSZip'],
  pptx: ['https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js', 'PptxGenJS'],
  tesseract: ['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'Tesseract'],
};
const pending = {};
export function lib(name) {
  const [src, g] = LIBS[name];
  if (window[g]) return Promise.resolve(window[g]);
  if (!pending[name]) pending[name] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => res(window[g]); // A failed load is forgotten, so pressing the button again retries it
    s.onerror = () => { delete pending[name]; s.remove(); rej(new Error('Could not load tool library. Check your internet connection and try again.')); };
    document.head.appendChild(s);
  });
  return pending[name];
}
export const mk = (blob, name) => ({ url: URL.createObjectURL(blob), name });
export const base = (f) => f.name.replace(/\.[^.]+$/, '');
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function useRun(fn) {
  const [st, setSt] = useState({});
  const run = async () => {
    setSt({ msg: 'Working...' });
    try { setSt(await fn((msg) => setSt({ msg }))); } catch (e) { setSt({ msg: e.message || 'Something went wrong.' }); }
  };
  return [st, run];
}
export function Drop({ accept, multiple, files, setFiles, label }) {
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
      <input type="file" accept={accept} multiple={multiple} onChange={(e) => setFiles([...e.target.files])}
        // Cleared on every open, so choosing the same file again still counts as a new choice
        onClick={(e) => { e.target.value = ''; }} />
      <b>{label}</b>
      <span>{files.length ? files.map((f) => f.name).join(', ') : 'Tap or click here to choose a file'}</span>
    </label>
  );
}
export function Out({ st }) {
  return (
    <div className="out" aria-live="polite">
      {st.msg && <p>{st.msg}</p>}
      {st.file && <a className="btn" href={st.file.url} download={st.file.name}>Download {st.file.name}</a>}
      {st.img && <img className="prev" src={st.img} alt="Result preview" />}
    </div>
  );
}
export const NOTE = (t) => <div className="note">{t}</div>;

export async function openPdf(file) {
  const pdfjs = await lib('pdfjs');
  pdfjs.GlobalWorkerOptions.workerSrc = CDN + 'pdf.js/3.11.174/pdf.worker.min.js';
  try { return await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise; }
  catch { throw new Error('Could not open this PDF. It may be password-protected or damaged.'); }
}
