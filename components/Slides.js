'use client';
import { useState } from 'react';
import { lib, mk, base, useRun, Drop, Out, NOTE, openPdf } from './shared';

export async function renderPage(page, maxPx = 1800) {
  const v1 = page.getViewport({ scale: 1 });
  const vp = page.getViewport({ scale: Math.min(2, maxPx / Math.max(v1.width, v1.height)) });
  const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: x, viewport: vp }).promise;
  return c;
}

export function PdfToPpt() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async (say) => {
    if (!files[0]) return { msg: 'Please choose a PDF first.' };
    const pdf = await openPdf(files[0]);
    await lib('jszip');
    const P = await lib('pptx');
    const pptx = new P(); let W, H;
    for (let n = 1; n <= pdf.numPages; n++) {
      say(`Converting page ${n} of ${pdf.numPages}...`);
      const page = await pdf.getPage(n); const v = page.getViewport({ scale: 1 });
      if (n === 1) {
        // PowerPoint only accepts slides between 1 and 56 inches
        const f = Math.min(1, 56 * 72 / Math.max(v.width, v.height));
        W = Math.max(1, v.width * f / 72); H = Math.max(1, v.height * f / 72);
        pptx.defineLayout({ name: 'PDF', width: W, height: H }); pptx.layout = 'PDF';
      }
      const c = await renderPage(page);
      const k = Math.min(W / v.width, H / v.height), w = v.width * k, h = v.height * k;
      pptx.addSlide().addImage({ data: c.toDataURL('image/jpeg', 0.9), x: (W - w) / 2, y: (H - h) / 2, w, h });
      c.width = 0;
    }
    return { file: mk(await pptx.write({ outputType: 'blob' }), base(files[0]) + '.pptx') };
  });
  return <><Drop accept=".pdf,application/pdf" files={files} setFiles={setFiles} label="Choose a PDF file" /><button className="btn" onClick={run}>Convert to PowerPoint</button><Out st={st} />{NOTE('Each PDF page becomes one slide that looks exactly like the page. The page is placed as a picture, so you can add your own text, shapes and notes on top, but the original text is not editable.')}</>;
}

// ---- PowerPoint to PDF: read the .pptx (a zip of XML), paint every slide on a canvas, put the pictures in a PDF ----
const EMU = 12700; // EMU per point
const kid = (el, ...names) => { for (const n of names) { if (!el) return null; el = [...el.children].find((c) => c.localName === n); } return el || null; };
const kids = (el, name) => (el ? [...el.children].filter((c) => c.localName === name) : []);
const num = (el, a, d = 0) => (el && el.hasAttribute(a) ? +el.getAttribute(a) : d);
const PRESET = { black: '#000000', white: '#FFFFFF', red: '#FF0000', green: '#008000', blue: '#0000FF', yellow: '#FFFF00', gray: '#808080' };
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', svg: 'image/svg+xml', webp: 'image/webp' };
const SKIP_PH = ['dt', 'ftr', 'sldNum'];

