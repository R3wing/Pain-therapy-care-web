/* =========================================================
   Generador de las páginas de sede
   Uso (desde la raíz del proyecto):   node tools/locations/build.js

   - UNA plantilla (template.html) + datos (data.js) → 4 páginas
     en locations/<slug>/index.html
   - Header, sprite, footer, barra móvil, hoja "Call", banda de
     aseguradoras, providers y CTA final salen de los partials de
     tools/shared/ (lib.js), igual que en el resto del sitio.
   - Si un partial no encaja (token sin valor, aria-current sin enlace),
     el script se detiene con un error (no genera HTML roto).
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE = 'https://paintherapycare.com';
const locations = require('./data.js');
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

/* Reemplazo obligatorio: si no hay coincidencia, falla */
function mustReplace(str, search, replacement, label) {
    const hit = typeof search === 'string' ? str.includes(search) : search.test(str);
    if (!hit) fail('Ajuste no aplicado (' + label + ')');
    return str.replace(search, replacement);
}

function indent(text, spaces) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(function (l) { return l ? pad + l : l; }).join('\n');
}

const plain = (s) => s.replace(/&amp;/g, '&');
const addr = (l) => `${l.street}, ${l.city}, ${l.region} ${l.zip}`;
const mapsQuery = (l) => `${l.street} ${l.city} ${l.region} ${l.zip}`.replace(/\s+/g, '+');
const mapsDir = (l) => `https://www.google.com/maps/dir/?api=1&amp;destination=${mapsQuery(l)}`;
const mapsSearch = (l) => `https://www.google.com/maps/search/?api=1&amp;query=${mapsQuery(l)}`;
const url = (l) => `${SITE}/locations/${l.slug}/`;


/* ---------- tratamientos (mismos slugs que el mega menú) ---------- */

const TREATMENTS = [
    { id: 'advanced-technology', title: 'Advanced Technology', items: [
        ['Shockwave', 'shock-wave-therapy', 'MedicalTherapy', 'Shockwave Therapy'],
        ['EMTT', 'emtt-therapy', 'MedicalTherapy', 'EMTT Therapy'],
        ['Laser', 'laser-therapy', 'MedicalTherapy', 'Laser Therapy'],
        ['PIT', 'pit-therapy', 'MedicalTherapy', 'PIT Therapy'],
        ['TECAR', 'tecar-therapy', 'MedicalTherapy', 'TECAR Therapy'],
        ['Cryotherapy', 'cryotherapy', 'MedicalTherapy', 'Cryotherapy']
    ] },
    { id: 'injections', title: 'Injections', items: [
        ['Steroid', 'steroid-injection', 'MedicalProcedure', 'Steroid Injection'],
        ['HA Knee', 'ha-knee-injection', 'MedicalProcedure', 'HA Knee Injection'],
        ['Ultrasound Guided', 'ultrasound-guided-injection', 'MedicalProcedure', 'Ultrasound Guided Injection']
    ] },
    { id: 'rehab-therapy', title: 'Rehab &amp; Therapy', items: [
        ['PT &amp; OT', 'physical-therapy-occupational-therapy', 'PhysicalTherapy', 'Physical Therapy & OT'],
        ['Aqua', 'aqua-therapy', 'PhysicalTherapy', 'Aqua Therapy'],
        ['IMS', 'ims-therapy', 'MedicalTherapy', 'IMS Therapy'],
        ['TMJ', 'tmj-therapy', 'MedicalTherapy', 'TMJ Therapy'],
        ['Pelvic Floor', 'pelvic-floor-therapy', 'PhysicalTherapy', 'Pelvic Floor Therapy']
    ] }
];

function treatmentsHtml(l) {
    return TREATMENTS.map(function (g) {
        const links = g.items.map(function (t) {
            /* Texto corto visible + nombre completo para lectores de pantalla y SEO
               ("Shockwave" → "Shockwave Therapy"; el texto visible queda al inicio) */
            const full = t[3].replace(/&(?!amp;)/g, '&amp;');
            let hidden = '';
            if (full.startsWith(t[0])) hidden = full.slice(t[0].length);
            else hidden = ` (${full})`;
            hidden = hidden ? `<span class="visually-hidden">${hidden}</span>` : '';
            return `<li><a class="pill-link location-pill-link" href="/services/${t[1]}/">${t[0]}${hidden}</a></li>`;
        }).join('\n');
        return [
            '<div class="location-treatments__group">',
            `    <h3 class="location-treatments__title" id="tx-${g.id}">${g.title}</h3>`,
            `    <ul class="location-treatments__list" aria-labelledby="tx-${g.id}">`,
            indent(links, 8),
            '    </ul>',
            '</div>'
        ].join('\n');
    }).join('\n');
}


/* ---------- FAQ (mismo texto en HTML y en JSON-LD) ---------- */

