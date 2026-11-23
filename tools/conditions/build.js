/* =========================================================
   Generador de la sección Conditions
   Uso (desde la raíz del proyecto):   node tools/conditions/build.js
   (build-all.js lo ejecuta solo: descubre tools/<sección>/build.js)

   Genera 20 páginas desde data.js + template.html:
     conditions/index.html                      índice (buscador + grupos por zona)
     conditions/<zona>/index.html               4 hubs de zona
     conditions/<condición>/index.html          15 páginas de condición

   - Header, footer, banda de aseguradoras y CTA final salen de tools/shared (lib.js).
   - Sedes, horarios y providers: SOLO LECTURA de tools/locations/data.js.
   - ENLACES SEGUROS: un enlace interno se activa solo si la página destino existe
     en el proyecto; si no, se muestra como texto con data-pending-link="<ruta>"
     (sin <a>, sin hover ni flecha) y se cuenta al final. Se activan solos al
     volver a ejecutar el build cuando exista la página.
   - Si algo no encaja (token sin valor, título largo, JSON-LD inválido), el script
     se detiene con un error: no genera HTML roto.
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://paintherapycare.com';
const data = require('./data.js');
const locations = require('../locations/data.js');
const services = require('../services/data.js');
const lib = require('../shared/lib.js');
const hours = require('../shared/hours.js');

locations.forEach(hours.check);

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const EOL = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('\r\n') ? '\r\n' : '\n';

const zones = data.zones;
const conditions = data.conditions;
const zoneBy = {}; zones.forEach(function (z) { zoneBy[z.slug] = z; });
const condBy = {}; conditions.forEach(function (c) { condBy[c.slug] = c; });
const svcBy = {}; services.forEach(function (s) { svcBy[s.slug] = s; });


/* ---------- utilidades ---------- */

function fail(msg) {
    console.error('ERROR: ' + msg);
    process.exit(1);
}

function indent(text, spaces) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n');
}

const esc = (s) => s.replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const plain = (s) => s.replace(/&amp;/g, '&');
const ICON_CHECK = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>';
const ICON_ARROW = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-arrow"></use></svg>';
const ICON_PHONE = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-phone"></use></svg>';
const urlOf = (p) => SITE + p;

/* Marcador visible + comentario para el equipo */
function confirm(label) {
    return '<span class="cond-confirm">[CONFIRM: ' + label + ']</span>';
}


/* ---------- enlaces seguros ---------- */

/* Páginas que genera este mismo script (existen por definición) */
const generated = new Set(['/conditions/']);
zones.forEach(function (z) { generated.add('/conditions/' + z.slug + '/'); });
conditions.forEach(function (c) { generated.add('/conditions/' + c.slug + '/'); });

const pending = {};   // ruta → cuántas veces quedó como texto

function pageExists(href) {
    const p = href.split('#')[0].split('?')[0];
    if (generated.has(p)) return true;
    if (p === '/') return true;
    return fs.existsSync(path.join(ROOT, p.replace(/^\//, ''), 'index.html'));
}

/* link(href, html, { cls, attrs, arrow }) → <a> si existe la página; si no, texto pendiente */
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
            : '<a href="' + it[1] + '">' + esc(it[0]) + '</a>') + '</li>';
    }).join('\n');
    return [
        '<nav class="breadcrumb" aria-label="Breadcrumb">',
        '    <div class="container">',
        '        <ol class="breadcrumb__list">',
        indent(lis, 12),
        '        </ol>',
        '    </div>',
        '</nav>'
    ].join('\n');
}

function breadcrumbLd(items) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map(function (it, i) {
            return { '@type': 'ListItem', position: i + 1, name: it[0], item: urlOf(it[1]) };
        })
    };
}

/* Íconos de zona (sprite local de cada página que los usa) */
const ZONE_ICONS = {
    spine: '<path d="M12 3v2M12 8v2M12 13v2M12 18v3"/><rect x="8" y="3.5" width="8" height="3" rx="1.5"/><rect x="8" y="8.5" width="8" height="3" rx="1.5"/><rect x="8" y="13.5" width="8" height="3" rx="1.5"/>',
    joint: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="M10.2 10.2l3.6 3.6"/>',
    nerve: '<path d="M4 12h4l2-5 4 10 2-5h4"/>',
    other: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'
};

function localSprite(keys) {
    const syms = keys.map(function (k) {
        return '<symbol id="i-zone-' + k + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ZONE_ICONS[k] + '</g></symbol>';
    }).join('\n        ');
    return '\n    <!-- Íconos de zona (solo Conditions) -->\n    <svg class="svg-sprite" aria-hidden="true" focusable="false">\n        ' + syms + '\n    </svg>\n';
}

const zoneIcon = (z) => '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-zone-' + z.icon + '"></use></svg>';

