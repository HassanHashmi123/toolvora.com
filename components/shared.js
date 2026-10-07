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
    s.src = src; s.onload = () => res(window[g]);
    s.onerror = () => { delete pending[name]; s.remove(); rej(new Error('Could not load tool library. Check your internet connection and try again.')); };
    document.head.appendChild(s);
  });
  return pending[name];
}
export const mk = (blob, name) => ({ url: URL.createObjectURL(blob), name });
export const base = (f) => f.name.replace(/\.[^.]+$/, '');
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function useRun(fn) {
  const [st, setSt] = useState({});
  const run = async () => {
    setSt({ msg: 'Processing locally in browser memory...', loading: true });
    try {
      const res = await fn((msg) => setSt({ msg, loading: true }));
      setSt({ ...res, loading: false });
    } catch (e) {
      setSt({ msg: e.message || 'Something went wrong.', isError: true, loading: false });
    }
  };
  return [st, run];
}

export function Drop({ accept, multiple, files, setFiles, label }) {
  const [over, setOver] = useState(false);
  
  useEffect(() => {
    const stop = (e) => e.preventDefault();
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return () => {
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);

  const drop = (e) => {
    e.preventDefault();
    setOver(false);
    const list = [...e.dataTransfer.files];
    if (list.length) setFiles(multiple ? list : list.slice(0, 1));
  };

  return (
    <label
      className={over ? 'drop over' : 'drop'}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => setFiles([...e.target.files])}
        onClick={(e) => { e.target.value = ''; }}
      />
      <div className="drop-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <b>{label}</b>
      {files.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          {files.map((f, idx) => (
            <div key={idx} className="file-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <span>{f.name} ({formatBytes(f.size)})</span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-muted)' }}>
            Click or drop to replace {multiple ? 'files' : 'file'}
          </div>
        </div>
      ) : (
        <span>Drag & drop your {multiple ? 'files' : 'file'} here, or click to browse from device</span>
      )}
    </label>
  );
}

export function Out({ st }) {
  if (!st || (!st.msg && !st.file && !st.img)) return null;

  return (
    <div className="out" aria-live="polite">
      {st.msg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: st.file ? 12 : 0 }}>
          {st.loading && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {st.file && !st.loading && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <p style={{ margin: 0, fontWeight: st.file ? 600 : 400, color: st.isError ? '#ef4444' : 'inherit' }}>
            {st.msg}
          </p>
        </div>
      )}
      {st.file && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          <a className="btn" href={st.file.url} download={st.file.name}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download {st.file.name}
          </a>
        </div>
      )}
      {st.img && <img className="prev" src={st.img} alt="Result preview" />}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export const NOTE = (t) => (
  <div className="note">
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--vibeans-blue-light)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <div>
        <b style={{ color: '#fff', display: 'block', marginBottom: 2 }}>100% Client Side Privacy Guarantee</b>
        <span>{t}</span>
      </div>
    </div>
  </div>
);

export async function openPdf(file) {
  const pdfjs = await lib('pdfjs');
  pdfjs.GlobalWorkerOptions.workerSrc = CDN + 'pdf.js/3.11.174/pdf.worker.min.js';
  try { return await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise; }
  catch { throw new Error('Could not open this PDF. It may be password protected or damaged.'); }
}
