/* =========================================================
   pagekit.js — piezas comunes de /about-us/, /providers/ y /providers/<slug>/
   (lo usan tools/providers/build.js y tools/about/build.js; NO es un generador).

   - Providers: SOLO LECTURA de tools/providers/data.js · sedes y horarios: tools/locations/data.js.
   - ENLACES SEGUROS: un enlace interno se activa solo si existe la página destino; si no,
     <span data-pending-link="/ruta"> (sin <a>) y se cuenta al final del build.
   - Si algo no encaja (token sin valor, title/description largos, JSON-LD inválido), se detiene
     con un error: no genera HTML roto.
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://paintherapycare.com';
const providers = require('./data.js');
const locations = require('../locations/data.js');
const conditions = require('../conditions/data.js');
const lib = require('../shared/lib.js');
const hours = require('../shared/hours.js');

const EOL = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('\r\n') ? '\r\n' : '\n';

function fail(msg) { console.error('ERROR: ' + msg); process.exit(1); }
function indent(text, n) { const pad = ' '.repeat(n); return text.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n'); }
const esc = (s) => String(s).replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const plain = (s) => String(s).replace(/&amp;/g, '&');
const urlOf = (p) => SITE + p;
const icon = (id) => '<svg class="icon" aria-hidden="true" focusable="false"><use href="#' + id + '"></use></svg>';
const ICON_CHECK = icon('i-check'), ICON_ARROW = icon('i-arrow'), ICON_PHONE = icon('i-phone');

const locBy = {}; locations.forEach(function (l) { locBy[l.key] = l; });
const condBy = {}; conditions.conditions.forEach(function (c) { condBy[c.slug] = c; });
conditions.zones.forEach(function (z) { condBy[z.slug] = { name: z.name }; });

/* ---------- providers ---------- */

const isActive = (p) => (p.status || 'active') === 'active';
/* Tienen página de bio: activos con bio escrita (array). Naveen entra solo al pasar a 'active' y tener bio. */
const hasBio = (p) => isActive(p) && Array.isArray(p.bio) && p.bio.length > 0 && !!p.headline;
const bioRoute = (p) => '/providers/' + p.slug + '/';
const bios = providers.filter(hasBio);
const typeOf = (p) => (p.credential === 'MD' || p.credential === 'DO') ? 'physician' : 'pa';
const lastName = (p) => p.familyName || p.name.replace(/,.*$/, '').split(' ').pop();
const bareName = (p) => p.name.replace(/,.*$/, '');
const sedes = (p) => p.locations.map(function (k) { return locBy[k]; });

providers.forEach(function (p) {
    p.locations.forEach(function (k) { if (!locBy[k]) fail(p.slug + ': sede desconocida "' + k + '"'); });
    if (!p.image || !p.image.url) fail(p.slug + ': falta la foto (image.url)');
});

/* ---------- enlaces seguros ---------- */

const generated = new Set(['/providers/', '/about-us/']);
bios.forEach(function (p) { generated.add(bioRoute(p)); });
const pending = {};