/* Primera frase de un texto */
function firstSentence(t) {
    const m = /^(.+?[.!?])(\s|$)/.exec(t);
    return m ? m[1] : t;
}

/* Tratamientos de una condición (live + propuestos), sin repetir */
function treatmentsOf(c) {
    const out = [];
    c.treatments.forEach(function (s) { out.push({ slug: s, proposed: false }); });
    c.treatmentsProposed.forEach(function (s) { if (!out.some(function (o) { return o.slug === s; })) out.push({ slug: s, proposed: true }); });
    out.forEach(function (o) { if (!svcBy[o.slug]) fail(c.slug + ': el servicio "' + o.slug + '" no existe en tools/services/data.js'); });
    return out;
}

/* "Treated with: A, B, C" (máx. 3; enlace solo si existe la página) */
function treatedWith(c) {
    const items = treatmentsOf(c).slice(0, 3).map(function (t) {
        return link('/services/' + t.slug + '/', esc(svcBy[t.slug].name), { cls: 'cond-card__tx' });
    });
    return '<p class="cond-card__treated"><span class="cond-card__treated-label">Treated with:</span> ' + items.join(', ') + '</p>';
}

/* Tarjeta-enlace de condición (enlace extendido sobre el H3; los enlaces a tratamientos van por encima) */
function conditionCard(c, withZone) {
    const z = zoneBy[c.zone];
    return [
        '<li class="cond-card" data-cond-item data-name="' + esc(c.name) + '" data-zone="' + esc(z.name) + '" data-href="/conditions/' + c.slug + '/">',
        '    <span class="cond-card__icon" aria-hidden="true">' + zoneIcon(z) + '</span>',
        '    <h3 class="cond-card__title"><a class="cond-card__link" href="/conditions/' + c.slug + '/">' + esc(c.name) + '</a></h3>',
        withZone ? '    <p class="cond-card__zone">' + esc(z.name) + '</p>' : '',
        '    <p class="cond-card__text">' + esc(firstSentence(c.summary)) + '</p>',
        '    ' + treatedWith(c),
        '</li>'
    ].filter(Boolean).join('\n');
}

/* Sedes compactas (desde tools/locations/data.js): nombre, dirección, horario y "Book here" */
function locationCards() {
    return locations.map(function (l) {
        return [
            '<article class="location-card">',
            '    <h3 class="location-card__name"><a href="/locations/' + l.slug + '/">' + l.listName + '</a></h3>',
            '    <address class="location-card__details">',
            '        <p class="location-card__row"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-pin"></use></svg><span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
            '        <p class="location-card__row">' + ICON_PHONE + '<a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + l.phone + '</a></p>',
            '    </address>',
            '    <p class="location-card__row"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-clock"></use></svg><span>' + hours.summaryHtml(l) + '</span></p>',
            '    <div class="location-card__actions">',
            '        <a class="btn btn--primary btn--md" href="/schedule/?location=' + l.key + '">Book here<span class="visually-hidden"> at ' + l.sede + '</span></a>',
            '    </div>',
            '</article>'
        ].join('\n');
    }).join('\n');
}

/* FAQ general (misma redacción que la Home). Solo las respondidas van al JSON-LD. */
function faqHtml() {
    return data.faqs.map(function (f, i) {
        return [
            '<details class="faq__item"' + (i === 0 ? ' open' : '') + '>',
            '    <summary class="faq__question">' + esc(f.q) + '<svg class="icon faq__icon" aria-hidden="true" focusable="false"><use href="#i-chevron"></use></svg></summary>',
            '    <div class="faq__answer"><p>' + esc(f.a) + '</p></div>',
            '</details>'
        ].join('\n');
    }).join('\n');
}
const faqLd = () => data.faqs.filter(function (f) { return !f.pending; }).map(function (f) {
    return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
});
const FAQ_NOTE = '<!-- CONFIRMAR CON CLIENTE: 3 de las 4 preguntas generales siguen pendientes del equipo clínico (igual que en la Home); solo la de seguros va al JSON-LD. -->';

function section(id, title, cls, inner, o) {
    o = o || {};
    return [
        '<section class="' + (o.plain ? 'cond-block' : 'section' + (cls ? ' ' + cls : '')) + '" aria-labelledby="' + id + '">',
        '    <div class="' + (o.plain ? '' : 'container') + '"' + (o.plain ? '' : ' data-reveal') + '>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="' + id + '">' + esc(title) + '</h2>',
        '        </header>',
        indent(inner, 8),
        '    </div>',
        '</section>'
    ].join('\n').replace(/<div class="">/, '<div>');
}

