/* =========================================================
   Librería de partials compartidos (tools/shared/*.html)

   Dos formas de usarlos:
   1) Desde un generador:      lib.render('header', { mode: 'scrolled', depth: 2 })
   2) En páginas hechas a mano, con marcadores que build-all.js rellena:

        <!-- @partial header mode=solid current=/insurance/ call=/locations/ -->
        <!-- @end header -->

   Partials: sprite · sprite-forms · header · header-minimal · footer ·
             mobile-bar · cta-final · insurance-band · insurers-grid ·
             providers-grid · call-list · hours · offices · head-scripts ·
             home-locations · schedule-options · insurance-locations ·
             contact-locations · map
   map: <div class="map" data-map="all|<slug>"> con su fallback (lista + "Open in Google Maps").
        <!-- @partial map key=all indent=16 --> · lo activa assets/js/map.js (Leaflet autoalojado).
   Las listas de sedes (menú Locations ▾, Call ▾, hoja Call, footer, tarjetas de la
   Home, radios de /schedule/, <select> de /insurance/, contacto de Terms) se
   GENERAN desde tools/locations/data.js: no se editan a mano.
   header-minimal: logo + "Questions? Call ▾" (schedule). Sin opciones.
   call-list / insurers-grid: indent = sangría de las líneas 2+

   Opciones comunes
     depth     profundidad de la página (0 = raíz, 2 = /locations/x/);
               ajusta las rutas relativas de assets/. En marcadores se
               calcula solo a partir de la ruta del archivo.
   header
     mode      top (transparente, solo Home) · solid · scrolled
     current   href(s) con aria-current="page", separados por coma
     call      destino sin JS de "Call a location" (#locations en la Home,
               /locations/ en el resto)
   footer      current
   mobile-bar  call · callTel + callLabel (llamada directa) ·
               book · bookSuffix
   cta-final   title · text · primary · primaryLabel · secondary (html)
   insurance-band  title
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const hours = require('./hours.js');

const DIR = __dirname;
const SITE = 'https://paintherapycare.com';

function read(name) {
    return fs.readFileSync(path.join(DIR, name + '.html'), 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

/* Sangra las líneas 2+ (la 1.ª ya queda en la posición del marcador) */
function indent(str, n) {
    return str.split('\n').map(function (l, i) { return i && l ? ' '.repeat(n) + l : l; }).join('\n');
}

function fill(str, tokens, name) {
    /* {{X_BLOCK}} solo en su línea: las líneas 2+ del valor heredan la sangría del token */
    str = str.replace(/^([ \t]*)\{\{([A-Z0-9_]+_BLOCK)\}\}[ \t]*$/gm, function (m, ind, key) {
        if (!(key in tokens)) throw new Error('Partial "' + name + '": token sin valor ' + key);
        return tokens[key].split('\n').map(function (l) { return l ? ind + l : l; }).join('\n');
    });
    return str.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) throw new Error('Partial "' + name + '": token sin valor ' + key);
        return tokens[key];
    });
}

