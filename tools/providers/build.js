/* =========================================================
   Generador de /providers/ (índice) y /providers/<slug>/ (bios)
   Uso (desde la raíz del proyecto):   node tools/providers/build.js
   (build-all.js lo ejecuta solo: descubre tools/<sección>/build.js)

   Genera desde tools/providers/data.js + template-index.html / template-bio.html:
     providers/index.html                 índice con filtros (assets/js/providers.js)
     providers/<slug>/index.html          una bio por provider ACTIVO con bio (hasBio en pagekit.js)

   - Naveen Sharma ('joining-soon'): sin bio. Al pasar su status a 'active' (o quitar el campo)
     y rellenar headline + bio[] en data.js, su página se genera sola en el siguiente build.
   - Header, footer, banda de aseguradoras y CTA final salen de tools/shared (lib.js).
   - Sedes y horarios: SOLO LECTURA de tools/locations/data.js.
   - Piezas comunes (enlaces seguros, tarjetas, escritura con validaciones): pagekit.js.
========================================================= */

'use strict';

const pk = require('./pagekit.js');
const { esc, plain, indent, urlOf, SITE, lib, link, section, locations, providers, bios } = pk;

const INDEX_TITLE = 'Our Pain Management Providers in Brooklyn NY';           // title de la web en vivo
const INDEX_DESC = 'Meet the Pain Therapy Care team, providers offering non-surgical pain management in Brooklyn and the Five Towns. Most insurance and Medicaid accepted.';   // meta de la web en vivo

const ORG = { '@id': SITE + '/#organization' };
const clinicId = (l) => ({ '@id': SITE + '/locations/' + l.slug + '/#clinic' });

/* Metas de las bios: las de la web en vivo (title y description) · Oyeniran: nueva */
const META = {
    'henry-sardar-md': {
        title: 'Dr. Henry Sardar, DO | Pain Management, Brooklyn',
        desc: 'Dr. Henry Sardar, DO, provides non-surgical pain care at Pain Therapy Care, Brooklyn and the Five Towns. Most insurance and Medicaid accepted.'
    },
    'lee-trosterman-md': {
        title: 'Dr. Lee Trosterman, MD | Pain Management, Brooklyn',
        desc: 'Dr. Lee Trosterman, MD, provides non-surgical pain care at Pain Therapy Care, Brooklyn and the Five Towns. Most insurance and Medicaid accepted.'
    },
    'jason-hernandez-md': {
        title: 'Dr. Jason Hernandez, MD | Pain Management, Brooklyn',
        desc: 'Dr. Jason Hernandez, MD, provides non-surgical pain care at Pain Therapy Care, Brooklyn and the Five Towns. Most insurance and Medicaid accepted.'
    },
    'michelle-abraham-pa-c': {
        title: 'Michelle Abraham, PA-C | Pain Management, Brooklyn',
        desc: 'Michelle Abraham, PA-C, provides non-surgical pain care at Pain Therapy Care, Brooklyn and the Five Towns. Most insurance and Medicaid accepted.'
    },
    'olutimilehin-oyeniran-md': {
        title: 'Dr. Olutimilehin Oyeniran, MD | Pain Management',
        desc: 'Dr. Olutimilehin Oyeniran, MD, provides non-surgical pain care in Crown Heights, Brooklyn. Medicare, Medicaid and most insurance plans accepted.'
    }
};
function metaOf(p) {
    return META[p.slug] || {
        title: 'Dr. ' + p.name.replace(/,.*$/, '') + ', ' + p.credential + ' | Pain Management',
        desc: p.name + ' provides non-surgical pain care at Pain Therapy Medical Care. Medicare, Medicaid and most insurance plans accepted.'
    };
}


/* =========================================================
   ÍNDICE
========================================================= */

function filtersHtml() {
    const opts = locations.map(function (l) { return '<option value="' + l.key + '">' + esc(l.listName) + '</option>'; }).join('\n');
    return [
        '<div class="prov-filters" data-prov-filters>',
        '    <div class="prov-filters__field">',
        '        <label class="prov-filters__label" for="filter-location">Location</label>',
        '        <select class="prov-filters__select" id="filter-location" data-prov-filter="loc">',
        '            <option value="">All locations</option>',
        indent(opts, 12),
        '        </select>',
        '    </div>',
        '    <div class="prov-filters__field">',
        '        <label class="prov-filters__label" for="filter-type">Provider type</label>',
        '        <select class="prov-filters__select" id="filter-type" data-prov-filter="type">',
        '            <option value="">All provider types</option>',
        '            <option value="physician">Physicians (MD/DO)</option>',
        '            <option value="pa">Physician Assistants</option>',
        '        </select>',
        '    </div>',
        '    <button type="button" class="btn btn--outline btn--md prov-filters__clear" data-prov-clear hidden>Clear filters</button>',
        '</div>',
        '<p class="prov-status" role="status" aria-live="polite" data-prov-status></p>'
    ].join('\n');
}