/* Tarjeta de un tratamiento (nombre + resumen del servicio + enlace seguro) */
function treatmentCard(slug, proposed) {
    const s = svcBy[slug];
    return [
        '<li class="service-card cond-tx">' + (proposed ? '<!-- CONFIRMAR relación: ' + s.name + ' es una relación PROPUESTA (la web en vivo no la vincula) -->' : ''),
        '    <h3 class="service-card__title">' + link('/services/' + slug + '/', esc(s.name), { cls: 'cond-tx__link' }) + '</h3>',
        '    <p class="service-card__text">' + esc(firstSentence(s.lead)) + '</p>',
        '    <p class="cond-tx__more">' + link('/services/' + slug + '/', 'Learn more<span class="visually-hidden"> about ' + esc(s.name) + '</span>', { cls: 'text-link', arrow: true }) + '</p>',
        '</li>'
    ].join('\n');
}


/* =========================================================
   PÁGINA DE CONDICIÓN
========================================================= */

function conditionHero(c) {
    const z = zoneBy[c.zone];
    const scheduleHref = '/schedule/?condition=' + c.slug;
    const img = c.image;
    return [
        '<section class="service-hero cond-hero" aria-labelledby="hero-title">',
        '    <div class="container service-hero__inner">',
        '        <div class="service-hero__content">',
        '            <p class="pill service-pill">' + esc(z.name) + '</p>',
        '            <h1 class="service-hero__title" id="hero-title">' + esc(c.name) + ' Treatment in Brooklyn, Five Towns &amp; Monsey</h1>',
        '            <!-- CONFIRMAR CON CLIENTE: médico que revisa el contenido (no se pone un nombre sin confirmar) -->',
        '            <p class="cond-reviewed">Medically reviewed by ' + confirm('provider') + '</p>',
        '            <p class="service-hero__text">' + esc(c.summary) + '</p>',
        '            <ul class="badge-list" aria-label="At a glance">',
        '                <li class="badge">Non-surgical</li>',
        '                <li class="badge">Insurance accepted</li>',
        '            </ul>',
        '            <div class="btn-group">',
        '                <a class="btn btn--primary btn--lg" href="' + scheduleHref + '">Book an evaluation</a>',
        '                <a class="btn btn--outline btn--lg" href="#locations" data-call-sheet-open>',
        '                    ' + ICON_PHONE,
        '                    Call a location',
        '                </a>',
        '            </div>',
        '        </div>',
        '        <div class="service-hero__media">',
        '            <!-- Imagen de la Media Library de WordPress (no se descarga). CONFIRMAR CON CLIENTE: texto alternativo (alt) tras ver la imagen -->',
        '            <div class="media-placeholder media-placeholder--16x10" data-media="' + c.slug + '-hero">',
        '                <img src="' + encodeURI(img.url) + '" alt="" width="' + img.width + '" height="' + img.height + '" decoding="async" fetchpriority="high">',
        '            </div>',
        '        </div>',
        '    </div>',
        '</section>'
    ].join('\n');
}

function bookingCard(c) {
    return [
        '<aside class="cond-book" aria-labelledby="book-title">',
        '    <h2 class="cond-book__title" id="book-title">Book an evaluation</h2>',
        '    <p class="cond-book__text">Non-surgical, drug-free care. Medicare and Medicaid accepted.</p>',
        '    <a class="btn btn--primary btn--lg btn--block" href="/schedule/?condition=' + c.slug + '">Request Appointment</a>',
        '    <a class="btn btn--outline btn--lg btn--block" href="#locations" data-call-sheet-open>',
        '        ' + ICON_PHONE,
        '        Call a location',
        '    </a>',
        '    <p class="cond-book__note">' + locations.length + ' locations in Brooklyn, Five Towns &amp; Monsey</p>',
        '</aside>'
    ].join('\n');
}