/* assets/… → ../../assets/… según la profundidad de la página */
function fixPaths(html, depth) {
    const prefix = '../'.repeat(depth || 0);
    return prefix ? html.replace(/(src|href)="assets\//g, '$1="' + prefix + 'assets/') : html;
}

/* aria-current="page" en los enlaces cuyo href coincide exactamente */
function setCurrent(html, hrefs, name) {
    String(hrefs).split(',').map(function (h) { return h.trim(); }).filter(Boolean).forEach(function (href) {
        const esc = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp('(<a\\b[^>]*?\\bhref="' + esc + '")(?![^>]*aria-current)', 'g');
        if (!re.test(html)) throw new Error('Partial "' + name + '": no hay enlace con href="' + href + '" para aria-current');
        html = html.replace(re, '$1 aria-current="page"');
    });
    return html;
}

/* ---------- listas de sedes (fuente: tools/locations/data.js) ---------- */

const locs = function () { return require('../locations/data.js'); };
const svgIcon = function (id) { return '<svg class="icon" aria-hidden="true" focusable="false"><use href="#' + id + '"></use></svg>'; };
const mapsQuery = function (l) { return (l.street + ' ' + l.city + ' ' + l.region + ' ' + l.zip).replace(/\s+/g, '+'); };
const mapsDir = function (l) { return 'https://www.google.com/maps/dir/?api=1&amp;destination=' + mapsQuery(l); };
const mapsSearch = function (l) { return 'https://www.google.com/maps/search/?api=1&amp;query=' + mapsQuery(l); };
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const numWord = function () { return NUM_WORDS[locs().length] || String(locs().length); };

const navLocationItems = function () {
    return locs().map(function (l) {
        return '<li><a href="/locations/' + l.slug + '/"><strong>' + l.listName + '</strong><span>' + l.shortAddr + '</span></a></li>';
    }).join('\n');
};

const callItems = function () {
    return locs().map(function (l) {
        return '<li><a class="call-list__link" href="tel:' + l.tel + '"><span class="call-list__name">' + l.listName + '</span><span class="call-list__address">' + l.shortAddr + '</span><span class="call-list__phone">' + l.phone + '</span></a></li>';
    }).join('\n');
};

const callListHtml = function () {
    return '<ul class="call-list">\n' + callItems().split('\n').map(function (x) { return '    ' + x; }).join('\n') + '\n</ul>';
};

const footerLocations = function () {
    return locs().map(function (l) {
        return [
            '<li>',
            '    <a class="site-footer__loc-name" href="/locations/' + l.slug + '/">' + l.listName + '</a>',
            '    <address>' + l.street + ', ' + l.city + ', ' + l.region + ' ' + l.zip + '<br><a href="tel:' + l.tel + '">' + l.phone + '</a></address>',
            '</li>'
        ].join('\n');
    }).join('\n');
};

const PHONE_ICON = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-phone"></use></svg>';

const HEADER_MODES = {
    top: {
        cls: 'site-header is-top', attrs: '',
        note: 'Estados: .is-top (A, transparente) / .is-scrolled (B, blanco)'
    },
    solid: {
        cls: 'site-header', attrs: ' data-header-solid',
        note: 'Página interna: [data-header-solid] → siempre sólido (sin estado A transparente)'
    },
    scrolled: {
        cls: 'site-header is-scrolled', attrs: ' data-header-solid data-header-scrolled',
        note: 'Página interna: .is-scrolled fijo ([data-header-scrolled] en main.js)'
    }
};

const RENDER = {
    sprite: function () { return read('sprite'); },

    header: function (o) {
        const m = HEADER_MODES[o.mode || 'scrolled'];
        if (!m) throw new Error('header: mode desconocido ' + o.mode);
        let h = fill(read('header'), {
            HEADER_NOTE: m.note, HEADER_CLASS: m.cls, HEADER_ATTRS: m.attrs,
            CALL_FALLBACK: o.call || '/locations/',
            NAV_COLS: String(locs().length),
            NAV_LOCATIONS_BLOCK: navLocationItems(),
            CALL_ITEMS_BLOCK: callItems()
        }, 'header');
        return o.current ? setCurrent(h, o.current, 'header') : h;
    },

    footer: function (o) {
        const f = fill(read('footer'), { FOOTER_LOCATIONS_BLOCK: footerLocations() }, 'footer');
        return o.current ? setCurrent(f, o.current, 'footer') : f;
    },

    'mobile-bar': function (o) {
        const callAttrs = o.callTel
            ? 'href="' + o.callTel + '"' + (o.callLabel ? ' aria-label="' + o.callLabel + '"' : '')
            : 'href="' + (o.call || '/locations/') + '" data-call-sheet-open';
        let m = fill(read('mobile-bar'), {
            MOBILE_CALL_ATTRS: callAttrs,
            BOOK_HREF: o.book || '/schedule/',
            BOOK_SUFFIX: o.bookSuffix || '',
            CALL_ITEMS_BLOCK: callItems()
        }, 'mobile-bar');
        return (o.note ? '<!-- ' + o.note + ' -->\n    ' : '') + m;
    },

    'cta-final': function (o) {
        const secondary = o.secondary || [
            '<a class="btn btn--outline-light btn--lg" href="' + (o.call || '/locations/') + '" data-call-sheet-open>',
            '                        ' + PHONE_ICON,
            '                        Call a location',
            '                    </a>'
        ].join('\n');
        return fill(read('cta-final'), {
            CTA_TITLE: o.title || 'Ready to move with less pain?',
            CTA_TEXT: o.text || 'Book a visit at one of our ' + locs().length + ' New York locations. We\'ll review your insurance and help you take the first step toward drug-free relief.',
            CTA_PRIMARY_HREF: o.primary || '/schedule/',
            CTA_PRIMARY_LABEL: o.primaryLabel || 'Request Appointment',
            CTA_SECONDARY: secondary
        }, 'cta-final');
    },

    'insurance-band': function (o) {
        return fill(read('insurance-band'), {
            INS_TITLE: o.title || 'Medicare, Medicaid &amp; most major insurance accepted'
        }, 'insurance-band');
    },

    'providers-grid': function () { return read('providers-grid'); },

    /* Teléfonos de todas las sedes (.call-list), generados desde data.js. indent = sangría de las líneas 2+ */
    'call-list': function (o) { return indent(callListHtml(), o.indent || 0); },

    /* Solo la <ul class="insurers__grid"> de la banda (para tarjetas laterales) */
    'insurers-grid': function (o) {
        const band = read('insurance-band');
        const a = band.indexOf('<ul class="insurers__grid">');
        const b = band.indexOf('</ul>', a) + 5;
        if (a < 0 || b < 5) throw new Error('insurers-grid: no hay <ul class="insurers__grid"> en insurance-band.html');
        return indent(band.slice(a, b), o.indent || 0);
    },

    /* Íconos extra de formularios: i-search, i-lock, i-alert */
    'sprite-forms': function () { return read('sprite-forms'); },

    /* Header de conversión: logo + "Questions? Call ▾" (sin menú) */
    'header-minimal': function () {
        return fill(read('header-minimal'), { CALL_LIST: indent(callListHtml(), 28) }, 'header-minimal');
    },

    /* Horario resumido de una sede (texto inline): <!-- @partial hours key=williamsburg --> */
    hours: function (o) {
        const loc = require('../locations/data.js').filter(function (l) { return l.key === o.key; })[0];
        if (!loc) throw new Error('hours: sede desconocida "' + o.key + '"');
        hours.check(loc);
        return hours.summaryHtml(loc);
    },

    /* Tarjetas ampliadas de todas las sedes (/new-patients/). TODO sale de
       tools/locations/data.js: dirección, teléfono, horario, idiomas y enlaces.
       <!-- @partial offices indent=24 --> */
    offices: function (o) {
        const locs = require('../locations/data.js');
        const icon = function (id) { return '<svg class="icon" aria-hidden="true" focusable="false"><use href="#' + id + '"></use></svg>'; };
        const cards = locs.map(function (l) {
            hours.check(l);
            const rows = hours.groups(l).map(function (g) {
                return '<div><dt>' + g.label + '</dt><dd>' + g.range + '</dd></div>';
            });
            const closed = hours.closedLabel(l);
            if (closed) rows.push('<div><dt>' + closed + '</dt><dd>Closed</dd></div>');
            return [
                '<li>',
                '    <article class="location-card np-office">',
                '        <h3 class="location-card__name">' + l.listName + '</h3>',
                '        <address class="location-card__details">',
                '            <p class="location-card__row">' + icon('i-pin') + '<span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
                l.floor ? '            <p class="np-office__note">' + l.floor + '</p>' : '',
                '        </address>',
                '        <p class="np-office__phone"><a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + icon('i-phone') + l.phone + '</a></p>',
                '        <dl class="np-hours">',
                rows.map(function (r) { return '            ' + r; }).join('\n'),
                '        </dl>',
                '        <ul class="badge-list np-office__languages" aria-label="Languages spoken at ' + l.sede + '">',
                (l.languages.length ? l.languages.map(function (lang) { return '            <li class="badge">' + lang + '</li>'; }) : ['            <!-- CONFIRMAR CON CLIENTE: idiomas de ' + l.sede + ' --><li class="badge">[CONFIRM: languages spoken]</li>']).join('\n'),
                '        </ul>',
                '        <div class="location-card__actions">',
                '            <a class="btn btn--outline btn--md" href="/locations/' + l.slug + '/">Directions and details<span class="visually-hidden"> for ' + l.sede + '</span></a>',
                '            <a class="btn btn--primary btn--md" href="/schedule/?location=' + l.key + '">Book here<span class="visually-hidden"> in ' + l.sede + '</span></a>',
                '        </div>',
                '    </article>',
                '</li>'
            ].filter(Boolean).join('\n');
        });
        return indent(cards.join('\n'), o.indent || 0);
    },

    /* Tarjetas de sede de la Home (dentro de <div class="locations">, antes del mapa) */
    'home-locations': function (o) {
        const cards = locs().map(function (l) {
            hours.check(l);
            return [
                '<article class="location-card" data-map-card="' + l.key + '">',
                '    <h3 class="location-card__name"><a href="/locations/' + l.slug + '/">' + l.listName + '</a></h3>',
                '    <address class="location-card__details">',
                '        <p class="location-card__row">' + svgIcon('i-pin') + '<span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
                '        <p class="location-card__row">' + svgIcon('i-phone') + '<a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + l.phone + '</a></p>',
                '    </address>',
                '    <p class="location-card__row">' + svgIcon('i-clock') + '<span>' + hours.summaryHtml(l) + '</span></p>',
                '    <div class="location-card__actions">',
                '        <a class="btn btn--primary btn--md" href="/schedule/?location=' + l.key + '">Book here<span class="visually-hidden"> at ' + l.sede + '</span></a>',
                '        <a class="btn btn--outline btn--md" href="' + mapsDir(l) + '" target="_blank" rel="noopener">Directions<span class="visually-hidden"> to ' + l.sede + ' (opens in a new tab)</span></a>',
                '    </div>',
                '</article>'
            ].join('\n');
        });
        return indent(cards.join('\n\n'), o.indent || 0);
    },

    /* Radios "Which location?" de /schedule/ (<li> dentro de <ul class="schedule-options">) */
    'schedule-options': function (o) {
        const items = locs().map(function (l) {
            return [
                '<li>',
                '    <label class="schedule-option schedule-option--radio">',
                '        <input class="schedule-option__input" type="radio" name="location" value="' + l.key + '" required>',
                '        <span class="schedule-option__box">',
                '            <span class="schedule-option__mark" aria-hidden="true">' + svgIcon('i-check') + '</span>',
                '            <span class="schedule-option__text">' + l.listName + '<span class="schedule-option__sub">' + l.street + ', ' + l.city + '</span></span>',
                '        </span>',
                '    </label>',
                '</li>'
            ].join('\n');
        });
        return indent(items.join('\n'), o.indent || 0);
    },

    /* <option> de sede para /insurance/ */
    'insurance-locations': function (o) {
        const opts = locs().map(function (l) {
            return '<option value="' + l.key + '">' + l.listName + ' — ' + l.shortAddr + '</option>';
        });
        return indent('<option value="">No preference</option>\n' + opts.join('\n'), o.indent || 0);
    },

    /* Bloque de contacto de /terms-and-conditions/ (<li> dentro de .legal-contact__grid) */
    'contact-locations': function (o) {
        const items = locs().map(function (l) {
            return [
                '<li>',
                '    <article class="location-card">',
                '        <h3 class="location-card__name">' + l.listName + '</h3>',
                '        <address class="location-card__details">',
                '            <p class="location-card__row">' + svgIcon('i-pin') + '<span>' + l.street + '<br>' + l.city + ', ' + l.region + ' ' + l.zip + '</span></p>',
                '            <p class="location-card__row">' + svgIcon('i-phone') + '<a href="tel:' + l.tel + '" aria-label="Call Pain Therapy ' + l.sede + ' at ' + l.phone + '">' + l.phone + '</a></p>',
                '        </address>',
                '    </article>',
                '</li>'
            ].join('\n');
        });
        return indent(items.join('\n'), o.indent || 0);
    },

    /* Mapa (Leaflet) de una sede o de todas. El fallback sin JS / si falla es la lista de sedes
       con enlaces "Open in Google Maps". key = 'all' | slug de la sede. */
    map: function (o) {
        const all = locs();
        const isAll = !o.key || o.key === 'all';
        const list = isAll ? all : all.filter(function (l) { return l.slug === o.key; });
        if (!list.length) throw new Error('map: sede desconocida "' + o.key + '"');
        const label = isAll ? 'Map of our ' + all.length + ' locations' : 'Map to Pain Therapy ' + list[0].sede;
        const items = list.map(function (l) {
            return [
                '<li>',
                '    <a href="/locations/' + l.slug + '/">' + l.listName + '</a> · ' + l.street + ', ' + l.city + ', ' + l.region + ' ' + l.zip + ' ·',
                '    <a href="' + mapsSearch(l) + '" target="_blank" rel="noopener">Open in Google Maps<span class="visually-hidden"> — ' + l.sede + ' (opens in a new tab)</span></a>',
                '</li>'
            ].join('\n');
        });
        const html = [
            '<div class="map" data-map="' + (isAll ? 'all' : list[0].slug) + '" role="region" aria-label="' + label + '">',
            '    <div class="map__fallback">',
            '        <ul class="map__fallback-list">',
            '            ' + indent(items.join('\n'), 12),
            '        </ul>',
            '    </div>',
            '</div>'
        ].join('\n');
        return indent(html, o.indent || 0);
    },

    /* <head>: GTM comentado + analytics.js */
    'head-scripts': function () { return read('head-scripts'); }
};

function render(name, opts) {
    if (!RENDER[name]) throw new Error('Partial desconocido: ' + name);
    opts = opts || {};
    return fixPaths(RENDER[name](opts), opts.depth);
}

/* Marcadores en páginas hechas a mano */
function parseOpts(str) {
    const o = {};
    str.replace(/(\w+)=(?:"([^"]*)"|(\S+))/g, function (m, k, q, v) { o[k] = q !== undefined ? q : v; return m; });
    return o;
}

function inject(html, depth) {
    const re = /^([ \t]*)<!-- @partial ([\w-]+)([^>]*?)-->[\s\S]*?<!-- @end \2 -->/gm;
    return html.replace(re, function (m, indent, name, optStr) {
        const opts = parseOpts(optStr);
        opts.depth = depth;
        const body = render(name, opts);
        return indent + '<!-- @partial ' + name + optStr.replace(/\s+$/, '') + ' -->\n' +
            indent + body + '\n' +
            indent + '<!-- @end ' + name + ' -->';
    });
}

module.exports = { SITE, render, inject, fixPaths, numWord };
