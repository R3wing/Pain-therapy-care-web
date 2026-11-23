/* =========================================================
   Generador del Blog
   Uso (desde la raíz del proyecto):   node tools/blog/build.js [--report]
   (build-all.js lo ejecuta solo: descubre tools/<sección>/build.js; NO usa la red)

   Entrada : tools/blog/data.json (lo crea tools/blog/import.js desde WordPress)
   Salida  : blog/index.html · blog/<n>/ (paginación) · blog/<slug>/ (un post por slug EXACTO
             del sitio en vivo) · blog/category/<slug>/ (+ /<n>/) · assets/data/blog-index.json

   - Limpieza del contenido SIN cambiar el texto: se quitan wrappers, clases, estilos inline y
     shortcodes de Elementor/WordPress; se conservan h2–h4, p, listas, strong/em, a, img,
     figure/figcaption, blockquote y table. Un solo H1 (el título): un h1 del contenido pasa a h2.
   - ENLACES SEGUROS: los enlaces absolutos a paintherapycare.com pasan a rutas relativas; si la
     página destino no existe en el proyecto, se muestran como texto con data-pending-link.
   - Relaciones post → condición / tratamiento / sede: detección AUTOMÁTICA por palabras clave
     (marcadas "auto"; --report imprime las tablas para revisarlas).
   - Si algo no encaja (slug repetido, JSON-LD inválido, cuenta de posts distinta…), el script
     se detiene con un error: no genera HTML roto.
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://paintherapycare.com';
const PER_PAGE = 12;
const MIN_CATEGORY = 3;
const REPORT = process.argv.includes('--report');

const imported = require('./data.json');
const conditions = require('../conditions/data.js').conditions;
const services = require('../services/data.js');
const locations = require('../locations/data.js');
const lib = require('../shared/lib.js');
const hours = require('../shared/hours.js');

const template = {
    index: fs.readFileSync(path.join(__dirname, 'template-index.html'), 'utf8'),
    post: fs.readFileSync(path.join(__dirname, 'template-post.html'), 'utf8')
};
const EOL = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('\r\n') ? '\r\n' : '\n';


/* ---------- utilidades ---------- */

function fail(msg) {
    console.error('ERROR: ' + msg);
    process.exit(1);
}

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
function decode(s) {
    return String(s || '')
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCodePoint(parseInt(n, 10)); })
        .replace(/&#x([0-9a-f]+);/gi, function (m, n) { return String.fromCodePoint(parseInt(n, 16)); })
        .replace(/&([a-z]+);/gi, function (m, n) { return NAMED[n.toLowerCase()] !== undefined ? NAMED[n.toLowerCase()] : m; });
}
const plainText = (html) => decode(String(html || '').replace(/<\/?(?:p|li|ul|ol|br|div|h[1-6]|tr|td|th|table|blockquote|figure|figcaption|dt|dd)\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function indent(text, spaces) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n');
}

/* Recorta en el límite de una palabra (≤ max caracteres incluida la "…") */
function clip(s, max) {
    s = String(s).replace(/\s+/g, ' ').trim();
    if (s.length <= max) return s;
    const cut = s.slice(0, max - 1);
    const sp = cut.lastIndexOf(' ');
    return (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-–—(]+$/, '') + '…';
}

function slugify(s) {
    return decode(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
}

const fmtDate = (iso) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'Z'));
const urlOf = (p) => SITE + p;


/* ---------- enlaces seguros ---------- */

const posts = imported.posts.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
if (!posts.length) fail('tools/blog/data.json no tiene posts: ejecuta primero node tools/blog/import.js');
if (imported.total !== posts.length) fail('data.json: total (' + imported.total + ') ≠ posts (' + posts.length + ')');

const slugSet = new Set(posts.map(function (p) { return p.slug; }));
if (slugSet.size !== posts.length) fail('hay slugs repetidos en data.json');
['category', 'page'].concat(posts.map(function (p, i) { return String(i + 1); })).forEach(function (s) {
    if (slugSet.has(s)) fail('un post usa el slug reservado "' + s + '" (choca con /blog/' + s + '/)');
});

const catCount = {};
posts.forEach(function (p) { p.categories.forEach(function (c) { catCount[c.slug] = (catCount[c.slug] || 0) + 1; }); });
const catBy = {};
posts.forEach(function (p) { p.categories.forEach(function (c) { catBy[c.slug] = c; }); });
const catSlugs = Object.keys(catCount).filter(function (s) { return catCount[s] >= MIN_CATEGORY; });
const catPageSet = new Set(catSlugs);

const pendingLinks = {};   // ruta → veces