function conditionMain(c) {
    const need = c.confirm || [];
    const blocks = [];

    // 4 · What is …
    blocks.push(section('what-title', 'What is ' + c.name.toLowerCase().replace(/\btmj\b/, 'TMJ') + '?', '', '<p class="cond-prose">' + esc(c.whatIs) + '</p>', { plain: true }));

    // 5 · Síntomas
    const sym = c.symptoms.length
        ? '<ul class="check-list cond-symptoms">\n' + indent(c.symptoms.map(function (t) { return '<li>' + ICON_CHECK + '<span>' + esc(t) + '</span></li>'; }).join('\n'), 4) + '\n</ul>'
        : '<!-- CONFIRMAR CON CLIENTE: síntomas -->\n<p class="cond-prose">' + confirm('common symptoms of ' + c.name.toLowerCase()) + '</p>';
    blocks.push(section('symptoms-title', 'Common symptoms', '', sym, { plain: true }));

    // 6 · Causas
    let causes;
    if (c.causes.length && !need.includes('causes')) {
        causes = '<ul class="cond-list">\n' + indent(c.causes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('\n'), 4) + '\n</ul>';
    } else {
        causes = '<!-- CONFIRMAR CON CLIENTE: causas -->\n<p class="cond-prose">' + confirm('causes of ' + c.name.toLowerCase()) + '</p>';
    }
    blocks.push(section('causes-title', 'What causes ' + c.name.toLowerCase().replace(/\btmj\b/, 'TMJ') + '?', '', causes, { plain: true }));

    // 7 · Cuándo ver al médico (caja --tint)
    const when = c.whenToSee && !need.includes('whenToSee')
        ? '<p>' + esc(c.whenToSee) + '</p>'
        : '<!-- CONFIRMAR CON CLIENTE: cuándo consultar -->\n<p>' + confirm('when to see a doctor for ' + c.name.toLowerCase()) + '</p>';
    blocks.push(section('when-title', 'When to see a doctor', '', '<div class="cond-callout">\n' + indent(when, 4) + '\n</div>', { plain: true }));

    // 8 · Cómo lo tratamos
    const tx = treatmentsOf(c);
    blocks.push(section('treat-title', 'How we treat ' + c.name.toLowerCase().replace(/\btmj\b/, 'TMJ'), '',
        '<ul class="service-cards cond-cards">\n' + indent(tx.map(function (t) { return treatmentCard(t.slug, t.proposed); }).join('\n'), 4) + '\n</ul>', { plain: true }));

    // 9 · Por qué elegirnos
    const why = [
        '<li>' + ICON_CHECK + '<span>Non-surgical care first</span></li>',
        '<li>' + ICON_CHECK + '<span>' + link('/insurance/', 'Medicare &amp; Medicaid accepted', { cls: 'text-link' }) + '</span></li>',
        '<li>' + ICON_CHECK + '<span>' + locations.length + ' locations in Brooklyn, Five Towns &amp; Monsey</span></li>'
    ].join('\n');
    blocks.push(section('why-title', 'Why choose Pain Therapy', '', '<ul class="service-checks cond-why">\n' + indent(why, 4) + '\n</ul>', { plain: true }));

    return blocks.join('\n\n');
}

function relatedOf(c) {
    const same = conditions.filter(function (x) { return x.zone === c.zone; });
    const i = same.indexOf(c);
    const out = [];
    for (let k = 1; k < same.length && out.length < 3; k++) out.push(same[(i + k) % same.length]);
    return out;
}

/* Sección de sedes (id="locations": destino de "Call a location" sin JS; no depende de /locations/) */
function locationsSection(title) {
    return [
        '<section class="section section--cloud" id="locations" aria-labelledby="locations-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="locations-title">' + esc(title) + '</h2>',
        '        </header>',
        '        <div class="service-locations">',
        indent(locationCards(), 12),
        '        </div>',
        '    </div>',
        '</section>'
    ].join('\n');
}