// el holds one of srgbClr / schemeClr / sysClr / prstClr
function colorOf(el, th) {
  for (const c of el ? el.children : []) {
    const v = c.getAttribute('val');
    if (c.localName === 'srgbClr') return '#' + v;
    if (c.localName === 'sysClr') return '#' + (c.getAttribute('lastClr') || '000000');
    if (c.localName === 'schemeClr') return th[th.map[v] || v] || null;
    if (c.localName === 'prstClr') return PRESET[v] || null;
  }
  return null;
}
const lum = (hex) => { const n = parseInt(hex.slice(1, 7), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
// Text that would vanish into its background (white on white when a theme background could not be drawn) flips to black or white
const readable = (c, bg) => (bg && Math.abs(lum(c) - lum(bg)) < 0.2 ? (lum(bg) > 0.5 ? '#000000' : '#FFFFFF') : c);

function fillOf(spPr, style, th) {
  if (kid(spPr, 'noFill')) return null;
  const s = kid(spPr, 'solidFill'); if (s) return colorOf(s, th);
  const g = kid(spPr, 'gradFill', 'gsLst', 'gs'); if (g) return colorOf(g, th);
  if (kid(spPr, 'blipFill') || kid(spPr, 'pattFill')) return null;
  const r = kid(style, 'fillRef'); return r && r.getAttribute('idx') !== '0' ? colorOf(r, th) : null;
}
function lineOf(spPr, style, th) {
  const ln = kid(spPr, 'ln');
  if (kid(ln, 'noFill')) return null;
  const c = colorOf(kid(ln, 'solidFill'), th), r = kid(style, 'lnRef');
  const col = c || (r && r.getAttribute('idx') !== '0' ? colorOf(r, th) : null);
  return col ? { col, w: Math.max(0.5, num(ln, 'w', EMU) / EMU) } : null;
}
const phOf = (n) => kid(n, 'nvSpPr', 'nvPr', 'ph') || kid(n, 'nvPicPr', 'nvPr', 'ph') || kid(n, 'nvGraphicFramePr', 'nvPr', 'ph');
const isTitle = (t) => t === 'title' || t === 'ctrTitle';
// The same placeholder on the layout or master, which holds the position and text style a slide does not repeat
function findPh(doc, ph, master) {
  const type = ph.getAttribute('type') || 'body', idx = ph.getAttribute('idx');
  const list = kids(kid(doc && doc.documentElement, 'cSld', 'spTree'), 'sp').map((sp) => [sp, phOf(sp)]).filter((x) => x[1]);
  const byType = (t) => list.find(([, p]) => (p.getAttribute('type') || 'body') === t || (isTitle(t) && isTitle(p.getAttribute('type'))));
  const hit = (!master && idx && list.find(([, p]) => p.getAttribute('idx') === idx)) || byType(type)
    || (master && !SKIP_PH.includes(type) && !isTitle(type) && byType('body'));
  return hit ? hit[0] : null;
}

// Paragraphs of a text body with every style value resolved through slide -> layout -> master -> theme
function readText(tb, ph, S, bg) {
  const type = ph ? ph.getAttribute('type') || 'body' : null;
  const bodies = [tb, ...(ph ? [kid(findPh(S.layout, ph), 'txBody'), kid(findPh(S.master, ph, true), 'txBody')] : [])].filter(Boolean);
  const base = !ph || SKIP_PH.includes(type) ? S.tx.other : isTitle(type) ? S.tx.title : S.tx.body;
  const bp = (a) => { for (const b of bodies) { const e = kid(b, 'bodyPr'); if (e && e.hasAttribute(a)) return e.getAttribute(a); } return null; };
  const fit = kid(tb, 'bodyPr', 'normAutofit');
  const fontScale = num(fit, 'fontScale', 100000) / 100000;
  let auto = 0;
  const paras = kids(tb, 'p').map((p) => {
    const pPr = kid(p, 'pPr'), lvl = num(pPr, 'lvl');
    const chain = [pPr, ...bodies.map((b) => kid(b, 'lstStyle', `lvl${lvl + 1}pPr`)), kid(base, `lvl${lvl + 1}pPr`)].filter(Boolean);
    const attr = (a) => { for (const e of chain) if (e.hasAttribute(a)) return e.getAttribute(a); return null; };
    const def = (a) => { for (const e of chain) { const d = kid(e, 'defRPr'); if (d && d.hasAttribute(a)) return d.getAttribute(a); } return null; };
    const defCol = () => { for (const e of chain) { const c = colorOf(kid(e, 'defRPr', 'solidFill'), S.th); if (c) return c; } return null; };
    const defSz = +(def('sz') || (isTitle(type) ? 4000 : ph && !SKIP_PH.includes(type) ? 2400 - lvl * 200 : 1800));
    const runs = [];
    for (const c of p.children) {
      if (c.localName === 'br') { runs.push({ text: '\n' }); continue; }
      if (c.localName !== 'r' && c.localName !== 'fld') continue;
      const rPr = kid(c, 'rPr'), face = kid(rPr, 'latin') && kid(rPr, 'latin').getAttribute('typeface');
      const text = c.getAttribute('type') === 'slidenum' ? String(S.n) : (kid(c, 't') ? kid(c, 't').textContent : '');
      if (!text) continue;
      runs.push({ text, sz: num(rPr, 'sz', defSz) / 100 * fontScale,
        bold: (rPr && rPr.getAttribute('b') || def('b')) === '1', ital: (rPr && rPr.getAttribute('i') || def('i')) === '1',
        face: face && !face.startsWith('+') ? `"${face.replace(/"/g, '')}", ` : '',
        col: readable(colorOf(kid(rPr, 'solidFill'), S.th) || S.fontCol || defCol() || S.th[S.th.map.tx1] || '#000000', bg) });
    }
    const hasText = runs.some((r) => r.text.trim());
    let bullet = null;
    for (const e of chain) {
      if (kid(e, 'buNone')) break;
      if (kid(e, 'buChar')) { bullet = '•'; break; }
      if (kid(e, 'buAutoNum')) { bullet = 'n'; break; }
    }
    if (bullet === 'n' && hasText) bullet = ++auto + '.'; else if (bullet !== '•') { if (bullet !== 'n') auto = 0; bullet = null; }
    const rtl = attr('rtl') === '1';
    const before = chain.map((e) => kid(e, 'spcBef')).find(Boolean), size = num(kid(p, 'endParaRPr'), 'sz', defSz) / 100 * fontScale;
    return { runs, size, bullet: hasText ? bullet : null, rtl, algn: attr('algn') || (rtl ? 'r' : 'l'),
      marL: (attr('marL') != null ? +attr('marL') : bullet ? (lvl + 1) * 342900 : 0) / EMU, indent: (attr('indent') != null ? +attr('indent') : bullet ? -342900 : 0) / EMU,
      before: kid(before, 'spcPts') ? num(kid(before, 'spcPts'), 'val') / 100 : kid(before, 'spcPct') ? num(kid(before, 'spcPct'), 'val') / 100000 * size : 0 };
  });
  const ins = (a, d) => (bp(a) != null ? +bp(a) / EMU : d);
  return { paras, anchor: bp('anchor') || (isTitle(type) ? 'ctr' : 't'), l: ins('lIns', 7.2), r: ins('rIns', 7.2), t: ins('tIns', 3.6), b: ins('bIns', 3.6) };
}
const fontOf = (r, k) => `${r.ital ? 'italic ' : ''}${r.bold ? 'bold ' : ''}${r.sz * k}px ${r.face}Arial, "Segoe UI", sans-serif`;

// Word-wrap the paragraphs into lines for the given width. k shrinks all font sizes (used to fit a placeholder)
function wrap(ctx, paras, width, k) {
  const lines = [];
  for (const p of paras) {
    const avail = Math.max(20, width - p.marL); let cur = null, first = true;
    const open = () => (cur ||= { p, segs: [], w: 0, size: 0, avail });
    const push = () => { if (!cur.size) cur.size = p.size * k; cur.first = first; first = false; lines.push(cur); cur = null; };
    for (const r of p.runs) {
      if (r.text === '\n') { open(); push(); continue; }
      ctx.font = fontOf(r, k);
      // Break at spaces, and between characters for Chinese, Japanese and Korean, which have no spaces
      for (const tok of r.text.split(/(\s+|[　-鿿가-힯＀-￯])/).filter(Boolean)) {
        const w = ctx.measureText(tok).width, space = !tok.trim();
        if (cur && cur.segs.length && !space && cur.w + w > avail) push();
        if (space && !cur) continue;
        open();
        const last = cur.segs[cur.segs.length - 1];
        // One fillText per run keeps Arabic and Urdu words joined and in the right order
        if (last && last.r === r) { last.text += tok; last.w += w; } else cur.segs.push({ r, text: tok, w });
        cur.w += w; cur.size = Math.max(cur.size, r.sz * k);
      }
    }
    open(); push();
  }
  let h = 0;
  lines.forEach((l, i) => { if (l.first && i) h += l.p.before * k; l.y = h; h += l.size * 1.2; });
  return { lines, h };
}

function drawText(ctx, T, box, shrink) {
  const w = box.w - T.l - T.r, h = box.h - T.t - T.b;
  let k = 1, L = wrap(ctx, T.paras, w, k);
  while (shrink && L.h > h && k > 0.4) { k -= 0.05; L = wrap(ctx, T.paras, w, k); }
  const y0 = box.y + T.t + (T.anchor === 'ctr' ? Math.max(0, (h - L.h) / 2) : T.anchor === 'b' ? Math.max(0, h - L.h) : 0);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  for (const l of L.lines) {
    const p = l.p, left = box.x + T.l + (p.rtl ? 0 : p.marL), y = y0 + l.y + l.size * 0.95;
    const tw = l.segs.reduce((a, s) => a + s.w, 0) - (l.segs.length && /\s$/.test(l.segs[l.segs.length - 1].text) ? ctx.measureText(' ').width : 0);
    let x = left + (p.algn === 'ctr' ? (l.avail - tw) / 2 : p.algn === 'r' ? l.avail - tw : 0);
    ctx.direction = p.rtl ? 'rtl' : 'ltr';
    if (l.first && p.bullet && l.segs.length) {
      const r = l.segs[0].r; ctx.font = fontOf({ ...r, bold: false, ital: false }, k); ctx.fillStyle = r.col;
      if (p.rtl) { ctx.textAlign = 'right'; ctx.fillText(p.bullet, left + l.avail - p.indent, y); ctx.textAlign = 'left'; }
      else {
        // With no hanging indent the text starts right after the bullet instead of on top of it
        const bx = Math.max(box.x + T.l, left + p.indent); ctx.fillText(p.bullet, bx, y);
        if (p.algn === 'l') x = Math.max(x, bx + ctx.measureText(p.bullet + ' ').width);
      }
    }
    for (const s of (p.rtl ? [...l.segs].reverse() : l.segs)) { ctx.font = fontOf(s.r, k); ctx.fillStyle = s.r.col; ctx.fillText(s.text, x, y); x += s.w; }
  }
  ctx.direction = 'ltr';
  return L.h + T.t + T.b;
}

// The colour already painted where a text box will go: its real background, whatever shape or picture lies under it
function under(ctx, box) {
  try {
    const m = ctx.getTransform(), cols = [0.2, 0.5, 0.8].map((t) => {
      const q = m.transformPoint(new DOMPoint(box.x + box.w * t, box.y + box.h / 2)), d = ctx.getImageData(Math.round(q.x), Math.round(q.y), 1, 1).data;
      return '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
    }).sort((a, b) => lum(a) - lum(b));
    return cols[1];
  } catch { return null; }
}

async function drawTree(tree, S, rels, tf, skipPh) {
  const { ctx } = S;
  for (const n of tree ? tree.children : []) {
    const ph = phOf(n), tag = n.localName;
    if (skipPh && ph) continue;
    let xf = kid(n, 'spPr', 'xfrm') || kid(n, 'grpSpPr', 'xfrm') || kid(n, 'xfrm');
    if (!xf && ph) xf = kid(findPh(S.layout, ph), 'spPr', 'xfrm') || kid(findPh(S.master, ph, true), 'spPr', 'xfrm');
    const off = kid(xf, 'off'), ext = kid(xf, 'ext');
    if (!off || !ext) continue;
    const box = { x: tf.ox + num(off, 'x') * tf.sx, y: tf.oy + num(off, 'y') * tf.sy, w: num(ext, 'cx') * tf.sx, h: num(ext, 'cy') * tf.sy };
    if (tag === 'grpSp') {
      const co = kid(xf, 'chOff'), ce = kid(xf, 'chExt'), kx = num(ce, 'cx') ? num(ext, 'cx') / num(ce, 'cx') : 1, ky = num(ce, 'cy') ? num(ext, 'cy') / num(ce, 'cy') : 1;
      await drawTree(n, S, rels, { sx: tf.sx * kx, sy: tf.sy * ky, ox: box.x - num(co, 'x') * kx * tf.sx, oy: box.y - num(co, 'y') * ky * tf.sy }, skipPh);
      continue;
    }
    ctx.save();
    const rot = num(xf, 'rot') / 60000;
    if (rot) { ctx.translate(box.x + box.w / 2, box.y + box.h / 2); ctx.rotate(rot * Math.PI / 180); ctx.translate(-box.x - box.w / 2, -box.y - box.h / 2); }
    const spPr = kid(n, 'spPr'), style = kid(n, 'style'), prst = kid(spPr, 'prstGeom') ? kid(spPr, 'prstGeom').getAttribute('prst') : 'rect';
    if (tag === 'pic') {
      const rel = rels[kid(n, 'blipFill', 'blip') ? kid(n, 'blipFill', 'blip').getAttribute('r:embed') : ''];
      const img = rel && await S.img(rel);
      if (img) ctx.drawImage(img, box.x, box.y, box.w, box.h);
    } else if (tag === 'cxnSp' || prst === 'line' || prst.includes('Connector')) {
      const ln = lineOf(spPr, style, S.th) || { col: S.th[S.th.map.tx1] || '#000000', w: 1 };
      const fh = xf.getAttribute('flipH') === '1', fv = xf.getAttribute('flipV') === '1';
      ctx.strokeStyle = ln.col; ctx.lineWidth = ln.w; ctx.beginPath();
      ctx.moveTo(fh ? box.x + box.w : box.x, fv ? box.y + box.h : box.y); ctx.lineTo(fh ? box.x : box.x + box.w, fv ? box.y : box.y + box.h); ctx.stroke();
    } else if (tag === 'sp') {
      const fill = fillOf(spPr, style, S.th), ln = lineOf(spPr, style, S.th);
      if (fill || ln) {
        ctx.beginPath();
        if (prst === 'ellipse') ctx.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
        else if (prst.includes('ound') && ctx.roundRect) ctx.roundRect(box.x, box.y, box.w, box.h, Math.min(box.w, box.h) * 0.12);
        else ctx.rect(box.x, box.y, box.w, box.h);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (ln) { ctx.strokeStyle = ln.col; ctx.lineWidth = ln.w; ctx.stroke(); }
      }
      const tb = kid(n, 'txBody');
      if (tb) {
        S.fontCol = colorOf(kid(style, 'fontRef'), S.th);
        drawText(ctx, readText(tb, ph, S, fill || under(ctx, box) || S.bg), box, !!ph);
        S.fontCol = null;
      }
    } else if (tag === 'graphicFrame') {
      const tbl = n.getElementsByTagNameNS('*', 'tbl')[0];
      if (tbl) drawTable(tbl, S, box, tf);
    }
    ctx.restore();
  }
}

function drawTable(tbl, S, box, tf) {
  const { ctx } = S, cols = kids(kid(tbl, 'tblGrid'), 'gridCol').map((c) => num(c, 'w') * tf.sx);
  let y = box.y;
  for (const tr of kids(tbl, 'tr')) {
    let x = box.x, ci = 0, rowH = num(tr, 'h') * tf.sy;
    const cells = kids(tr, 'tc').map((tc) => {
      const span = num(tc, 'gridSpan', 1), w = cols.slice(ci, ci + span).reduce((a, b) => a + b, 0), c = { tc, x, w };
      ci += span; x += w;
      c.fill = colorOf(kid(tc, 'tcPr', 'solidFill'), S.th);
      c.T = tc.getAttribute('hMerge') === '1' || tc.getAttribute('vMerge') === '1' || !kid(tc, 'txBody') ? null : readText(kid(tc, 'txBody'), null, S, c.fill || S.bg);
      if (c.T) rowH = Math.max(rowH, wrap(ctx, c.T.paras, w - c.T.l - c.T.r, 1).h + c.T.t + c.T.b);
      return c;
    });
    for (const c of cells) {
      if (c.fill) { ctx.fillStyle = c.fill; ctx.fillRect(c.x, y, c.w, rowH); }
      ctx.strokeStyle = '#8a8a8a'; ctx.lineWidth = 0.75; ctx.strokeRect(c.x, y, c.w, rowH);
      if (c.T) drawText(ctx, { ...c.T, anchor: kid(c.tc, 'tcPr') && kid(c.tc, 'tcPr').getAttribute('anchor') || 't' }, { x: c.x, y, w: c.w, h: rowH }, false);
    }
    y += rowH;
  }
}

async function pptToPdf(file, say) {
  const Z = await lib('jszip'); let zip;
  try { zip = await Z.loadAsync(await file.arrayBuffer()); } catch { zip = null; }
  if (!zip || !zip.file('ppt/presentation.xml')) throw new Error('This is not a valid .pptx file. Old .ppt files are not supported: open the file in PowerPoint and save it as .pptx first.');
  const docs = {}, relCache = {}, imgs = {};
  const xml = async (path) => (path in docs ? docs[path] : (docs[path] = zip.file(path) ? new DOMParser().parseFromString(await zip.file(path).async('string'), 'application/xml') : null));
  const rels = async (path) => {
    if (relCache[path]) return relCache[path];
    const i = path.lastIndexOf('/'), dir = path.slice(0, i), d = await xml(`${dir}/_rels/${path.slice(i + 1)}.rels`), m = {};
    for (const r of d ? d.getElementsByTagName('Relationship') : []) {
      const t = r.getAttribute('Target'), parts = t.startsWith('/') ? [] : dir.split('/');
      t.split('/').forEach((s) => { if (s === '..') parts.pop(); else if (s && s !== '.') parts.push(s); });
      m[r.getAttribute('Id')] = { type: r.getAttribute('Type').split('/').pop(), path: parts.join('/'), ext: r.getAttribute('TargetMode') === 'External' };
    }
    return (relCache[path] = m);
  };
  const img = (rel) => (imgs[rel.path] ||= (async () => {
    const f = !rel.ext && zip.file(rel.path), type = MIME[rel.path.split('.').pop().toLowerCase()];
    if (!f || !type) return null; // EMF, WMF and TIFF pictures cannot be drawn by a browser
    const url = URL.createObjectURL(new Blob([await f.async('arraybuffer')], { type }));
    return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = url; });
  })());
  const only = (m, type) => Object.values(m).find((r) => r.type === type);

  const pres = await xml('ppt/presentation.xml'), pr = await rels('ppt/presentation.xml');
  const sz = kid(pres.documentElement, 'sldSz'), W = num(sz, 'cx', 9144000) / EMU, H = num(sz, 'cy', 6858000) / EMU;
  const ids = kids(kid(pres.documentElement, 'sldIdLst'), 'sldId').map((s) => pr[s.getAttribute('r:id')]).filter(Boolean);
  if (!ids.length) throw new Error('This presentation has no slides.');
  const P = await lib('pdflib'), out = await P.PDFDocument.create(), SC = 2;
  const themes = {};
  for (let i = 0; i < ids.length; i++) {
    say(`Converting slide ${i + 1} of ${ids.length}...`);
    const path = ids[i].path, slide = await xml(path);
    if (!slide) continue;
    const sr = await rels(path), lp = only(sr, 'slideLayout'), layout = lp ? await xml(lp.path) : null, lr = lp ? await rels(lp.path) : {};
    const mp = only(lr, 'slideMaster'), master = mp ? await xml(mp.path) : null, mr = mp ? await rels(mp.path) : {};
    const tp = only(mr, 'theme');
    const th = tp ? (themes[tp.path] ||= await (async () => {
      const t = { map: { bg1: 'lt1', tx1: 'dk1', bg2: 'lt2', tx2: 'dk2' } }, d = await xml(tp.path);
      for (const c of d ? (d.getElementsByTagNameNS('*', 'clrScheme')[0] || { children: [] }).children : []) t[c.localName] = colorOf(c, t);
      const cm = kid(master.documentElement, 'clrMap');
      for (const a of cm ? cm.attributes : []) t.map[a.name] = a.value;
      return t;
    })()) : { map: {} };
    const c = document.createElement('canvas'); c.width = Math.round(W * SC); c.height = Math.round(H * SC);
    const ctx = c.getContext('2d'); ctx.scale(SC, SC);
    const txs = kid(master && master.documentElement, 'txStyles');
    const S = { ctx, th, layout, master, img, n: i + 1, bg: '#FFFFFF', tx: { title: kid(txs, 'titleStyle'), body: kid(txs, 'bodyStyle'), other: kid(txs, 'otherStyle') } };
    // Background: the slide's own, else the layout's, else the master's
    let bgImg = null;
    for (const [d, r] of [[slide, sr], [layout, lr], [master, mr]]) {
      const bg = kid(d && d.documentElement, 'cSld', 'bg'); if (!bg) continue;
      const bp = kid(bg, 'bgPr'), blip = kid(bp, 'blipFill', 'blip');
      if (blip && r[blip.getAttribute('r:embed')]) bgImg = await img(r[blip.getAttribute('r:embed')]);
      S.bg = (bp ? fillOf(bp, null, th) : colorOf(kid(bg, 'bgRef'), th)) || '#FFFFFF';
      break;
    }
    ctx.fillStyle = S.bg; ctx.fillRect(0, 0, W, H);
    if (bgImg) { ctx.drawImage(bgImg, 0, 0, W, H); S.bg = null; }
    const root = { sx: 1 / EMU, sy: 1 / EMU, ox: 0, oy: 0 }, tree = (d) => kid(d && d.documentElement, 'cSld', 'spTree');
    if (!layout || layout.documentElement.getAttribute('showMasterSp') !== '0') await drawTree(tree(master), S, mr, root, true);
    await drawTree(tree(layout), S, lr, root, true);
    await drawTree(tree(slide), S, sr, root, false);
    const jpg = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
    if (!jpg) throw new Error('Could not render slide image.');
    out.addPage([W, H]).drawImage(await out.embedJpg(await jpg.arrayBuffer()), { x: 0, y: 0, width: W, height: H });
    c.width = 0; c.height = 0;
  }
  return new Blob([await out.save()], { type: 'application/pdf' });
}

export function PptToPdf() {
  const [files, setFiles] = useState([]);
  const [st, run] = useRun(async (say) => {
    if (!files[0]) return { msg: 'Please choose a PowerPoint file first.' };
    return { file: mk(await pptToPdf(files[0], say), base(files[0]) + '.pdf') };
  });
  return <><Drop accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" files={files} setFiles={setFiles} label="Choose a PowerPoint (.pptx) file" /><button className="btn" onClick={run}>Convert to PDF</button><Out st={st} />{NOTE('Only .pptx is supported. Text, pictures, shapes and tables are kept, one slide per page. Charts, SmartArt, animations, special fonts and some theme effects may look different or be missing.')}</>;
}
