/* =========================================================
   Generador de las páginas de tratamiento
   Uso (desde la raíz del proyecto):   node tools/services/build.js

   - UNA plantilla (template.html) + datos (data.js) → una página por
     tratamiento en services/<slug>/index.html
   - Header, sprite, footer, barra móvil, banda de aseguradoras y CTA final
     salen de los partials de tools/shared/ (lib.js).
   - Las secciones opcionales (candidates, combine…) solo se generan si el
     tratamiento trae esos datos; las secciones centrales se alternan
     blanco / cloud automáticamente.
   - Si algo no encaja (token sin valor, dato inválido), el script se
     detiene con un error: no genera HTML roto.
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://paintherapycare.com';
const services = require('./data.js');
const locations = require('../locations/data.js');
const lib = require('../shared/lib.js');
const hours = require('../shared/hours.js');

locations.forEach(hours.check);

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const EOL = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('\r\n') ? '\r\n' : '\n';

/* ---------- utilidades ---------- */

function fail(msg) {
    console.error('ERROR: ' + msg);
    process.exit(1);
}

function indent(text, spaces) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n');
}

/* Texto de data.js (con & sueltos) → HTML */
const esc = (s) => s.replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;');
const plain = (s) => s.replace(/&amp;/g, '&');
const url = (s) => `${SITE}/services/${s.slug}/`;
const bySlug = {};
services.forEach(function (s) { bySlug[s.slug] = s; });

const ICON_CHECK = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>';
const ICON_ARROW = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-arrow"></use></svg>';

/* ---------- secciones centrales ---------- */

function header(id, title, cls, inner) {
    return [
        `<section class="section${cls ? ' ' + cls : ''}" aria-labelledby="${id}">`,
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        `            <h2 class="section-title" id="${id}">${esc(title)}</h2>`,
        '        </header>',
        indent(inner, 8),
        '    </div>',
        '</section>'
    ].join('\n');
}

function sectionWhat(s, cls) {
    const paras = s.what.paras.map(function (p) { return `<p>${esc(p)}</p>`; }).join('\n');
    const groups = (s.what.cardGroups || []).map(function (g) {
        const cards = g.items.map(function (c) {
            return [
                '<li class="service-card">',
                `    <h4 class="service-card__title">${esc(c.t)}</h4>`,
                `    <p class="service-card__text">${esc(c.d)}</p>`,
                '</li>'
            ].join('\n');
        }).join('\n');
        return [
            '<div class="service-group">',
            `    <h3 class="service-group__title">${esc(g.title)}</h3>`,
            '    <ul class="service-cards">',
            indent(cards, 8),
            '    </ul>',
            '</div>'
        ].join('\n');
    }).join('\n');
    return header('what-title', s.what.title, cls, `<div class="service-prose">\n${indent(paras, 4)}\n</div>\n${groups}`);
}

/* Lista de checks */
function checksHtml(items) {
    const lis = items.map(function (t) { return `<li>${ICON_CHECK}<span>${esc(t)}</span></li>`; }).join('\n');
    return `<ul class="service-checks">\n${indent(lis, 4)}\n</ul>`;
}

/* Subgrupo con subtítulo h3 */
function groupHtml(title, inner) {
    return `<div class="service-group">\n    <h3 class="service-group__title">${esc(title)}</h3>\n${indent(inner, 4)}\n</div>`;
}

function tagsHtml(items) {
    const lis = items.map(function (t) { return `<li class="service-tags__item">${esc(t)}</li>`; }).join('\n');
    return `<ul class="service-tags">\n${indent(lis, 4)}\n</ul>`;
}

function sectionCandidates(s, cls) {
    const c = s.candidates;
    const body = c.groups
        ? c.groups.map(function (g) { return groupHtml(g.title, checksHtml(g.items)); }).join('\n')
        : checksHtml(c.items);
    const inner = [
        c.intro ? `<p class="service-intro">${esc(c.intro)}</p>` : '',
        body,
        '<p class="service-note">Your physician decides whether this treatment is right for you.</p>'
    ].filter(Boolean).join('\n');
    return header('candidates-title', c.title, cls, inner);
}

function sectionConditions(s, cls) {
    const c = s.conditions;
    const body = c.groups
        ? c.groups.map(function (g) { return groupHtml(g.title, tagsHtml(g.items)); }).join('\n')
        : tagsHtml(c.items);
    return header('conditions-title', c.title, cls, body);
}

/* Secciones extra opcionales: { id, title, intro?, type: 'checks' | 'tags', items } */
function sectionExtra(e) {
    return function (s, cls) {
        const body = e.type === 'tags' ? tagsHtml(e.items) : checksHtml(e.items);
        const inner = (e.intro ? `<p class="service-intro">${esc(e.intro)}</p>\n` : '') + body;
        return header(e.id + '-title', e.title, cls, inner);
    };
}