function conditionTail(c) {
    const rel = relatedOf(c);
    const reviews = [1, 2, 3].map(function () {
        return [
            '<figure class="review-card">',
            '    <svg class="stars" viewBox="0 0 120 24" role="img" aria-label="5 out of 5 stars"><use href="#i-star" width="24" height="24"/><use href="#i-star" x="24" width="24" height="24"/><use href="#i-star" x="48" width="24" height="24"/><use href="#i-star" x="72" width="24" height="24"/><use href="#i-star" x="96" width="24" height="24"/></svg>',
            '    <blockquote class="review-card__quote"><p>[Review]</p></blockquote>',
            '    <figcaption class="review-card__author">[Patient name]</figcaption>',
            '</figure>'
        ].join('\n');
    }).join('\n');
    const relHtml = rel.map(function (r) {
        return [
            '<li>',
            '    <a class="service-related__link" href="/conditions/' + r.slug + '/">',
            '        <span class="service-related__name">' + esc(r.name) + '</span>',
            '        ' + ICON_ARROW,
            '    </a>',
            '</li>'
        ].join('\n');
    }).join('\n');

    return [
        // 10 · Dónde lo tratamos
        locationsSection('Where we treat ' + c.name.toLowerCase().replace(/tmj/, 'TMJ')),
        '',
        // 11 · Reseñas
        '<!-- CONFIRMAR CON CLIENTE: reseñas reales de Google Business Profile (no se inventan) -->',
        '<section class="section" aria-labelledby="reviews-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header section-header--split">',
        '            <h2 class="section-title" id="reviews-title">What our patients say</h2>',
        '            ' + link('/reviews/', 'Read all reviews', { cls: 'text-link', arrow: true }),
        '        </header>',
        '        <div class="reviews-grid">',
        indent(reviews, 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        // 12 · FAQ
        FAQ_NOTE,
        '<section class="section section--cloud" aria-labelledby="faq-title">',
        '    <div class="container container--narrow" data-reveal>',
        '        <header class="section-header section-header--center">',
        '            <h2 class="section-title" id="faq-title">Questions about your care</h2>',
        '        </header>',
        '        <div class="faq">',
        indent(faqHtml(), 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        // 13 · Relacionadas + CTA
        '<section class="section" aria-labelledby="related-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header section-header--split">',
        '            <h2 class="section-title" id="related-title">Related conditions</h2>',
        '            <a class="text-link" href="/conditions/' + c.zone + '/">All ' + esc(zoneBy[c.zone].name.toLowerCase()) + ' conditions <span aria-hidden="true">→</span></a>',
        '        </header>',
        '        <ul class="service-related">',
        indent(relHtml, 12),
        '        </ul>',
        '    </div>',
        '</section>'
    ].join('\n');
}

function conditionLd(c) {
    const u = urlOf('/conditions/' + c.slug + '/');
    const z = zoneBy[c.zone];
    const crumbs = [['Home', '/'], ['Conditions', '/conditions/'], [z.name, '/conditions/' + z.slug + '/'], [c.name, '/conditions/' + c.slug + '/']];
    const cond = {
        '@type': 'MedicalCondition',
        '@id': u + '#condition',
        name: c.name,
        description: plain(c.summary),
        associatedAnatomy: { '@type': 'AnatomicalStructure', name: c.anatomy },
        relevantSpecialty: 'https://schema.org/PainMedicine'
    };
    if (c.symptoms.length) cond.signOrSymptom = c.symptoms.map(function (t) { return { '@type': 'MedicalSymptom', name: t }; });
    // Solo las relaciones que la web en vivo confirma (las propuestas no van al schema)
    cond.possibleTreatment = c.treatments.map(function (s) {
        return { '@type': 'MedicalTherapy', name: svcBy[s].name, url: urlOf('/services/' + s + '/') };
    });
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'MedicalWebPage',
                '@id': u + '#webpage',
                url: u,
                name: plain(c.metaTitle),
                description: plain(c.metaDescription),
                about: { '@id': u + '#condition' },
                breadcrumb: { '@id': u + '#breadcrumb' },
                inLanguage: 'en-US'
            },
            cond,
            Object.assign({ '@id': u + '#breadcrumb' }, breadcrumbLd(crumbs)),
            { '@type': 'FAQPage', '@id': u + '#faq', mainEntity: faqLd() }
        ]
    };
}

function conditionNote(c) {
    const lines = (c.notes || []).slice();
    if (c.treatmentsProposed.length) lines.push('Relaciones condición → tratamiento PROPUESTAS: ' + c.treatmentsProposed.map(function (s) { return svcBy[s].name; }).join(', ') + ' (se ven en la página y NO van al JSON-LD).');
    (c.confirm || []).forEach(function (f) { lines.push('Sin base en el texto en vivo: ' + f + ' (se muestra [CONFIRM] visible).'); });
    lines.push('Imagen: og:image de la web en vivo (' + c.image.url.replace(SITE + '/wp-content/uploads/', '') + '); revisar derechos y texto alternativo.');
    lines.forEach(function (t) { if (t.includes('--')) fail(c.slug + ': una nota contiene "--" (rompe el comentario HTML)'); });
    return '\n        <!--\n          CONFIRMAR CON CLIENTE (solo para el equipo, no se ve en la página):\n' + lines.map(function (t) { return '          - ' + t; }).join('\n') + '\n        -->\n';
}

/* =========================================================
   HUBS DE ZONA E ÍNDICE
========================================================= */

function simpleHero(o) {
    return [
        '<section class="service-hero cond-hero cond-hero--list" aria-labelledby="hero-title">',
        '    <svg class="arcs cond-hero__arcs" aria-hidden="true" focusable="false"><use href="#i-arcs"></use></svg>',
        '    <div class="container cond-hero__inner">',
        '        <div class="service-hero__content">',
        o.pill ? '            <p class="pill service-pill">' + esc(o.pill) + '</p>' : '',
        '            <h1 class="service-hero__title" id="hero-title">' + o.h1 + '</h1>',
        '            <p class="service-hero__text">' + esc(o.text) + '</p>',
        '            <div class="btn-group">',
        '                <a class="btn btn--primary btn--lg" href="/schedule/">Book an evaluation</a>',
        '                <a class="btn btn--outline btn--lg" href="#locations" data-call-sheet-open>',
        '                    ' + ICON_PHONE,
        '                    Call a location',
        '                </a>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</section>'
    ].filter(Boolean).join('\n');
}

function ctaBand(primary) {
    return lib.render('cta-final', { depth: 2, call: '#locations', primary: primary || '/schedule/' });
}

/* ----- hub de zona ----- */