function faqData(l) {
    return [
        {
            q: `Is there parking near the ${l.sede} clinic?`,
            a: '[PARKING]'
        },
        {
            q: l.hasSubway ? 'Which subway or bus lines are closest?' : 'How do I get there by car or bus?',
            a: '[SUBWAY / BUS]'
        },
        {
            q: 'Do you accept Medicare and Medicaid at this location?',
            a: 'Yes. We accept Medicare, Medicaid and most major insurance plans at all four locations.'
        },
        {
            q: 'Can I get a same-day appointment?',
            a: `Same-day appointments may be available. Call ${l.phone} or request online.`,
            html: `Same-day appointments may be available. Call <a href="tel:${l.tel}" aria-label="Call Pain Therapy ${l.sede} at ${l.phone}">${l.phone}</a> or <a href="/schedule/?location=${l.key}">request online</a>.`
        }
    ];
}

function faqHtml(l) {
    return faqData(l).map(function (f, i) {
        return [
            `<details class="faq__item"${i === 0 ? ' open' : ''}>`,
            `    <summary class="faq__question">${f.q}<svg class="icon faq__icon" aria-hidden="true" focusable="false"><use href="#i-chevron"></use></svg></summary>`,
            `    <div class="faq__answer"><p>${f.html || f.a}</p></div>`,
            '</details>'
        ].join('\n');
    }).join('\n');
}


/* ---------- reseñas (marcadores) ---------- */

const STARS = '<svg class="stars" viewBox="0 0 120 24" role="img" aria-label="5 out of 5 stars"><use href="#i-star" width="24" height="24"/><use href="#i-star" x="24" width="24" height="24"/><use href="#i-star" x="48" width="24" height="24"/><use href="#i-star" x="72" width="24" height="24"/><use href="#i-star" x="96" width="24" height="24"/></svg>';

function reviewsHtml(l) {
    return [1, 2, 3].map(function () {
        return [
            '<figure class="review-card">',
            '    ' + STARS,
            `    <blockquote class="review-card__quote"><p>[Review from Google Business Profile — ${l.sede}]</p></blockquote>`,
            '    <figcaption class="review-card__author">[Patient name]</figcaption>',
            '</figure>'
        ].join('\n');
    }).join('\n');
}


/* ---------- otras sedes (tarjeta de sede de la Home) ---------- */

function othersHtml(current) {
    return locations.filter(function (l) { return l !== current; }).map(function (l) {
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


/* ---------- JSON-LD ---------- */

function jsonLd(l) {
    const u = url(l);
    const services = [];
    TREATMENTS.forEach(function (g) {
        g.items.forEach(function (t) {
            services.push({ '@type': t[2], name: t[3], url: `${SITE}/services/${t[1]}/` });
        });
    });

    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'MedicalClinic',
                '@id': u + '#clinic',
                name: l.schemaName,
                url: u,
                telephone: l.schemaTel,
                image: `${SITE}/assets/images/og-${l.slug}.jpg`,
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: l.street,
                    addressLocality: l.city,
                    addressRegion: l.region,
                    postalCode: l.zip,
                    addressCountry: 'US'
                },
                medicalSpecialty: 'PainMedicine',
                openingHoursSpecification: hours.schemaSpec(l),
                availableService: services,
                parentOrganization: { '@id': SITE + '/#organization' }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': u + '#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
                    { '@type': 'ListItem', position: 2, name: 'Locations', item: SITE + '/locations/' },
                    { '@type': 'ListItem', position: 3, name: l.listName, item: u }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': u + '#faq',
                mainEntity: faqData(l).map(function (f) {
                    return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
                })
            }
        ]
    };
    return indent(JSON.stringify(data, null, 4), 4);
}


/* ---------- ajustes por sede sobre los fragmentos de la Home ---------- */

function headerFor(l) {
    return lib.render('header', { mode: 'scrolled', call: '#locations', depth: 2, current: `/locations/${l.slug}/` });
}

function footerFor(l) {
    const f = lib.render('footer', { depth: 2, current: `/locations/${l.slug}/` });
    /* NAP del footer: debe ser idéntico al del hero */
    if (!f.includes(`<address>${addr(l)}<br>`)) fail('El NAP del footer no coincide con data.js: ' + addr(l));
    if (!f.includes(`>${l.phone}</a>`)) fail('El teléfono del footer no coincide: ' + l.phone);
    return f;
}

/* Barra móvil: "Call" llama DIRECTO a la sede (sin abrir la hoja) */
function mobileFor(l) {
    return lib.render('mobile-bar', {
        depth: 2,
        note: 'Barra fija móvil (< 768px): "Call" llama directo a esta sede',
        callTel: 'tel:' + l.tel,
        callLabel: `Call Pain Therapy ${l.sede} at ${l.phone}`,
        book: `/schedule/?location=${l.key}`,
        bookSuffix: `<span class="visually-hidden"> in ${l.sede}</span>`
    });
}

