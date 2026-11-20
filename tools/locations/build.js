/* =========================================================
   Generador de las páginas de sede
   Uso (desde la raíz del proyecto):   node tools/locations/build.js

   - UNA plantilla (template.html) + datos (data.js) → N páginas (una por sede de data.js)
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
const providers = require('../providers/data.js');

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


/* ---------- sedes con lista de condiciones (en vez de pills de tecnología) ---------- */

function conditionsHtml(l) {
    const groups = l.custom.conditions.map(function (g, i) {
        const links = g.links.map(function (c) {
            return `<li><a class="pill-link location-pill-link" href="/conditions/${c[1]}/">${c[0]}</a></li>`;
        }).join('\n');
        return [
            '<div class="location-treatments__group">',
            `    <h3 class="location-treatments__title" id="cond-${i}">${g.title}</h3>`,
            `    <ul class="location-treatments__list" aria-labelledby="cond-${i}">`,
            indent(links, 8),
            '    </ul>',
            '</div>'
        ].join('\n');
    }).join('\n');
    return groups + '\n' + [
        '<!-- CONFIRMAR CON CLIENTE: qué tratamientos de tecnología (Shockwave, EMTT, Laser…) se ofrecen en esta sede -->',
        '<p class="location-areas__text">[CONFIRM: technology treatments available at this location]</p>'
    ].join('\n');
}

function providerOf(l) {
    const slug = l.custom && l.custom.providerSlug;
    if (!slug) return null;
    const p = providers.filter(function (x) { return x.slug === slug; })[0];
    if (!p) fail(l.sede + ': el provider "' + slug + '" no existe en tools/providers/data.js');
    return p;
}

/* Tarjeta SIN enlace: su página de bio se crea en el Bloque 4 (cuando haya bio) */
function providerHtml(l) {
    const p = providerOf(l);
    const img = p.image || {};
    const photo = img.url
        ? [
            '    <div class="provider-card__photo">',
            `        <img src="${img.url}" alt="${img.alt}" width="${img.width}" height="${img.height}" loading="lazy" decoding="async">`,
            '    </div>'
        ]
        : [
            `    <div class="media-placeholder media-placeholder--1x1" data-media="${img.media}">`,
            `        <span class="media-placeholder__label">IMAGE: ${img.media}.webp · 600×600</span>`,
            '    </div>'
        ];
    return [
        '<!-- CONFIRMAR CON CLIENTE: bio. Sin enlace hasta que exista su página de bio (Bloque 4) -->',
        '<li class="provider-card">'
    ].concat(photo, [
        `    <h3 class="provider-card__name">${p.name}</h3>`,
        `    <p class="provider-card__role">${p.specialty}</p>`,
        '</li>'
    ]).join('\n');
}

/* ---------- FAQ (mismo texto en HTML y en JSON-LD) ---------- */

function faqData(l) {
    if (l.custom && l.custom.faq) return l.custom.faq;
    /* Seguros: mismas aseguradoras en todas las sedes; el número sale de data.js */
    const insuranceAnswer = 'Yes. We accept Medicare, Medicaid and most major insurance plans at all ' + lib.numWord() + ' locations.';
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
            a: insuranceAnswer
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
    /* Sedes con custom.conditions: los tratamientos de tecnología NO están confirmados → sin availableService */
    if (!(l.custom && l.custom.conditions)) {
        TREATMENTS.forEach(function (g) {
            g.items.forEach(function (t) {
                services.push({ '@type': t[2], name: t[3], url: `${SITE}/services/${t[1]}/` });
            });
        });
    }

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
    const clinic = data['@graph'][0];
    const langs = hours.languageCodes(l);
    if (langs.length) clinic.knowsLanguage = langs;
    if (services.length) clinic.availableService = services;
    if (l.openedOn) clinic.foundingDate = l.openedOn;
    if (l.geo) clinic.geo = { '@type': 'GeoCoordinates', latitude: l.geo.lat, longitude: l.geo.lng };
    const prov = providerOf(l);
    if (prov) {
        clinic.employee = { '@id': u + '#physician' };
        const doc = { '@type': 'Physician', '@id': u + '#physician', name: prov.givenName + ' ' + prov.familyName, honorificSuffix: prov.credential };
        if (prov.image && prov.image.url) doc.image = prov.image.url;
        doc.medicalSpecialty = 'PainMedicine';
        doc.worksFor = { '@id': u + '#clinic' };
        doc.workLocation = { '@id': u + '#clinic' };
        data['@graph'].splice(1, 0, doc);
    }
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
    const title = (l.custom && l.custom.insuranceTitle) || `We accept your insurance in ${l.sede}`;
    return lib.render('insurance-band', { depth: 2, title: title });
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
    const c = l.custom || {};
    const desc = c.metaDesc || `Pain management at ${addr(l)}: Shockwave, EMTT &amp; Laser Therapy. Medicare &amp; Medicaid accepted. Call ${l.phone}.`;
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
        HERO_HOURS: c.hoursText || hours.summaryHtml(l),
        HERO_TEXT: c.heroText || 'Drug-free Shockwave, EMTT and Laser Therapy close to home. Medicare, Medicaid and most insurance accepted.',
        NAP_VENUE: l.venue ? `\n                        <p class="location-nap__venue">at ${l.venue}</p>` : '',
        MAP: lib.render('map', { key: l.slug, depth: 2, indent: 20 }),
        BADGE_TEXT: c.badge || 'Same-day appointments',
        GALLERY_CLASS: c.gallery === 'facade+3' ? ' location-gallery--4' : '',
        GALLERY_FACADE: c.gallery === 'facade+3' ? [
            '<li>',
            `    <div class="media-placeholder location-gallery__media" data-media="${l.slug}-facade">`,
            `        <span class="media-placeholder__label">IMAGE: ${l.slug}-facade.webp · 1200×900</span>`,
            `        <!-- <img src="../../assets/images/locations/${l.slug}-facade.webp" alt="Entrance of ${l.venue || 'our clinic'} at ${addr(l)}" width="1200" height="900" loading="lazy" decoding="async"> -->`,
            '    </div>',
            '</li>'
        ].map(function (x, i) { return i ? ' '.repeat(20) + x : x; }).join('\n') + '\n' + ' '.repeat(20) : '',
        TREATMENTS_TITLE: c.treatmentsTitle || `Treatments available in ${l.sede}`,
        CLINICS_WORD: lib.numWord(),
        JSONLD_NOTES: (l.venue ? `NAP: nombre del schema decidido por el cliente (“${l.schemaName}”); el centro “${l.venue}” figura en la línea “at …”.\n        CONFIRMAR: verificar que coincide con el nombre exacto en Google Business Profile.

        ` : ''),
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
        PROVIDERS: ' '.repeat(20) + (c.providerSlug ? indent(providerHtml(l), 20).trimStart() : providerItems),
        TREATMENTS: indent(c.conditions ? conditionsHtml(l) : treatmentsHtml(l), 20),
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