function hubMain(z) {
    const list = conditions.filter(function (c) { return c.zone === z.slug; });
    const cards = list.map(function (c) { return conditionCard(c, false); }).join('\n');

    // Tratamientos más repetidos en sus condiciones (live pesa 2, propuesto 1)
    const score = {};
    list.forEach(function (c) {
        c.treatments.forEach(function (s) { score[s] = (score[s] || 0) + 2; });
        c.treatmentsProposed.forEach(function (s) { score[s] = (score[s] || 0) + 1; });
    });
    const top = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).slice(0, 4);
    const proposedOnly = function (s) { return !list.some(function (c) { return c.treatments.includes(s); }); };
    const tx = top.map(function (s) { return treatmentCard(s, proposedOnly(s)); }).join('\n');

    const extra = (z.extraLinks || []).map(function (e) {
        return [
            '<li class="cond-card cond-card--service">',
            '    <span class="cond-card__icon" aria-hidden="true">' + zoneIcon(z) + '</span>',
            '    <h3 class="cond-card__title">' + link(e.href, esc(e.name), { cls: 'cond-card__link' }) + '</h3>',
            '    <p class="cond-card__text">' + link(e.href, esc(e.text), { cls: 'text-link', arrow: true }) + '</p>',
            '</li>'
        ].join('\n');
    }).join('\n');

    return [
        breadcrumb([['Home', '/'], ['Conditions', '/conditions/'], [z.name, '/conditions/' + z.slug + '/']]),
        '',
        simpleHero({ pill: 'Conditions', h1: esc(z.h1Name) + ' Pain Treatment in Brooklyn, Five Towns &amp; Monsey', text: z.intro }),
        '',
        '<section class="section" aria-labelledby="zone-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="zone-title">' + esc(z.name) + ' conditions we treat</h2>',
        '        </header>',
        '        <ul class="cond-grid">',
        indent(cards + (extra ? '\n' + extra : ''), 12),
        '        </ul>',
        '    </div>',
        '</section>',
        '',
        '<!-- CONFIRMAR relación: los tratamientos de abajo son los más repetidos en las condiciones de esta zona; las relaciones propuestas están marcadas en cada tarjeta -->',
        '<section class="section section--cloud" aria-labelledby="hub-tx-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="hub-tx-title">Treatments we often use for ' + esc(z.h1Name.toLowerCase()) + ' pain</h2>',
        '        </header>',
        '        <ul class="service-cards cond-cards">',
        indent(tx, 12),
        '        </ul>',
        '    </div>',
        '</section>',
        '',
        lib.render('insurance-band', { depth: 2 }),
        '',
        locationsSection('Our locations'),
        '',
        ctaBand('/schedule/')
    ].join('\n');
}

function hubLd(z) {
    const u = urlOf('/conditions/' + z.slug + '/');
    const list = conditions.filter(function (c) { return c.zone === z.slug; });
    const crumbs = [['Home', '/'], ['Conditions', '/conditions/'], [z.name, '/conditions/' + z.slug + '/']];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': u + '#page',
                url: u,
                name: plain(z.title),
                description: plain(z.desc),
                inLanguage: 'en-US',
                breadcrumb: { '@id': u + '#breadcrumb' },
                mainEntity: { '@id': u + '#list' }
            },
            {
                '@type': 'ItemList',
                '@id': u + '#list',
                numberOfItems: list.length,
                itemListElement: list.map(function (c, i) {
                    return { '@type': 'ListItem', position: i + 1, url: urlOf('/conditions/' + c.slug + '/'), name: c.name };
                })
            },
            Object.assign({ '@id': u + '#breadcrumb' }, breadcrumbLd(crumbs))
        ]
    };
}

/* ----- índice /conditions/ ----- */

const INDEX = {
    title: 'Conditions We Treat in Brooklyn | Pain Therapy Medical Care',
    desc: 'Find your pain and see how we can help. Non-surgical, drug-free care for back, joint, nerve and chronic pain in Brooklyn, Five Towns and Monsey.'
};

function searchBlock() {
    return [
        '<section class="cond-searchbar" aria-labelledby="search-title">',
        '    <div class="container">',
        '        <!-- Buscador (patrón combobox ARIA, assets/js/conditions.js). Sin JS: se ve la lista completa de abajo -->',
        '        <div class="cond-search" data-cond-search>',
        '            <label class="cond-search__label" id="search-title" for="cond-search-input">Search conditions</label>',
        '            <div class="cond-search__field">',
        '                <svg class="icon cond-search__icon" aria-hidden="true" focusable="false"><use href="#i-search"></use></svg>',
        '                <input class="insurance-input cond-search__input" id="cond-search-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="cond-search-list" aria-describedby="cond-search-hint" autocomplete="off" spellcheck="false" placeholder="Try &quot;knee&quot;, &quot;sciatica&quot; or &quot;jaw&quot;">',
        '                <ul class="cond-search__list" id="cond-search-list" role="listbox" aria-labelledby="search-title" hidden></ul>',
        '            </div>',
        '            <p class="cond-search__hint" id="cond-search-hint">Use the arrow keys to move, Enter to open a condition and Esc to clear.</p>',
        '            <p class="visually-hidden" role="status" aria-live="polite" data-cond-search-status></p>',
        '        </div>',
        '    </div>',
        '</section>'
    ].join('\n');
}