function indexMain() {
    const all = providers;                    // los 6 (5 activos + Naveen "Joining soon")
    const cards = all.map(function (p) { return pk.providerCard(p, { level: 2 }); }).join('\n');
    const grid = [
        filtersHtml(),
        '<ul class="prov-grid" data-prov-grid>',
        indent(cards, 4),
        '</ul>',
        '<div class="prov-empty" data-prov-empty hidden>',
        '    <p class="prov-empty__text">No providers match these filters. Try another location or provider type, or call us and we will help you find the right provider.</p>',
        '    <a class="btn btn--primary btn--lg" href="#locations" data-call-sheet-open>',
        '        ' + pk.ICON_PHONE,
        '        Call a location',
        '    </a>',
        '</div>'
    ].join('\n');

    return [
        pk.breadcrumb([['Home', '/'], ['About Us', '/about-us/'], ['Providers', '/providers/']]),
        '',
        pk.listHero({
            pill: 'Providers',
            h1: 'Pain Management Providers in NYC',
            text: 'Physicians and physician assistants who take time to listen, with drug-free care covered by Medicare, Medicaid and most insurance plans.',
            primary: ['Book an evaluation', '/schedule/']
        }),
        '',
        '<!-- Filtros: sin JS se ven todos los providers (el bloque de filtros queda oculto) -->',
        section('team-title', 'Meet our team', grid, { lead: 'Choose a provider to read their biography, or filter by location and provider type.' }),
        '',
        section('trust-title', 'Care you can trust', pk.featureCards(pk.VALUES), { cloud: true, center: true }),
        '',
        '<section class="section" id="locations" aria-labelledby="locations-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="locations-title">Our ' + lib.numWord() + ' locations</h2>',
        '        </header>',
        '        <div class="service-locations">',
        indent(pk.locationCards(), 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', title: 'Start Your Journey to a Pain-Free Life', primary: '/schedule/' })
    ].join('\n');
}

function indexLd() {
    const u = urlOf('/providers/');
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': u + '#page',
                url: u,
                name: INDEX_TITLE,
                description: INDEX_DESC,
                inLanguage: 'en-US',
                isPartOf: { '@id': SITE + '/#organization' },
                breadcrumb: { '@id': u + '#breadcrumb' },
                mainEntity: { '@id': u + '#list' }
            },
            {
                '@type': 'ItemList',
                '@id': u + '#list',
                numberOfItems: bios.length,
                itemListElement: bios.map(function (p, i) {
                    return { '@type': 'ListItem', position: i + 1, url: urlOf(pk.bioRoute(p)), name: p.name };
                })
            },
            Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd([['Home', '/'], ['About Us', '/about-us/'], ['Providers', '/providers/']]))
        ]
    };
}


/* =========================================================
   BIOS
========================================================= */

function bioHero(p) {
    const places = pk.sedes(p).map(function (l) { return link('/locations/' + l.slug + '/', esc(l.listName), { cls: 'text-link' }); }).join(', ');
    return [
        '<section class="service-hero prov-hero prov-hero--bio" aria-labelledby="hero-title">',
        '    <svg class="arcs prov-hero__arcs" aria-hidden="true" focusable="false"><use href="#i-arcs"></use></svg>',
        '    <div class="container prov-bio-hero">',
        '        <div class="prov-bio-hero__photo">' + pk.photo(p, { hero: true }) + '</div>',
        '        <div class="prov-bio-hero__text">',
        '            <p class="pill service-pill">Provider</p>',
        '            <h1 class="service-hero__title" id="hero-title">' + esc(p.name) + '</h1>',
        '            <p class="prov-bio-hero__headline">' + esc(p.headline) + '</p>',
        (p.certifications || []).length
            ? '            <ul class="badge-list" aria-label="Certifications">\n' + indent((p.certifications).map(function (c) { return '<li class="badge">' + esc(c) + '</li>'; }).join('\n'), 16) + '\n            </ul>'
            : '',
        '            <p class="prov-bio-hero__sees"><span class="prov-bio-hero__sees-label">Sees patients in:</span> ' + places + '</p>',
        '            <div class="btn-group">',
        '                <a class="btn btn--primary btn--lg" href="/schedule/?provider=' + p.slug + '">' + esc(p.bookLabel) + '</a>',
        '                <a class="btn btn--outline btn--lg" href="#locations" data-call-sheet-open>',
        '                    ' + pk.ICON_PHONE,
        '                    Call<span class="visually-hidden"> a location</span>',
        '                    ' + pk.icon('i-chevron'),
        '                </a>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</section>'
    ].filter(Boolean).join('\n');
}

