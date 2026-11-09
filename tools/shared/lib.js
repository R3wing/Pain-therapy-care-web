/* =========================================================
   Librería de partials compartidos (tools/shared/*.html)

   Dos formas de usarlos:
   1) Desde un generador:      lib.render('header', { mode: 'scrolled', depth: 2 })
   2) En páginas hechas a mano, con marcadores que build-all.js rellena:

        <!-- @partial header mode=solid current=/insurance/ call=/locations/ -->
        <!-- @end header -->

   Partials: sprite · sprite-forms · header · header-minimal · footer ·
             mobile-bar · cta-final · insurance-band · insurers-grid ·
             providers-grid · call-list · head-scripts
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
            CALL_FALLBACK: o.call || '/locations/'
        }, 'header');
        return o.current ? setCurrent(h, o.current, 'header') : h;
    },

    footer: function (o) {
        const f = read('footer');
        return o.current ? setCurrent(f, o.current, 'footer') : f;
    },

    'mobile-bar': function (o) {
        const callAttrs = o.callTel
            ? 'href="' + o.callTel + '"' + (o.callLabel ? ' aria-label="' + o.callLabel + '"' : '')
            : 'href="' + (o.call || '/locations/') + '" data-call-sheet-open';
        let m = fill(read('mobile-bar'), {
            MOBILE_CALL_ATTRS: callAttrs,
            BOOK_HREF: o.book || '/schedule/',
            BOOK_SUFFIX: o.bookSuffix || ''
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
            CTA_TEXT: o.text || 'Book a visit at one of our 4 New York locations. We\'ll review your insurance and help you take the first step toward drug-free relief.',
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

    /* Teléfonos de las 4 sedes (.call-list). indent = sangría de las líneas 2+ */
    'call-list': function (o) { return indent(read('call-list'), o.indent || 0); },

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
        return fill(read('header-minimal'), { CALL_LIST: indent(read('call-list'), 28) }, 'header-minimal');
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

module.exports = { SITE, render, inject, fixPaths };