function pageExists(href) {
    const p = href.split('#')[0].split('?')[0];
    if (generated.has(p) || p === '/') return true;
    return fs.existsSync(path.join(ROOT, p.replace(/^\//, ''), 'index.html'));
}

function link(href, html, o) {
    o = o || {};
    const cls = o.cls ? ' class="' + o.cls + '"' : '';
    if (pageExists(href)) {
        return '<a' + cls + ' href="' + href + '"' + (o.attrs ? ' ' + o.attrs : '') + '>' + html + (o.arrow ? ' ' + ICON_ARROW : '') + '</a>';
    }
    pending[href] = (pending[href] || 0) + 1;
    return '<span' + (o.cls ? ' class="' + o.cls + ' is-pending"' : ' class="is-pending"') + ' data-pending-link="' + href + '">' + html + '</span>';
}

/* ---------- piezas comunes ---------- */

function breadcrumb(items) {
    const lis = items.map(function (it, i) {
        const last = i === items.length - 1;
        return '<li class="breadcrumb__item">' + (last
            ? '<span aria-current="page">' + esc(it[0]) + '</span>'
            : link(it[1], esc(it[0]))) + '</li>';
    }).join('\n');
    return ['<nav class="breadcrumb" aria-label="Breadcrumb">', '    <div class="container">', '        <ol class="breadcrumb__list">', indent(lis, 12), '        </ol>', '    </div>', '</nav>'].join('\n');
}

function breadcrumbLd(items) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map(function (it, i) { return { '@type': 'ListItem', position: i + 1, name: it[0], item: urlOf(it[1]) }; })
    };
}

/* Sección estándar */
function section(id, title, inner, o) {
    o = o || {};
    return [
        '<section class="section' + (o.cloud ? ' section--cloud' : '') + (o.cls ? ' ' + o.cls : '') + '"' + (o.sectionId ? ' id="' + o.sectionId + '"' : '') + ' aria-labelledby="' + id + '">',
        '    <div class="container' + (o.narrow ? ' container--narrow' : '') + '" data-reveal>',
        '        <header class="section-header' + (o.center ? ' section-header--center' : '') + '">',
        '            <h2 class="section-title" id="' + id + '">' + esc(title) + '</h2>',
        o.lead ? '            <p class="section-lead">' + o.lead + '</p>' : '',
        '        </header>',
        indent(inner, 8),
        '    </div>',
        '</section>'
    ].filter(Boolean).join('\n');
}

/* Fotos 1:1 (object-fit: cover; object-position: center top). hero = fetchpriority high, sin lazy */
function photo(p, o) {
    o = o || {};
    const im = p.image;
    return '<img src="' + encodeURI(im.url) + '" alt="' + esc(im.alt) + '" width="' + im.width + '" height="' + im.height + '"' +
        (o.hero ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"') + '>';
}

/* Tarjeta de provider (índice, About, carrusel). level = nivel del encabezado. Una sola acción por tarjeta. */
function providerCard(p, o) {
    o = o || {};
    const lvl = o.level || 3;
    const soon = !isActive(p);
    const linked = hasBio(p);
    const name = linked
        ? '<a class="prov-card__link" href="' + bioRoute(p) + '">' + esc(p.name) + '</a>'
        : esc(p.name);
    const locs = sedes(p).map(function (l) { return '<li class="badge">' + esc(l.listName) + '</li>'; }).join('');
    return [
        '<li class="prov-card' + (soon ? ' prov-card--soon' : '') + '" data-prov-item data-loc="' + p.locations.join(' ') + '" data-type="' + typeOf(p) + '">',
        soon ? '    <!-- CONFIRMAR CON CLIENTE: fecha de inicio y bio de ' + esc(p.name) + ' (sin enlace hasta que haya bio) -->' : '',
        '    <div class="prov-card__photo">' + photo(p) + '</div>',
        '    <h' + lvl + ' class="prov-card__name">' + name + '</h' + lvl + '>',
        o.noRole || !p.role ? '' : '    <p class="prov-card__role">' + esc(p.role) + '</p>',
        soon ? '    <p class="badge prov-card__soon">Joining soon</p>' : '',
        '    <ul class="prov-card__locs" aria-label="' + (p.locations.length > 1 ? 'Locations' : 'Location') + '">' + locs + '</ul>',
        '</li>'
    ].filter(Boolean).join('\n');
}

/* Sedes compactas (About / Providers): nombre, dirección, teléfono, horario y "Book here" */
function locationCards(o) {
    o = o || {};
    return locations.map(function (l) {
        return [
            '<article class="location-card"' + (o.map ? ' data-location="' + l.slug + '"' : '') + '>',   // o.map: map.js anima el pin al pasar el ratón
            '    <h3 class="location-card__name"><a href="/locations/' + l.slug + '/">' + l.listName + '</a></h3>',
            '    <address class="location-card__details">',
            '        <p class="location-card__row">' + icon('i-pin') + '<span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
            '        <p class="location-card__row">' + ICON_PHONE + '<a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + l.phone + '</a></p>',
            '    </address>',
            '    <p class="location-card__row">' + icon('i-clock') + '<span>' + hours.summaryHtml(l) + '</span></p>',
            '    <div class="location-card__actions">',
            '        <a class="btn btn--primary btn--md" href="/schedule/?location=' + l.key + (o.provider ? '&amp;provider=' + o.provider : '') + '">Book here<span class="visually-hidden"> at ' + l.sede + '</span></a>',
            '    </div>',
            '</article>'
        ].join('\n');
    }).join('\n');
}

const mapsQuery = (l) => (l.street + ' ' + l.city + ' ' + l.region + ' ' + l.zip).replace(/\s+/g, '+');

/* "Where to see <provider>": tarjetas de SUS sedes (horario, teléfono, Book here, Directions) */
function providerLocationCards(p) {
    return sedes(p).map(function (l) {
        return [
            '<article class="location-card">',
            '    <h3 class="location-card__name"><a href="/locations/' + l.slug + '/">' + l.listName + '</a></h3>',
            '    <address class="location-card__details">',
            '        <p class="location-card__row">' + icon('i-pin') + '<span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
            '        <p class="location-card__row">' + ICON_PHONE + '<a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + l.phone + '</a></p>',
            '    </address>',
            '    <p class="location-card__row">' + icon('i-clock') + '<span>' + hours.summaryHtml(l) + '</span></p>',
            '    <div class="location-card__actions">',
            '        <a class="btn btn--primary btn--md" href="/schedule/?location=' + l.key + '&amp;provider=' + p.slug + '">Book here<span class="visually-hidden"> at ' + l.sede + ' with ' + esc(p.short) + '</span></a>',
            '        <a class="btn btn--outline btn--md" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + mapsQuery(l) + '" target="_blank" rel="noopener">Directions<span class="visually-hidden"> to ' + l.sede + ' (opens in a new tab)</span></a>',
            '    </div>',
            '</article>'
        ].join('\n');
    }).join('\n');
}

/* Valores (3 tarjetas con ícono local) */
const VALUES = [
    { icon: 'i-pv-excellence', title: 'Excellence', text: 'Committed to providing the highest quality care with proven results' },
    { icon: 'i-pv-compassion', title: 'Compassion', text: 'Understanding and empathetic approach to every patient\'s journey' },
    { icon: 'i-pv-collaboration', title: 'Collaboration', text: 'Interdisciplinary team working together for optimal outcomes' }
];
function featureCards(list) {
    return '<ul class="prov-features">\n' + indent(list.map(function (v) {
        return [
            '<li class="prov-feature">',
            '    <span class="prov-feature__icon" aria-hidden="true">' + icon(v.icon) + '</span>',
            '    <h3 class="prov-feature__title">' + esc(v.title) + '</h3>',
            '    <p class="prov-feature__text">' + esc(v.text) + '</p>',
            '</li>'
        ].join('\n');
    }).join('\n'), 4) + '\n</ul>';
}

/* Íconos locales (solo About / Providers); se inyectan como sprite en cada página que los use */
const LOCAL_ICONS = {
    'i-pv-excellence': '<circle cx="12" cy="9" r="5"/><path d="M8.6 13.3 7 21l5-3 5 3-1.6-7.7"/>',
    'i-pv-compassion': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    'i-pv-collaboration': '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15.5 14.4c3 .1 5.5 1.7 5.5 5.6"/>',
    'i-ab-diagnosis': '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.2-4.2"/>',
    'i-ab-undertreated': '<path d="M12 4 21 20H3z"/><path d="M12 10v4M12 17.4v.01"/>',
    'i-ab-real': '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    'i-ab-disability': '<path d="M4 18l5-6 4 3 7-9"/><path d="M4 20h16"/>',
    'i-ab-silent': '<path d="M5 5h14v10h-8l-5 4v-4H5z"/><path d="M9 10h6"/>',
    'i-ab-life': '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>'
};
function localSprite(keys) {
    const syms = keys.map(function (k) {
        return '<symbol id="' + k + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + LOCAL_ICONS[k] + '</g></symbol>';
    }).join('\n        ');
    return '\n    <!-- Íconos locales (About / Providers) -->\n    <svg class="svg-sprite" aria-hidden="true" focusable="false">\n        ' + syms + '\n    </svg>\n';
}

/* Hero de listas (breadcrumb va aparte) */
function listHero(o) {
    return [
        '<section class="service-hero prov-hero' + (o.media ? ' prov-hero--media' : '') + '" aria-labelledby="hero-title">',
        '    <svg class="arcs prov-hero__arcs" aria-hidden="true" focusable="false"><use href="#i-arcs"></use></svg>',
        '    <div class="container service-hero__inner prov-hero__inner">',
        '        <div class="service-hero__content">',
        '            <p class="pill service-pill">' + esc(o.pill) + '</p>',
        '            <h1 class="service-hero__title" id="hero-title">' + o.h1 + '</h1>',
        '            <p class="service-hero__text">' + esc(o.text) + '</p>',
        '            <div class="btn-group">',
        '                <a class="btn btn--primary btn--lg" href="' + o.primary[1] + '">' + esc(o.primary[0]) + '</a>',
        o.secondary ? '                ' + link(o.secondary[1], esc(o.secondary[0]), { cls: 'btn btn--outline btn--lg' })
            : '                <a class="btn btn--outline btn--lg" href="#locations" data-call-sheet-open>\n                    ' + ICON_PHONE + '\n                    Call a location\n                </a>',
        '            </div>',
        '        </div>',
        o.media ? '        <div class="service-hero__media">\n' + indent(o.media, 12) + '\n        </div>' : '',
        '    </div>',
        '</section>'
    ].filter(Boolean).join('\n');
}

/* FAQ */
function faqHtml(list) {
    return list.map(function (f, i) {
        return [
            '<details class="faq__item"' + (i === 0 ? ' open' : '') + '>',
            '    <summary class="faq__question">' + esc(f.q) + '<svg class="icon faq__icon" aria-hidden="true" focusable="false"><use href="#i-chevron"></use></svg></summary>',
            '    <div class="faq__answer"><p>' + (f.html || esc(f.a)) + '</p></div>',
            '</details>'
        ].join('\n');
    }).join('\n');
}
const faqLd = (list) => list.filter(function (f) { return !f.pending; }).map(function (f) {
    return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
});

/* ---------- escritura ---------- */

const seenTitles = {}, seenDescs = {}, report = [];

function writePage(o) {
    const depth = o.depth;
    const BASE = '../'.repeat(depth);
    const template = fs.readFileSync(path.join(__dirname, o.template || 'template-index.html'), 'utf8');
    const title = plain(o.title), desc = plain(o.desc);
    if (title.length > 60) fail(o.route + ': title de ' + title.length + ' caracteres (máx. 60)');
    if (desc.length > 155) fail(o.route + ': description de ' + desc.length + ' caracteres (máx. 155)');
    if (seenTitles[title]) fail('title repetido: ' + o.route + ' y ' + seenTitles[title]);
    if (seenDescs[desc]) fail('description repetida: ' + o.route + ' y ' + seenDescs[desc]);
    seenTitles[title] = o.route; seenDescs[desc] = o.route;

    const scripts = (o.scripts || []).map(function (s) { return '\n    <script src="' + BASE + 'assets/js/' + s + '" defer></script>'; }).join('');
    const tokens = {
        SITE: SITE,
        BASE: BASE,
        URL: urlOf(o.route),
        TITLE: esc(title),
        DESC: esc(desc),
        OG_IMAGE_TAGS: o.ogImage
            ? '\n    <meta property="og:image" content="' + encodeURI(o.ogImage.url) + '">' +
              (o.ogImage.width ? '\n    <meta property="og:image:width" content="' + o.ogImage.width + '">\n    <meta property="og:image:height" content="' + o.ogImage.height + '">' : '') +
              (o.ogImage.alt ? '\n    <meta property="og:image:alt" content="' + esc(o.ogImage.alt) + '">' : '')
            : '',
        PAGE_SCRIPTS: scripts,
        SCHEMA_NOTE: o.schemaNote,
        JSONLD: indent(JSON.stringify(o.ld, null, 4), 4),
        HEAD_SCRIPTS: lib.render('head-scripts', { depth: depth }),
        SPRITE: lib.render('sprite', { depth: depth }) + (o.forms ? '\n    ' + lib.render('sprite-forms', { depth: depth }) : ''),
        LOCAL_SPRITE: localSprite(o.icons || []),
        HEADER: lib.render('header', { mode: 'scrolled', call: '#locations', depth: depth, current: o.current || undefined }),
        CONFIRM_NOTE: o.note || '',
        MAIN: indent(o.main, 8),
        FOOTER: lib.render('footer', { depth: depth }),
        MOBILE_AND_SHEET: lib.render('mobile-bar', { depth: depth, call: '#locations', book: o.book || '/schedule/' })
    };

    let html = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) fail('Token sin valor: ' + key);
        return tokens[key];
    });

    if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(o.route + ': debe haber 1 <h1>');
    const leftover = html.match(/\{\{[A-Z0-9_]+\}\}/);
    if (leftover) fail(o.route + ': token sin reemplazar: ' + leftover[0]);
    const ids = {};
    (html.match(/\sid="[^"]+"/g) || []).forEach(function (m) {
        if (ids[m]) fail(o.route + ': id duplicado ' + m.trim());
        ids[m] = 1;
    });
    JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);

    html = html.replace(/\n{3,}/g, '\n\n').replace(/\r?\n/g, EOL);
    const outDir = path.join(ROOT, o.route.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    report.push('  ✓ ' + o.route.replace(/^\//, '') + 'index.html  ·  title ' + title.length + ' · description ' + desc.length + ' car.');
}

function finish(label) {
    console.log('Páginas de ' + label + ' generadas:\n' + report.join('\n'));
    const pend = Object.keys(pending);
    console.log('\nEnlaces internos pendientes (texto hasta que exista la página): ' + pend.reduce(function (n, k) { return n + pending[k]; }, 0) +
        (pend.length ? '\n' + pend.map(function (k) { return '  · ' + k + ' (×' + pending[k] + ')'; }).join('\n') : ''));
}

module.exports = {
    ROOT, SITE, providers, locations, conditions, condBy, lib, hours,
    fail, indent, esc, plain, urlOf, icon, ICON_CHECK, ICON_ARROW, ICON_PHONE,
    isActive, hasBio, bioRoute, bios, typeOf, lastName, bareName, sedes, locBy,
    link, breadcrumb, breadcrumbLd, section, photo, providerCard, locationCards, providerLocationCards,
    VALUES, featureCards, localSprite, listHero, faqHtml, faqLd, writePage, finish, mapsQuery
};