/* Médico de la página (opcional): { title, name, role, image: {src, alt} } */
function sectionProvider(s, cls) {
    const p = s.provider;
    const inner = [
        '<div class="service-provider">',
        `    <div class="media-placeholder media-placeholder--1x1 service-provider__media" data-media="${s.slug}-provider">`,
        `        <img src="${p.image.src}" alt="${esc(p.image.alt)}" width="400" height="400" loading="lazy" decoding="async">`,
        '    </div>',
        '    <div class="service-provider__text">',
        `        <h3 class="service-provider__name">${esc(p.name)}</h3>`,
        `        <p>${esc(p.role)}</p>`,
        '    </div>',
        '</div>'
    ].join('\n');
    return header('provider-title', p.title, cls, inner);
}

function sectionSteps(s, cls) {
    const items = s.steps.items.map(function (st, i) {
        const n = String(i + 1).padStart(2, '0');
        return [
            '<li class="step">',
            `    <span class="step__number" aria-hidden="true">${n}</span>`,
            `    <h3 class="step__title">${esc(st.t)}</h3>`,
            `    <p class="step__text">${esc(st.d)}</p>`,
            '</li>'
        ].join('\n');
    }).join('\n');
    const intro = s.steps.intro ? `<p class="service-intro">${esc(s.steps.intro)}</p>\n` : '';
    return header('steps-title', s.steps.title, cls, `${intro}<ol class="steps service-steps">\n${indent(items, 4)}\n</ol>`);
}

function sectionCombine(s, cls) {
    const c = s.combine;
    const items = c.items.map(function (it) {
        if (it.slug && !bySlug[it.slug]) { /* página aún sin crear: se enlaza igual (ruta definitiva) */ }
        return it.slug
            ? `<li><a class="pill-link location-pill-link" href="/services/${it.slug}/">${esc(it.label)}</a></li>`
            : `<li><span class="pill-link location-pill-link service-pill-static">${esc(it.label)}</span></li>`;
    }).join('\n');
    const inner = `<p class="service-intro">${esc(c.intro)}</p>\n<ul class="service-combine">\n${indent(items, 4)}\n</ul>`;
    return header('combine-title', c.title, cls, inner);
}

function sectionsFor(s) {
    const list = [sectionWhat];
    if (s.candidates) list.push(sectionCandidates);
    if (s.conditions) list.push(sectionConditions);
    if (s.steps) list.push(sectionSteps);
    if (s.combine) list.push(sectionCombine);
    (s.extras || []).forEach(function (e) { list.push(sectionExtra(e)); });
    if (s.provider) list.push(sectionProvider);
    return list.map(function (fn, i) {
        /* hero = cloud → la primera sección es blanca, luego se alterna */
        return indent(fn(s, i % 2 ? 'section--cloud' : ''), 8);
    }).join('\n\n');
}

/* ---------- FAQ ---------- */

function faqHtml(s) {
    return s.faq.map(function (f, i) {
        return [
            `<details class="faq__item"${i === 0 ? ' open' : ''}>`,
            `    <summary class="faq__question">${esc(f.q)}<svg class="icon faq__icon" aria-hidden="true" focusable="false"><use href="#i-chevron"></use></svg></summary>`,
            `    <div class="faq__answer"><p>${esc(f.a)}</p></div>`,
            '</details>'
        ].join('\n');
    }).join('\n');
}

/* ---------- sedes (misma tarjeta que la Home) ---------- */

const addrQuery = (l) => `${l.street} ${l.city} ${l.region} ${l.zip}`.replace(/\s+/g, '+');
const mapsDir = (l) => `https://www.google.com/maps/dir/?api=1&amp;destination=${addrQuery(l)}`;

function locationsHtml() {
    return locations.map(function (l) {
        return [
            '<article class="location-card">',
            `    <h3 class="location-card__name"><a href="/locations/${l.slug}/">${l.listName}</a></h3>`,
            '    <address class="location-card__details">',
            `        <p class="location-card__row"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-pin"></use></svg><span>${l.street}<br>${l.city}, ${l.region} ${l.zip}</span></p>`,
            `        <p class="location-card__row"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-phone"></use></svg><a href="tel:${l.tel}" aria-label="Call Pain Therapy ${l.sede} at ${l.phone}">${l.phone}</a></p>`,
            '    </address>',
            '    <p class="location-card__row"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-clock"></use></svg><span>' + hours.summaryHtml(l) + '</span></p>',
            '    <div class="location-card__actions">',
            `        <a class="btn btn--primary btn--md" href="/locations/${l.slug}/">View location<span class="visually-hidden">: ${l.listName}</span></a>`,
            `        <a class="btn btn--outline btn--md" href="${mapsDir(l)}" target="_blank" rel="noopener">Directions<span class="visually-hidden"> to ${l.sede} (opens in a new tab)</span></a>`,
            '    </div>',
            '</article>'
        ].join('\n');
    }).join('\n');
}

/* ---------- relacionados ---------- */

