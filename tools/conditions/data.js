/* =========================================================
   Conditions — fuente única (zonas + 15 condiciones)
   Contenido: https://paintherapycare.com/conditions/<slug>/ (API de WordPress), reorganizado
   en campos sin cambiar su sentido médico. Ver cabecera de data-spine.js para los criterios.

   Se unen aquí:
     data-spine.js · data-joints.js · data-nerves-other.js   → los campos de cada condición
     live-meta.json  → title, meta description e imagen ACTUALES de la web en vivo
                       (el title ≤ 60 y la description ≤ 155 se conservan tal cual)

   Sedes, providers y horarios NO se duplican: se leen de tools/locations/data.js y
   tools/providers/data.js (solo lectura).
========================================================= */

'use strict';

const live = require('./live-meta.json');

/* Zonas (id del grupo en /conditions/ = slug de la zona) */
const zones = [
    {
        slug: 'spine-back',
        name: 'Spine & Back',
        h1Name: 'Spine & Back',
        icon: 'spine',
        title: 'Spine & Back Pain Treatment in Brooklyn | Non-Surgical',
        desc: 'Back, neck and spine pain treatment in Brooklyn, Five Towns and Monsey. Non-surgical, drug-free care. Medicare and Medicaid accepted.',
        intro: 'Pain in the neck, back and spine can come from discs, joints, nerves and the muscles around them, and each source needs a different approach. At Pain Therapy Medical Care we look for what is generating your pain and offer non-surgical, drug-free care.'
    },
    {
        slug: 'joints',
        name: 'Joints',
        h1Name: 'Joint',
        icon: 'joint',
        title: 'Joint Pain Treatment in Brooklyn | Non-Surgical Relief',
        desc: 'Knee, hip, shoulder and arthritis pain treatment in Brooklyn, Five Towns and Monsey. Non-surgical, drug-free care. Medicare and Medicaid accepted.',
        intro: 'The knee, hip, shoulder and other joints depend on cartilage, tendons, ligaments and muscles working together. When one part breaks down, the rest compensates, which is why we look at the whole joint and not only the painful spot. We offer non-surgical, drug-free care.'
    },
    {
        slug: 'nerves-hands-feet',
        name: 'Nerves, Hands & Feet',
        h1Name: 'Nerve, Hand & Foot',
        icon: 'nerve',
        title: 'Nerve, Hand & Foot Pain Treatment in Brooklyn, NY',
        desc: 'Carpal tunnel, plantar fasciitis and neuropathy treatment in Brooklyn, Five Towns and Monsey. Drug-free care. Medicare and Medicaid accepted.',
        intro: 'Tingling, numbness and pain in the hands and feet can come from a nerve that is compressed or damaged somewhere along its path. We look for where the nerve is affected and offer drug-free care.'
    },
    {
        slug: 'other-pain',
        name: 'Other Pain',
        h1Name: 'Chronic & Jaw',
        icon: 'other',
        title: 'Chronic Pain & TMJ Treatment in Brooklyn | Drug-Free',
        desc: 'Chronic pain and TMJ treatment in Brooklyn, Five Towns and Monsey. Non-surgical, drug-free care. Medicare and Medicaid accepted.',
        intro: 'Some pain does not fit a single joint or area, such as pain that has lasted for months or pain in the jaw. We look for the root causes and offer non-surgical, drug-free care.',
        /* Solo enlace a un servicio (no se genera página de condición) */
        extraLinks: [
            { name: 'Pelvic Floor Pain', href: '/services/pelvic-floor-therapy/', text: 'Learn about Pelvic Floor Therapy' }
        ]
    }
];

/* Condiciones: campos + metadatos de la web en vivo */
const conditions = []
    .concat(require('./data-spine.js'), require('./data-joints.js'), require('./data-nerves-other.js'))
    .map(function (c) {
        const m = live[c.slug];
        if (!m) throw new Error('conditions: falta ' + c.slug + ' en live-meta.json');
        return Object.assign({}, c, {
            metaTitle: m.title,
            metaDescription: m.desc,
            image: { url: m.image, width: m.width, height: m.height }
        });
    });

/* FAQ generales: las mismas 4 de la Home. Solo la de seguros está aprobada; las otras 3 siguen
   pendientes del equipo clínico (misma redacción que la Home). */
const faqs = [
    {
        q: 'Do you accept Medicare and Medicaid?',
        a: 'Yes. We accept Medicare, Medicaid and most major insurance plans, including for Shockwave, EMTT and Laser Therapy. Call us and we will review your plan with you before your first visit.'
    },
    { q: 'Is the treatment painful?', a: '[Clinical team to confirm]', pending: true },
    { q: 'How many sessions will I need?', a: '[Clinical team to confirm]', pending: true },
    { q: 'Do I need a referral?', a: '[Confirm referral policy]', pending: true }
];

module.exports = { zones: zones, conditions: conditions, faqs: faqs };
