/* =========================================================
   Importador de posts del blog (WordPress → tools/blog/data.json)
   Uso (desde la raíz del proyecto):   node tools/blog/import.js

   - Descarga TODOS los posts publicados:
       https://paintherapycare.com/wp-json/wp/v2/posts?per_page=100&page=N&_embed
     recorriendo las páginas hasta el final y comprobando el total con X-WP-Total.
   - La API NO trae los campos de Yoast / Rank Math, así que, por cada post, lee también
     el <title>, la meta description y la og:image de su página pública en vivo
     (petición secuencial y con pausa; solo lectura).
   - Guarda el resultado en tools/blog/data.json (el contenido va SIN limpiar: la limpieza
     se hace en build.js, para que el build sea reproducible y sin red).
   - NO lo ejecuta build-all.js (necesita red). Solo se corre a mano al actualizar el blog.
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const SITE = 'https://paintherapycare.com';
const API = SITE + '/wp-json/wp/v2/posts?per_page=100&_embed&page=';
const OUT = path.join(__dirname, 'data.json');
const PAUSE_MS = 120;

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…', copy: '©', reg: '®' };

function decode(s) {
    return String(s || '')
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCodePoint(parseInt(n, 10)); })
        .replace(/&#x([0-9a-f]+);/gi, function (m, n) { return String.fromCodePoint(parseInt(n, 16)); })
        .replace(/&([a-z]+);/gi, function (m, n) { return NAMED[n.toLowerCase()] !== undefined ? NAMED[n.toLowerCase()] : m; });
}

const text = (html) => decode(String(html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise(function (r) { setTimeout(r, ms); });

async function getJson(url) {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' en ' + url);
    return { json: await res.json(), total: +res.headers.get('x-wp-total') || 0, pages: +res.headers.get('x-wp-totalpages') || 0 };
}

function mapPost(p) {
    const emb = p._embedded || {};
    const terms = emb['wp:term'] || [];
    const fm = (emb['wp:featuredmedia'] || [])[0] || null;
    let image = null;
    if (fm && fm.source_url) {
        const md = fm.media_details || {};
        const large = md.sizes && (md.sizes.large || md.sizes.medium_large);
        image = {
            url: fm.source_url,
            width: md.width || 0,
            height: md.height || 0,
            alt: text(fm.alt_text),
            caption: text(fm.caption && fm.caption.rendered),
            large: large ? { url: large.source_url, width: large.width, height: large.height } : null
        };
    }
    return {
        id: p.id,
        slug: p.slug,
        title: text(p.title.rendered),
        excerpt: text(p.excerpt && p.excerpt.rendered),
        content: p.content.rendered,
        date: p.date,
        modified: p.modified,
        author: (emb.author && emb.author[0] && emb.author[0].name) || '',
        image: image,
        categories: (terms[0] || []).map(function (c) { return { id: c.id, name: decode(c.name), slug: c.slug }; }),
        tags: (terms[1] || []).map(function (t) { return { name: decode(t.name), slug: t.slug }; }),
        seo: { title: '', description: '', ogImage: '' }
    };
}

/* title / description / og:image de la página pública (equivalente a Yoast / Rank Math) */
async function readHead(slug) {
    const res = await fetch(SITE + '/blog/' + slug + '/');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const h = await res.text();
    const t = /<title>([\s\S]*?)<\/title>/.exec(h);
    const d = /<meta name="description" content="([^"]*)"/.exec(h);
    const o = /<meta property="og:image" content="([^"]*)"/.exec(h);
    return { title: t ? decode(t[1]).trim() : '', description: d ? decode(d[1]).trim() : '', ogImage: o ? o[1] : '' };
}

(async function main() {
    const errors = [];
    const raw = [];
    let total = 0, totalPages = 1;

    for (let page = 1; page <= totalPages; page++) {
        const r = await getJson(API + page);
        if (page === 1) { total = r.total; totalPages = r.pages || 1; }
        raw.push.apply(raw, r.json);
        console.log('página ' + page + '/' + totalPages + ': ' + r.json.length + ' posts');
    }

    const posts = raw.map(mapPost).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (total && posts.length !== total) errors.push('X-WP-Total=' + total + ' pero se descargaron ' + posts.length);
    if (new Set(posts.map(function (p) { return p.slug; })).size !== posts.length) errors.push('hay slugs repetidos');

    console.log('Leyendo <title>, meta description y og:image de ' + posts.length + ' páginas…');
    for (let i = 0; i < posts.length; i++) {
        try {
            posts[i].seo = await readHead(posts[i].slug);
        } catch (e) {
            errors.push(posts[i].slug + ': ' + e.message);
        }
        if ((i + 1) % 40 === 0) console.log('  ' + (i + 1) + '/' + posts.length);
        await sleep(PAUSE_MS);
    }

    fs.writeFileSync(OUT, JSON.stringify({ importedAt: new Date().toISOString(), source: SITE, total: posts.length, posts: posts }, null, 1), 'utf8');

    console.log('\nPosts importados: ' + posts.length + ' (X-WP-Total: ' + total + ')');
    console.log('Sin imagen destacada: ' + posts.filter(function (p) { return !p.image; }).length);
    console.log('Sin SEO title / description en vivo: ' + posts.filter(function (p) { return !p.seo.title; }).length + ' / ' + posts.filter(function (p) { return !p.seo.description; }).length);
    console.log(errors.length ? 'ERRORES (' + errors.length + '):\n  ' + errors.join('\n  ') : 'Sin errores.');
    if (errors.length) process.exitCode = 1;
})().catch(function (e) {
    console.error('ERROR: ' + e.message);
    process.exit(1);
});
