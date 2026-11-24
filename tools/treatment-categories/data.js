/* =========================================================
   Categorías de tratamientos: /services/ (índice) y /services/<slug>/ (3 categorías).
   ÚNICA fuente de la agrupación: la usan este generador, tools/services/build.js
   (breadcrumb de cada tratamiento) y el mega-menú / píldoras (conteos).

   Los textos marcados "PROPUESTA" (h1, intro, faq) son propuestos: aprobar con el cliente.
   Sin afirmaciones clínicas nuevas: solo lo que ya dicen las páginas de tratamiento.
========================================================= */

module.exports = {
    index: {
        route: '/services/',
        title: 'Pain Treatments in NYC | Pain Therapy Medical Care',
        desc: 'Explore our pain treatments in Brooklyn, the Five Towns and Monsey: advanced technology, injections, and rehab & therapy. Medicare and Medicaid accepted.',
        h1: 'Pain Management Treatments in NYC',
        intro: 'Drug-free, non-surgical pain management in Brooklyn, the Five Towns and Monsey. Choose a treatment group to see what we offer.',
        faq: [
            { q: 'How do I know which treatment is right for me?', a: 'Your provider will evaluate your pain and recommend the options that fit your situation. Request an appointment and tell us where it hurts.' },
            { q: 'Do you accept Medicare and Medicaid?', a: 'Yes. We accept Medicare, Medicaid and most major insurance plans. Check your coverage on our insurance page.' },
            { q: 'Where can I get these treatments?', a: 'Treatments are available at our locations in Brooklyn, the Five Towns and Monsey. Each treatment page lists where to book.' }
        ]
    },
    categories: [
        {
            slug: 'advanced-technology',
            name: 'Advanced Technology',
            title: 'Advanced Pain Treatments NYC | Pain Therapy Medical Care',
            desc: 'Non-invasive, drug-free pain treatments in NYC: shockwave, EMTT, laser, PIT, TECAR and cryotherapy. Medicare and Medicaid accepted.',
            h1: 'Advanced Technology Pain Treatments in NYC',
            intro: 'Non-invasive, drug-free treatments that use advanced technology to help reduce pain and improve movement.',
            services: ['shock-wave-therapy', 'emtt-therapy', 'laser-therapy', 'pit-therapy', 'tecar-therapy', 'cryotherapy'],
            faq: [
                { q: 'Are these treatments covered by insurance?', a: 'We accept Medicare, Medicaid and most major insurance plans. Coverage can vary by plan, so check your coverage with us before your visit.' },
                { q: 'Which advanced treatment is right for me?', a: 'Your provider will evaluate your pain and recommend the options that fit your situation. Each treatment page explains how it works and who it may help.' },
                { q: 'How do I book an evaluation?', a: 'Request an appointment online or call the location closest to you. Our team will take it from there.' }
            ]
        },
        {
            slug: 'injections',
            name: 'Injections',
            title: 'Pain Management Injections NYC | Pain Therapy Medical Care',
            desc: 'Targeted pain management injections in NYC, used when clinically appropriate to help relieve pain and inflammation. Medicare and Medicaid accepted.',
            h1: 'Pain Management Injections in NYC',
            intro: 'Targeted injections, used when clinically appropriate, to help relieve pain and inflammation.',
            services: ['steroid-injection', 'ha-knee-injection', 'ultrasound-guided-injection'],
            faq: [
                { q: 'Are these treatments covered by insurance?', a: 'We accept Medicare, Medicaid and most major insurance plans. Coverage can vary by plan, so check your coverage with us before your visit.' },
                { q: 'Will I need an injection?', a: 'Injections are used only when clinically appropriate. Your provider will evaluate your pain first and discuss your options with you.' },
                { q: 'How do I book an evaluation?', a: 'Request an appointment online or call the location closest to you. Our team will take it from there.' }
            ]
        },
        {
            slug: 'rehab-therapy',
            name: 'Rehab & Therapy',
            title: 'Rehab & Therapy Services NYC | Pain Therapy Medical Care',
            desc: 'Hands-on rehab and therapy services in NYC to help you rebuild strength, mobility and independence. Medicare and Medicaid accepted.',
            h1: 'Rehab & Therapy Services in NYC',
            intro: 'Hands-on therapy programs that help you rebuild strength, mobility and independence.',
            services: ['physical-therapy-occupational-therapy', 'aqua-therapy', 'ims-therapy', 'tmj-therapy', 'pelvic-floor-therapy'],
            faq: [
                { q: 'Are these services covered by insurance?', a: 'We accept Medicare, Medicaid and most major insurance plans. Coverage can vary by plan, so check your coverage with us before your visit.' },
                { q: 'Which therapy is right for me?', a: 'Your provider will evaluate your pain and recommend the options that fit your situation. Each service page explains what to expect.' },
                { q: 'How do I book an evaluation?', a: 'Request an appointment online or call the location closest to you. Our team will take it from there.' }
            ]
        }
    ]
};
