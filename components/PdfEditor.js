'use client';
import { useEffect, useRef, useState } from 'react';
import { lib, mk, base, useRun, Drop, Out, NOTE, openPdf } from './shared';

const TEXT_FONT = 'Helvetica, Arial, sans-serif';
const BASELINE = 0.95; // baseline of a line of text, as a share of the font size below the top of its 1.2 line box
const LOCKED = 'This PDF is password protected or damaged, so it cannot be changed.';

function usePdf(files) {
  const [pdf, setPdf] = useState(null), [msg, setMsg] = useState(''), [pageNo, setPageNo] = useState(1), [vp, setVp] = useState(null);
  useEffect(() => {
    let live = true;
    setPdf(null); setVp(null); setPageNo(1); setMsg('');
    if (!files[0]) return;
    setMsg('Opening PDF...');
    openPdf(files[0]).then((d) => { if (live) { setPdf(d); setMsg(''); } }, (e) => { if (live) setMsg(e.message); });
    return () => { live = false; };
  }, [files]);
  return { pdf, msg, pageNo, setPageNo, vp, setVp };
}

// The page as a picture with a layer on top. Everything on the layer is positioned in PDF points of the upright page
function Stage({ pdf, pageNo, vp, setVp, ov, touch, clip, children, ...handlers }) {
  const cv = useRef(null);
  useEffect(() => {
    let live = true, task;
    (async () => {
      const page = await pdf.getPage(pageNo); if (!live) return;
      const v1 = page.getViewport({ scale: 1 }), v = page.getViewport({ scale: Math.min(2, 1800 / Math.max(v1.width, v1.height)) });
      const c = document.createElement('canvas'); c.width = Math.ceil(v.width); c.height = Math.ceil(v.height);
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
      cv.current.width = c.width; cv.current.height = c.height; setVp(v1);
      task = page.render({ canvasContext: x, viewport: v }); await task.promise;
      if (live && cv.current) cv.current.getContext('2d').drawImage(c, 0, 0);
    })().catch(() => {});
    return () => { live = false; if (task) task.cancel(); };
  }, [pdf, pageNo, setVp]);
  return (
    <div className="pe-stage">
      <canvas ref={cv} />
      <div ref={ov} className="pe-ov" style={{ touchAction: touch ? 'none' : 'pan-y', overflow: clip ? 'hidden' : 'visible' }} {...handlers}>{vp && children}</div>
    </div>
  );
}
function Pager({ pdf, pageNo, setPageNo }) {
  return (
    <span className="pe-pager">
      <button className="btn alt" onClick={() => setPageNo(pageNo - 1)} disabled={pageNo <= 1} aria-label="Previous page">&lsaquo;</button>
      <span>Page {pageNo} of {pdf.numPages}</span>
      <button className="btn alt" onClick={() => setPageNo(pageNo + 1)} disabled={pageNo >= pdf.numPages} aria-label="Next page">&rsaquo;</button>
    </span>
  );
}
// Pointer position in PDF points of the upright page
const at = (e, ov, vp) => { const r = (ov.current || e.currentTarget).getBoundingClientRect(); return [(e.clientX - r.left) / r.width * vp.width, (e.clientY - r.top) / r.height * vp.height]; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function SignPad({ onDone }) {
  const cv = useRef(null), last = useRef(null);
  const [mode, setMode] = useState('draw'), [name, setName] = useState(''), [err, setErr] = useState('');
  const ctx = () => cv.current.getContext('2d');
  const clear = () => ctx().clearRect(0, 0, 600, 200);
  const p = (e) => { const r = cv.current.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 600, (e.clientY - r.top) / r.height * 200]; };
  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); last.current = p(e); const x = ctx(); x.fillStyle = '#0b2a6f'; x.beginPath(); x.arc(...last.current, 1.5, 0, 7); x.fill(); };
  const move = (e) => {
    if (!last.current) return;
    const q = p(e), x = ctx(); x.strokeStyle = '#0b2a6f'; x.lineWidth = 3; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(...last.current); x.lineTo(...q); x.stroke(); last.current = q;
  };
  const use = () => {
    if (mode === 'type') {
      clear(); const x = ctx(); x.fillStyle = '#0b2a6f'; x.textBaseline = 'middle';
      let s = 90; do { x.font = `italic ${s}px "Segoe Script", "Brush Script MT", "Lucida Handwriting", "Snell Roundhand", cursive`; s -= 4; } while (x.measureText(name).width > 570 && s > 20);
      x.fillText(name.trim(), 15, 100);
    }
    // Cut away the empty space around the ink so the signature can be placed exactly
    const d = ctx().getImageData(0, 0, 600, 200).data; let x0 = 600, y0 = 200, x1 = -1, y1 = -1;
    for (let y = 0; y < 200; y++) for (let x = 0; x < 600; x++) if (d[(y * 600 + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 - x0 < 4 || y1 - y0 < 4) return setErr(mode === 'type' ? 'Type your name first.' : 'Draw your signature in the box first.');
    const c = document.createElement('canvas'); c.width = x1 - x0 + 9; c.height = y1 - y0 + 9;
    c.getContext('2d').drawImage(cv.current, x0 - 4, y0 - 4, c.width, c.height, 0, 0, c.width, c.height);
    onDone({ url: c.toDataURL('image/png'), ratio: c.height / c.width });
  };
  return (
    <div className="pe-sign">
      <div className="pe-bar">
        <button className={`btn alt${mode === 'draw' ? ' on' : ''}`} onClick={() => { setMode('draw'); setErr(''); clear(); }}>Draw</button>
        <button className={`btn alt${mode === 'type' ? ' on' : ''}`} onClick={() => { setMode('type'); setErr(''); clear(); }}>Type</button>
      </div>
      {mode === 'type' && <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" aria-label="Your name" style={{ marginTop: 10 }} />}
      <canvas ref={cv} width="600" height="200" className="pe-pad" style={mode === 'type' ? { display: 'none' } : null} aria-label="Signature drawing area"
        onPointerDown={down} onPointerMove={move} onPointerUp={() => { last.current = null; }} onPointerCancel={() => { last.current = null; }} />
      <div className="pe-bar">
        <button className="btn" onClick={use}>Use this signature</button>
        {mode === 'draw' && <button className="btn alt" onClick={clear}>Clear</button>}
      </div>
      {err && <p>{err}</p>}
    </div>
  );
}

function Editor({ sign }) {
  const [files, setFiles] = useState([]);
  const { pdf, msg, pageNo, setPageNo, vp, setVp } = usePdf(files);
  const [els, setEls] = useState([]), [tool, setTool] = useState(sign ? 'sign' : 'text');
  const [color, setColor] = useState('#000000'), [size, setSize] = useState(14), [sig, setSig] = useState(null), [k, setK] = useState(1);
  const ov = useRef(null), drag = useRef(null), ids = useRef(0);
  useEffect(() => { setEls([]); }, [files]);
  useEffect(() => {
    const el = ov.current;
    if (!vp || !el) return;
    // el, not ov.current: the observer can still fire once after the page view is removed (another file chosen)
    const fit = () => { const w = el.getBoundingClientRect().width; if (w) setK(w / vp.width); };
    const ro = new ResizeObserver(fit); ro.observe(el); fit();
    return () => ro.disconnect();
  }, [vp]);
  const upd = (id, ch) => setEls((a) => a.map((e) => (e.id === id ? { ...e, ...ch } : e)));
  const del = (id) => setEls((a) => a.filter((e) => e.id !== id));
  const add = (el) => { const id = ++ids.current; setEls((a) => [...a, { id, page: pageNo, ...el }]); return id; };

  const click = (e) => {
    if (e.target !== ov.current || !vp) return;
    const [x, y] = at(e, ov, vp);
    if (tool === 'text') add({ type: 'text', x, y: clamp(y - size * 0.6, 0, vp.height - size * 1.2), text: '', size, color });
    if (tool === 'sign' && sig) { const w = Math.min(160, vp.width * 0.4), h = w * sig.ratio; add({ type: 'sign', x: clamp(x - w / 2, 0, vp.width - w), y: clamp(y - h / 2, 0, vp.height - h), w, h, img: sig.url, ratio: sig.ratio }); }
  };
  const down = (e) => {
    if (e.target !== ov.current || (tool !== 'white' && tool !== 'draw')) return;
    const [x, y] = at(e, ov, vp); ov.current.setPointerCapture(e.pointerId);
    drag.current = { kind: tool, x, y, id: add(tool === 'white' ? { type: 'white', x, y, w: 0, h: 0 } : { type: 'draw', pts: [[x, y]], color, lw: 2 }) };
  };
  const grab = (el, kind) => (e) => {
    e.stopPropagation(); e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = at(e, ov, vp); drag.current = { kind, id: el.id, dx: x - el.x, dy: y - el.y };
  };
  const move = (e) => {
    const d = drag.current; if (!d || !vp) return;
    const [px, py] = at(e, ov, vp), x = clamp(px, 0, vp.width), y = clamp(py, 0, vp.height);
    if (d.kind === 'white') upd(d.id, { x: Math.min(d.x, x), y: Math.min(d.y, y), w: Math.abs(x - d.x), h: Math.abs(y - d.y) });
    else if (d.kind === 'draw') setEls((a) => a.map((el) => (el.id === d.id ? { ...el, pts: [...el.pts, [x, y]] } : el)));
    else if (d.kind === 'move') setEls((a) => a.map((el) => (el.id === d.id ? { ...el, x: clamp(px - d.dx, 0, vp.width - (el.w || 10)), y: clamp(py - d.dy, 0, vp.height - (el.h || el.size * 1.2)) } : el)));
    else if (d.kind === 'size') setEls((a) => a.map((el) => { if (el.id !== d.id) return el; const w = clamp(x - el.x, 30, vp.width - el.x); return { ...el, w, h: w * el.ratio }; }));
  };
  const up = () => {
    const d = drag.current; drag.current = null;
    if (d && d.kind === 'white') setEls((a) => a.filter((el) => el.id !== d.id || (el.w > 3 && el.h > 3)));
  };

  const [st, run] = useRun(async () => {
    const list = els.filter((e) => e.type !== 'text' || e.text.trim());
    if (!list.length) return { msg: sign ? 'Place your signature on the page first.' : 'Add some text, a whiteout or a drawing to the page first.' };
    const P = await lib('pdflib'); let doc;
    try { doc = await P.PDFDocument.load(await files[0].arrayBuffer()); } catch { return { msg: LOCKED }; }
    const font = await doc.embedFont(P.StandardFonts.Helvetica), vps = {}, imgs = {};
    const rgb = (h) => { const n = parseInt(h.slice(1), 16); return P.rgb((n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
    for (const el of list) {
      // pdf.js turns positions on the upright page into the page's own coordinates, whatever its rotation or crop
      const v = (vps[el.page] ||= (await pdf.getPage(el.page)).getViewport({ scale: 1 }));
      const page = doc.getPage(el.page - 1), rotate = P.degrees(v.rotation), pt = (x, y) => v.convertToPdfPoint(x, y);
      if (el.type === 'white') {
        const [x1, y1] = pt(el.x, el.y), [x2, y2] = pt(el.x + el.w, el.y + el.h);
        page.drawRectangle({ x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1), color: P.rgb(1, 1, 1) });
      } else if (el.type === 'draw') {
        const ps = el.pts.length > 1 ? el.pts : [el.pts[0], [el.pts[0][0] + 0.1, el.pts[0][1]]];
        for (let i = 1; i < ps.length; i++) { const [a, b] = pt(...ps[i - 1]), [c, d] = pt(...ps[i]); page.drawLine({ start: { x: a, y: b }, end: { x: c, y: d }, thickness: el.lw, color: rgb(el.color), lineCap: P.LineCapStyle.Round }); }
      } else if (el.type === 'sign') {
        const [x, y] = pt(el.x, el.y + el.h);
        page.drawImage((imgs[el.img] ||= await doc.embedPng(el.img)), { x, y, width: el.w, height: el.h, rotate });
      } else {
        let plain = true; try { font.encodeText(el.text); } catch { plain = false; }
        if (plain) { const [x, y] = pt(el.x, el.y + el.size * BASELINE); page.drawText(el.text, { x, y, size: el.size, font, color: rgb(el.color), rotate }); continue; }
        // The built-in PDF font only has Western letters, so other scripts (Urdu, Arabic, Chinese...) go in as a sharp picture
        const s = 4, c = document.createElement('canvas'), x = c.getContext('2d'), f = `${el.size * s}px ${TEXT_FONT}`;
        x.font = f; const w = x.measureText(el.text).width / s + 2;
        c.width = Math.ceil(w * s); c.height = Math.ceil(el.size * 1.2 * s);
        const y2 = c.getContext('2d'); y2.font = f; y2.fillStyle = el.color; y2.textBaseline = 'alphabetic'; y2.fillText(el.text, s, el.size * BASELINE * s);
        const [ax, ay] = pt(el.x, el.y + el.size * 1.2);
        page.drawImage(await doc.embedPng(c.toDataURL('image/png')), { x: ax, y: ay, width: w, height: el.size * 1.2, rotate });
      }
    }
    return { file: mk(new Blob([await doc.save()], { type: 'application/pdf' }), base(files[0]) + (sign ? '_signed.pdf' : '_edited.pdf')) };
  });

  const tools = sign ? [['sign', 'Signature'], ['text', 'Text / date']] : [['text', 'Text'], ['white', 'Whiteout'], ['draw', 'Draw']];
  const hint = { text: 'Click on the page where the text should go, then type. Drag the arrows to move it.', white: 'Drag over the part you want to cover with white. Then pick Text to write on top of it.',
    draw: 'Draw on the page with your mouse or finger.', sign: sig ? 'Click on the page where your signature should go. Drag it to move, drag its corner to resize.' : 'Create your signature below first.' }[tool];
  const pct = (el) => ({ left: `${el.x / vp.width * 100}%`, top: `${el.y / vp.height * 100}%` });
  return (
    <>
      <Drop accept=".pdf,application/pdf" files={files} setFiles={setFiles} label="Choose a PDF file" />
      {msg && <div className="out" aria-live="polite"><p>{msg}</p></div>}
      {pdf && <>
        {sign && !sig && <SignPad onDone={(s) => { setSig(s); setTool('sign'); }} />}
        {sign && sig && <div className="pe-bar"><img className="pe-sigprev" src={sig.url} alt="Your signature" /><button className="btn alt" onClick={() => setSig(null)}>Change signature</button></div>}
        <div className="pe-bar">
          {tools.map(([t, name]) => <button key={t} className={`btn alt${tool === t ? ' on' : ''}`} aria-pressed={tool === t} onClick={() => setTool(t)}>{name}</button>)}
          {tool === 'text' && <label>Size <select value={size} onChange={(e) => setSize(+e.target.value)}>{[8, 10, 12, 14, 16, 18, 24, 32, 48].map((n) => <option key={n}>{n}</option>)}</select></label>}
          {(tool === 'text' || tool === 'draw') && <label>Colour <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>}
          <button className="btn alt" onClick={() => setEls((a) => a.slice(0, -1))} disabled={!els.length}>Undo</button>
          <Pager pdf={pdf} pageNo={pageNo} setPageNo={setPageNo} />
        </div>
        <p className="pe-hint">{hint}</p>
        <Stage pdf={pdf} pageNo={pageNo} vp={vp} setVp={setVp} ov={ov} touch={tool === 'white' || tool === 'draw'}
          onClick={click} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <svg viewBox={`0 0 ${vp ? vp.width : 1} ${vp ? vp.height : 1}`} preserveAspectRatio="none">
            {els.filter((e) => e.page === pageNo && e.type === 'draw').map((e) => <polyline key={e.id} points={(e.pts.length > 1 ? e.pts : [e.pts[0], e.pts[0]]).map((q) => q.join(',')).join(' ')} fill="none" stroke={e.color} strokeWidth={e.lw} strokeLinecap="round" strokeLinejoin="round" />)}
          </svg>
          {vp && els.filter((e) => e.page === pageNo && e.type !== 'draw').map((el) => (el.type === 'text' ? (
            <div key={el.id} className="pe-el" style={pct(el)}>
              <input className="pe-txt" type="text" autoFocus value={el.text} aria-label="Text to add" onChange={(e) => upd(el.id, { text: e.target.value })} onBlur={() => { if (!el.text.trim()) del(el.id); }}
                style={{ fontSize: el.size * k, height: el.size * 1.2 * k, lineHeight: `${el.size * 1.2 * k}px`, color: el.color, width: `calc(${Math.max(el.text.length, 3)}ch + ${el.size * k}px)` }} />
              <span className="pe-grip" onPointerDown={grab(el, 'move')} title="Drag to move">&#10021;</span>
              <button className="pe-x" onPointerDown={(e) => e.preventDefault()} onClick={() => del(el.id)} aria-label="Delete">&times;</button>
            </div>
          ) : (
            <div key={el.id} className={`pe-el pe-${el.type}`} onPointerDown={grab(el, 'move')}
              // A whiteout only reacts while its own tool is active, so with the Text tool a click on it types over it
              style={{ ...pct(el), width: `${el.w / vp.width * 100}%`, height: `${el.h / vp.height * 100}%`, pointerEvents: el.type === 'white' && tool !== 'white' ? 'none' : 'auto' }}>
              {el.type === 'sign' && <><img src={el.img} alt="Signature" draggable="false" /><span className="pe-size" onPointerDown={grab(el, 'size')} title="Drag to resize" /></>}
              {el.w > 3 && (el.type !== 'white' || tool === 'white') && <button className="pe-x" onPointerDown={(e) => e.stopPropagation()} onClick={() => del(el.id)} aria-label="Delete">&times;</button>}
            </div>
          )))}
        </Stage>
        <button className="btn" onClick={run}>{sign ? 'Save signed PDF' : 'Save PDF'}</button><Out st={st} />
      </>}
      {NOTE(sign ? 'Draw or type your signature, place it on any page and save. Your PDF and your signature never leave your browser.'
        : 'Add text, cover parts of a page with white, or draw on it. Text that is already in the PDF cannot be retyped, but you can white it out and write over it.')}
    </>
  );
}
export const EditPdf = () => <Editor />;
export const SignPdf = () => <Editor sign />;

export function CropPdf() {
  const [files, setFiles] = useState([]);
  const { pdf, msg, pageNo, setPageNo, vp, setVp } = usePdf(files);
  const [box, setBox] = useState(null), [every, setEvery] = useState(true); // box is in shares of the page, so it fits pages of any size
  const ov = useRef(null), start = useRef(null);
  useEffect(() => { setBox(null); }, [files]);
  const frac = (e) => { const [x, y] = at(e, ov, vp); return [clamp(x / vp.width, 0, 1), clamp(y / vp.height, 0, 1)]; };
  const down = (e) => { ov.current.setPointerCapture(e.pointerId); start.current = frac(e); setBox(null); };
  const move = (e) => { if (!start.current) return; const [x, y] = frac(e), [sx, sy] = start.current; setBox({ x: Math.min(x, sx), y: Math.min(y, sy), w: Math.abs(x - sx), h: Math.abs(y - sy) }); };
  const [st, run] = useRun(async () => {
    if (!box || box.w * vp.width < 10 || box.h * vp.height < 10) return { msg: 'Drag on the page to mark the area you want to keep.' };
    const P = await lib('pdflib'); let doc;
    try { doc = await P.PDFDocument.load(await files[0].arrayBuffer()); } catch { return { msg: LOCKED }; }
    for (let n = 1; n <= pdf.numPages; n++) {
      if (!every && n !== pageNo) continue;
      const v = (await pdf.getPage(n)).getViewport({ scale: 1 });
      const [x1, y1] = v.convertToPdfPoint(box.x * v.width, box.y * v.height), [x2, y2] = v.convertToPdfPoint((box.x + box.w) * v.width, (box.y + box.h) * v.height);
      const r = [Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)], page = doc.getPage(n - 1);
      // Every box is set, because viewers and printers do not agree on which one they follow
      page.setMediaBox(...r); page.setCropBox(...r); page.setBleedBox(...r); page.setTrimBox(...r); page.setArtBox(...r);
    }
    return { file: mk(new Blob([await doc.save()], { type: 'application/pdf' }), base(files[0]) + '_cropped.pdf') };
  });
  return (
    <>
      <Drop accept=".pdf,application/pdf" files={files} setFiles={setFiles} label="Choose a PDF file" />
      {msg && <div className="out" aria-live="polite"><p>{msg}</p></div>}
      {pdf && <>
        <div className="pe-bar">
          <label><input type="checkbox" checked={every} onChange={(e) => setEvery(e.target.checked)} /> Crop all pages the same way</label>
          <button className="btn alt" onClick={() => setBox(null)} disabled={!box}>Reset</button>
          <Pager pdf={pdf} pageNo={pageNo} setPageNo={setPageNo} />
        </div>
        <p className="pe-hint">Drag on the page to mark the area you want to keep. Drag again to change it.</p>
        <Stage pdf={pdf} pageNo={pageNo} vp={vp} setVp={setVp} ov={ov} touch clip onPointerDown={down} onPointerMove={move} onPointerUp={() => { start.current = null; }} onPointerCancel={() => { start.current = null; }}>
          {box && <div className="pe-crop" style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }} />}
        </Stage>
        <button className="btn" onClick={run}>Crop PDF</button><Out st={st} />
      </>}
      {NOTE('Cropping hides everything outside the area you mark and makes the page smaller. The text inside stays sharp and selectable.')}
    </>
  );
}