/* Formación: <dl> solo si hay datos en vivo */
function trainingDl(p) {
    const rows = [['Education', p.education], ['Internship', p.internship], ['Residency', p.residency], ['Fellowship', p.fellowship], ['Certification', p.certification], ['Languages', p.languages]]
        .filter(function (r) { return r[1] && (!Array.isArray(r[1]) || r[1].length); });
    if (!rows.length) return '';
    return '<dl class="prov-dl">\n' + indent(rows.map(function (r) {
        return '<div class="prov-dl__row"><dt>' + r[0] + '</dt><dd>' + (Array.isArray(r[1]) ? (r[0] === 'Languages' ? esc(r[1].join(', ')) : r[1].map(esc).join('<br>')) : esc(r[1])) + '</dd></div>';
    }).join('\n'), 4) + '\n</dl>';
}

function reviewsBlock(p) {
    const stars = '<svg class="stars" viewBox="0 0 120 24" role="img" aria-label="5 out of 5 stars"><use href="#i-star" width="24" height="24"/><use href="#i-star" x="24" width="24" height="24"/><use href="#i-star" x="48" width="24" height="24"/><use href="#i-star" x="72" width="24" height="24"/><use href="#i-star" x="96" width="24" height="24"/></svg>';
    return '<div class="prov-reviews">\n' + indent(p.reviews.map(function (r) {
        return [
            '<figure class="review-card">',
            '    ' + stars,
            '    <blockquote class="review-card__quote"><p>“' + esc(r.quote) + '”</p></blockquote>',
            '    <figcaption class="review-card__author">' + esc(r.author) + '</figcaption>',
            '</figure>'
        ].join('\n');
    }).join('\n'), 4) + '\n</div>';
}

function carousel(p) {
    const others = providers.filter(function (x) { return x !== p; });
    const cards = others.map(function (x) { return pk.providerCard(x, { level: 3, noRole: false }); }).join('\n');
    return [
        '<div class="prov-carousel" data-carousel role="region" aria-roledescription="carousel" aria-label="Other providers">',
        '    <div class="prov-carousel__nav">',
        '        <button type="button" class="prov-carousel__btn prov-carousel__btn--prev" data-carousel-prev aria-controls="team-track" aria-label="Previous providers" disabled>' + pk.ICON_ARROW + '</button>',
        '        <button type="button" class="prov-carousel__btn prov-carousel__btn--next" data-carousel-next aria-controls="team-track" aria-label="Next providers">' + pk.ICON_ARROW + '</button>',
        '    </div>',
        '    <ul class="prov-carousel__track" id="team-track" data-carousel-track>',
        indent(cards, 8),
        '    </ul>',
        '</div>'
    ].join('\n');
}

function bioMain(p) {
    const blocks = [];
    let alt = 0;
    const tone = function () { return { cloud: alt++ % 2 === 1 }; };

    // Biografía (máx. 68ch por línea)
    blocks.push(section('bio-title', 'Biography', '<div class="prov-prose">\n' + indent(p.bio.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('\n'), 4) + '\n</div>', tone()));

    // Specialties & certifications / Areas of focus (+ formación)
    const items = (p.specialties || []).concat(p.certifications || []);
    const focus = items.length
        ? '<ul class="check-list prov-checks">\n' + indent(items.map(function (t) { return '<li>' + pk.ICON_CHECK + '<span>' + esc(t) + '</span></li>'; }).join('\n'), 4) + '\n</ul>'
        : '';
    const dl = trainingDl(p);
    if (focus || dl) {
        const title = !focus ? 'Education & training' : (p.focusLabel || ((p.certifications || []).length ? 'Specialties & certifications' : 'Areas of focus'));
        blocks.push(section('focus-title', title, [focus, dl ? (focus ? '<h3 class="prov-subtitle">Education &amp; training</h3>\n' : '') + dl : ''].filter(Boolean).join('\n'), tone()));
    }

    // Conditions treated: pills-enlace (enlace seguro)
    if ((p.treats || []).length) {
        const pills = p.treats.map(function (s) {
            if (!pk.condBy[s]) pk.fail(p.slug + ': la condición "' + s + '" no existe en tools/conditions/data.js');
            return '<li>' + link('/conditions/' + s + '/', esc(pk.condBy[s].name), { cls: 'pill-link prov-pill' }) + '</li>';
        }).join('\n');
        blocks.push(section('treats-title', 'Conditions treated', '<ul class="pill-links prov-pills">\n' + indent(pills, 4) + '\n</ul>', tone()));
    }

    // Dónde atiende (id="locations": destino de "Call" sin JS)
    blocks.push(section('where-title', 'Where to see ' + p.short, '<div class="service-locations">\n' + indent(pk.providerLocationCards(p), 4) + '\n</div>', Object.assign(tone(), { sectionId: 'locations' })));

    // Reseñas: SOLO reales y que mencionen al provider
    if ((p.reviews || []).length) {
        blocks.push('<!-- Reseña real publicada en la Home (Google) que menciona a ' + esc(p.short) + ' -->');
        blocks.push(section('reviews-title', 'What patients say about ' + p.short, reviewsBlock(p), tone()));
    }

    // Resto del equipo
    blocks.push(section('team-title', 'Meet the rest of our team', carousel(p), Object.assign(tone(), { cls: 'prov-team' })));

    return blocks.join('\n\n');
}

