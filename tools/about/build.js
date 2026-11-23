/* =========================================================
   Generador de /about-us/
   Uso (desde la raíz del proyecto):   node tools/about/build.js
   (build-all.js lo ejecuta solo: descubre tools/<sección>/build.js)

   - Contenido: página en vivo https://paintherapycare.com/about-us/ (API de WordPress), reordenado
     sin cambiar el sentido. Las cifras y afirmaciones atribuidas NO se publican (ver PENDIENTE).
   - Providers: tools/providers/data.js · sedes y horarios: tools/locations/data.js (solo lectura).
   - Piezas comunes y escritura con validaciones: tools/providers/pagekit.js.
========================================================= */

'use strict';

const pk = require('../providers/pagekit.js');
const { esc, indent, urlOf, SITE, lib, link, section, locations, providers } = pk;

const TITLE = 'About Us & FAQs | Pain Therapy Medical Care';
const DESC = 'Advanced pain management clinic providing personalized care focused on long-term comfort, mobility, and overall wellness.';   // meta de la web en vivo (121 car.)
const ROUTE = '/about-us/';

/* FAQ: respuestas ya aprobadas en el sitio (Home, sedes) */
const TRANSPORT = 'We can arrange transportation to your appointment, depending on your insurance plan. Please request it at least one day before your visit and call to confirm your ride.';
const faqs = [
    { q: 'Do you accept Medicare and Medicaid?', a: 'Yes. We accept Medicare, Medicaid and most major insurance plans, including for Shockwave, EMTT and Laser Therapy. Call us and we will review your plan with you before your first visit.' },
    { q: 'Can I walk in without an appointment?', a: 'Yes, we accept walk-ins. Patients with a scheduled appointment are seen first, so booking ahead is the best way to avoid a wait.' },
    { q: 'Can you help me get to my appointment?', a: 'Yes. ' + TRANSPORT },
    {
        q: 'Do I need a referral?', pending: true,
        a: '[Confirm referral policy]',
        html: '<span class="prov-confirm">[CONFIRM: referral policy]</span> ' + link('/blog/referral-pain-management-new-york/', 'Read more about referrals', { cls: 'text-link', arrow: true })
    }
];

const FAQ_NOTE = '<!-- CONFIRMAR CON CLIENTE: la política de referidos sigue sin respuesta aprobada en el repositorio (igual que en la Home): se ve [CONFIRM] y NO va al JSON-LD. El enlace al artículo del blog se activa porque la página existe. -->';

function heroMedia() {
    return [
        '<!-- Imagen de la Media Library de WordPress (no se descarga): og:image de la página About en vivo. CONFIRMAR CON CLIENTE: texto alternativo (alt) tras ver la imagen -->',
        '<div class="media-placeholder media-placeholder--16x10" data-media="about-hero">',
        '    <img src="https://paintherapycare.com/wp-content/uploads/2026/04/physical-therapy-pain-therapy-care-nyc-1_converted.avif" alt="" width="700" height="467" decoding="async" fetchpriority="high">',
        '</div>'
    ].join('\n');
}

