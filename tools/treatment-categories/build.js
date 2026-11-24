/* =========================================================
   Generador de /services/ (índice) y de las 3 categorías de tratamientos.
   Uso (desde la raíz):   node tools/treatment-categories/build.js   (lo ejecuta build-all.js)

   - Datos: tools/treatment-categories/data.js (agrupación y textos) +
     tools/services/data.js (nombre, resumen, imagen y enlace de cada tratamiento) +
     tools/conditions/data.js (condiciones relacionadas).
   - Reutiliza las piezas de tools/providers/pagekit.js (breadcrumb, secciones, FAQ, escritura
     con validaciones de title/description/H1/ids/JSON-LD) y los partials de tools/shared/.
   - Las 14 páginas de tratamiento NO se generan aquí (tools/services/build.js): solo se enlazan.
========================================================= */

'use strict';

const path = require('path');
const pk = require('../providers/pagekit.js');
const { esc, plain, indent, urlOf, SITE, lib, link, section } = pk;
const cfg = require('./data.js');
const services = require('../services/data.js');
const conditions = require('../conditions/data.js');

const svcBy = {}; services.forEach(function (s) { svcBy[s.slug] = s; });
const TEMPLATE = '../treatment-categories/template.html';

cfg.categories.forEach(function (c) {
    c.services.forEach(function (slug) { if (!svcBy[slug]) pk.fail('categoría ' + c.slug + ': el tratamiento "' + slug + '" no existe en tools/services/data.js'); });
});
const grouped = [].concat.apply([], cfg.categories.map(function (c) { return c.services; }));
services.forEach(function (s) { if (grouped.indexOf(s.slug) === -1) pk.fail('el tratamiento "' + s.slug + '" no pertenece a ninguna categoría'); });

const catRoute = (c) => '/services/' + c.slug + '/';
const firstSentence = (t) => t.split(/(?<=\.)\s/)[0];

/* ---------- piezas ---------- */

/* Píldoras de navegación (mismo diseño que las de la Home): la activa lleva aria-current="page" */
function pillNav(activeSlug) {
    const items = cfg.categories.map(function (c) {
        const active = c.slug === activeSlug;
        return '<li><a class="pill-link' + (active ? ' is-current' : '') + '" href="' + catRoute(c) + '"' + (active ? ' aria-current="page"' : '') + '>' +
            esc(c.name) + ' <span class="pill-link__count">' + c.services.length + '<span class="visually-hidden"> treatments</span></span></a></li>';
    }).join('\n');
    return '<ul class="pill-links" aria-label="Treatment groups">\n' + indent(items, 4) + '\n</ul>';
}

/* Tarjeta de tratamiento: la misma .treatment-card de la Home */
function card(s) {
    const badges = (s.checks || []).slice(0, 2).map(function (t) { return '<li class="badge">' + esc(t) + '</li>'; }).join('\n');
    return [
        '<article class="treatment-card">',
        '    <figure class="treatment-card__image">',
        '        <div class="media-placeholder media-placeholder--16x10">',
        '            <img src="' + s.image.src + '" alt="' + esc(s.image.alt) + '" loading="lazy" decoding="async">',
        '        </div>',
        '    </figure>',
        '    <div class="treatment-card__content">',
        '        <h3 class="treatment-card__title">' + esc(s.name) + '</h3>',
        '        <p class="treatment-card__text">' + esc(firstSentence(s.lead)) + '</p>',
        badges ? '        <ul class="badge-list">\n' + indent(badges, 12) + '\n        </ul>' : '',
        '        ' + link('/services/' + s.slug + '/', 'Learn more<span class="visually-hidden"> about ' + esc(s.name) + '</span>' + ' ' + pk.icon('i-arrow').replace('class="icon"', 'class="icon treatment-card__arrow"'), { cls: 'treatment-card__link' }),
        '    </div>',
        '</article>'
    ].filter(Boolean).join('\n');
}

const grid = (list) => '<div class="treatments-grid">\n' + indent(list.map(function (slug) { return card(svcBy[slug]); }).join('\n\n'), 4) + '\n</div>';

/* Condiciones relacionadas: las páginas de condición que listan alguno de estos tratamientos
   (campo `treatments`; si no hay ninguna confirmada se usan las `treatmentsProposed`, marcadas como PROPUESTA) */
function relatedConditions(c) {
    const has = function (arr) { return (arr || []).some(function (t) { return c.services.indexOf(t) !== -1; }); };
    const confirmed = conditions.conditions.filter(function (x) { return has(x.treatments); });
    const proposed = conditions.conditions.filter(function (x) { return !has(x.treatments) && has(x.treatmentsProposed); });
    return { confirmed: confirmed, proposed: proposed };
}

function conditionsBlock(c) {
    const r = relatedConditions(c);
    const all = r.confirmed.concat(r.proposed);
    if (!all.length) return '';
    const pills = all.map(function (x) { return '<li>' + link('/conditions/' + x.slug + '/', esc(x.name), { cls: 'pill-link prov-pill' }) + '</li>'; }).join('\n');
    const note = r.proposed.length
        ? '<!-- PROPUESTA: aprobar texto. ' + r.proposed.length + ' condición(es) vienen de treatmentsProposed (tools/conditions/data.js), no de relaciones confirmadas: ' + r.proposed.map(function (x) { return x.slug; }).join(', ') + ' -->\n'
        : '';
    return note + section('conditions-title', 'Conditions we treat', '<ul class="pill-links prov-pills">\n' + indent(pills, 4) + '\n</ul>', { cloud: true });
}

