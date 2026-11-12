/* =========================================================
   Datos de las páginas de tratamiento (/services/<slug>/).
   ÚNICA fuente para generar las páginas con tools/services/build.js.

   Grupos: INJECTIONS (3, aquí), REHAB & THERAPY (5, data-rehab.js) y
   ADVANCED TECHNOLOGY (6, data-advanced.js). Cada grupo vive en su archivo
   y se concatena al final; la plantilla y el build no cambian.

   Origen del texto: páginas en vivo de paintherapycare.com/services/…
   reescritas de forma más corta. NO se copian las afirmaciones clínicas
   que no tienen respaldo (ver `confirm` de cada página): salen en el
   HTML como comentario <!-- CONFIRMAR CON CLIENTE --> para revisión.

   Campos
     slug, name, kicker, procedureType (schema.org), title (≤ 65 car.),
     desc (≤ 155 car., texto plano con &), h1, lead, checks[]
     image {src, alt}        → URL de la Media Library de WordPress (no se descarga)
     what {title, paras[], cardGroups[{title, items[{t,d}]}]}
     candidates {title, intro, items[]}      (opcional)
     conditions {title, items[]}
     steps {title, intro, items[{t,d}]}
     combine {title, intro, items[{label, slug?}]}   (opcional)
     faq[{q, a}]             → mismo texto en HTML y en JSON-LD
     related[]               → slugs de otros tratamientos
     confirm[]               → notas para el cliente (solo comentario HTML)
========================================================= */