function relatedHtml(s) {
    return s.related.map(function (slug) {
        const r = bySlug[slug];
        if (!r) fail(`${s.slug}: related "${slug}" no existe en data.js`);
        return [
            '<li>',
            `    <a class="service-related__link" href="/services/${r.slug}/">`,
            `        <span class="service-related__name">${esc(r.name)}</span>`,
            '        ' + ICON_ARROW,
            '    </a>',
            '</li>'
        ].join('\n');
    }).join('\n');
}

/* ---------- JSON-LD ---------- */

function jsonLd(s) {
    const u = url(s);
    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': s.schemaType || 'MedicalProcedure',
                '@id': u + '#procedure',
                name: s.name,
                description: plain(s.desc),
                url: u,
                relevantSpecialty: 'https://schema.org/PainMedicine'
            },
            {
                '@type': 'BreadcrumbList',
                '@id': u + '#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
                    { '@type': 'ListItem', position: 2, name: 'Treatments', item: SITE + '/services/' },
                    { '@type': 'ListItem', position: 3, name: s.name, item: u }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': u + '#faq',
                mainEntity: s.faq.map(function (f) {
                    return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
                })
            }
        ]
    };
    const proc = data['@graph'][0];
    if (s.procedureType) proc.procedureType = 'https://schema.org/' + s.procedureType;
    if (s.steps) proc.howPerformed = s.steps.items.map(function (st) { return st.d; }).join(' ');
    return indent(JSON.stringify(data, null, 4), 4);
}

function confirmNote(s) {
    const lines = s.confirm.map(function (t) {
        if (t.includes('--')) fail(`${s.slug}: una nota "confirm" contiene "--" (rompe el comentario HTML)`);
        return '          - ' + t;
    }).join('\n');
    return '\n        <!--\n          CONFIRMAR CON CLIENTE (solo para el equipo, no se ve en la página):\n' + lines + '\n        -->\n';
}

/* ---------- build ---------- */

const report = [];

services.forEach(function (s) {
    if (s.title.length > 65) fail(`${s.slug}: title de ${s.title.length} caracteres (máx. 65)`);
    if (s.desc.length > 155) fail(`${s.slug}: description de ${s.desc.length} caracteres (máx. 155)`);

    const scheduleHref = `/schedule/?service=${s.slug}`;
    const tokens = {
        SITE: SITE,
        URL: url(s),
        SLUG: s.slug,
        NAME: esc(s.name),
        TITLE: esc(s.title),
        DESC: esc(s.desc),
        KICKER: esc(s.kicker),
        H1: esc(s.h1),
        LEAD: esc(s.lead),
        CHECKS: indent(s.checks.map(function (c) { return `<li>${ICON_CHECK}${esc(c)}</li>`; }).join('\n'), 24),
        IMG_SRC: s.image.src,
        IMG_ALT: esc(s.image.alt),
        SCHEDULE_HREF: scheduleHref,
        CONFIRM_NOTE: confirmNote(s),
        SECTIONS: sectionsFor(s),
        FAQ: indent(faqHtml(s), 20),
        LOCATIONS: indent(locationsHtml(), 20),
        RELATED: indent(relatedHtml(s), 20),
        RELATED_TITLE: esc(s.relatedTitle),
        JSONLD: jsonLd(s),
        HEAD_SCRIPTS: lib.render('head-scripts', { depth: 2 }),
        SPRITE: lib.render('sprite', { depth: 2 }),
        HEADER: lib.render('header', { mode: 'scrolled', call: '/locations/', depth: 2, current: `/services/${s.slug}/` }),
        FOOTER: lib.render('footer', { depth: 2 }),
        INSURANCE_BAND: lib.render('insurance-band', { depth: 2 }),
        CTA_FINAL: lib.render('cta-final', { depth: 2, primary: scheduleHref }),
        MOBILE_AND_SHEET: lib.render('mobile-bar', { depth: 2, call: '/locations/', book: scheduleHref })
    };

    let html = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) fail('Token sin valor: ' + key);
        return tokens[key];
    });

    /* Controles de calidad */
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(`${s.slug}: debe haber 1 <h1>, hay ${h1s}`);
    const leftover = html.match(/\{\{[A-Z0-9_]+\}\}/);
    if (leftover) fail(`${s.slug}: quedó un token sin reemplazar: ${leftover[0]}`);
    const ids = {};
    (html.match(/\sid="[^"]+"/g) || []).forEach(function (m) {
        if (ids[m]) fail(`${s.slug}: id duplicado ${m.trim()}`);
        ids[m] = 1;
    });
    const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
    JSON.parse(ld[1]);                                  // JSON-LD válido

    html = html.replace(/\n{3,}/g, '\n\n').replace(/\r?\n/g, EOL);
    const outDir = path.join(ROOT, 'services', s.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    report.push(`  ✓ services/${s.slug}/index.html  ·  title ${s.title.length} · description ${s.desc.length} car.`);
});

console.log('Páginas de tratamiento generadas:\n' + report.join('\n'));