function bioLd(p) {
    const u = urlOf(pk.bioRoute(p));
    const m = metaOf(p);
    const isDoc = pk.typeOf(p) === 'physician';
    const person = {
        '@type': isDoc ? 'IndividualPhysician' : 'Person',
        '@id': u + '#person',
        name: pk.bareName(p),
        honorificSuffix: p.credential,
        url: u,
        image: p.image.url,
        description: p.headline
    };
    if (isDoc) person.medicalSpecialty = 'PainMedicine';
    if ((p.specialties || []).length) person.knowsAbout = p.specialties;
    if ((p.certifications || []).length) {
        person.hasCredential = p.certifications.map(function (c) { return { '@type': 'EducationalOccupationalCredential', name: c }; });
    }
    person.worksFor = ORG;
    person.workLocation = pk.sedes(p).map(clinicId);
    const crumbs = [['Home', '/'], ['About Us', '/about-us/'], ['Providers', '/providers/'], [p.name, pk.bioRoute(p)]];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfilePage',
                '@id': u + '#page',
                url: u,
                name: plain(m.title),
                description: plain(m.desc),
                inLanguage: 'en-US',
                isPartOf: { '@id': SITE + '/#organization' },
                breadcrumb: { '@id': u + '#breadcrumb' },
                mainEntity: { '@id': u + '#person' }
            },
            person,
            Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd(crumbs))
        ]
    };
}

function bioNote(p) {
    const lines = [];
    if (p.slug === 'olutimilehin-oyeniran-md' || p.slug === 'naveen-sharma-do') {
        lines.push('Bio: texto oficial entregado por el cliente (correo del 24-nov).');
    } else {
        lines.push('Texto de la bio: página en vivo https://paintherapycare.com/providers/' + p.slug + '/ (API de WordPress).');
        lines.push('Title y description: los de la web en vivo.');
    }
    lines.push('Formación e idiomas: confirmados por el cliente (correo del 24-nov); no se publican datos personales de los CV.');
    lines.push('Sede y horarios: tools/locations/data.js (se ignoran los horarios viejos de la bio en vivo).');
    if (p.slug === 'henry-sardar-md') lines.push('DO confirmado por el cliente; la URL conserva "-md" (es la de la web en vivo: no cambiarla).');
    lines.forEach(function (t) { if (t.includes('--')) pk.fail(p.slug + ': una nota contiene "--"'); });
    return '\n        <!--\n          ORIGEN DE LOS DATOS (solo para el equipo, no se ve en la página):\n' + lines.map(function (t) { return '          - ' + t; }).join('\n') + '\n        -->\n';
}


/* =========================================================
   ESCRITURA
========================================================= */

pk.writePage({
    route: '/providers/', depth: 1, title: INDEX_TITLE, desc: INDEX_DESC, current: '/providers/',
    scripts: ['providers.js'], icons: ['i-pv-excellence', 'i-pv-compassion', 'i-pv-collaboration'],
    schemaNote: 'CollectionPage + ItemList (providers activos) + BreadcrumbList',
    ld: indexLd(), main: indexMain()
});

bios.forEach(function (p) {
    const m = metaOf(p);
    const route = pk.bioRoute(p);
    const main = [
        pk.breadcrumb([['Home', '/'], ['About Us', '/about-us/'], ['Providers', '/providers/'], [p.name, route]]),
        '',
        bioHero(p),
        '',
        bioMain(p),
        '',
        lib.render('insurance-band', { depth: 2 }),
        '',
        lib.render('cta-final', { depth: 2, call: '#locations', title: 'Ready to see ' + p.short + '?', primary: '/schedule/?provider=' + p.slug })
    ].join('\n');
    pk.writePage({
        route: route, depth: 2, template: 'template-bio.html', title: m.title, desc: m.desc,
        ogImage: p.image, book: '/schedule/?provider=' + p.slug,
        scripts: ['providers.js'],
        schemaNote: 'ProfilePage + ' + (pk.typeOf(p) === 'physician' ? 'IndividualPhysician' : 'Person') + ' + BreadcrumbList',
        ld: bioLd(p), note: bioNote(p), main: main
    });
});

pk.finish('Providers');
