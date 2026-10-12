'use client';
import { useEffect, useRef, useState } from 'react';
import { lib, base, formatBytes, useRun, Drop, Out, NOTE } from './shared';

const CANT_OPEN = 'This file could not be opened. It may be damaged or not an image.';
const TOO_BIG = 'Your browser could not process this image. Try a smaller image.';
const loadImg = (file) => new Promise((res, rej) => {
  const i = new Image(), u = URL.createObjectURL(file);
  i.onload = () => { URL.revokeObjectURL(u); i.naturalWidth ? res(i) : rej(new Error(CANT_OPEN)); };
  i.onerror = () => { URL.revokeObjectURL(u); rej(new Error(CANT_OPEN)); };
  i.src = u;
});
// The picture on a canvas, made smaller when its longest side is above max
function toCanvas(img, max) {
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  c.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, c.width, c.height);
  return c;
}
const toBlob = (c, type, q) => new Promise((r) => c.toBlob(r, type, q));

/* ---------- Background Remover ---------- */

// U2-Net (small version), Apache 2.0 licence, see public/models/README.txt. It looks at a 320 x 320 copy of the picture
const MODEL = '/models/u2netp.onnx', S = 320, MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];
const BG_MAX = 2560;
let session = null;
function model() {
  if (!session) session = (async () => {
    const ort = await lib('ort');
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/'; ort.env.wasm.numThreads = 1;
    return [ort, await ort.InferenceSession.create(MODEL)];
  })().catch(() => { session = null; throw new Error('Could not load the background model. Check your internet connection and try again.'); });
  return session;
}
// How strongly each pixel belongs to the main subject, 0 to 1, for an S x S copy of the picture
async function subjectMask(src) {
  const [ort, s] = await model();
  const c = document.createElement('canvas'); c.width = c.height = S;
  const x = c.getContext('2d', { willReadFrequently: true }); x.fillStyle = '#fff'; x.fillRect(0, 0, S, S); x.drawImage(src, 0, 0, S, S);
  const d = x.getImageData(0, 0, S, S).data, n = S * S, t = new Float32Array(3 * n);
  let max = 1; for (let i = 0; i < d.length; i += 4) max = Math.max(max, d[i], d[i + 1], d[i + 2]);
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) t[k * n + i] = (d[i * 4 + k] / max - MEAN[k]) / STD[k];
  const out = (await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', t, [1, 3, S, S]) }))[s.outputNames[0]].data;
  let lo = Infinity, hi = -Infinity; for (let i = 0; i < n; i++) { if (out[i] < lo) lo = out[i]; if (out[i] > hi) hi = out[i]; }
  const m = new Float32Array(n); for (let i = 0; i < n; i++) m[i] = (out[i] - lo) / (hi - lo || 1);
  return m;
}
// Makes the background of the canvas transparent. Returns the share of the picture that was kept
function applyMask(c, m) {
  const w = c.width, h = c.height, x = c.getContext('2d'), px = x.getImageData(0, 0, w, h), d = px.data;
  let kept = 0;
  for (let y = 0; y < h; y++) {
    const fy = Math.min(S - 1, Math.max(0, (y + 0.5) * S / h - 0.5)), y0 = Math.floor(fy), y1 = Math.min(S - 1, y0 + 1), ty = fy - y0;
    for (let i = 0; i < w; i++) {
      const fx = Math.min(S - 1, Math.max(0, (i + 0.5) * S / w - 0.5)), x0 = Math.floor(fx), x1 = Math.min(S - 1, x0 + 1), tx = fx - x0;
      let a = (m[y0 * S + x0] * (1 - tx) + m[y0 * S + x1] * tx) * (1 - ty) + (m[y1 * S + x0] * (1 - tx) + m[y1 * S + x1] * tx) * ty;
      // A steeper edge than the enlarged mask has, so less of the old background shows as a halo
      a = Math.min(1, Math.max(0, (a - 0.25) / 0.5)); a = a * a * (3 - 2 * a);
      const o = (y * w + i) * 4 + 3; d[o] = d[o] * a; if (a > 0.5) kept++;
    }
  }
  x.putImageData(px, 0, 0);
  return kept / (w * h);
}

