/* =========================================================
   Generador de /reviews/.
   Uso (desde la raíz):   node tools/reviews/build.js   (lo ejecuta build-all.js)

   - Datos: tools/reviews/data.js (texto LITERAL de paintherapycare.com/reviews/).
   - Reutiliza las piezas de tools/providers/pagekit.js y los partials de tools/shared/.
   - SIN promedio, SIN número de estrellas y SIN schema Review / AggregateRating: solo WebPage + BreadcrumbList.
   - Las bios de /providers/ leen este mismo data.js (filtrado por provider).
========================================================= */

'use strict';

const pk = require('../providers/pagekit.js');
const { esc, indent, urlOf, SITE, lib, link, section, locations, providers } = pk;
const reviews = require('./data.js');

const ROUTE = '/reviews/';
const TITLE = 'Patient Reviews | Pain Therapy Medical Care';
const DESC = 'Read what patients say about Pain Therapy Medical Care in Brooklyn, the Five Towns and Monsey. Reviews are shared by our patients; results may vary.';
const H1 = 'Pain Management Patient Reviews in NYC';
const NOTE = 'Reviews shared by our patients. Individual results may vary.';

const provBy = {}; providers.forEach(function (p) { provBy[p.slug] = p; });
const FILTERS = [['shockwave', 'Shockwave'], ['laser', 'Laser'], ['emtt', 'EMTT'], ['injections', 'Injections']];

reviews.forEach(function (r) {
    if (r.provider && !provBy[r.provider]) pk.fail('reseña ' + r.id + ': provider desconocido "' + r.provider + '"');
    r.treatments.forEach(function (t) { if (!FILTERS.some(function (f) { return f[0] === t; }) && t !== 'cryotherapy') pk.fail('reseña ' + r.id + ': tratamiento desconocido "' + t + '"'); });
});

const count = (key) => reviews.filter(function (r) { return r.treatments.indexOf(key) !== -1; }).length;

/* ---------- filtro (solo con JS: sin JS se ven todas las reseñas) ---------- */
function filterNav() {
    const btns = [['all', 'All', reviews.length]].concat(FILTERS.map(function (f) { return [f[0], f[1], count(f[0])]; })).map(function (f, i) {
        return '<li><button type="button" class="pill-link reviews-filter__btn" data-review-filter="' + f[0] + '" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' +
            esc(f[1]) + ' <span class="pill-link__count">' + f[2] + '<span class="visually-hidden"> reviews</span></span></button></li>';
    }).join('\n');
    return [
        '<div class="reviews-filter" data-reviews-filter>',
        '    <ul class="pill-links" aria-label="Filter reviews by treatment">',
        indent(btns, 8),
        '    </ul>',
        '    <p class="reviews-filter__status" role="status" aria-live="polite" data-reviews-status></p>',
        '</div>'
    ].join('\n');
}

/* ---------- tarjeta ---------- */
function card(r) {
    const paras = r.text.split('\n\n').map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    const prov = r.provider ? ' <span class="badge">' + esc(provBy[r.provider].short) + '</span>' : '';
    return [
        '<li class="reviews-list__item" data-review data-treatments="' + r.treatments.join(' ') + '">',
        '    <figure class="review-card">',
        '        <blockquote class="review-card__quote"' + (r.lang !== 'en' ? ' lang="' + r.lang + '"' : '') + '>' + paras + '</blockquote>',
        '        <figcaption class="review-card__author">' + esc(r.name) + prov + '</figcaption>',
        '    </figure>',
        '</li>'
    ].join('\n');
}

/* ---------- "Leave us a review": un botón por sede hacia su ficha de Google (enlaces pendientes) ---------- */
function leaveReview() {
    const btns = locations.map(function (l) {
        return '<li><span class="btn btn--outline btn--md is-pending" data-pending-link="#google-review-' + l.key + '">Review our ' + esc(l.sede) + ' office<span class="visually-hidden"> on Google</span></span></li>';
    }).join('\n');
    return [
        '<!-- CONFIRMAR CON CLIENTE: enlace de reseñas de Google Business Profile de cada sede (pendientes #11 y #16). Mientras no existan, el botón es texto (data-pending-link). -->',
        '<ul class="reviews-leave" aria-label="Leave a review on Google">',
        indent(btns, 4),
        '</ul>'
    ].join('\n');
}

function clinics() {
    return [
        '<div class="prov-clinics">',
        '    <div class="prov-clinics__map">',
        indent(lib.render('map', { key: 'all' }), 8),
        '    </div>',
        '    <div class="service-locations prov-clinics__cards">',
        indent(pk.locationCards({ map: true }), 8),
        '    </div>',
        '</div>'
    ].join('\n');
}

function main() {
    return [
        pk.breadcrumb([['Home', '/'], ['Reviews', ROUTE]]),
        '',
        pk.listHero({ pill: 'Reviews', h1: esc(H1), text: NOTE, primary: ['Book Appointment', '/schedule/'] }),
        '',
        section('reviews-title', 'What our patients say', filterNav() + '\n<ul class="reviews-list" data-reviews-list>\n' + indent(reviews.map(card).join('\n'), 4) + '\n</ul>', {}),
        '',
        section('leave-title', 'Leave us a review', '<p class="section-lead">Your feedback helps other patients find the care they need.</p>\n' + leaveReview(), { cloud: true, center: true }),
        '',
        section('clinics-title', 'Our locations', clinics(), { sectionId: 'locations' }),
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', title: 'Start with an evaluation', primary: '/schedule/' })
    ].join('\n');
}

const u = urlOf(ROUTE);
pk.writePage({
    route: ROUTE, depth: 1, template: '../reviews/template.html', title: TITLE, desc: DESC,
    scripts: ['locations-data.js', 'map.js', 'reviews.js'],
    schemaNote: 'WebPage + BreadcrumbList. Sin Review ni AggregateRating',
    ld: {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'WebPage', '@id': u + '#page', url: u, name: TITLE, description: DESC, inLanguage: 'en-US', isPartOf: { '@id': SITE + '/#organization' }, breadcrumb: { '@id': u + '#breadcrumb' } },
            Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd([['Home', '/'], ['Reviews', ROUTE]]))
        ]
    },
    main: main()
});

pk.finish('Reviews');