function insuranceBandFor(l) {
    return lib.render('insurance-band', { depth: 2, title: `We accept your insurance in ${l.sede}` });
}

function ctaFor(l) {
    return lib.render('cta-final', {
        depth: 2,
        text: `Book a visit at our ${l.sede} clinic. We'll review your insurance first and help you take the first step toward drug-free relief.`,
        primary: `/schedule/?location=${l.key}`,
        primaryLabel: `Book in ${l.sede}`,
        secondary: [
            `<a class="btn btn--outline-light btn--lg" href="tel:${l.tel}">`,
            '                        <svg class="icon" aria-hidden="true" focusable="false"><use href="#i-phone"></use></svg>',
            `                        <span>Call<span class="visually-hidden"> Pain Therapy ${l.sede} at</span> ${l.phone}</span>`,
            '                    </a>'
        ].join('\n')
    });
}


/* ---------- build ---------- */

/* Providers: solo los <li> (la plantilla ya trae el <ul>) */
const providerItems = lib.render('providers-grid', { depth: 2 })
    .replace(/^<ul class="providers-grid">\s*/, '')
    .replace(/\s*<\/ul>$/, '');

const report = [];

locations.forEach(function (l) {
    const title = `Pain Management in ${l.titleArea} | Pain Therapy Medical Care`;
    const desc = `Pain management at ${addr(l)}: Shockwave, EMTT &amp; Laser Therapy. Medicare &amp; Medicaid accepted. Call ${l.phone}.`;
    if (plain(desc).length > 155) fail(`meta description de ${l.sede} supera 155 caracteres (${plain(desc).length})`);

    const redirect = l.legacyUrl
        ? `\n    <!-- REDIRECCIÓN 301 PENDIENTE: ${l.legacyUrl} → /locations/${l.slug}/\n         Se configura en el servidor / WordPress (Redirection o .htaccess), NO en este HTML. -->`
        : '';

    const tokens = {
        SITE: SITE,
        URL: url(l),
        TITLE: title,
        DESC: desc,
        REDIRECT_NOTE: redirect,
        SLUG: l.slug,
        KEY: l.key,
        SEDE: l.sede,
        LIST_NAME: l.listName,
        SCHEMA_NAME: l.schemaName,
        H1: l.h1,
        KICKER: l.kicker,
        PLACE: l.placeLabel,
        ADDRESS: addr(l),
        FLOOR_NOTE: l.floor ? ` <span class="location-nap__floor">· ${l.floor}</span>` : '',
        HOURS_SUMMARY: hours.summaryHtml(l),
        HOURS_ROWS: indent(hours.tableRows(l), 32),
        PHONE: l.phone,
        TEL: l.tel,
        MAPS_SEARCH: mapsSearch(l),
        MAPS_DIR: mapsDir(l),
        TRANSIT_TITLE: l.hasSubway ? 'Subway &amp; bus' : 'Bus &amp; driving',
        JSONLD: jsonLd(l),
        HEAD_SCRIPTS: lib.render('head-scripts', { depth: 2 }),
        SPRITE: lib.render('sprite', { depth: 2 }),
        HEADER: headerFor(l),
        FOOTER: footerFor(l),
        MOBILE_AND_SHEET: mobileFor(l),
        INSURANCE_BAND: insuranceBandFor(l),
        CTA_FINAL: ctaFor(l),
        PROVIDERS: ' '.repeat(20) + providerItems,
        TREATMENTS: indent(treatmentsHtml(l), 20),
        REVIEWS: indent(reviewsHtml(l), 20),
        FAQ: indent(faqHtml(l), 20),
        OTHERS: indent(othersHtml(l), 20)
    };

    let html = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, function (m, key) {
        if (!(key in tokens)) fail('Token sin valor: ' + key);
        return tokens[key];
    });

    /* Controles de calidad */
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(`${l.sede}: debe haber 1 <h1>, hay ${h1s}`);
    const napCount = html.split(addr(l)).length - 1;
    if (napCount < 2) fail(`${l.sede}: el NAP no aparece en hero y footer`);
    if (!html.includes(`"streetAddress": "${l.street}"`)) fail(`${l.sede}: NAP del schema distinto`);
    const leftover = html.match(/\{\{[A-Z0-9_]+\}\}/);
    if (leftover) fail(`${l.sede}: quedó un token sin reemplazar: ${leftover[0]}`);

    html = html.replace(/\r?\n/g, EOL);
    const outDir = path.join(ROOT, 'locations', l.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    report.push(`  ✓ locations/${l.slug}/index.html  ·  description ${plain(desc).length} car.`);
});

console.log('Páginas de sede generadas:\n' + report.join('\n'));