export function BgRemover() {
  const [files, setFiles] = useState([]), [bg, setBg] = useState('none'), [color, setColor] = useState('#ffffff'), [cut, setCut] = useState(null), [out, setOut] = useState(null);
  const [st, run] = useRun(async (say) => {
    setCut(null);
    if (!files[0]) return { msg: 'Please choose an image first.' };
    const img = await loadImg(files[0]);
    say('Loading the background model (about 7 MB the first time)...');
    await model();
    say('Finding the subject of the picture...');
    let c, kept;
    try { c = toCanvas(img, BG_MAX); kept = applyMask(c, await subjectMask(c)); } catch { throw new Error(TOO_BIG); }
    if (kept < 0.005) return { msg: 'No clear subject was found in this picture. Try a photo in which the person or object stands out from the background.' };
    setCut(c);
    return { msg: `Background removed. The picture is ${c.width} x ${c.height} pixels.` };
  });
  // The download is made again whenever the cut out picture or the chosen background changes
  useEffect(() => {
    if (!cut) { setOut(null); return; }
    let live = true, url;
    const c = document.createElement('canvas'); c.width = cut.width; c.height = cut.height;
    const x = c.getContext('2d'); if (bg !== 'none') { x.fillStyle = bg === 'white' ? '#fff' : color; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(cut, 0, 0);
    toBlob(c, 'image/png').then((b) => { if (live && b) { url = URL.createObjectURL(b); setOut({ url, size: b.size }); } });
    return () => { live = false; if (url) URL.revokeObjectURL(url); };
  }, [cut, bg, color]);
  const name = files[0] ? base(files[0]) + '_no_bg.png' : '';
  return (
    <>
      <Drop accept="image/*" files={files} setFiles={(f) => { setFiles(f); setCut(null); }} label="Choose an image" />
      <button className="btn" onClick={run}>Remove Background</button>
      <Out st={st} />
      {cut && <>
        <div className="pe-bar">
          <label htmlFor="bgc">New background</label>
          <select id="bgc" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: 'auto', padding: '0 10px' }}>
            <option value="none">Transparent</option><option value="white">White</option><option value="color">Colour</option>
          </select>
          {bg === 'color' && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Background colour" />}
        </div>
        {out && <>
          <div className="ie-check"><img src={out.url} alt="Picture without its background" /></div>
          <a className="btn" href={out.url} download={name}>Download PNG ({formatBytes(out.size)})</a>
        </>}
      </>}
      {NOTE('The subject is found by a small model that runs on your device, so the picture is not uploaded. It works best when one person or object stands out clearly. Fine details such as loose hair can be cut off.')}
    </>
  );
}

/* ---------- Object Remover ---------- */

