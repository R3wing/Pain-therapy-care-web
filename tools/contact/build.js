/* =========================================================
   Generador de /contact-us/ y /thank-you-contact-page/.
   Uso (desde la raíz):   node tools/contact/build.js   (lo ejecuta build-all.js)

   - Reutiliza las piezas de tools/providers/pagekit.js y los partials de tools/shared/.
   - Sedes, teléfonos y horarios: tools/locations/data.js (nada se escribe a mano).
   - El texto del consentimiento SMS se LEE de schedule/index.html: es el mismo componente, carácter por carácter
     (versión 2026-11-v1). Si el de /schedule/ cambia, este cambia con él en el siguiente build.
   - El formulario final será el de WordPress (con su propio mensaje de confirmación). Mientras tanto,
     contact.js usa el mismo adaptador que /schedule/ (data-endpoint vacío = NO envía nada).
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const pk = require('../providers/pagekit.js');
const { esc, plain, indent, urlOf, SITE, lib, link, section, locations } = pk;

const ROUTE = '/contact-us/';
const THANKS = '/thank-you-contact-page/';
const TITLE = 'Contact Us | Pain Therapy Medical Care';
const DESC = 'Contact Pain Therapy Medical Care in Brooklyn, the Five Towns or Monsey. Send us a message, call your nearest clinic, or request an appointment.';
const H1 = 'Contact Expert Pain Therapy Specialist in NYC';
const INTRO = 'Tell us where it hurts and what you want to get back to. We will take it from there.';   // texto del sitio en vivo

/* ---------- consentimiento SMS: copia exacta del de /schedule/ ---------- */
const sched = fs.readFileSync(path.join(pk.ROOT, 'schedule', 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const smsMatch = /(<!-- CONFIRMAR CON CLIENTE: si no se enviarán mensajes de marketing[^\n]*-->)\s*\n\s*(<label class="insurance-check__label insurance-check__label--text" for="sms-consent">[\s\S]*?<\/label>)/.exec(sched);
if (!smsMatch) pk.fail('no se encontró el consentimiento SMS en schedule/index.html');
const SMS_NOTE = smsMatch[1], SMS_LABEL = smsMatch[2];

const ICON_ALERT = pk.icon('i-alert');
const err = (id) => '<p class="insurance-field__error" id="' + id + '-error" hidden>\n    ' + ICON_ALERT + '\n    <span data-error-text></span>\n</p>';

/* ---------- formulario ---------- */
function formHtml() {
    const consentLine = 'By submitting, you agree to our ' + link('/terms-and-conditions/', 'Terms and Conditions') + ' and ' + link('/privacy-policy/', 'Privacy Policy') + '.';
    return [
        '<!-- TODO: endpoint compatible con HIPAA (BAA firmado). CONFIRMAR endpoint HIPAA con BAA.',
        '     Mientras data-endpoint esté vacío, contact.js NO envía los datos a ningún servidor: solo redirige a ' + THANKS + '.',
        '     El formulario final será el de WordPress (con su propio mensaje de confirmación): este es el adaptador provisional. -->',
        '<form class="insurance-form contact-form" action="#" method="post" data-contact-form data-endpoint="" aria-labelledby="form-title" novalidate>',
        '    <p class="insurance-form__note"><span class="insurance-field__req" aria-hidden="true">*</span> Required<span class="visually-hidden">: fields marked with an asterisk are required</span></p>',
        '',
        '    <div class="insurance-field">',
        '        <label class="insurance-field__label" for="ct-name">Full name <span class="insurance-field__req" aria-hidden="true">*</span></label>',
        '        <input class="insurance-input" id="ct-name" name="full_name" type="text" autocomplete="name" required data-validate="name">',
        indent(err('ct-name'), 8),
        '    </div>',
        '',
        '    <div class="insurance-field">',
        '        <label class="insurance-field__label" for="ct-phone">Phone <span class="insurance-field__req" aria-hidden="true">*</span></label>',
        '        <input class="insurance-input" id="ct-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required data-validate="phone">',
        indent(err('ct-phone'), 8),
        '    </div>',
        '',
        '    <div class="insurance-field">',
        '        <label class="insurance-field__label" for="ct-email">Email <span class="insurance-field__req" aria-hidden="true">*</span></label>',
        '        <input class="insurance-input" id="ct-email" name="email" type="email" autocomplete="email" inputmode="email" required data-validate="email">',
        indent(err('ct-email'), 8),
        '    </div>',
        '',
        '    <div class="insurance-field">',
        '        <label class="insurance-field__label" for="ct-location">Preferred location <span class="insurance-field__optional">(optional)</span></label>',
        '        <select class="insurance-input insurance-select" id="ct-location" name="preferred_location">',
        indent(lib.render('insurance-locations', { indent: 0 }), 12),
        '        </select>',
        '    </div>',
        '',
        '    <div class="insurance-field">',
        '        <label class="insurance-field__label" for="ct-message">Message <span class="insurance-field__optional">(optional)</span></label>',
        '        <textarea class="insurance-input contact-form__message" id="ct-message" name="message" rows="5" aria-describedby="ct-message-hint"></textarea>',
        '        <p class="insurance-field__hint" id="ct-message-hint">Please don’t include medical details in this message.</p>',
        '    </div>',
        '',
        '    <!-- Consentimiento SMS: opcional, sin marcar y NO obligatorio para enviar. Mismo componente y texto que /schedule/ (versión 2026-11-v1). -->',
        '    <input type="hidden" name="sms_consent_text_version" value="2026-11-v1">',
        '    <input type="hidden" name="form_source" value="contact">',
        '    <div class="insurance-field">',
        '        <div class="insurance-check sms-consent">',
        '            <input class="insurance-check__input" id="sms-consent" name="sms_consent" type="checkbox" value="yes">',
        '            ' + SMS_NOTE,
        '            ' + SMS_LABEL,
        '        </div>',
        '    </div>',
        '',
        '    <p class="contact-form__legal">' + consentLine + '</p>',
        '',
        '    <div class="schedule-nav">',
        '        <button class="btn btn--primary btn--lg schedule-nav__submit" type="submit">Send message</button>',
        '    </div>',
        '',
        '    <p class="insurance-form__secure">',
        '        ' + pk.icon('i-lock'),
        '        Private &amp; secure',
        '    </p>',
        '    <p class="visually-hidden" role="status" aria-live="polite" data-form-status></p>',
        '</form>'
    ].join('\n');
}

/* ---------- página ---------- */
function main() {
    const clinics = [
        '<div class="prov-clinics">',
        '    <div class="prov-clinics__map">',
        indent(lib.render('map', { key: 'all' }), 8),
        '    </div>',
        '    <div class="service-locations prov-clinics__cards">',
        indent(pk.locationCards({ map: true }), 8),
        '    </div>',
        '</div>'
    ].join('\n');

    return [
        pk.breadcrumb([['Home', '/'], ['Contact Us', ROUTE]]),
        '',
        pk.listHero({ pill: 'Contact us', h1: esc(H1), text: INTRO, primary: ['Book Appointment', '/schedule/'] }),
        '',
        '<section class="section section--cloud" aria-labelledby="form-title">',
        '    <div class="container container--narrow" data-reveal>',
        '        <header class="section-header section-header--center">',
        '            <h2 class="section-title" id="form-title">Have a question? We’re here to help</h2>',
        '        </header>',
        '        <div class="schedule-form-card">',
        indent(formHtml(), 12),
        '        </div>',
        '    </div>',
        '</section>',
        '',
        section('clinics-title', 'Our pain management clinics', clinics, { sectionId: 'locations' }),
        '',
        lib.render('insurance-band', { depth: 1 }),
        '',
        lib.render('cta-final', { depth: 1, call: '#locations', title: 'Start with an evaluation', text: INTRO, primary: '/schedule/' })
    ].join('\n');
}

function contactLd() {
    const u = urlOf(ROUTE);
    return {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'ContactPage', '@id': u + '#page', url: u, name: plain(TITLE), description: DESC, inLanguage: 'en-US', about: { '@id': SITE + '/#organization' }, breadcrumb: { '@id': u + '#breadcrumb' } },
            {
                '@type': 'MedicalOrganization', '@id': SITE + '/#organization', name: 'Pain Therapy Medical Care', url: SITE + '/',
                contactPoint: locations.map(function (l) {
                    return { '@type': 'ContactPoint', contactType: 'customer service', name: 'Pain Therapy Medical Care – ' + l.sede, telephone: l.schemaTel, availableLanguage: 'English' };
                })
            },
            Object.assign({ '@id': u + '#breadcrumb' }, pk.breadcrumbLd([['Home', '/'], ['Contact Us', ROUTE]]))
        ]
    };
}

