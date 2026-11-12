/* =========================================================
   Grupo ADVANCED TECHNOLOGY (6 páginas). Se suma a data.js.
   Mismo esquema de campos que data.js / data-rehab.js.
   Origen: páginas en vivo de paintherapycare.com/services/… reescritas
   más cortas. Lo omitido por no tener respaldo está en `confirm`.

   Cobertura de seguro:
   - Shockwave, EMTT y Laser: "Medicare & Medicaid accepted" (mismo texto que
     la Home aprobada).
   - TECAR, PIT y Cryotherapy: la web en vivo los ofrece "sin importar el
     seguro" (TECAR dice que la mayoría de seguros NO lo cubren). No se afirma
     cobertura: el FAQ de seguro lleva un marcador visible [… TO CONFIRM].
========================================================= */

module.exports = [
    /* ------------------------------------------------------- */
    {
        slug: 'shock-wave-therapy',
        name: 'Shockwave Therapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'Shockwave Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Shockwave therapy for chronic musculoskeletal pain in Brooklyn: non-invasive and drug-free. Medicare & Medicaid accepted.',
        h1: 'Shockwave Therapy for Pain in Brooklyn, NYC',
        lead: 'A non-invasive, drug-free treatment for chronic musculoskeletal pain. Acoustic waves reach deep into muscles, tendons and bones to support healing.',
        checks: ['Non-invasive', 'Drug-free', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/10/ptc-shockwave-therapy-brooklyn-featured.jpg',
            alt: 'Shockwave therapy treatment for pain in Brooklyn'
        },
        what: {
            title: 'What is shockwave therapy?',
            paras: [
                'Shockwave therapy uses acoustic (sound) waves that penetrate muscles, tendons and bones. It is used for chronic musculoskeletal pain and orthopedic injuries, and it is an option for patients who want to avoid steroid injections or surgery.',
                'Treatment is offered by Dr. Henry Sardar. The same technology is also used in our pelvic floor therapy for a tight, painful pelvic floor.'
            ],
            cardGroups: [
                {
                    title: 'How it is meant to help',
                    items: [
                        { t: 'Anti-inflammatory effect', d: 'Helps regulate inflammation in the treated area.' },
                        { t: 'Better circulation', d: 'Supports the formation of new blood vessels (angiogenesis).' },
                        { t: 'Pain relief', d: 'Targets the source of musculoskeletal pain.' },
                        { t: 'Repair', d: 'Supports tissue repair and regeneration.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'Shockwave therapy may help if you have:',
            items: [
                'Musculoskeletal pain lasting more than 6 weeks without noticeable improvement',
                'A wish to avoid steroid injections or surgery',
                'Chronic muscle tightness',
                'A tight, painful pelvic floor when Kegels and standard physical therapy have not worked'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Neck pain', 'Shoulder pain', 'Low back pain', 'Knee pain', 'Hip pain', 'Rotator cuff tendinopathy', 'Medial tibial stress syndrome', 'Achilles tendinopathy', 'Heel spur', 'Tennis elbow', "Jumper's knee", 'Chronic muscle tightness']
        },
        steps: {
            title: 'What to expect',
            intro: 'Each session lasts only a few minutes, usually once a week for several weeks.',
            items: [
                { t: 'Gel', d: 'A lubricant gel is applied to the area.' },
                { t: 'Treatment', d: 'The probe of the shockwave device is moved over the affected area.' },
                { t: 'Care plan', d: 'Dr. Sardar may prescribe a care plan, such as hot or cold packs, light exercise or stretching.' },
                { t: 'Aftercare', d: 'Avoid strenuous physical activity for a few days after treatment.' }
            ]
        },
        faq: [
            { q: 'How many sessions will I need?', a: 'Treatment is usually once a week for several weeks. Improvement is typically expected in about 6 to 8 weeks, but this varies from person to person. Your physician will confirm your plan.' },
            { q: 'Are there restrictions after treatment?', a: 'Avoid strenuous physical activity for a few days. Otherwise you can usually return to your daily routine. Dr. Sardar may suggest a care plan with hot or cold packs, light exercise or stretching.' },
            { q: 'Is shockwave therapy used for the pelvic floor?', a: 'Yes. Shockwave is one of the tools used in our pelvic floor therapy for a tight, painful pelvic floor when Kegels and standard physical therapy have not worked.' },
            { q: 'Is shockwave therapy covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Call your nearest location and we will review your coverage for this treatment.' }
        ],
        related: ['emtt-therapy', 'laser-therapy', 'tecar-therapy'],
        confirm: [
            'NO se copiaron: "FDA approved" (sin número de autorización), "high success rate", "proven to cause significant improvement and long-term pain relief", "little to no side effects", "no restrictions", "revolutionary / excellent / latest treatment", "eliminating the need for painkillers", "almost immediate pain relief" (contradice las 6 a 8 semanas), "hyperstimulated pain receptors become numb".',
            'La web en vivo lista "bone marrow edema" como condición tratada: no se incluyó. Confirmar con el médico.',
            '"No matter your insurance coverage / regardless of insurance" es ambiguo (¿cobro particular?): no se copió. La cobertura se dejó como "Medicare, Medicaid and most major plans", igual que la Home.',
            'La web en vivo menciona el equipo "Piezo Shockwave 2": no se nombró la marca. Confirmar si se quiere mostrar.',
            '"6 to 8 weeks" y "once a week for several weeks" vienen de la web en vivo: confirmar con el médico.',
            'Faltan contraindicaciones y quién NO debe recibir el tratamiento.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'La imagen es la misma "featured" de la Home. La web en vivo dice "Brooklyn": confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'emtt-therapy',
        name: 'EMTT Therapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'EMTT Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'EMTT (electromagnetic transduction therapy) for deep-tissue pain in Brooklyn: non-operative and drug-free. Medicare & Medicaid accepted.',
        h1: 'Electromagnetic Transduction Therapy (EMTT) in Brooklyn, NYC',
        lead: 'A non-operative, drug-free technology that uses focused electromagnetic energy to reach deep-tissue pain.',
        checks: ['Non-surgical', 'Drug-free', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/image-4-1.png',
            alt: 'EMTT electromagnetic transduction therapy device'
        },
        what: {
            title: 'What is EMTT?',
            paras: [
                'Electromagnetic transduction therapy (EMTT), also known as extracorporeal magnetotransduction therapy, is a high-energy electromagnetic technology for deep-tissue pain. It is non-operative and drug-free.',
                'Dr. Henry Sardar first assesses you, then sets the treatment area, the length of each session and the number of sessions. EMTT is also used in our pelvic floor therapy.'
            ],
            cardGroups: [
                {
                    title: 'EMTT vs. PEMF mats',
                    items: [
                        { t: 'Consumer PEMF mats', d: 'Low-intensity, whole-body and unsupervised.' },
                        { t: 'EMTT in our office', d: 'Focused on the painful area, with the treatment set by your physician after an assessment.' }
                    ]
                }
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Radiculopathies', 'Joint diseases', 'Non-specific chronic back pain', 'Low back pain', 'Herniated discs', 'Osteoarthritis', 'Achilles tendinopathy', 'Rotator cuff tendinopathy', 'Shoulder pain', 'Plantar fasciitis', 'Joint and tendon inflammation', 'Osteitis pubis']
        },
        steps: {
            title: 'What to expect',
            intro: 'EMTT can be used for chronic pain or a new acute injury. No anesthesia is needed.',
            items: [
                { t: 'Assessment', d: 'Dr. Sardar assesses you and sets the treatment area.' },
                { t: 'Treatment', d: 'The device is positioned over the painful area. The number and length of sessions depend on how you respond.' },
                { t: 'Afterwards', d: 'You can usually return to normal activity. Some patients notice mild discomfort or redness, which resolves within a few days.' }
            ]
        },
        extras: [
            {
                id: 'exclusions',
                title: 'Who should not have EMTT',
                intro: 'EMTT is not suitable if you have:',
                type: 'tags',
                items: ['Pregnancy', 'A pacemaker or defibrillator that is not MRI safe', 'Open wounds in the treatment area']
            }
        ],
        faq: [
            { q: 'What is the difference between EMTT and a PEMF mat?', a: 'PEMF mats are consumer products: low-intensity, whole-body and unsupervised. EMTT is focused on the painful area and delivered in the office after your physician assesses you.' },
            { q: 'Do I need anesthesia?', a: 'No. EMTT does not require anesthesia.' },
            { q: 'How many sessions will I need?', a: 'It depends on how you respond. Your physician sets the number and length of sessions after your assessment.' },
            { q: 'Who should not receive EMTT?', a: 'EMTT is not suitable during pregnancy, with a pacemaker or defibrillator that is not MRI safe, or over open wounds in the treatment area.' },
            { q: 'Is EMTT covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Call your nearest location and we will review your coverage for this treatment.' }
        ],
        related: ['shock-wave-therapy', 'laser-therapy', 'tecar-therapy'],
        confirm: [
            'NO se copiaron: "FDA approved" (la FDA suele "autorizar/clearance" los equipos, no "aprobarlos"), "no reported side effects" (la propia página menciona molestias y enrojecimiento), "clinical studies show…" (sin citas), "7 inches deep", "3 Hz impulse every nanosecond" (incoherente), "almost immediate relief", "relief lasting 6 months to more than a year", "painless", "best alternative to surgery", "cure chronic pain", "treatment of choice among Dr. Sardar\'s patients".',
            'Terminología inconsistente en la web en vivo: "Electromagnetic Transduction Therapy" y "Extracorporeal Magnetotransduction Therapy". Confirmar el nombre oficial.',
            'La web en vivo lista "pain in the spinal cord" como condición: no se incluyó. "Lumbalgia" se omitió por duplicar "low back pain".',
            'No se nombró el equipo (Magnetolith) ni su frecuencia: confirmar si se quiere mostrar.',
            'Las exclusiones (embarazo, marcapasos no compatibles con RM, heridas abiertas) vienen de la web en vivo: confirmar la lista completa de contraindicaciones con el médico.',
            '"No matter what your insurance covers" es ambiguo: no se copió.',
            'Imagen: la misma "image-4-1.png" de la Home (572 KB, resolución baja y la marca "STORZ MEDICAL" visible). Conviene una imagen horizontal propia.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Falta número de sesiones y duración. Confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'laser-therapy',
        name: 'Laser Therapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'Cold Laser Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Cold laser (low-level laser) therapy for musculoskeletal pain in Brooklyn: non-invasive and drug-free. Medicare & Medicaid accepted.',
        h1: 'Cold Laser Pain Therapy in Brooklyn, NYC',
        lead: 'Low-level laser light reaches deep tissue to support healing and ease musculoskeletal pain, without incisions or anesthesia.',
        checks: ['Non-invasive', 'No anesthesia', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/10/ptc-cold-laser-therapy-featured.jpg',
            alt: 'Cold laser therapy treatment for pain in Brooklyn'
        },
        what: {
            title: 'What is cold laser therapy?',
            paras: [
                'Cold laser therapy, also called low-level laser therapy (LLLT), uses light at specific wavelengths to reach deep tissues such as muscle, tendon and ligament. It is used for chronic and acute musculoskeletal pain, and for some patients it is a non-intrusive alternative to injections and surgery.',
                'After assessing the area, your provider selects the wavelength and output of the device. Dr. Henry Sardar offers this treatment, which is also part of our pelvic floor therapy.'
            ],
            cardGroups: [
                {
                    title: 'How it may help',
                    items: [
                        { t: 'Less inflammation', d: 'Increased blood flow and less swelling.' },
                        { t: 'Pain blocking', d: 'Helps block pain signals.' },
                        { t: 'Cell healing', d: 'Supports cellular healing and regeneration.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'Cold laser therapy may be right for you if you have:',
            items: [
                'Pain months after surgery',
                'Recurring pain from an old injury',
                'Nagging joint or muscle pain',
                'Chronic pain that has not responded to other therapies',
                'Joint flexibility issues'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Painful muscle spasms', 'Knee pain', 'Low back pain', 'Neck pain', 'Tennis elbow', 'Bursitis', 'Tendonitis', 'Muscle strains']
        },
        steps: {
            title: 'What to expect',
            intro: 'A session lasts up to 10 minutes. Multiple sessions may be needed for the best results.',
            items: [
                { t: 'Assessment', d: 'Your provider assesses the painful area.' },
                { t: 'Settings', d: 'The wavelength and output of the laser are selected for your condition.' },
                { t: 'Treatment', d: 'You may feel mild warmth and possibly some tingling. There are no incisions and no anesthesia.' }
            ]
        },
        combine: {
            title: "What if cold laser therapy doesn't work for me?",
            intro: 'We design a tailored plan for each patient. Cold laser therapy can be combined with:',
            items: [
                { label: 'Shockwave therapy', slug: 'shock-wave-therapy' },
                { label: 'Cryotherapy', slug: 'cryotherapy' },
                { label: 'EMTT', slug: 'emtt-therapy' },
                { label: 'TECAR therapy', slug: 'tecar-therapy' },
                { label: 'Aqua therapy', slug: 'aqua-therapy' },
                { label: 'Kinesiology taping' },
                { label: 'Ultrasound-guided injections', slug: 'ultrasound-guided-injection' },
                { label: 'Fluoroscopy-guided epidural and facet injections', slug: 'steroid-injection' },
                { label: 'Physical and occupational therapy', slug: 'physical-therapy-occupational-therapy' }
            ]
        },
        faq: [
            { q: 'Is cold laser therapy painful?', a: 'No. You may feel mild warmth and possibly some tingling. A session takes up to 10 minutes, with no incisions and no anesthesia.' },
            { q: 'How many sessions will I need?', a: 'Multiple sessions may be needed for the best results. Your provider will recommend a plan after assessing you.' },
            { q: 'Is cold laser the same as low-level laser therapy (LLLT)?', a: 'Yes. Cold laser therapy is also called low-level laser therapy.' },
            { q: 'Is cold laser therapy covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Call your nearest location and we will review your coverage for this treatment.' }
        ],
        related: ['shock-wave-therapy', 'emtt-therapy', 'tecar-therapy'],
        confirm: [
            'NO se copiaron: "FDA approved" (sin número), "one of the most effective interventions", "optimal results", "research shows…" (sin citas), "New York\'s leading pain clinic", "almost immediate relief / significant relief after one session", "minimal risk / causing no harm", "promotes relaxation and reduces anxiety", "restore motor function faster", "the latest therapies".',
            'La web en vivo se contradice: longitudes de onda (760-1050 nm vs 600-950 nm) y duración de sesión ("2-3 minutes" vs "up to 10 minutes"). Se usó "up to 10 minutes" y no se mencionaron longitudes de onda. Confirmar con el médico.',
            'No se nombró el equipo (K-Laser). La web en vivo no cita artritis ni fibromialgia como condiciones tratadas en esta sección: se omitieron.',
            '"Complimentary sessions for all patients regardless of insurance": sin términos claros, no se copió.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'La lista "combined with" enlaza a páginas de este grupo y de los otros. Confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'pit-therapy',
        name: 'PIT Therapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'PIT Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Perineural injection therapy (PIT) for nerve-related pain in Brooklyn: dextrose injections, drug-free and non-surgical.',
        h1: 'Perineural Injection Therapy (PIT) for Pain in Brooklyn, NYC',
        lead: 'Small dextrose injections near an irritated nerve to support natural healing and ease nerve-related pain. Also known as neural prolotherapy.',
        checks: ['Non-surgical', 'Drug-free', 'Brief sessions'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/PIT-Therapy-3.avif',
            alt: 'Perineural injection therapy (PIT) for nerve pain'
        },
        what: {
            title: 'What is perineural injection therapy (PIT)?',
            paras: [
                'PIT, also known as neural prolotherapy or Lyftogt perineural injection treatment, uses dextrose injections to support natural healing and ease pain from irritated nerves.',
                'Neuropathic pain comes from injury and inflammation that affect nerve function. Common causes include sports injuries, surgical injuries, chronic disease such as diabetes, and neurologic disease such as multiple sclerosis.',
                'Treatment is performed by Dr. Henry Sardar.'
            ],
            cardGroups: [
                {
                    title: 'How PIT works',
                    items: [
                        { t: 'Targeted injections', d: 'A series of injections of a 5% dextrose solution is placed near the painful nerve, at a point where a superficial nerve is prone to compression.' },
                        { t: 'Natural healing', d: "The dextrose is used to support the body's natural healing and pain suppression." }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'PIT may be an option if you have:',
            items: [
                'Recurrent or chronic pain',
                'Painful nerves',
                'A musculoskeletal disorder',
                'Difficulty moving a joint',
                'Pain from a ligament injury',
                'Pain that has not improved with pain medication',
                'Pain during post-surgical rehabilitation'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Ankle pain', 'Chronic low back pain', 'Elbow pain', 'Wrist pain', 'Joint pain', 'Spine pain', 'Neck pain or strain', 'Arthritis pain', 'Carpal tunnel pain', 'Neuropathic pain']
        },
        steps: {
            title: 'What to expect',
            intro: 'Sessions are brief. A typical course is about 5 to 8 sessions, depending on your condition and response.',
            items: [
                { t: 'Locate', d: 'Dr. Sardar locates the injured nerve.' },
                { t: 'Disinfect', d: 'The skin is disinfected.' },
                { t: 'Inject', d: 'A 5% dextrose solution is injected with a small needle between the muscle and the deepest layer of skin.' },
                { t: 'Afterwards', d: 'Slight discomfort, bruising and redness are possible and resolve within a few days. An ice pack can help.' }
            ]
        },
        faq: [
            { q: 'How soon will I feel relief?', a: 'Relief may begin within minutes, but the effect of the first injection is often short-lived. Consistent sessions are meant to reduce pain progressively.' },
            { q: 'Are there restrictions after PIT?', a: 'You can usually continue work and your daily routine. Avoid exercise or activities that stress the treated area.' },
            { q: 'How many sessions will I need?', a: 'A typical course is about 5 to 8 sessions, depending on your condition and how you respond. Your physician will confirm your plan.' },
            { q: 'Is PIT covered by insurance?', a: 'Coverage for PIT varies by plan. Call your nearest location and we will review your options before your visit. [PIT INSURANCE COVERAGE: TO CONFIRM]' }
        ],
        related: ['tecar-therapy', 'cryotherapy', 'laser-therapy'],
        confirm: [
            'NO se copiaron: "high success rate", "revolutionary approach", "one of the best non-invasive alternatives", "New York\'s best pain management clinic", "little to no reported adverse effects", "no recovery period" y "no restrictions" (se contradicen con la sección de recuperación de la misma página), "eliminating pain / no pain signals, no pain", "long-lasting pain relief" (contradice que el efecto de la primera inyección es corto), explicaciones del mecanismo (debilita receptores del dolor, proliferación celular).',
            'COBERTURA: la web en vivo dice que PIT se ofrece "regardless of what your insurance covers" (ambiguo). No se afirma cobertura: el FAQ lleva el marcador visible [PIT INSURANCE COVERAGE: TO CONFIRM].',
            '"5 to 8 sessions" y la solución de dextrosa al 5% vienen de la web en vivo: confirmar con el médico. No se nombró el "punto de Valleix".',
            'Los nombres alternativos (neural prolotherapy, Lyftogt) vienen de la web: confirmar que se quiere mostrarlos.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece (la web dice "Brooklyn").'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'tecar-therapy',
        name: 'TECAR Therapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'TECAR Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'TECAR therapy (radiofrequency thermotherapy) for joint and muscle pain in Brooklyn: non-invasive and drug-free.',
        h1: 'TECAR Therapy for Pain Relief in Brooklyn, NYC',
        lead: 'TECAR (Transfer of Energy Capacitive and Resistive) is a radiofrequency heat therapy that encourages healing in joints and muscles.',
        checks: ['Non-invasive', 'Drug-free', 'No anesthesia'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/TECAR-Therapy-1.avif',
            alt: 'TECAR therapy session for joint and muscle pain'
        },
        what: {
            title: 'What is TECAR therapy?',
            paras: [
                'TECAR therapy is a thermotherapy (heat-based) treatment that uses radiofrequency to generate energy and encourage healing. It is used for joint and muscle disorders, low back and spine pain, sports injuries and other painful conditions.',
                'Dr. Henry Sardar offers TECAR therapy at Pain Therapy Medical Care.'
            ],
            cardGroups: [
                {
                    title: 'How it is meant to help',
                    items: [
                        { t: 'Pain relief', d: 'Aims to reduce pain signals.' },
                        { t: 'Tissue repair', d: 'Supports tissue repair and regeneration.' },
                        { t: 'Muscle relaxation', d: 'Heat widens blood vessels, increasing blood flow, oxygen and nutrients.' },
                        { t: 'Less swelling', d: 'Increased circulation supports lymphatic drainage and reduces swelling.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'TECAR therapy may be a good fit if you have:',
            items: [
                'Chronic back, neck or other musculoskeletal pain',
                'A musculoskeletal injury you are recovering from',
                'Physical therapy in progress and a wish for faster progress',
                'Pain that interferes with daily life or normal activities',
                'Pain that has not improved with conventional treatment or pain medication',
                'A wish to avoid the risks of surgery',
                'A wish for a non-surgical, non-pharmacological option'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Joint pain', 'Shoulder tendinitis', 'Neuropathy', 'Carpal tunnel syndrome', 'Low back pain', 'Epicondylitis', 'Neck pain', 'Heel spurs', 'Knee or hip osteoarthritis', 'Plantar fasciitis', 'Post-surgery rehabilitation', 'Scar tissue treatment', 'Sports trauma', 'Sprains and bruises']
        },
        steps: {
            title: 'What to expect',
            intro: 'A typical session lasts 15 to 20 minutes at most. No anesthesia is needed.',
            items: [
                { t: 'Cream', d: 'A conductive cream is applied to the skin.' },
                { t: 'Electrode', d: 'An electrode is placed on the area and delivers radiofrequency energy.' },
                { t: 'Aftercare', d: 'Rest the treated area and avoid strenuous activity afterwards. Some patients report a tingling sensation.' }
            ]
        },
        faq: [
            { q: 'How long is a TECAR session?', a: 'A typical session lasts 15 to 20 minutes at most, and no anesthesia is needed.' },
            { q: 'How many sessions will I need?', a: 'Your physician decides the number of sessions and the schedule after assessing you. [NUMBER OF SESSIONS: TO CONFIRM]' },
            { q: 'What should I do after a session?', a: 'Rest the treated area and avoid strenuous activity. Some patients report a tingling sensation.' },
            { q: 'Is TECAR therapy covered by insurance?', a: 'Coverage for TECAR therapy varies by plan. Call your nearest location and we will review your options before your visit. [TECAR INSURANCE COVERAGE: TO CONFIRM]' }
        ],
        related: ['shock-wave-therapy', 'laser-therapy', 'cryotherapy'],
        confirm: [
            'NO se copiaron: "entirely safe and effective", "no known side effects" (la propia página menciona hormigueo), "safe for any age or gender", "one of the top surgery alternatives to cure acute and chronic pain", "one of the most effective thermotherapy treatments", "best non-operative treatment", "significant improvement within a few hours" (sin citas), "long-term results", "relief for six months to a year", "electrical currents alter the magnetic field / polarize cell membranes".',
            'COBERTURA: la web en vivo dice que la mayoría de los seguros NO cubren TECAR y que la clínica lo ofrece "regardless of coverage"; también ofrece una prueba gratuita sin términos. No se afirma cobertura ni se copió la prueba: el FAQ lleva el marcador visible [TECAR INSURANCE COVERAGE: TO CONFIRM].',
            'La web en vivo lista "pain from cancer or cancer treatment" y "lymphatic and vascular disorders" como condiciones: no se incluyeron. Confirmar con el médico (precauciones oncológicas).',
            'La web exige "a commitment to an intense treatment plan": se omitió. Faltan número de sesiones y contraindicaciones: el FAQ lleva el marcador [NUMBER OF SESSIONS: TO CONFIRM].',
            'No se nombró el equipo (Capenergy TECAR): confirmar si se quiere mostrar.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'cryotherapy',
        name: 'Cryotherapy',
        kicker: 'Advanced technology',
        relatedTitle: 'Other advanced technology treatments',
        schemaType: 'MedicalTherapy',
        title: 'Cryotherapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Localized cryotherapy (cold therapy) for musculoskeletal pain in Brooklyn: non-surgical and drug-free.',
        h1: 'Cryotherapy for Pain Relief in Brooklyn, NYC',
        lead: 'Localized cold therapy applies extreme cold to the painful area to help ease pain and swelling, without surgery or medication.',
        checks: ['Non-surgical', 'Non-pharmacological', 'Sessions of 2 to 3 minutes'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/image-25_converted.avif',
            alt: 'Localized cryotherapy treatment for pain'
        },
        what: {
            title: 'What is cryotherapy?',
            paras: [
                'Cryotherapy is cold therapy: extreme cold is applied locally to a painful area. It follows the same principle as an ice pack, which reduces swelling and pain, applied on a larger scale.',
                'The cold is applied with a device called Cryo Polar Bear, at temperatures between -148°F and -220°F in a localized area. Dr. Henry Sardar offers it to all patients with acute or chronic pain, not only athletes.'
            ],
            cardGroups: [
                {
                    title: 'How it may help',
                    items: [
                        { t: 'Pain relief', d: 'Cold numbs the area and helps reduce pain signals.' },
                        { t: 'Less swelling', d: 'Cold constricts blood vessels to reduce swelling.' },
                        { t: 'Circulation', d: 'Afterwards, blood vessels widen and bring more circulation to the tissue.' }
                    ]
                }
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Neck pain', 'Low back pain', 'Post-orthopedic surgery', 'Arthritis', 'Osteoarthritis', 'Sprains', 'Tendonitis', "Runner's knee", 'Delayed onset muscle soreness', 'Muscle spasms', 'Neuromas or nerve entrapment (pinched nerve)']
        },
        steps: {
            title: 'What to expect',
            intro: 'A session takes 2 to 3 minutes, depending on your condition.',
            items: [
                { t: 'Consultation', d: 'You meet Dr. Sardar to build a treatment plan.' },
                { t: 'Treatment', d: 'The cold is applied locally to the painful area.' },
                { t: 'Afterwards', d: 'Numbness in the treated area is normal. Most patients can return to their daily activities.' }
            ]
        },
        faq: [
            { q: 'How long is a cryotherapy session?', a: 'A session takes 2 to 3 minutes, depending on your condition.' },
            { q: 'Is numbness normal?', a: 'Yes. Numbness in the treated area is normal after a session.' },
            { q: 'Can I combine cryotherapy with physical therapy?', a: 'Yes. A short session before physical therapy can reduce swelling and tenderness, which can make rehab more comfortable.' },
            { q: 'Is cryotherapy covered by insurance?', a: 'Coverage for cryotherapy varies by plan. Call your nearest location and we will review your options before your visit. [CRYOTHERAPY INSURANCE COVERAGE: TO CONFIRM]' }
        ],
        related: ['laser-therapy', 'tecar-therapy', 'shock-wave-therapy'],
        confirm: [
            'NO se copiaron: "one of the most advanced non-surgical treatments", "one of the best in the world", "remove toxins", "little to no risks", "almost immediate pain relief", "relief after just one session", "has been shown to boost outcomes" (sin cita), "go-to treatment", "superb reputation", celebridades y atletas.',
            'La web en vivo lista "multiple sclerosis" como condición tratada en una página musculoesquelética: no se incluyó. Confirmar con el médico.',
            'La web en vivo llama "near-freezing" a -148°F (incorrecto). Se dejó el rango de temperatura tal cual lo da la web: confirmar con el médico y el equipo.',
            'Credencial: la web dice "certified pain management specialist": no se copió. Equipo: "Cryo Polar Bear": confirmar que se quiere mostrar.',
            'COBERTURA: la web en vivo ofrece una prueba "regardless of insurance" sin términos claros. No se copió ni se afirma cobertura: el FAQ lleva el marcador visible [CRYOTHERAPY INSURANCE COVERAGE: TO CONFIRM].',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto. El título original tiene un error ("What Conditions Does Cryotherapy?").',
            'Confirmar en qué sedes se ofrece (la web dice "Brooklyn").'
        ]
    }
];