const OBJ_MAX = 3000;
// Fills the marked pixels of an RGBA block from their surroundings, working inwards from the edge of the mark.
// No model is involved: the filled area continues the nearby colours, it does not invent detail. False if nothing unmarked is left
function inpaint(d, w, h, mask) {
  const n = w * h, m = mask.slice(), R = 4, queued = new Uint8Array(n);
  const edge = (i) => { const x = i % w, y = (i / w) | 0; return (x > 0 && !m[i - 1]) || (x < w - 1 && !m[i + 1]) || (y > 0 && !m[i - w]) || (y < h - 1 && !m[i + w]); };
  let front = [];
  for (let i = 0; i < n; i++) if (m[i] && edge(i)) { front.push(i); queued[i] = 1; }
  if (!front.length) return false;
  while (front.length) {
    const vals = new Float32Array(front.length * 4);
    for (let k = 0; k < front.length; k++) {
      const i = front[k], x = i % w, y = (i / w) | 0; let sw = 0, r = 0, g = 0, b = 0, a = 0;
      for (let dy = -R; dy <= R; dy++) {
        const ny = y + dy; if (ny < 0 || ny >= h) continue;
        for (let dx = -R; dx <= R; dx++) {
          const nx = x + dx; if (nx < 0 || nx >= w) continue;
          const j = ny * w + nx; if (m[j]) continue;
          const wg = 1 / (dx * dx + dy * dy), o = j * 4; sw += wg; r += wg * d[o]; g += wg * d[o + 1]; b += wg * d[o + 2]; a += wg * d[o + 3];
        }
      }
      vals.set([r / sw, g / sw, b / sw, a / sw], k * 4);
    }
    const next = [];
    for (let k = 0; k < front.length; k++) { const i = front[k]; d.set(vals.subarray(k * 4, k * 4 + 4), i * 4); m[i] = 0; }
    for (const i of front) {
      const x = i % w, y = (i / w) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) if (j >= 0 && m[j] && !queued[j]) { queued[j] = 1; next.push(j); }
    }
    front = next;
  }
  // Smooth away the streaks that the inward fill leaves
  const idx = []; for (let i = 0; i < n; i++) if (mask[i]) idx.push(i);
  const f = Float32Array.from(d);
  for (let it = 0; it < 40; it++) for (let q = 0; q < idx.length; q++) {
    const i = it & 1 ? idx[idx.length - 1 - q] : idx[q], x = i % w, y = (i / w) | 0;
    for (let c = 0; c < 4; c++) {
      let s = 0, k = 0;
      if (x > 0) { s += f[(i - 1) * 4 + c]; k++; } if (x < w - 1) { s += f[(i + 1) * 4 + c]; k++; }
      if (y > 0) { s += f[(i - w) * 4 + c]; k++; } if (y < h - 1) { s += f[(i + w) * 4 + c]; k++; }
      f[i * 4 + c] = s / k;
    }
  }
  // A perfectly smooth patch stands out in a photo, so give it the same amount of grain as the area around it
  const lum = (i) => d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114, hp = [];
  for (let i = w + 1, step = Math.max(1, Math.floor(n / 6000)); i < n - w - 1; i += step) {
    if (mask[i] || mask[i - 1] || mask[i + 1] || mask[i - w] || mask[i + w] || i % w === 0 || i % w === w - 1) continue;
    hp.push(Math.abs(lum(i) - (lum(i - 1) + lum(i + 1) + lum(i - w) + lum(i + w)) / 4));
  }
  hp.sort((p, q) => p - q);
  const grain = hp.length ? Math.min(8, hp[hp.length >> 1] * 1.4826 / 1.118) : 0;
  for (const i of idx) {
    const z = grain ? Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(6.2832 * Math.random()) * grain : 0;
    d[i * 4] = f[i * 4] + z; d[i * 4 + 1] = f[i * 4 + 1] + z; d[i * 4 + 2] = f[i * 4 + 2] + z; d[i * 4 + 3] = f[i * 4 + 3];
  }
  return true;
}