function pageExists(p) {
    const clean = p.split('#')[0].split('?')[0];
    if (clean === '/' || clean === '/blog/') return true;
    let m = /^\/blog\/([^/]+)\/$/.exec(clean);
    if (m) return slugSet.has(m[1]) || /^\d+$/.test(m[1]);
    m = /^\/blog\/category\/([^/]+)\/$/.exec(clean);
    if (m) return catPageSet.has(m[1]);
    return fs.existsSync(path.join(ROOT, clean.replace(/^\//, ''), 'index.html'));
}

const rewrites = [];   // enlaces reescritos (raíz → /blog/<slug>/, URL antigua de sede → nueva) para el informe
const legacyLocations = {};
locations.forEach(function (l) { if (l.legacyUrl) legacyLocations[l.legacyUrl] = '/locations/' + l.slug + '/'; });

/* href absoluto → relativo; devuelve { href, pending } */
function fixHref(raw, ctx) {
    const href = decode(raw).trim();
    const m = /^https?:\/\/(?:www\.)?paintherapycare\.com(\/[^?#]*)?([?#].*)?$/i.exec(href);
    let p, tail = '';
    if (m) { p = m[1] || '/'; tail = m[2] || ''; }
    else if (/^\//.test(href) && !/^\/\//.test(href)) { const mm = /^([^?#]*)(.*)$/.exec(href); p = mm[1]; tail = mm[2]; }
    else return { href: href, pending: false };          // externo, mailto:, tel:, #ancla
    if (p && !/\/$/.test(p) && !/\.[a-z0-9]{2,5}$/i.test(p)) p += '/';
    // artículos que estaban en la raíz del sitio viejo (/slug/) → /blog/slug/
    const one = /^\/([^/]+)\/$/.exec(p);
    if (one && slugSet.has(one[1]) && !fs.existsSync(path.join(ROOT, one[1], 'index.html'))) {
        rewrites.push(ctx + ': ' + p + ' → /blog/' + one[1] + '/');
        p = '/blog/' + one[1] + '/';
    }
    // URLs antiguas de sedes (legacyUrl en tools/locations/data.js) → URL nueva
    const legacy = legacyLocations[p];
    if (legacy) { rewrites.push(ctx + ': ' + p + ' → ' + legacy); p = legacy; }
    if (!pageExists(p)) {
        pendingLinks[p] = (pendingLinks[p] || 0) + 1;
        return { href: p + tail, pending: true, path: p };
    }
    return { href: p + tail, pending: false };
}

/* =========================================================
   LIMPIEZA DEL CONTENIDO (tokenizador + lista blanca)
========================================================= */

const VOID = new Set(['img', 'br', 'hr']);
const KEEP = new Set(['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'figure', 'figcaption', 'blockquote',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'sup', 'sub', 'pre', 'code', 'dl', 'dt', 'dd']);
const MAP = { b: 'strong', i: 'em', h1: 'h2' };
const DROP_ALL = new Set(['script', 'style', 'noscript', 'form', 'button', 'svg', 'object', 'embed', 'head', 'select', 'textarea']);

function parseAttrs(s) {
    const out = {};
    const re = /([a-zA-Z_:][-\w:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    let m;
    while ((m = re.exec(s))) out[m[1].toLowerCase()] = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : '';
    return out;
}

function tokenize(html) {
    const tokens = [];
    const re = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>|[^<]+|</g;
    let m;
    while ((m = re.exec(html))) {
        if (m[0].startsWith('<!--')) continue;
        if (m[1]) tokens.push({ t: 'close', name: m[1].toLowerCase() });
        else if (m[2]) {
            const name = m[2].toLowerCase();
            tokens.push({ t: 'open', name: name, attrs: parseAttrs(m[3] || ''), self: /\/\s*$/.test(m[3] || '') || VOID.has(name) });
            if (DROP_ALL.has(name) || name === 'iframe') {
                const close = new RegExp('</' + name + '\\s*>', 'ig');
                close.lastIndex = re.lastIndex;
                const c = close.exec(html);
                if (c) { tokens[tokens.length - 1].inner = html.slice(re.lastIndex, c.index); re.lastIndex = close.lastIndex; tokens.push({ t: 'close', name: name }); }
            }
        } else tokens.push({ t: 'text', v: m[0] });
    }
    return tokens;
}

/* Párrafos que son listas "de texto": líneas que empiezan con – / - / • (viñetas) o 1. 2. (numeradas),
   separadas por saltos de línea dentro de un <p>. El navegador las junta en un bloque; se convierten en
   <ul>/<ol> reales. Solo cambia el formato: el texto de cada elemento no se modifica. */
const MARK = /^\s*(?:(&#8211;|&ndash;|–|-|•|&bull;)|(\d{1,2})[.)])\s+(\S[\s\S]*)$/;
function listifyParagraphs(html, stats) {
    return html.replace(/<p>([\s\S]*?)<\/p>/g, function (m, inner) {
        if (!/\n\s*(?:&#8211;|&ndash;|–|-|•|&bull;|\d{1,2}[.)])\s+\S/.test(inner)) return m;
        const intro = [], items = [];
        let kind = null;
        inner.split('\n').forEach(function (line) {
            const mm = MARK.exec(line);
            if (mm) {
                const k = mm[1] ? 'ul' : 'ol';
                if (!kind) kind = k;
                if (k === kind) { items.push(mm[3].trim()); return; }
            }
            if (!items.length) intro.push(line.trim());
            else items[items.length - 1] += ' ' + line.trim();
        });
        if (items.length < 2) return m;
        stats.listified++;
        const lead = intro.join(' ').trim();
        return (lead ? '<p>' + lead + '</p>' : '') + '<' + kind + '>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</' + kind + '>';
    });
}

/* Devuelve { html, stats } — stats: pending, noAlt, iframe, elementor, shortcodes */
function sanitize(raw, ctx, post) {
    const stats = { pending: 0, noAlt: 0, iframe: [], elementor: /elementor/i.test(raw), brackets: [], emptyAlt: 0, listified: 0 };
    const tokens = tokenize(raw);
    const out = [];
    const stack = [];            // { src, close }
    let skipDepth = 0;           // dentro de un elemento descartado con contenido (script, style…)

    function closeTop() { const e = stack.pop(); out.push(e.close); }

    tokens.forEach(function (tk) {
        if (tk.t === 'text') {
            if (!skipDepth) out.push(tk.v);
            return;
        }
        if (tk.t === 'open') {
            if (tk.name === 'iframe') {
                const src = tk.attrs.src || '';
                const yt = /youtube\.com\/embed\/([\w-]+)/i.exec(src);
                const link = yt ? 'https://www.youtube.com/watch?v=' + yt[1] : src;
                stats.iframe.push(src);
                if (link) out.push('<p><a href="' + esc(link) + '" rel="noopener" target="_blank">Watch the video<span class="visually-hidden"> (opens in a new tab)</span></a></p>');
                skipDepth++;
                return;
            }
            if (DROP_ALL.has(tk.name)) { skipDepth++; return; }
            if (skipDepth) return;
            const name = MAP[tk.name] || tk.name;
            if (tk.name === 'img') {
                const a = tk.attrs;
                if (!a.src) return;
                let alt = a.alt !== undefined ? decode(a.alt).trim() : '';
                if (!alt) { alt = plainText(post.title) + ' [CONFIRM alt]'; stats.noAlt++; }
                const w = a.width && /^\d+$/.test(a.width) ? ' width="' + a.width + '"' : '';
                const h = a.height && /^\d+$/.test(a.height) ? ' height="' + a.height + '"' : '';
                const ss = a.srcset ? ' srcset="' + esc(a.srcset) + '"' : '';
                const sz = a.srcset && a.sizes ? ' sizes="' + esc(a.sizes) + '"' : '';
                out.push('<img src="' + esc(a.src) + '" alt="' + esc(alt) + '"' + w + h + ss + sz + ' loading="lazy" decoding="async">');
                return;
            }
            if (tk.name === 'br') { out.push('<br>'); return; }
            if (tk.name === 'hr') { out.push('<hr>'); return; }
            if (!KEEP.has(name)) return;                       // div, span, section…: se desenvuelve
            if (name === 'a') {
                const href = tk.attrs.href;
                if (!href) return;
                const f = fixHref(href, ctx);
                if (f.pending) { stats.pending++; out.push('<span data-pending-link="' + esc(f.path) + '">'); stack.push({ src: 'a', close: '</span>' }); return; }
                const ext = /^https?:\/\//i.test(f.href) && !/paintherapycare\.com/i.test(f.href);
                out.push('<a href="' + esc(f.href) + '"' + (ext ? ' rel="noopener"' : '') + '>');
                stack.push({ src: 'a', close: '</a>' });
                return;
            }
            let attrs = '';
            if (name === 'td' || name === 'th') {
                ['colspan', 'rowspan', 'scope'].forEach(function (k) { if (tk.attrs[k] && /^[\w]+$/.test(tk.attrs[k])) attrs += ' ' + k + '="' + tk.attrs[k] + '"'; });
            }
            if (name === 'ol' && tk.attrs.start && /^\d+$/.test(tk.attrs.start)) attrs += ' start="' + tk.attrs.start + '"';
            if (name === 'table') {
                out.push('<div class="blog-table" role="region" aria-label="Scrollable table" tabindex="0"><table>');
                stack.push({ src: 'table', close: '</table></div>' });
                return;
            }
            out.push('<' + name + attrs + '>');
            stack.push({ src: tk.name, close: '</' + name + '>' });
            return;
        }
        /* close */
        if (DROP_ALL.has(tk.name) || tk.name === 'iframe') { if (skipDepth) skipDepth--; return; }
        if (skipDepth) return;
        const idx = (function () { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].src === tk.name) return i; return -1; })();
        if (idx === -1) return;
        while (stack.length - 1 > idx) closeTop();
        closeTop();
    });
    while (stack.length) closeTop();

    let html = listifyParagraphs(out.join(''), stats)
        .replace(/<p>(?:\s|&nbsp;|<br>)*<\/p>/gi, '')
        .replace(/<(strong|em)>\s*<\/\1>/gi, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // corchetes sueltos (restos de plantilla) → solo se informan, el texto no se toca
    (plainText(html).match(/\[[^\]]{3,80}\]/g) || []).forEach(function (b) { if (!/CONFIRM alt/.test(b)) stats.brackets.push(b); });
    return { html: html, stats: stats };
}

/* TL;DR: caja estilizada al inicio ("<strong>TL;DR</strong>" + párrafo + viñetas). Se extrae del cuerpo. */
function extractTldr(raw) {
    const re = /<strong>\s*TL;?\s*DR\s*:?\s*<\/strong>/i;
    const m = re.exec(raw);
    if (!m || m.index > 1500) return { body: raw, tldr: '' };
    // contenedor <div …> que lo envuelve
    const start = raw.lastIndexOf('<div', m.index);
    let from, to;
    if (start !== -1 && raw.slice(start, m.index).split('<div').length - 1 === 1 && !/<\/div>/.test(raw.slice(start, m.index))) {
        const rx = /<div\b|<\/div>/gi;
        rx.lastIndex = start;
        let depth = 0, e;
        while ((e = rx.exec(raw))) {
            depth += e[0].toLowerCase() === '</div>' ? -1 : 1;
            if (depth === 0) { to = rx.lastIndex; break; }
        }
        if (to) from = start;
    }
    if (from === undefined) {
        // sin <div>: la etiqueta <p> y los bloques siguientes hasta el primer encabezado
        const ps = raw.lastIndexOf('<p', m.index);
        const h = raw.slice(m.index).search(/<h[1-6][\s>]/i);
        if (ps === -1 || h === -1) return { body: raw, tldr: '' };
        from = ps; to = m.index + h;
    }
    const block = raw.slice(from, to);
    const inner = block
        .replace(/^<div[^>]*>/i, '').replace(/<\/div>\s*$/i, '')
        .replace(/<p[^>]*>\s*<strong>\s*TL;?\s*DR\s*:?\s*<\/strong>\s*<\/p>/i, '');
    return { body: raw.slice(0, from) + raw.slice(to), tldr: inner };
}

/* =========================================================
   DATOS DERIVADOS
========================================================= */

const condBy = {}; conditions.forEach(function (c) { condBy[c.slug] = c; });
const svcBy = {}; services.forEach(function (s) { svcBy[s.slug] = s; });
const locBy = {}; locations.forEach(function (l) { locBy[l.key] = l; });

const COND_KW = [
    ['herniated-disk', /herniated|slipped disc|bulging disc|\bdisc (herniation|bulge)|\bdisk\b/],
    ['spinal-stenosis', /stenosis/],
    ['sciatica', /sciatic/],
    ['pinched-nerve', /pinched nerve|radiculopathy/],
    ['carpal-tunnel-syndrome', /carpal/],
    ['plantar-fasciitis', /plantar|\bheel\b/],
    ['peripheral-neuropathy', /neuropath/],
    ['rotator-cuff-injury', /rotator|shoulder/],
    ['hip-pain', /\bhip\b/],
    ['arthritis', /arthritis/],
    ['tmj-pain', /\btmj\b|\bjaw\b/],
    ['neck-pain', /\bneck\b|cervical/],
    ['lower-back-pain', /lower[- ]back|low[- ]back|\bback[- ]pain|\bspine\b|\bspinal\b/],
    ['knee-pain', /\bknee\b/],
    ['chronic-pain', /chronic[- ]pain/]
];
const SVC_KW = [
    ['shock-wave-therapy', /shock[- ]?wave|eswt/],
    ['emtt-therapy', /emtt|electromagnetic transduction/],
    ['laser-therapy', /laser/],
    ['pit-therapy', /perineural|\bpit\b/],
    ['tecar-therapy', /tecar/],
    ['cryotherapy', /cryo/],
    ['ha-knee-injection', /hyaluronic|joint lubricant|viscosuppl|gel injection/],
    ['steroid-injection', /steroid|cortisone/],
    ['ultrasound-guided-injection', /ultrasound[- ]guided/],
    ['physical-therapy-occupational-therapy', /physical[- ]therapy|occupational[- ]therapy/],
    ['aqua-therapy', /\baqua/],
    ['ims-therapy', /\bims\b|dry[- ]needling|intramuscular/],
    ['tmj-therapy', /tmj[- ]therapy/],
    ['pelvic-floor-therapy', /pelvic[- ]floor/]
];
const LOC_KW = [
    ['crown-heights', /crown[- ]heights/],
    ['williamsburg', /williamsburg/],
    ['flatbush', /flatbush/],
    ['inwood', /inwood|five[- ]towns/],
    ['monsey', /monsey/]
];
function detect(list, text) {
    for (let i = 0; i < list.length; i++) if (list[i][1].test(text)) return list[i][0];
    return null;
}

const words = (html) => plainText(html).split(/\s+/).filter(Boolean).length;

const P = posts.map(function (post) {
    const ctx = '/blog/' + post.slug + '/';
    const ex = extractTldr(post.content);
    const body = sanitize(ex.body, ctx, post);
    const tl = ex.tldr ? sanitize(ex.tldr, ctx, post) : { html: '', stats: { pending: 0, noAlt: 0, iframe: [], brackets: [], elementor: false } };

    // ids de encabezados (TOC) y preguntas frecuentes (H2/H3 que terminan en "?")
    const used = {};
    const toc = [];
    const heads = [];
    let html = body.html.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, function (m, lvl, inner, offset) {
        const label = plainText(inner);
        if (!label) return '';
        let id = slugify(label);
        used[id] = (used[id] || 0) + 1;
        if (used[id] > 1) id += '-' + used[id];
        if (lvl === '2') toc.push({ id: id, text: label });
        heads.push({ lvl: +lvl, text: label, id: id });
        return '<h' + lvl + ' id="' + id + '">' + inner + '</h' + lvl + '>';
    });

    const faqs = [];
    const hr = /<h([2-6]) id="[^"]*">([\s\S]*?)<\/h\1>/g;
    let mm; const marks = [];
    while ((mm = hr.exec(html))) marks.push({ lvl: +mm[1], text: plainText(mm[2]), end: hr.lastIndex, start: mm.index });
    marks.forEach(function (h, i) {
        if (!(h.lvl <= 3 && /\?\s*$/.test(h.text))) return;
        const stop = i + 1 < marks.length ? marks[i + 1].start : html.length;
        const ans = plainText(html.slice(h.end, stop));
        if (ans) faqs.push({ q: h.text, a: ans });
    });

    const txt = (post.title + ' ' + post.slug.replace(/-/g, ' ')).toLowerCase();
    const cond = detect(COND_KW, txt);
    const svc = detect(SVC_KW, txt);
    const loc = detect(LOC_KW, txt);

    const tldrText = tl.html ? plainText((/<p>([\s\S]*?)<\/p>/.exec(tl.html) || [, tl.html])[1]) : '';
    const summary = tldrText || post.excerpt || plainText(html).slice(0, 200);
    const img = post.image
        ? (post.image.large || { url: post.image.url, width: post.image.width, height: post.image.height })
        : null;

    return {
        post: post,
        slug: post.slug,
        url: '/blog/' + post.slug + '/',
        title: post.title,
        html: html,
        tldrHtml: tl.html,
        tldrText: tldrText,
        summary: summary,
        toc: toc,
        faqs: faqs,
        readingTime: Math.max(1, Math.ceil((words(html) + words(tl.html)) / 200)),
        relCondition: cond,
        relService: svc,
        relLocation: loc,
        image: img ? { url: img.url, width: img.width, height: img.height, alt: post.image.alt, caption: post.image.caption } : null,
        stats: {
            pending: body.stats.pending + tl.stats.pending,
            noAlt: body.stats.noAlt + tl.stats.noAlt,
            iframe: body.stats.iframe,
            elementor: body.stats.elementor,
            brackets: body.stats.brackets.concat(tl.stats.brackets),
            listified: body.stats.listified + (tl.stats.listified || 0),
            tldr: !!tl.html
        }
    };
});

/* Categoría principal: la más específica (la de menos posts) que tenga página; si ninguna, sin enlace */
const byCatSpecific = (a, b) => (catCount[a.slug] - catCount[b.slug]) || (a.id - b.id);
P.forEach(function (x) {
    const cats = x.post.categories.slice().sort(byCatSpecific);
    const withPage = cats.filter(function (c) { return catPageSet.has(c.slug); });
    x.primary = withPage[0] || null;
    x.primaryName = (withPage[0] || cats[0] || { name: 'Blog' }).name;
});

/* 3 relacionados: misma condición > misma categoría principal > categorías/tags compartidas; recientes primero */
P.forEach(function (x) {
    const myCats = new Set(x.post.categories.map(function (c) { return c.slug; }));
    const myTags = new Set(x.post.tags.map(function (t) { return t.slug; }));
    x.related = P.filter(function (y) { return y !== x; }).map(function (y) {
        let s = 0;
        if (x.relCondition && y.relCondition === x.relCondition) s += 4;
        if (x.primary && y.primary && x.primary.slug === y.primary.slug) s += 2;
        y.post.categories.forEach(function (c) { if (myCats.has(c.slug)) s += 1; });
        y.post.tags.forEach(function (t) { if (myTags.has(t.slug)) s += 0.5; });
        return { y: y, s: s };
    }).sort(function (a, b) { return (b.s - a.s) || (a.y.post.date < b.y.post.date ? 1 : -1); }).slice(0, 3).map(function (o) { return o.y; });
});

/* SEO: title ≤ 60 y description ≤ 155 (los de la página en vivo; si no caben, se recortan y se informa) */
const seoTrimmed = { title: [], desc: [] };
P.forEach(function (x) {
    const s = x.post.seo || {};
    let t = s.title || x.title, d = s.description || x.tldrText || x.post.excerpt;
    if (t.length > 60) { seoTrimmed.title.push(x.slug + ' (' + t.length + ')'); t = clip(t, 60); }
    if (d.length > 155) { seoTrimmed.desc.push(x.slug + ' (' + d.length + ')'); d = clip(d, 155); }
    x.seoTitle = t; x.seoDesc = d;
});
{
    const seen = {};
    P.forEach(function (x) { if (seen[x.seoTitle]) fail('title repetido: ' + x.slug + ' y ' + seen[x.seoTitle]); seen[x.seoTitle] = x.slug; });
}

/* =========================================================
   PIEZAS COMUNES
========================================================= */

const ICON_ARROW = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-arrow"></use></svg>';
const ICON_CHECK = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>';
const CALL = '/schedule/';   // "Call a location" sin JS: /schedule/ existe y lista los teléfonos (no hay hub /locations/ aún)

/* enlace seguro (destino debe existir en el proyecto; si no, texto con data-pending-link) */
const pendingGen = {};
function safeLink(href, html, cls, arrow) {
    const c = cls ? ' class="' + cls + '"' : '';
    if (pageExists(href)) return '<a' + c + ' href="' + href + '">' + html + (arrow ? ' ' + ICON_ARROW : '') + '</a>';
    pendingGen[href] = (pendingGen[href] || 0) + 1;
    return '<span' + (cls ? ' class="' + cls + ' is-pending"' : ' class="is-pending"') + ' data-pending-link="' + href + '">' + html + '</span>';
}

function breadcrumb(items) {
    const lis = items.map(function (it, i) {
        return '<li class="breadcrumb__item">' + (i === items.length - 1
            ? '<span aria-current="page">' + escText(it[0]) + '</span>'
            : (it[1] ? '<a href="' + it[1] + '">' + escText(it[0]) + '</a>' : '<span>' + escText(it[0]) + '</span>')) + '</li>';
    }).join('\n');
    return '<nav class="breadcrumb" aria-label="Breadcrumb">\n    <div class="container">\n        <ol class="breadcrumb__list">\n' + indent(lis, 12) + '\n        </ol>\n    </div>\n</nav>';
}
const breadcrumbLd = (items) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map(function (it, i) { return { '@type': 'ListItem', position: i + 1, name: it[0], item: urlOf(it[1] || '/blog/') }; })
});

const timeTag = (iso) => '<time datetime="' + iso.slice(0, 10) + '">' + fmtDate(iso) + '</time>';
const metaLine = (x) => timeTag(x.post.date) + ' · ' + x.readingTime + ' min read';

function mediaImg(x, o) {
    o = o || {};
    if (!x.image) {
        return '<span class="media-placeholder media-placeholder--16x9 blog-media" data-media="blog-' + x.slug + '"><span class="media-placeholder__label">IMAGE</span></span>';
    }
    const i = x.image;
    return '<img src="' + esc(i.url) + '" alt="' + esc(o.alt !== undefined ? o.alt : '') + '"' + (i.width ? ' width="' + i.width + '" height="' + i.height + '"' : '') +
        (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
}

/* Tarjeta: UN solo enlace (toda la tarjeta) */
function card(x) {
    return [
        '<li class="blog-card">',
        '    <a class="blog-card__link" href="' + x.url + '" aria-labelledby="t-' + x.slug + '">',
        '        <span class="blog-card__media">' + mediaImg(x) + '</span>',
        '        <span class="blog-card__body">',
        '            <span class="blog-card__cat">' + escText(x.primaryName) + '</span>',
        '            <h3 class="blog-card__title" id="t-' + x.slug + '">' + escText(x.title) + '</h3>',
        '            <span class="blog-card__text">' + escText(clip(x.summary, 140)) + '</span>',
        '            <span class="blog-card__meta">' + metaLine(x) + '</span>',
        '        </span>',
        '    </a>',
        '</li>'
    ].join('\n');
}

function feature(x) {
    return [
        '<article class="blog-feature">',
        '    <a class="blog-feature__link" href="' + x.url + '" aria-labelledby="t-' + x.slug + '">',
        '        <span class="blog-feature__media">' + mediaImg(x, { eager: true }) + '</span>',
        '        <span class="blog-feature__body">',
        '            <span class="blog-card__cat">Latest · ' + escText(x.primaryName) + '</span>',
        '            <h2 class="blog-feature__title" id="t-' + x.slug + '">' + escText(x.title) + '</h2>',
        '            <span class="blog-card__text">' + escText(clip(x.summary, 220)) + '</span>',
        '            <span class="blog-card__meta">' + metaLine(x) + '</span>',
        '        </span>',
        '    </a>',
        '</article>'
    ].join('\n');
}

/* Chips de categoría (enlaces; aria-current en la activa) */
const chipCats = catSlugs.slice().sort(function (a, b) { return (catCount[b] - catCount[a]) || catBy[a].name.localeCompare(catBy[b].name); });
function chips(active) {
    const li = function (href, label, on) {
        return '<li><a class="blog-chip' + (on ? ' is-active' : '') + '" href="' + href + '"' + (on ? ' aria-current="page"' : '') + '>' + escText(label) + '</a></li>';
    };
    const items = [li('/blog/', 'All posts', active === null)].concat(chipCats.map(function (s) {
        return li('/blog/category/' + s + '/', catBy[s].name, active === s);
    }));
    return '<nav class="blog-chips" aria-label="Blog categories">\n    <ul class="blog-chips__list">\n' + indent(items.join('\n'), 8) + '\n    </ul>\n</nav>';
}

const pageHref = (base, n) => n === 1 ? base : base + n + '/';

function pagination(base, page, total) {
    if (total <= 1) return '';
    const set = new Set([1, total, page - 1, page, page + 1]);
    const nums = Array.from(set).filter(function (n) { return n >= 1 && n <= total; }).sort(function (a, b) { return a - b; });
    const li = [];
    if (page > 1) li.push('<li><a class="blog-page blog-page--nav" rel="prev" href="' + pageHref(base, page - 1) + '"><span aria-hidden="true">←</span> Previous<span class="visually-hidden"> page</span></a></li>');
    let last = 0;
    nums.forEach(function (n) {
        if (n - last > 1) li.push('<li class="blog-page__gap" aria-hidden="true">…</li>');
        li.push(n === page
            ? '<li><span class="blog-page is-current" aria-current="page"><span class="visually-hidden">Page </span>' + n + '</span></li>'
            : '<li><a class="blog-page" href="' + pageHref(base, n) + '"><span class="visually-hidden">Page </span>' + n + '</a></li>');
        last = n;
    });
    if (page < total) li.push('<li><a class="blog-page blog-page--nav" rel="next" href="' + pageHref(base, page + 1) + '">Next<span class="visually-hidden"> page</span> <span aria-hidden="true">→</span></a></li>');
    return '<nav class="blog-pagination" aria-label="Blog pagination">\n    <ul class="blog-pagination__list">\n' + indent(li.join('\n'), 8) + '\n    </ul>\n</nav>';
}

function searchBlock() {
    return [
        '<div class="blog-search" data-blog-search data-index="assets/data/blog-index.json">',
        '    <label class="blog-search__label" for="blog-search-input">Search the blog</label>',
        '    <div class="blog-search__field">',
        '        <svg class="icon blog-search__icon" aria-hidden="true" focusable="false"><use href="#i-search"></use></svg>',
        '        <input class="insurance-input blog-search__input" id="blog-search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Try &quot;knee&quot;, &quot;laser&quot; or &quot;referral&quot;" aria-describedby="blog-search-status">',
        '    </div>',
        '    <div class="blog-search__results" aria-live="polite" id="blog-search-status" data-blog-search-results></div>',
        '</div>'
    ].join('\n');
}

function ctaFinal(depth, primary) {
    return lib.render('cta-final', { depth: depth, call: CALL, primary: primary || '/schedule/' });
}

/* =========================================================
   ESCRITURA DE PÁGINAS
========================================================= */

const report = { pages: 0, files: [] };
const seenTitle = {};
const seenDesc = {};

function writePage(o) {
    const depth = o.route.split('/').filter(Boolean).length;
    const BASE = '../'.repeat(depth);
    const title = o.title, desc = o.desc;
    if (title.length > 60) fail(o.route + ': title de ' + title.length + ' caracteres (máx. 60)');
    if (desc.length > 155) fail(o.route + ': description de ' + desc.length + ' caracteres (máx. 155)');
    if (seenTitle[title]) fail('title repetido: ' + o.route + ' y ' + seenTitle[title]);
    if (seenDesc[desc]) fail('description repetida: ' + o.route + ' y ' + seenDesc[desc]);
    seenTitle[title] = o.route; seenDesc[desc] = o.route;

    const tokens = Object.assign({
        SITE: SITE,
        BASE: BASE,
        URL: urlOf(o.route),
        TITLE: escText(title),
        DESC: esc(desc),
        PAGE_LINKS: o.links || '',
        OG: o.og || '',
        PAGE_SCRIPTS: o.script ? '\n    <script src="' + BASE + 'assets/js/' + o.script + '" defer></script>' : '',
        JSONLD: indent(JSON.stringify(o.ld, null, 4), 4),
        HEAD_SCRIPTS: lib.render('head-scripts', { depth: depth }),
        SPRITE: lib.render('sprite', { depth: depth }) + (o.forms ? '\n    ' + lib.render('sprite-forms', { depth: depth }) : ''),
        HEADER: lib.render('header', { mode: 'scrolled', call: CALL, depth: depth, current: o.current }),
        FOOTER: lib.render('footer', { depth: depth }),
        MOBILE_AND_SHEET: lib.render('mobile-bar', { depth: depth, call: CALL, book: '/schedule/' })
    }, o.tokens);

    let html = template[o.kind].replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) fail(o.route + ': token sin valor ' + key);
        return tokens[key];
    });

    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(o.route + ': debe haber 1 <h1>, hay ' + h1s);
    const leftover = html.match(/\{\{[A-Z0-9_]+\}\}/);
    if (leftover) fail(o.route + ': quedó un token sin reemplazar: ' + leftover[0]);
    JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);   // JSON-LD válido

    html = html.replace(/\n{3,}/g, '\n\n').replace(/\r?\n/g, EOL);
    const outDir = path.join(ROOT, o.route.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    report.pages++;
    report.files.push(o.route);
}

function fitTitle(options, suffix) {
    for (let i = 0; i < options.length; i++) {
        const t = options[i] + (suffix || '');
        if (t.length <= 60) return t;
    }
    return clip(options[options.length - 1], 60 - (suffix || '').length) + (suffix || '');
}

const ORG = { '@id': SITE + '/#organization' };

/* ---------- listados: índice y categorías ---------- */

function listing(o) {
    const total = Math.ceil(o.items.length / PER_PAGE);
    for (let page = 1; page <= total; page++) {
        const slice = o.items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
        const first = page === 1;
        const route = pageHref(o.base, page);
        const crumbs = [['Home', '/'], ['Blog', o.catSlug || page > 1 ? '/blog/' : null]];
        if (o.catSlug) crumbs.push([o.name, page > 1 ? o.base : null]);
        if (page > 1) crumbs.push(['Page ' + page, null]);
        const bc = crumbs.map(function (c, i) { return [c[0], i === crumbs.length - 1 ? null : (c[1] || '/blog/')]; });
        const bcLd = crumbs.map(function (c, i) {
            const href = i === 0 ? '/' : i === 1 ? '/blog/' : (o.catSlug && i === 2 ? o.base : route);
            return [c[0], href];
        });
        const u = urlOf(route);
        const pageSuffix = page > 1 ? ' – Page ' + page : '';
        const title = o.catSlug
            ? fitTitle([o.name + ' | Pain Therapy Blog', o.name + ' – Blog', o.name], pageSuffix)
            : (first ? 'Pain Relief Health & News | Pain Therapy Medical Care' : 'Blog – Page ' + page + ' | Pain Therapy Medical Care');
        const desc = o.catSlug
            ? clip((page > 1 ? 'Page ' + page + ': ' : '') + 'Articles about ' + o.name + ' from the Pain Therapy Medical Care team in Brooklyn, Five Towns & Monsey.', 155)
            : (first ? 'Practical answers about pain, treatments and getting care in Brooklyn, Five Towns & Monsey. Read the latest from Pain Therapy Medical Care.'
                : 'Page ' + page + ' of the Pain Therapy Medical Care blog: practical answers about pain, treatments and getting care in Brooklyn, Five Towns & Monsey.');

        const links = (page > 1 ? '\n    <link rel="prev" href="' + urlOf(pageHref(o.base, page - 1)) + '">' : '') +
            (page < total ? '\n    <link rel="next" href="' + urlOf(pageHref(o.base, page + 1)) + '">' : '');

        const grid = (first ? slice.slice(1) : slice).map(card).join('\n');
        const ld = {
            '@context': 'https://schema.org',
            '@graph': [
                o.catSlug
                    ? { '@type': 'CollectionPage', '@id': u + '#page', url: u, name: o.name, description: desc, inLanguage: 'en-US', isPartOf: { '@id': SITE + '/blog/#blog' }, mainEntity: { '@id': u + '#list' } }
                    : { '@type': 'Blog', '@id': SITE + '/blog/#blog', url: urlOf('/blog/'), name: 'Pain Relief Health & News', description: 'Practical answers about pain, treatments and getting care in Brooklyn, Five Towns & Monsey.', inLanguage: 'en-US', publisher: ORG },
                {
                    '@type': 'ItemList', '@id': u + '#list', numberOfItems: slice.length,
                    itemListElement: slice.map(function (x, i) { return { '@type': 'ListItem', position: (page - 1) * PER_PAGE + i + 1, url: urlOf(x.url), name: x.title }; })
                },
                Object.assign({ '@id': u + '#breadcrumb' }, breadcrumbLd(bcLd))
            ]
        };

        writePage({
            kind: 'index', route: route, title: title, desc: desc, links: links, ld: ld,
            script: 'blog.js', forms: true, current: !o.catSlug && first ? '/blog/' : undefined,
            tokens: {
                SCHEMA_NOTE: o.catSlug ? 'CollectionPage + ItemList + BreadcrumbList' : 'Blog + ItemList + BreadcrumbList',
                BREADCRUMB: breadcrumb(bc),
                H1: escText(o.h1),
                SUBTITLE: escText(o.sub),
                SEARCH: indent(searchBlock(), 12),
                CHIPS: indent(chips(o.catSlug || null), 8),
                FEATURED: first ? indent(feature(slice[0]), 8) : '',
                GRID: indent(grid, 16),
                PAGINATION: indent(pagination(o.base, page, total), 8),
                CTA_FINAL: ctaFinal(depthOf(route))
            }
        });
    }
    return total;
}
const depthOf = (route) => route.split('/').filter(Boolean).length;

/* ---------- posts ---------- */

function nthIndex(html, needle, n) {
    let i = -1;
    for (let k = 0; k < n; k++) { i = html.indexOf(needle, i + 1); if (i === -1) return -1; }
    return i;
}

function inlineCta(x) {
    const c = x.relCondition && condBy[x.relCondition];
    const s = !c && x.relService && svcBy[x.relService];
    let title, link;
    if (c) {
        title = 'Dealing with ' + c.name.toLowerCase().replace(/\btmj\b/, 'TMJ') + '? Our providers can help.';
        link = safeLink('/conditions/' + c.slug + '/', 'Learn about ' + escText(c.name.toLowerCase().replace(/\btmj\b/, 'TMJ')), 'text-link', true);
    } else if (s) {
        title = 'Interested in ' + s.name + '? Our providers can help.';
        link = safeLink('/services/' + s.slug + '/', 'Learn about ' + escText(s.name), 'text-link', true);
    } else {
        title = 'Looking for non-surgical pain care? Our providers can help.';
        link = safeLink('/conditions/', 'See the conditions we treat', 'text-link', true);
    }
    const href = c ? '/schedule/?condition=' + c.slug : s ? '/schedule/?service=' + s.slug : '/schedule/';
    return [
        '<aside class="blog-cta" aria-label="Book an evaluation">',
        '    <p class="blog-cta__title">' + escText(title) + '</p>',
        '    <p class="blog-cta__text">Non-surgical, drug-free care. Medicare and Medicaid accepted.</p>',
        '    <div class="blog-cta__actions">',
        '        <a class="btn btn--primary btn--md" href="' + href + '">Book an evaluation</a>',
        '        ' + link,
        '    </div>',
        '</aside>'
    ].join('\n');
}

function relatedCare(x) {
    const items = [];
    const row = function (href, kind, name) {
        const inner = '<span class="service-related__name"><span class="blog-related__kind">' + kind + '</span> ' + escText(name) + '</span>' + (pageExists(href) ? ' ' + ICON_ARROW : '');
        if (pageExists(href)) return '<li><a class="service-related__link" href="' + href + '">' + inner + '</a></li>';
        pendingGen[href] = (pendingGen[href] || 0) + 1;
        return '<li><span class="service-related__link is-pending" data-pending-link="' + href + '">' + inner + '</span></li>';
    };
    if (x.relCondition) items.push(row('/conditions/' + x.relCondition + '/', 'Condition', condBy[x.relCondition].name));
    if (x.relService) items.push(row('/services/' + x.relService + '/', 'Treatment', svcBy[x.relService].name));
    if (x.relLocation) items.push(row('/locations/' + locBy[x.relLocation].slug + '/', 'Location', locBy[x.relLocation].listName));
    if (!items.length) return '';
    return ['<aside class="blog-related-care" aria-labelledby="related-care-title">',
        '    <h2 class="blog-related-care__title" id="related-care-title">Related care</h2>',
        '    <ul class="service-related blog-related-care__list">',
        indent(items.join('\n'), 8),
        '    </ul>',
        '</aside>'].join('\n');
}

function tocHtml(x) {
    if (x.toc.length < 2) return { side: '', inline: '' };
    const lis = x.toc.map(function (t) { return '<li><a href="#' + t.id + '">' + escText(t.text) + '</a></li>'; }).join('\n');
    return {
        side: '<nav class="blog-toc blog-toc--side" aria-label="On this page">\n    <h2 class="blog-toc__title">On this page</h2>\n    <ol class="blog-toc__list">\n' + indent(lis, 8) + '\n    </ol>\n</nav>',
        inline: '<details class="blog-toc blog-toc--inline">\n    <summary class="blog-toc__summary">On this page</summary>\n    <nav aria-label="On this page (mobile)">\n        <ol class="blog-toc__list">\n' + indent(lis, 12) + '\n        </ol>\n    </nav>\n</details>'
    };
}

function postLd(x) {
    const u = urlOf(x.url);
    const post = x.post;
    const crumbs = [['Home', '/'], ['Blog', '/blog/']].concat(x.primary ? [[x.primary.name, '/blog/category/' + x.primary.slug + '/']] : [], [[x.title, x.url]]);
    const graph = [
        {
            '@type': 'BlogPosting',
            '@id': u + '#post',
            mainEntityOfPage: { '@type': 'WebPage', '@id': u },
            headline: clip(x.title, 110),
            name: x.title,
            description: x.seoDesc,
            inLanguage: 'en-US',
            datePublished: post.date,
            dateModified: post.modified || post.date,
            articleSection: x.primaryName,
            wordCount: words(x.html),
            author: (post.author && post.author !== 'Pain Therapy Medical Care') ? { '@type': 'Person', name: post.author } : ORG,
            publisher: ORG
        },
        Object.assign({ '@id': u + '#breadcrumb' }, breadcrumbLd(crumbs))
    ];
    if (x.image) graph[0].image = x.image.url;
    if (post.tags && post.tags.length) graph[0].keywords = post.tags.map(function (t) { return t.name; }).join(', ');
    if (x.faqs.length >= 2) {
        graph.push({ '@type': 'FAQPage', '@id': u + '#faq', mainEntity: x.faqs.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
}

const noAltFeatured = [];

function postPage(x) {
    const post = x.post;
    const crumbs = [['Home', '/'], ['Blog', '/blog/']].concat(x.primary ? [[x.primary.name, '/blog/category/' + x.primary.slug + '/']] : [], [[x.title, null]]);
    const toc = tocHtml(x);
    const cta = inlineCta(x);
    const i3 = nthIndex(x.html, '<h2 ', 3);
    const body = i3 === -1 ? x.html + '\n' + cta : x.html.slice(0, i3) + cta + '\n' + x.html.slice(i3);

    let alt = x.image ? x.image.alt : '';
    if (x.image && !alt) { alt = x.title + ' [CONFIRM alt]'; noAltFeatured.push(x.slug); }
    const figure = x.image
        ? '<div class="blog-top">\n    <figure class="blog-figure">\n        <div class="media-placeholder media-placeholder--16x9 blog-figure__media">\n            ' + mediaImg(x, { eager: true, alt: alt }) + '\n        </div>' +
          (x.image.caption ? '\n        <figcaption class="blog-figure__caption">' + escText(x.image.caption) + '</figcaption>' : '') + '\n    </figure>\n</div>'
        : '';

    /* TL;DR: etiqueta + párrafo principal + viñetas, en la misma columna que el cuerpo (.blog-top = grid del layout) */
    const tldr = x.tldrHtml
        ? [
            '<div class="blog-top">',
            '    <aside class="blog-tldr" aria-labelledby="tldr-title">',
            '        <h2 class="blog-tldr__title" id="tldr-title"><span class="blog-tldr__tag"><svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>TL;DR</span></h2>',
            '        <div class="blog-tldr__body">',
            indent(x.tldrHtml, 12),
            '        </div>',
            '    </aside>',
            '</div>'
        ].join('\n')
        : '';

    const author = post.author || 'Pain Therapy Medical Care';
    const og = '\n    <meta property="article:published_time" content="' + post.date + '">\n    <meta property="article:modified_time" content="' + (post.modified || post.date) + '">\n    <meta property="article:section" content="' + esc(x.primaryName) + '">' +
        (x.image ? '\n    <meta property="og:image" content="' + esc(x.image.url) + '">' + (x.image.width ? '\n    <meta property="og:image:width" content="' + x.image.width + '">\n    <meta property="og:image:height" content="' + x.image.height + '">' : '') : '');

    writePage({
        kind: 'post', route: x.url, title: x.seoTitle, desc: x.seoDesc, og: og, ld: postLd(x), current: undefined,
        tokens: {
            BREADCRUMB: breadcrumb(crumbs),
            PILL: x.primary
                ? '<a class="pill service-pill blog-pill" href="/blog/category/' + x.primary.slug + '/">' + escText(x.primary.name) + '</a>'
                : '<span class="pill service-pill blog-pill">' + escText(x.primaryName) + '</span>',
            H1: escText(x.title),
            META_LINE: 'By ' + escText(author) + ' · Updated ' + timeTag(post.modified || post.date) + ' · ' + x.readingTime + ' min read',
            TLDR_BOX: tldr ? indent(tldr, 8) : '',
            FIGURE: figure ? indent(figure, 8) : '',
            TOC_SIDE: toc.side ? indent(toc.side, 12) : '',
            TOC_INLINE: toc.inline ? indent(toc.inline, 16) : '',
            BODY: indent(body, 16),
            RELATED_CARE: indent(relatedCare(x), 16),
            AUTHOR_BOX: indent('<aside class="blog-author" aria-labelledby="author-title">\n    <h2 class="blog-author__title" id="author-title">Published by ' + escText(author) + '</h2>\n    <p class="blog-author__text">Pain management in Brooklyn, Five Towns &amp; Monsey.</p>\n</aside>', 16),
            KEEP_READING: indent(x.related.map(card).join('\n'), 16),
            CTA_FINAL: ctaFinal(2, '/schedule/' + (x.relCondition ? '?condition=' + x.relCondition : ''))
        }
    });
}

/* =========================================================
   BUILD
========================================================= */

const categoryPages = {};
listing({ base: '/blog/', items: P, catSlug: null, name: 'Blog', h1: 'Pain Relief Health & News', sub: 'Practical answers about pain, treatments and getting care in Brooklyn, Five Towns & Monsey.' });
const indexPages = Math.ceil(P.length / PER_PAGE);

catSlugs.forEach(function (s) {
    const items = P.filter(function (x) { return x.post.categories.some(function (c) { return c.slug === s; }); });
    const name = catBy[s].name;
    categoryPages[s] = listing({
        base: '/blog/category/' + s + '/', items: items, catSlug: s, name: name, h1: name,
        sub: 'Articles about ' + name.toLowerCase() + ' from the Pain Therapy Medical Care team in Brooklyn, Five Towns & Monsey.'
    });
});

P.forEach(postPage);

/* blog-index.json: liviano (sin contenido) para la búsqueda */
const searchIndex = P.map(function (x) {
    return { t: x.title, u: x.url, c: x.primaryName, d: x.post.date.slice(0, 10), r: x.readingTime, s: clip(x.summary, 160) };
});
fs.mkdirSync(path.join(ROOT, 'assets', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets', 'data', 'blog-index.json'), JSON.stringify(searchIndex) + '\n', 'utf8');

/* ---------- comprobaciones y resumen ---------- */

const generatedPosts = report.files.filter(function (f) { return slugSet.has(f.replace(/^\/blog\/|\/$/g, '')) && f.split('/').filter(Boolean).length === 2 && !/^\/blog\/\d+\/$/.test(f); });
if (generatedPosts.length !== posts.length) fail('posts generados (' + generatedPosts.length + ') ≠ importados (' + posts.length + ')');
posts.forEach(function (p) { if (!fs.existsSync(path.join(ROOT, 'blog', p.slug, 'index.html'))) fail('falta blog/' + p.slug + '/'); });

const catPagesTotal = Object.keys(categoryPages).reduce(function (n, s) { return n + categoryPages[s]; }, 0);
const allPending = {};
[pendingLinks, pendingGen].forEach(function (m) { Object.keys(m).forEach(function (k) { allPending[k] = (allPending[k] || 0) + m[k]; }); });
const pendKeys = Object.keys(allPending).sort(function (a, b) { return allPending[b] - allPending[a]; });

console.log('Blog generado:');
console.log('  posts importados: ' + posts.length + ' · posts generados: ' + generatedPosts.length + ' (slugs idénticos al sitio en vivo)');
console.log('  índice paginado: ' + indexPages + ' páginas (/blog/ … /blog/' + indexPages + '/) · categorías con página: ' + catSlugs.length + ' (' + catPagesTotal + ' páginas)');
console.log('  URLs nuevas en total: ' + report.pages + ' · blog-index.json: ' + searchIndex.length + ' entradas');
console.log('  SEO recortado por superar el límite: ' + seoTrimmed.title.length + ' títulos (>60) · ' + seoTrimmed.desc.length + ' descripciones (>155)');
console.log('\nEnlaces internos pendientes (se muestran como texto): ' + pendKeys.reduce(function (n, k) { return n + allPending[k]; }, 0) + ' en ' + pendKeys.length + ' destinos');
pendKeys.slice(0, 14).forEach(function (k) { console.log('  · ' + k + ' (×' + allPending[k] + ')'); });
if (pendKeys.length > 14) console.log('  · … y ' + (pendKeys.length - 14) + ' destinos más');

/* ---------- tablas de revisión (node tools/blog/build.js --report) ---------- */

if (REPORT) {
    const out = [];
    out.push('\n## Categorías (WordPress, tal cual)\n\n| categoría | slug | posts | página |\n|---|---|---|---|');
    Object.keys(catCount).sort(function (a, b) { return catCount[b] - catCount[a]; }).forEach(function (s) {
        out.push('| ' + catBy[s].name + ' | ' + s + ' | ' + catCount[s] + ' | ' + (catPageSet.has(s) ? 'sí (' + categoryPages[s] + ' pág.)' : 'no (< ' + MIN_CATEGORY + ' posts)') + ' |');
    });
    out.push('\n## Relaciones AUTO post → condición / tratamiento / sede\n\n| post | condición | tratamiento | sede |\n|---|---|---|---|');
    P.forEach(function (x) { out.push('| ' + x.slug + ' | ' + (x.relCondition || '—') + ' | ' + (x.relService || '—') + ' | ' + (x.relLocation || '—') + ' |'); });
    out.push('\n## Posts con problemas de limpieza\n\n| post | imágenes sin alt | enlaces pendientes | iframe/video | Elementor | corchetes sueltos | sin TL;DR | FAQ |\n|---|---|---|---|---|---|---|---|');
    P.forEach(function (x) {
        const s = x.stats;
        if (s.noAlt || s.pending || s.iframe.length || s.elementor || s.brackets.length)
            out.push('| ' + x.slug + ' | ' + s.noAlt + ' | ' + s.pending + ' | ' + (s.iframe.length ? 'sí' : '') + ' | ' + (s.elementor ? 'sí' : '') + ' | ' + s.brackets.slice(0, 3).join(' ') + ' | ' + (s.tldr ? '' : 'sí') + ' | ' + (x.faqs.length >= 2 ? x.faqs.length : '') + ' |');
    });
    out.push('\n## Resúmenes\n');
    out.push('- Párrafos convertidos en listas (líneas con guiones o números): ' + P.reduce(function (n, x) { return n + x.stats.listified; }, 0) + ' en ' + P.filter(function (x) { return x.stats.listified; }).length + ' posts');
    out.push('- Posts sin TL;DR: ' + P.filter(function (x) { return !x.stats.tldr; }).length + ' · con TL;DR: ' + P.filter(function (x) { return x.stats.tldr; }).length);
    out.push('- Posts con FAQPage (≥ 2 preguntas con "?"): ' + P.filter(function (x) { return x.faqs.length >= 2; }).length);
    out.push('- Imagen destacada sin alt en WordPress (alt = título + [CONFIRM alt]): ' + noAltFeatured.length + ' → ' + noAltFeatured.join(', '));
    out.push('- Enlaces de raíz redirigidos a /blog/<slug>/: ' + rewrites.length + '\n' + rewrites.slice(0, 20).map(function (r) { return '  - ' + r; }).join('\n'));
    out.push('- Títulos SEO recortados (' + seoTrimmed.title.length + '): ' + seoTrimmed.title.join(', '));
    out.push('- Descripciones recortadas (' + seoTrimmed.desc.length + '): ' + seoTrimmed.desc.join(', '));
    out.push('- Destinos pendientes (todos): ' + pendKeys.map(function (k) { return k + ' ×' + allPending[k]; }).join(' · '));
    console.log(out.join('\n'));
}