function indexMain() {
    const groups = zones.map(function (z, i) {
        const list = conditions.filter(function (c) { return c.zone === z.slug; });
        const cards = list.map(function (c) { return conditionCard(c, false); }).join('\n');
        const extra = (z.extraLinks || []).map(function (e) {
            return [
                '<li class="cond-card cond-card--service">',
                '    <span class="cond-card__icon" aria-hidden="true">' + zoneIcon(z) + '</span>',
                '    <h3 class="cond-card__title">' + link(e.href, esc(e.name), { cls: 'cond-card__link' }) + '</h3>',
                '    <p class="cond-card__text">' + link(e.href, esc(e.text), { cls: 'text-link', arrow: true }) + '</p>',
                '</li>'
            ].join('\n');
        }).join('\n');
        return [
            '<section class="section' + (i % 2 ? ' section--cloud' : '') + '" id="' + z.slug + '" aria-labelledby="' + z.slug + '-title">',
            '    <div class="container" data-reveal>',
            '        <header class="section-header section-header--split">',
            '            <h2 class="section-title" id="' + z.slug + '-title">' + esc(z.name) + '</h2>',
            '            <a class="text-link" href="/conditions/' + z.slug + '/">View all<span class="visually-hidden"> ' + esc(z.name.toLowerCase()) + ' conditions</span> <span aria-hidden="true">→</span></a>',
            '        </header>',
            '        <ul class="cond-grid">',
            indent(cards + (extra ? '\n' + extra : ''), 12),
            '        </ul>',
            '    </div>',
            '</section>'
        ].join('\n');
    }).join('\n\n');

    return [
        breadcrumb([['Home', '/'], ['Conditions', '/conditions/']]),
        '',
        simpleHero({ pill: 'Conditions', h1: 'Conditions We Treat', text: 'Find your pain and see how we can help — without pills or surgery.' }),
        '',
        searchBlock(),
        '',
        groups,
        '',
        '<section class="section cond-notsure" aria-labelledby="notsure-title">',
        '    <div class="container" data-reveal>',
        '        <div class="cond-notsure__box">',
        '            <h2 class="section-title" id="notsure-title">Not sure what is causing your pain?</h2>',
        '            <p class="cond-notsure__text">Our physicians will find out.</p>',
        '            <a class="btn btn--primary btn--lg" href="/schedule/">Book an evaluation</a>',
        '        </div>',
        '    </div>',
        '</section>',
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        FAQ_NOTE,
        '<section class="section section--cloud" aria-labelledby="faq-title">',
        '    <div class="container container--narrow" data-reveal>',
        '        <header class="section-header section-header--center">',
        '            <h2 class="section-title" id="faq-title">Questions? We have answers.</h2>',
        '        </header>',
        '        <div class="faq">',
        indent(faqHtml(), 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        locationsSection('Our locations'),
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', primary: '/schedule/' })
    ].join('\n');
}

function indexLd() {
    const u = urlOf('/conditions/');
    const crumbs = [['Home', '/'], ['Conditions', '/conditions/']];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': u + '#page',
                url: u,
                name: INDEX.title,
                description: INDEX.desc,
                inLanguage: 'en-US',
                breadcrumb: { '@id': u + '#breadcrumb' },
                mainEntity: { '@id': u + '#list' }
            },
            {
                '@type': 'ItemList',
                '@id': u + '#list',
                numberOfItems: conditions.length,
                itemListElement: conditions.map(function (c, i) {
                    return { '@type': 'ListItem', position: i + 1, url: urlOf('/conditions/' + c.slug + '/'), name: c.name };
                })
            },
            Object.assign({ '@id': u + '#breadcrumb' }, breadcrumbLd(crumbs))
        ]
    };
}


/* =========================================================
   ESCRITURA DE PÁGINAS
========================================================= */

const report = [];
const seenTitles = {};
const seenDescs = {};