export function ObjectRemover() {
  const [files, setFiles] = useState([]), [ready, setReady] = useState(false), [msg, setMsg] = useState(''), [brush, setBrush] = useState(30), [undo, setUndo] = useState([]), [marked, setMarked] = useState(false);
  const cv = useRef(null), ov = useRef(null), last = useRef(null), box = useRef(null);
  useEffect(() => {
    let live = true;
    setReady(false); setUndo([]); setMarked(false); setMsg(''); box.current = null;
    if (!files[0]) return;
    loadImg(files[0]).then((img) => {
      if (!live) return;
      const c = toCanvas(img, OBJ_MAX);
      for (const el of [cv.current, ov.current]) { el.width = c.width; el.height = c.height; }
      cv.current.getContext('2d', { willReadFrequently: true }).drawImage(c, 0, 0);
      setReady(true);
    }, (e) => { if (live) setMsg(e.message); });
    return () => { live = false; };
  }, [files]);

  // Pointer position and brush width in pixels of the picture
  const at = (e) => { const r = ov.current.getBoundingClientRect(), k = ov.current.width / r.width; return [(e.clientX - r.left) * k, (e.clientY - r.top) * k, brush * k]; };
  const stroke = (a, b, size) => {
    const x = ov.current.getContext('2d'); x.strokeStyle = '#ff2d2d'; x.lineWidth = size; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1] + 0.01); x.stroke();
    const o = box.current || [Infinity, Infinity, -Infinity, -Infinity], r = size / 2 + 2;
    box.current = [Math.min(o[0], a[0] - r, b[0] - r), Math.min(o[1], a[1] - r, b[1] - r), Math.max(o[2], a[0] + r, b[0] + r), Math.max(o[3], a[1] + r, b[1] + r)];
  };
  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); const p = at(e); last.current = p; stroke(p, p, p[2]); setMarked(true); setMsg(''); };
  const move = (e) => { if (!last.current) return; const p = at(e); stroke(last.current, p, p[2]); last.current = p; };
  const up = () => { last.current = null; };
  const clearMarks = () => { ov.current.getContext('2d').clearRect(0, 0, ov.current.width, ov.current.height); box.current = null; setMarked(false); };

  const remove = () => {
    if (!box.current) return setMsg('Paint over the object you want to remove first.');
    setMsg('Working in your browser...');
    // Let the message appear before the page is busy
    setTimeout(() => {
      try {
        const W = cv.current.width, H = cv.current.height, PAD = 24;
        const x0 = Math.max(0, Math.floor(box.current[0]) - PAD), y0 = Math.max(0, Math.floor(box.current[1]) - PAD);
        const w = Math.min(W, Math.ceil(box.current[2]) + PAD) - x0, h = Math.min(H, Math.ceil(box.current[3]) + PAD) - y0;
        const md = ov.current.getContext('2d').getImageData(x0, y0, w, h).data, ctx = cv.current.getContext('2d'), px = ctx.getImageData(x0, y0, w, h);
        let mask = new Uint8Array(w * h); for (let i = 0; i < mask.length; i++) mask[i] = md[i * 4 + 3] > 0 ? 1 : 0;
        // Three pixels wider than painted, to catch the soft rim of the object
        for (let pass = 0; pass < 3; pass++) {
          const g = mask.slice();
          for (let i = 0; i < g.length; i++) if (!mask[i]) { const x = i % w; if ((x > 0 && mask[i - 1]) || (x < w - 1 && mask[i + 1]) || mask[i - w] || mask[i + w]) g[i] = 1; }
          mask = g;
        }
        const before = new ImageData(new Uint8ClampedArray(px.data), w, h);
        if (!inpaint(px.data, w, h, mask)) return setMsg('The whole picture is marked. Leave some of it unmarked, so there is something to fill the gap from.');
        ctx.putImageData(px, x0, y0);
        setUndo((u) => [...u.slice(-9), { x: x0, y: y0, data: before }]);
        clearMarks(); setMsg('Done. Paint over anything that is still visible and press Remove again, or download the picture.');
      } catch { setMsg(TOO_BIG); }
    }, 30);
  };
  const back = () => { const u = undo[undo.length - 1]; cv.current.getContext('2d').putImageData(u.data, u.x, u.y); setUndo(undo.slice(0, -1)); setMsg(''); };
  const save = async () => {
    const jpg = files[0].type === 'image/jpeg', b = await toBlob(cv.current, jpg ? 'image/jpeg' : 'image/png', 0.92);
    if (!b) return setMsg(TOO_BIG);
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${base(files[0])}_edited.${jpg ? 'jpg' : 'png'}`; a.click();
  };
  return (
    <>
      <Drop accept="image/*" files={files} setFiles={setFiles} label="Choose an image" />
      {files[0] && <div style={{ display: ready ? 'block' : 'none' }}>
        <div className="pe-bar">
          <label htmlFor="obs">Brush size</label>
          <input id="obs" type="range" min="6" max="120" value={brush} onChange={(e) => setBrush(+e.target.value)} />
          <button className="btn" onClick={remove}>Remove</button>
          <button className="btn alt" onClick={clearMarks} disabled={!marked}>Clear marks</button>
          <button className="btn alt" onClick={back} disabled={!undo.length}>Undo</button>
          <button className="btn alt" onClick={save}>Download</button>
        </div>
        <p className="pe-hint">Paint over the object with your mouse or finger, then press Remove.</p>
        <div className="pe-stage ie-check">
          <canvas ref={cv} />
          <canvas ref={ov} className="ie-marks" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        </div>
      </div>}
      {msg && <div className="out" aria-live="polite"><p style={{ margin: 0 }}>{msg}</p></div>}
      {NOTE('The marked area is filled from the colours around it, on your device. This works well on plain or softly blurred backgrounds such as sky, walls, sand or water. On detailed backgrounds the filled area looks smooth and can be noticed.')}
    </>
  );
}