function aboutMain() {
    const facts = [
        { icon: 'i-ab-diagnosis', title: 'Complex diagnosis', text: 'Chronic pain is not like other serious medical conditions. Its causes can be difficult to diagnose with conventional medical tests.' },
        { icon: 'i-ab-undertreated', title: 'Often undertreated', text: 'Recurring pain is often left undertreated.' },
        { icon: 'i-ab-real', title: 'Pain is real', text: 'While each person’s experience of pain is specific to them, it is virtually never “only in your head.”' }
    ];
    const impact = [
        { icon: 'i-ab-disability', title: 'Long-term disability', text: 'Unrelieved pain is a better predictor for long-term disability than almost any other factor.' },
        { icon: 'i-ab-silent', title: 'Silent suffering', text: 'People are often scared to admit the extent of their suffering. However, those who stay silent generally fail to receive effective treatment.' },
        { icon: 'i-ab-life', title: 'Quality of life', text: 'Refusing to acknowledge your pain results in severe physiological and psychological outcomes that diminish your quality of life. Chronic pain leaves many of its victims solitary and discouraged.' }
    ];

    const team = '<ul class="prov-grid">\n' + indent(providers.map(function (p) { return pk.providerCard(p, { level: 3, noRole: true }); }).join('\n'), 4) + '\n</ul>\n' +
        '<p class="prov-more"><a class="btn btn--primary btn--lg" href="/providers/">Meet our providers</a></p>';

    const clinics = [
        '<div class="prov-clinics">',
        '    <div class="prov-clinics__map">',
        indent(lib.render('map', { key: 'all' }), 8),
        '    </div>',
        '    <div class="service-locations prov-clinics__cards">',
        indent(pk.locationCards(), 8),
        '    </div>',
        '</div>'
    ].join('\n');

    return [
        pk.breadcrumb([['Home', '/'], ['About Us', ROUTE]]),
        '',
        pk.listHero({
            pill: 'About us',
            h1: 'We Are Pain Therapy Medical Care',
            text: 'We believe that it is possible, no matter how severe your disease, to return to a life free from suffering.',
            primary: ['Book an evaluation', '/schedule/'],
            secondary: ['Meet our providers', '/providers/'],
            media: heroMedia()
        }),
        '',
        section('complexity-title', 'We understand the complexity of pain',
            '<div class="prov-prose">\n' +
            '    <p>Our offices are staffed with highly competent teams that specialize in providing care for chronic pain.</p>\n' +
            '    <p>Our professional staff works closely together to ensure the highest level of communication and medical care, with comprehensive pain management and rehabilitation services.</p>\n' +
            '</div>'),
        '',
        '<!-- PENDIENTE: publicar solo con fuente verificable (enlace). Afirmaciones de la web en vivo que NO se publican: -->',
        '<!--   · "The American Medical Association says that recurring pain is undertreated." -->',
        '<!--   · "The National Institute of Health indicates that 40 million Americans never treat their recurrent pain." -->',
        '<!--   · "The average patient with chronic pain suffers for more than 5 years before their pain is addressed." -->',
        '<!-- La tarjeta "Often undertreated" usa una frase genérica sin cifras ni atribución: CONFIRMAR CON CLIENTE. -->',
        section('facts-title', 'Important facts about chronic pain', pk.featureCards(facts), { cloud: true, lead: 'Understanding the reality of chronic pain is the first step toward effective treatment and recovery.' }),
        '',
        section('impact-title', 'The impact of untreated pain', pk.featureCards(impact)),
        '',
        section('values-title', 'What guides our care', pk.featureCards(pk.VALUES), { cloud: true }),
        '',
        section('team-title', 'Meet our team', team, { lead: 'Highly competent professionals specializing in comprehensive pain management and rehabilitation services.' }),
        '',
        '<section class="section section--cloud" id="locations" aria-labelledby="clinics-title">',
        '    <div class="container" data-reveal>',
        '        <header class="section-header">',
        '            <h2 class="section-title" id="clinics-title">Our clinics in Brooklyn, the Five Towns and Monsey</h2>',
        '        </header>',
        indent(clinics, 8),
        '    </div>',
        '</section>',
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        FAQ_NOTE,
        '<section class="section" aria-labelledby="faq-title">',
        '    <div class="container container--narrow" data-reveal>',
        '        <header class="section-header section-header--center">',
        '            <h2 class="section-title" id="faq-title">Questions? We have answers.</h2>',
        '        </header>',
        '        <div class="faq">',
        indent(pk.faqHtml(faqs), 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', title: 'Start with an evaluation', text: 'Tell us where it hurts and what you want to get back to.', primary: '/schedule/', primaryLabel: 'Book an evaluation' })
    ].join('\n');
}

function aboutLd() {
    const u = urlOf(ROUTE);
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'AboutPage',
                '@id': u + '#page',
                url: u,
                name: TITLE,
                description: DESC,
                inLanguage: 'en-US',
                about: { '@id': SITE + '/#organization' },
                breadcrumb: { '@id': u + '#breadcrumb' }
            },
            { '@type': 'MedicalOrganization', '@id': SITE + '/#organization', name: 'Pain Therapy Medical Care', url: SITE + '/' },
            { '@type': 'FAQPage', '@id': u + '#faq', mainEntity: pk.faqLd(faqs) },
            Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd([['Home', '/'], ['About Us', ROUTE]]))
        ]
    };
}

pk.writePage({
    route: ROUTE, depth: 1, title: TITLE, desc: DESC, current: ROUTE,
    scripts: ['locations-data.js', 'map.js'],
    icons: ['i-pv-excellence', 'i-pv-compassion', 'i-pv-collaboration', 'i-ab-diagnosis', 'i-ab-undertreated', 'i-ab-real', 'i-ab-disability', 'i-ab-silent', 'i-ab-life'],
    note: '\n        <!--\n          ORIGEN: https://paintherapycare.com/about-us/ (API de WordPress). Providers y sedes: tools/providers/data.js y tools/locations/data.js.\n          Cifras y afirmaciones atribuidas (AMA, NIH, "5 años"): NO publicadas (ver PENDIENTE más abajo).\n        -->\n',
    schemaNote: 'AboutPage + MedicalOrganization (@id de la Home) + FAQPage + BreadcrumbList',
    ld: aboutLd(), main: aboutMain()
});

pk.finish('About');