module.exports = [
    /* ------------------------------------------------------- */
    {
        slug: 'steroid-injection',
        name: 'Steroid Injection',
        kicker: 'Injection therapy',
        relatedTitle: 'Other injection treatments',
        procedureType: 'PercutaneousProcedure',
        title: 'Steroid Injections in Brooklyn | Pain Therapy Medical Care',
        desc: 'Fluoroscopy-guided steroid injections for back, neck and joint pain in Brooklyn. Medicare & Medicaid accepted. Request an appointment.',
        h1: 'Fluoroscopy-Guided Steroid Injections for Pain in Brooklyn, NYC',
        lead: 'A minimally invasive option that aims to bring fast relief at the source of your pain. X-ray imaging guides each injection so the medication goes exactly where it is needed.',
        checks: ['Minimally invasive', 'X-ray (fluoroscopy) guided', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/image-33_converted.avif',
            alt: 'Fluoroscopy-guided epidural injection for pain management in Brooklyn'
        },
        what: {
            title: 'How do fluoroscopy-guided injections work?',
            paras: [
                'Fluoroscopy-guided injections deliver a corticosteroid and a local anesthetic (lidocaine) into the affected area. Live X-ray imaging and a contrast dye confirm where the needle is before anything is injected, so there is no blind targeting or hit-or-miss approach.',
                'Treatment is performed by Dr. Henry Sardar.'
            ],
            cardGroups: [
                {
                    title: 'How the injection helps',
                    items: [
                        { t: 'Reduces inflammation', d: 'The corticosteroid has an anti-inflammatory effect in the affected area.' },
                        { t: 'Interrupts nerve pain', d: 'It inhibits the release of chemicals that trigger nerve pain.' },
                        { t: 'Numbs the area', d: 'The local anesthetic blocks pain signals.' }
                    ]
                },
                {
                    title: 'Two types of injection',
                    items: [
                        { t: 'Epidural corticosteroid injections', d: 'For low back pain, herniated discs and spinal arthritis.' },
                        { t: 'Facet joint injections', d: 'For pain and inflammation in the facet joints of the spine.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'You may be a candidate if you have:',
            items: [
                'Severe back, neck or joint pain lasting several weeks',
                'Developed tolerance to pain medications, or want to avoid it',
                'A wish to avoid surgery',
                'Severe facet joint pain',
                'A wish to combine treatments to support natural healing'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Herniated discs', 'Spinal stenosis', 'Sciatica', 'Whiplash', 'Compression fractures', 'Annular tears', 'Bone spurs', 'Lumbar arthritis', 'Psoriatic arthritis', 'Lumbar pain']
        },
        steps: {
            title: 'What to expect',
            intro: 'The procedure takes about 15 to 30 minutes.',
            items: [
                { t: 'Prepare', d: 'Remove jewelry and any clothing that could interfere with the X-ray.' },
                { t: 'Numb', d: 'The skin is disinfected and numbed.' },
                { t: 'Confirm', d: 'Imaging confirms the needle is in the right place.' },
                { t: 'Inject and rest', d: 'The steroid and anesthetic mixture is delivered, followed by a short monitoring period.' }
            ]
        },
        faq: [
            { q: 'How long does a fluoroscopy-guided injection take?', a: 'The procedure takes about 15 to 30 minutes, followed by a short monitoring period.' },
            { q: 'What is the difference between epidural and facet joint injections?', a: 'Epidural corticosteroid injections are used for low back pain, herniated discs and spinal arthritis. Facet joint injections target pain and inflammation in the facet joints of the spine.' },
            { q: 'Is a steroid injection covered by insurance?', a: 'Insurance may cover the procedure when a referring physician recommends it. We accept Medicare, Medicaid and most major plans, and we review your coverage first.' },
            { q: 'Can I combine injections with other treatments?', a: 'Many patients combine injections with other non-surgical treatments. Your physician will build a plan for you.' }
        ],
        related: ['ha-knee-injection', 'ultrasound-guided-injection'],
        confirm: [
            'Título H1 de la web en vivo: "Fluoroscopic Guided Epidural Injection Therapy…" (el title habla de "Steroid Injections"). Se unificó.',
            'La web en vivo lista "septic arthritis" y "rheumatoid osteoarthritis" como condiciones tratadas. NO se copiaron: la artritis séptica es una infección y requiere revisión clínica; "rheumatoid osteoarthritis" mezcla dos enfermedades.',
            'NO se copiaron: "clinically proven/tested", "long-lasting effects", "fewer risks than spine surgery", "one of the top providers in New York", "minimizes the need for prescription medicines".',
            'La web en vivo dice que el procedimiento está disponible "at the Brooklyn clinic": confirmar en qué sedes se ofrece.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas de esta página salen solo de datos de esa misma página; revisar el texto.',
            'Falta confirmar cobertura por aseguradora específica (la web nombra Medicaid Plan, UnitedHealthcare Community Plan, etc.).'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'ha-knee-injection',
        name: 'HA Knee Injection',
        kicker: 'Injection therapy',
        relatedTitle: 'Other injection treatments',
        procedureType: 'PercutaneousProcedure',
        title: 'HA Knee Injections in Brooklyn | Pain Therapy Medical Care',
        desc: 'Ultrasound-guided hyaluronic acid (HA) knee injections for arthritis pain in Brooklyn. Medicare & Medicaid accepted. Request an appointment.',
        h1: 'Hyaluronic Acid (HA) Knee Injections for Pain in Brooklyn, NYC',
        lead: 'Hyaluronic acid adds lubrication to the knee joint to ease arthritis pain. Each injection is ultrasound-guided and does not require surgery.',
        checks: ['Ultrasound guided', 'Minimally invasive', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/image-37_converted.avif',
            alt: 'Hyaluronic acid (HA) knee injections in Brooklyn'
        },
        what: {
            title: 'What are Hyalgan knee injections?',
            paras: [
                'Hyaluronic acid (HA) is a natural component of the synovial fluid that lubricates your joints. Our clinic uses Hyalgan, a sodium hyaluronate solution, to bring that lubrication back to the knee.',
                'Dr. Henry Sardar performs the injections with ultrasound guidance. For many patients this is an option to discuss before knee replacement or arthroscopic surgery.'
            ],
            cardGroups: [
                {
                    title: 'How it helps',
                    items: [
                        { t: 'Lubrication', d: 'Supplements the natural fluid in the joint.' },
                        { t: 'Less friction', d: 'Helps the joint move more smoothly.' },
                        { t: 'Anti-inflammatory support', d: 'Helps calm inflammation in the joint.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'You may be a candidate if you have:',
            items: [
                'Arthritis knee pain that has lasted several weeks',
                'Pain from a knee injury',
                'A wish to avoid pain relievers',
                'A wish to avoid knee replacement surgery or steroid injections',
                'A wish for a natural improvement in pain'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Knee osteoarthritis', 'Knee injuries', 'Mild non-specific knee pain']
        },
        steps: {
            title: 'What to expect',
            intro: '',
            items: [
                { t: 'Ultrasound guidance', d: 'Ultrasound imaging is used to guide the injection.' },
                { t: 'Numbing', d: 'The area is numbed first.' },
                { t: 'Fluid removal (if needed)', d: 'Excess fluid may be drawn out of the joint before the injection.' },
                { t: 'Injection', d: 'Dr. Sardar delivers the hyaluronic acid into the knee.' }
            ]
        },
        faq: [
            { q: 'What is Hyalgan?', a: 'Hyalgan is a sodium hyaluronate solution: a form of hyaluronic acid, a natural component of the fluid that lubricates your joints.' },
            { q: 'How many sessions will I need?', a: 'About 4 to 5 sessions may be needed for the full benefit. Your physician will confirm the plan for you.' },
            { q: 'What should I do after the injection?', a: 'Avoid strenuous activity after your injection. Your physician will give you specific instructions.' },
            { q: 'Is an HA knee injection covered by insurance?', a: 'Coverage depends on your condition and on a referral from a physician or physical therapist. We accept Medicare, Medicaid and most major plans, and we review your coverage first.' }
        ],
        related: ['steroid-injection', 'ultrasound-guided-injection'],
        confirm: [
            'NO se copiaron: "FDA approved", "no known side effects", "no recovery period / no downtime", "relief for up to six months or longer", "cell regeneration", "clinical studies show improvement" (sin cita), "reduced need for prescription medication".',
            'La web en vivo lista "rheumatoid arthritis" entre las condiciones: no se incluyó (el ácido hialurónico se indica sobre todo para osteoartritis de rodilla). Confirmar con el médico.',
            '"4 to 5 sessions" viene de la web en vivo: confirmar con el médico.',
            'Marca "Hyalgan": confirmar que es la que se usa hoy.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen solo de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece (la web dice "Brooklyn").'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'ultrasound-guided-injection',
        name: 'Ultrasound Guided Injection',
        kicker: 'Injection therapy',
        relatedTitle: 'Other injection treatments',
        procedureType: 'PercutaneousProcedure',
        title: 'Ultrasound-Guided Injections | Pain Therapy Medical Care',
        desc: 'Ultrasound-guided injections for joint, hip and shoulder pain in Brooklyn. Minimally invasive. Medicare & Medicaid accepted.',
        h1: 'Ultrasound-Guided Joint, Hip and Shoulder Injections in Brooklyn, NYC',
        lead: 'Live ultrasound imaging guides the needle to the exact source of your pain: a minimally invasive approach instead of a hit-or-miss one.',
        checks: ['Live ultrasound imaging', 'Outpatient procedure', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/ultrasound-guided-injection-03.jpg',
            alt: 'Ultrasound-guided injection for joint pain in Brooklyn'
        },
        what: {
            title: 'What is an ultrasound-guided injection?',
            paras: [
                'An ultrasound-guided injection is an advanced, minimally invasive method that uses live ultrasound imaging to guide the needle to the source of pain and deliver the medication precisely.',
                'Dr. Henry Sardar performs these injections at our Brooklyn location.'
            ],
            cardGroups: [
                {
                    title: 'Medications we may use',
                    items: [
                        { t: 'Cortisone', d: 'Reduces inflammation and helps prevent further damage from acute and chronic injuries.' },
                        { t: 'Lidocaine', d: 'A local anesthetic that blocks pain signals.' },
                        { t: 'Hyaluronic acid (HA)', d: 'Lubricates the joint and acts as a shock absorber.' }
                    ]
                }
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Osteoarthritis', 'Knee osteoarthritis', 'Ankle joint pain', 'Epicondylitis', 'Tennis elbow', 'Tendonitis', 'Morton\'s neuroma', 'Carpal tunnel syndrome', 'Frozen shoulder', 'Subacromial bursitis', 'Trochanteric bursitis', 'Arthritic joints of the hand and fingers']
        },
        steps: {
            title: 'What to expect',
            intro: 'An outpatient procedure that needs little preparation and takes about 5 to 10 minutes.',
            items: [
                { t: 'Scan', d: 'Ultrasound is used first to locate the injection site.' },
                { t: 'Clean', d: 'The skin is cleaned with an antiseptic.' },
                { t: 'Inject', d: 'A mix of steroid and local anesthetic is typically delivered while real-time imaging helps avoid nearby structures.' },
                { t: 'Monitor', d: 'A short monitoring period follows.' }
            ]
        },
        combine: {
            title: 'Can it be combined with other treatments?',
            intro: 'Yes. We design a tailored plan for each patient. Ultrasound-guided injections can be combined with:',
            items: [
                { label: 'Cold laser therapy', slug: 'laser-therapy' },
                { label: 'Shockwave therapy', slug: 'shock-wave-therapy' },
                { label: 'Cryotherapy', slug: 'cryotherapy' },
                { label: 'Kinesiology taping' },
                { label: 'TECAR therapy', slug: 'tecar-therapy' },
                { label: 'Aqua therapy', slug: 'aqua-therapy' },
                { label: 'Perineural Injection Therapy (PIT)', slug: 'pit-therapy' },
                { label: 'Physical and occupational therapy', slug: 'physical-therapy-occupational-therapy' },
                { label: 'EMTT', slug: 'emtt-therapy' },
                { label: 'Fluoroscopy-guided epidural and facet injections', slug: 'steroid-injection' }
            ]
        },
        faq: [
            { q: 'How long does an ultrasound-guided injection take?', a: 'About 5 to 10 minutes, followed by a short monitoring period.' },
            { q: 'What medications are used?', a: 'We may use cortisone, lidocaine or hyaluronic acid (HA), depending on your condition. Typically a mix of steroid and local anesthetic is used.' },
            { q: 'Can ultrasound-guided injections be combined with other treatments?', a: 'Yes. They can be combined with therapies such as cold laser, shockwave, TECAR, EMTT and physical therapy. We design a tailored plan for each patient.' },
            { q: 'Is an ultrasound-guided injection covered by insurance?', a: 'Insurance may cover it when your primary pain management physician recommends it. We accept Medicare, Medicaid and most major plans, and we review your coverage first.' }
        ],
        related: ['steroid-injection', 'ha-knee-injection'],
        confirm: [
            'NO se copió la cita a "clinical trial evidence … up to 6 weeks": no tiene fuente.',
            'La web en vivo no dice a quién va dirigido (no hay sección "Who can benefit"): no se inventó. Pedir criterios al médico si se quiere esa sección.',
            'Las páginas de la lista "combine" que aún no existen (laser, shockwave, cryotherapy, TECAR, aqua, PIT, PT&OT, EMTT) enlazan a rutas que se crearán con los otros grupos de tratamientos.',
            '"Kinesiology taping" no tiene página propia en el menú: sale sin enlace.',
            'La web en vivo dice que se ofrece "at the Brooklyn location": confirmar en qué sedes.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen solo de datos de esa misma página; revisar el texto.'
        ]
    }
].concat(require('./data-rehab.js'), require('./data-advanced.js'));