const faqSection = (faqs, cloud) => section('faq-title', 'Questions? We have answers.', '<div class="faq">\n' + indent(pk.faqHtml(faqs), 4) + '\n</div>', { narrow: true, center: true, cloud: !!cloud });

const locationsSection = () => section('locations-title', 'Book at a location near you', '<div class="service-locations">\n' + indent(pk.locationCards(), 4) + '\n</div>', { sectionId: 'locations', cloud: true });

function hero(o) {
    return pk.listHero({ pill: 'Treatments', h1: o.h1, text: o.intro, primary: ['Book Appointment', '/schedule/'], secondary: o.secondary });
}

/* ---------- JSON-LD ---------- */

function ld(o) {
    const u = urlOf(o.route);
    const graph = [
        { '@type': 'CollectionPage', '@id': u + '#page', url: u, name: o.name, description: plain(o.desc), inLanguage: 'en-US', isPartOf: { '@id': SITE + '/#organization' }, breadcrumb: { '@id': u + '#breadcrumb' }, mainEntity: { '@id': u + '#list' } },
        {
            '@type': 'ItemList', '@id': u + '#list', numberOfItems: o.items.length,
            itemListElement: o.items.map(function (it, i) { return { '@type': 'ListItem', position: i + 1, name: it.name, url: urlOf(it.route) }; })
        },
        Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd(o.crumbs))
    ];
    return { '@context': 'https://schema.org', '@graph': graph };
}

/* ---------- /services/ (índice) ---------- */

function indexMain() {
    const I = cfg.index;
    const blocks = cfg.categories.map(function (c, i) {
        const head = '<h2 class="section-title" id="' + c.slug + '-title">' + link(catRoute(c), esc(c.name), { cls: 'text-link' }) + '</h2>';
        return [
            '<section class="section' + (i % 2 === 0 ? '' : ' section--cloud') + '" id="' + c.slug + '" aria-labelledby="' + c.slug + '-title">',
            '    <div class="container" data-reveal>',
            '        <header class="section-header">',
            '            ' + head,
            '            <p class="section-lead">' + esc(c.intro) + '</p>',
            '        </header>',
            indent(grid(c.services), 8),
            '        <p class="prov-more">' + link(catRoute(c), 'View ' + esc(c.name), { cls: 'btn btn--outline btn--md' }) + '</p>',
            '    </div>',
            '</section>'
        ].join('\n');
    });
    return [
        pk.breadcrumb([['Home', '/'], ['Treatments', I.route]]),
        '',
        '<!-- PROPUESTA: aprobar texto (H1 e intro) -->',
        hero({ h1: esc(I.h1), intro: I.intro, secondary: ['Check your insurance', '/insurance/'] }),
        '',
        section('groups-title', 'Treatment groups', pillNav(null), {}),
        '',
        blocks.join('\n\n'),
        '',
        faqSection(I.faq, true),
        '',
        locationsSection().replace('section section--cloud', 'section'),
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', title: 'Start with an evaluation', primary: '/schedule/' })
    ].join('\n');
}

/* ---------- categoría ---------- */

function categoryMain(c) {
    return [
        pk.breadcrumb([['Home', '/'], ['Treatments', '/services/'], [c.name, catRoute(c)]]),
        '',
        '<!-- PROPUESTA: aprobar texto (H1 e intro) -->',
        hero({ h1: esc(c.h1), intro: c.intro, secondary: ['All treatments', '/services/'] }),
        '',
        section('cards-title', c.name + ' treatments', pillNav(c.slug) + '\n' + grid(c.services), {}),
        '',
        conditionsBlock(c),
        '',
        faqSection(c.faq, false),
        '',
        locationsSection(),
        '',
        lib.render('insurance-band', { depth: 2 }),
        '',
        lib.render('cta-final', { depth: 2, call: '#locations', title: 'Start with an evaluation', primary: '/schedule/' })
    ].join('\n');
}

/* ---------- escritura ---------- */

const I = cfg.index;
pk.writePage({
    route: I.route, depth: 1, template: TEMPLATE, title: I.title, desc: I.desc,
    schemaNote: 'CollectionPage + ItemList (categorías) + BreadcrumbList',
    ld: ld({ route: I.route, name: plain(I.h1), desc: I.desc, items: cfg.categories.map(function (c) { return { name: c.name, route: catRoute(c) }; }), crumbs: [['Home', '/'], ['Treatments', I.route]] }),
    main: indexMain()
});

cfg.categories.forEach(function (c) {
    pk.writePage({
        route: catRoute(c), depth: 2, template: TEMPLATE, title: c.title, desc: c.desc,
        schemaNote: 'CollectionPage + ItemList (tratamientos) + BreadcrumbList',
        ld: ld({ route: catRoute(c), name: plain(c.h1), desc: c.desc, items: c.services.map(function (s) { return { name: svcBy[s].name, route: '/services/' + s + '/' }; }), crumbs: [['Home', '/'], ['Treatments', I.route], [c.name, catRoute(c)]] }),
        main: categoryMain(c)
    });
});

pk.finish('categorías de tratamientos');