function writePage(o) {
    const depth = o.depth;
    const BASE = '../'.repeat(depth);
    const title = plain(o.title), desc = plain(o.desc);
    if (title.length > 60) fail(o.route + ': title de ' + title.length + ' caracteres (máx. 60)');
    if (desc.length > 155) fail(o.route + ': description de ' + desc.length + ' caracteres (máx. 155)');
    if (seenTitles[title]) fail('title repetido: ' + o.route + ' y ' + seenTitles[title]);
    if (seenDescs[desc]) fail('description repetida: ' + o.route + ' y ' + seenDescs[desc]);
    seenTitles[title] = o.route; seenDescs[desc] = o.route;

    const header = lib.render('header', { mode: 'scrolled', call: '#locations', depth: depth, current: o.current });
    const tokens = {
        SITE: SITE,
        BASE: BASE,
        URL: urlOf(o.route),
        TITLE: esc(title),
        DESC: esc(desc),
        OG_IMAGE_TAGS: o.ogImage
            ? '\n    <meta property="og:image" content="' + encodeURI(o.ogImage.url) + '">\n    <meta property="og:image:width" content="' + o.ogImage.width + '">\n    <meta property="og:image:height" content="' + o.ogImage.height + '">'
            : '',
        PAGE_SCRIPTS: o.script ? '\n    <script src="' + BASE + 'assets/js/' + o.script + '" defer></script>' : '',
        SCHEMA_NOTE: o.schemaNote,
        JSONLD: indent(JSON.stringify(o.ld, null, 4), 4),
        HEAD_SCRIPTS: lib.render('head-scripts', { depth: depth }),
        SPRITE: lib.render('sprite', { depth: depth }) + (o.forms ? '\n    ' + lib.render('sprite-forms', { depth: depth }) : ''),
        LOCAL_SPRITE: localSprite(Object.keys(ZONE_ICONS)),
        HEADER: header,
        CONFIRM_NOTE: o.note || '',
        MAIN: indent(o.main, 8),
        FOOTER: lib.render('footer', { depth: depth }),
        MOBILE_AND_SHEET: lib.render('mobile-bar', { depth: depth, call: '#locations', book: o.book || '/schedule/' })
    };

    let html = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) fail('Token sin valor: ' + key);
        return tokens[key];
    });

    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(o.route + ': debe haber 1 <h1>, hay ' + h1s);
    const leftover = html.match(/\{\{[A-Z0-9_]+\}\}/);
    if (leftover) fail(o.route + ': quedó un token sin reemplazar: ' + leftover[0]);
    const ids = {};
    (html.match(/\sid="[^"]+"/g) || []).forEach(function (m) {
        if (ids[m]) fail(o.route + ': id duplicado ' + m.trim());
        ids[m] = 1;
    });
    JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);   // JSON-LD válido

    html = html.replace(/\n{3,}/g, '\n\n').replace(/\r?\n/g, EOL);
    const outDir = path.join(ROOT, o.route.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    report.push('  ✓ ' + o.route.replace(/^\//, '') + 'index.html  ·  title ' + title.length + ' · description ' + desc.length + ' car.');
}

/* índice */
writePage({
    route: '/conditions/', depth: 1, title: INDEX.title, desc: INDEX.desc, current: null,
    script: 'conditions.js', forms: true,
    schemaNote: 'CollectionPage + ItemList (15 condiciones) + BreadcrumbList',
    ld: indexLd(), main: indexMain()
});

/* hubs */
zones.forEach(function (z) {
    writePage({
        route: '/conditions/' + z.slug + '/', depth: 2, title: z.title, desc: z.desc, current: null,
        schemaNote: 'CollectionPage + ItemList + BreadcrumbList',
        ld: hubLd(z), main: hubMain(z)
    });
});

/* condiciones */
conditions.forEach(function (c) {
    const route = '/conditions/' + c.slug + '/';
    const main = [
        conditionHero(c),
        '',
        '<div class="container cond-layout">',
        indent(bookingCard(c), 4),
        '    <div class="cond-main">',
        indent(conditionMain(c), 8),
        '    </div>',
        '</div>',
        '',
        conditionTail(c),
        '',
        lib.render('cta-final', { depth: 2, call: '#locations', primary: '/schedule/?condition=' + c.slug })
    ].join('\n');
    const crumbs = breadcrumb([['Home', '/'], ['Conditions', '/conditions/'], [zoneBy[c.zone].name, '/conditions/' + c.zone + '/'], [c.name, route]]);
    writePage({
        route: route, depth: 2, title: c.metaTitle, desc: c.metaDescription, current: route,
        ogImage: c.image, book: '/schedule/?condition=' + c.slug,
        schemaNote: 'MedicalWebPage + MedicalCondition + FAQPage + BreadcrumbList',
        ld: conditionLd(c), note: conditionNote(c),
        main: crumbs + '\n\n' + main
    });
});

console.log('Páginas de Conditions generadas:\n' + report.join('\n'));
const pend = Object.keys(pending);
console.log('\nEnlaces internos pendientes (se muestran como texto hasta que exista la página): ' + pend.reduce(function (n, k) { return n + pending[k]; }, 0) +
    (pend.length ? '\n' + pend.map(function (k) { return '  · ' + k + ' (×' + pending[k] + ')'; }).join('\n') : ''));