pk.writePage({
    route: ROUTE, depth: 1, template: '../contact/template.html', title: TITLE, desc: DESC,
    scripts: ['locations-data.js', 'map.js', 'contact.js'], forms: true,
    schemaNote: 'ContactPage + MedicalOrganization (contactPoint por sede) + BreadcrumbList',
    ld: contactLd(), main: main()
});

/* ---------- gracias (noindex permanente) ---------- */
const thanksMain = [
    '<section class="thanks" aria-labelledby="thanks-title">',
    '    <div class="container thanks__inner">',
    '        <span class="insurance-success__icon" aria-hidden="true">',
    '            ' + pk.icon('i-check'),
    '        </span>',
    '        <h1 class="thanks__title" id="thanks-title">Thank you! We received your message.</h1>',
    '        <p class="thanks__text">A member of our team will get back to you within [RESPONSE TIME]. <!-- CONFIRMAR CON CLIENTE --></p>',
    '        <div class="btn-group btn-group--center">',
    '            <a class="btn btn--primary btn--lg" href="/">Back to home</a>',
    '            <a class="btn btn--outline btn--lg" href="/schedule/">Request an appointment</a>',
    '        </div>',
    '    </div>',
    '</section>',
    '',
    '<section class="section section--cloud" aria-labelledby="learn-title">',
    '    <div class="container" data-reveal>',
    '        <header class="section-header section-header--center">',
    '            <h2 class="section-title" id="learn-title">Learn more while you wait</h2>',
    '        </header>',
    '        <ul class="pill-links" aria-label="Helpful pages">',
    '            <li>' + link('/locations/', 'Our locations', { cls: 'pill-link' }) + '</li>',
    '            <li>' + link('/conditions/', 'Conditions we treat', { cls: 'pill-link' }) + '</li>',
    '            <li>' + link('/services/', 'Our treatments', { cls: 'pill-link' }) + '</li>',
    '            <li>' + link('/insurance/', 'Insurance we accept', { cls: 'pill-link' }) + '</li>',
    '        </ul>',
    '    </div>',
    '</section>'
].join('\n');

pk.writePage({
    route: THANKS, depth: 1, template: '../contact/template-thanks.html', title: 'Message Received | Pain Therapy Medical Care',
    desc: 'Thank you for contacting Pain Therapy Medical Care. Our team will get back to you soon.',
    schemaNote: 'WebPage', book: '/schedule/',
    ld: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Message received', url: urlOf(THANKS), inLanguage: 'en-US', isPartOf: { '@id': SITE + '/#organization' } },
    main: thanksMain
});

pk.finish('Contacto');
