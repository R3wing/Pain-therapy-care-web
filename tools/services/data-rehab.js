/* =========================================================
   Grupo REHAB & THERAPY (5 páginas). Se suma a data.js.
   Mismo esquema de campos que data.js, más (todos opcionales):
     schemaType              → @type de schema.org (PhysicalTherapy / MedicalTherapy)
     relatedTitle            → título de la sección "otros tratamientos"
     candidates.groups[]     → listas con subtítulo {title, items[]}
     conditions.groups[]     → etiquetas con subtítulo {title, items[]}
     extras[]                → {id, title, intro?, type: 'checks' | 'tags', items[]}
     provider                → {title, name, role, image {src, alt}}
   Origen: páginas en vivo de paintherapycare.com/services/… reescritas
   más cortas. Lo omitido por no tener respaldo está en `confirm`.
========================================================= */

module.exports = [
    /* ------------------------------------------------------- */
    {
        slug: 'physical-therapy-occupational-therapy',
        name: 'Physical Therapy & OT',
        kicker: 'Rehab & therapy',
        relatedTitle: 'Other rehab & therapy treatments',
        schemaType: 'PhysicalTherapy',
        title: 'Physical & Occupational Therapy | Pain Therapy Medical Care',
        desc: 'Physical and occupational therapy in Brooklyn to restore movement and daily function without surgery. Medicare & Medicaid accepted.',
        h1: 'Physical & Occupational Therapy in Brooklyn, NYC',
        lead: 'Physical therapy restores movement and strength. Occupational therapy helps you regain the daily activities and fine motor skills you have lost. Together they support your recovery without surgery.',
        checks: ['Non-invasive', 'Home exercise program', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/physical-therapy-patient-receiving-leg-care.webp',
            alt: 'Physical therapy patient receiving leg care'
        },
        what: {
            title: 'What are physical and occupational therapy?',
            paras: [
                'Physical therapy (PT) is a rehabilitative approach that restores movement, function and gross motor skills. It addresses the physical side of an injury without surgery or invasive procedures, using exercises, stretches, sensory integration and functional activities.',
                'Occupational therapy (OT) helps you regain control of daily activities such as eating, showering and dressing, and the fine motor skills affected by a physical or neurological injury. It treats the whole person, including how you adapt to your condition.',
                'Care is led by Dr. Henry Sardar, a Physical Medicine and Rehabilitation specialist.'
            ],
            cardGroups: [
                {
                    title: 'Goals of physical therapy',
                    items: [
                        { t: 'Pain relief', d: 'Reduces muscle strain and helps ease pain.' },
                        { t: 'Better function', d: 'Rebuilds strength, movement and range of motion after surgery, injury or a chronic condition.' },
                        { t: 'Prevention', d: 'Reduces physical stress and strengthens support to help prevent further damage.' }
                    ]
                },
                {
                    title: 'Goals of occupational therapy',
                    items: [
                        { t: 'Fine motor skills', d: 'Practice everyday tasks such as brushing your teeth or cutting food.' },
                        { t: 'Adaptation', d: 'Relearn daily tasks so you can do them independently.' },
                        { t: 'Simpler activities', d: 'Adjust routines and environments, or use adaptive tools.' },
                        { t: 'Stress management', d: 'Build coping strategies for work and school.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: '',
            groups: [
                {
                    title: 'Physical therapy may help if you are:',
                    items: [
                        'Recovering from a debilitating injury',
                        'Recovering from a physically limiting condition, such as a stroke or paralysis',
                        'Living with chronic pain',
                        'Looking for natural pain relief',
                        'Wanting to avoid surgery or steroid injections',
                        'Wanting to speed healing by combining therapies'
                    ]
                },
                {
                    title: 'Occupational therapy may help if you are:',
                    items: [
                        'Recovering from a debilitating surgical procedure',
                        'Managing chronic pain',
                        'Living with a joint or hand condition',
                        'Living with developmental disabilities',
                        'Living with a neurological condition, such as a stroke or MS',
                        'Dealing with depression or anxiety'
                    ]
                }
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Pain management', 'Cerebral palsy', 'Stroke or paralysis', 'Dementia', "Parkinson's disease", 'Osteoarthritis', 'Rheumatoid arthritis', 'Cognitive disabilities', 'Surgery rehabilitation', 'Sports or traumatic injuries', 'Developmental disabilities', 'Carpal tunnel syndrome']
        },
        extras: [
            {
                id: 'benefits',
                title: 'Benefits',
                type: 'checks',
                items: [
                    'A natural approach to pain relief that aims to treat the cause of pain',
                    'A non-invasive way to support healing',
                    'A home exercise program',
                    'Strategies and tools for everyday life (occupational therapy)'
                ]
            }
        ],
        faq: [
            { q: 'What is the difference between physical and occupational therapy?', a: 'Physical therapy restores movement, strength and function. Occupational therapy helps you regain daily activities and fine motor skills. Your provider will recommend the right combination for you.' },
            { q: 'Do you offer pelvic floor rehabilitation?', a: 'Yes. Hands-on pelvic floor rehabilitation is available for a tight, painful pelvic floor.' },
            { q: 'Can I continue my exercises at home?', a: 'Your plan can include a home exercise program.' },
            { q: 'Is physical therapy covered by insurance?', a: 'Coverage often depends on a recommendation from your primary provider, orthopedic surgeon or physical therapist. We accept Medicare, Medicaid and most major plans, and we review your coverage first.' }
        ],
        related: ['aqua-therapy', 'ims-therapy', 'pelvic-floor-therapy'],
        confirm: [
            'NO se copiaron: "cure chronic pain of sports injury", "boosts immunity against chronic inflammatory disease", "according to research" (PT en niños y adultos mayores), "evidence-based", "natural, safe and effective", "one of the top Physical Medicine and Rehabilitation specialists", "the best rehabilitation plan", "soon you will be able to brush your teeth".',
            'La web en vivo presenta PT como "alternativa a la cirugía": se suavizó a "una forma no invasiva de apoyar la recuperación".',
            'La lista de condiciones (demencia, parálisis cerebral, Parkinson, etc.) viene de la web en vivo: confirmar con el médico.',
            'La web habla de atención "en la clínica o en casa": solo se dejó "home exercise program". Confirmar si hay visitas a domicilio.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece (la web dice "Brooklyn").',
            'El alt de una imagen de OT en la web en vivo dice "Spinal Stenosis Recovery" (no coincide): no se usó.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'aqua-therapy',
        name: 'Aqua Therapy',
        kicker: 'Rehab & therapy',
        relatedTitle: 'Other rehab & therapy treatments',
        schemaType: 'PhysicalTherapy',
        title: 'Aqua Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Aqua physical therapy in Brooklyn: therapeutic exercise in water to ease pain and support recovery. Medicare & Medicaid accepted.',
        h1: 'Aqua Physical Therapy in Brooklyn, NYC',
        lead: 'Therapeutic exercise in water lets you move without being limited by pain, supporting recovery from injury, surgery and chronic pain.',
        checks: ['Non-invasive', 'Guided by trained therapists', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/smiling-in-pool-aqua-therapy.webp',
            alt: 'Patient smiling in the pool during aqua physical therapy'
        },
        what: {
            title: 'What is aqua physical therapy?',
            paras: [
                'Aqua therapy is a rehabilitative treatment for musculoskeletal disorders that uses aquatic exercise programs and water circuit therapy.',
                'Combining water with therapeutic exercise lets you move without being limited by pain. Dr. Henry Sardar, a Physical Medicine and Rehabilitation practitioner, uses aqua therapy for sports, orthopedic and neurological conditions.'
            ],
            cardGroups: [
                {
                    title: 'How it helps',
                    items: [
                        { t: 'Muscle strengthening', d: 'Water resistance, less stress on muscles and joints, and improved circulation.' },
                        { t: 'Body awareness', d: 'Better proprioception: improved body awareness, coordination and range of motion.' }
                    ]
                }
            ]
        },
        candidates: {
            title: 'Who can benefit?',
            intro: 'Aqua therapy may be a good fit if you are:',
            items: [
                'Recovering from a stroke',
                'Recovering from a recent musculoskeletal injury',
                'In post-surgery rehabilitation',
                'Looking to speed up a physical therapy plan',
                'Wanting to regain muscle strength quickly',
                'Looking for a natural method of pain relief'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Low back pain', 'Joint pain', 'Fibromyalgia', 'Rotator cuff tendinitis', 'Arthritis', 'Sprains, strains and fractures', 'Stroke', 'Cerebral palsy', 'Spinal cord injuries', 'Traumatic brain injuries']
        },
        extras: [
            {
                id: 'safety',
                title: 'Is aqua therapy safe?',
                intro: 'What you can expect during your sessions:',
                type: 'checks',
                items: [
                    'Therapists are trained in medical aid and risk awareness, and guide your exercises',
                    'Non-swimmers can take part: exercises are done in shallow water',
                    'A team member stays with you at all times',
                    'Pools and equipment are disinfected frequently'
                ]
            }
        ],
        faq: [
            { q: 'Do I need to know how to swim?', a: 'No. Non-swimmers can take part. Exercises are done in shallow water and a team member stays with you at all times.' },
            { q: 'Who is aqua therapy for?', a: 'People recovering from an injury, a stroke or surgery, or living with chronic pain.' },
            { q: 'Which conditions can aqua therapy help with?', a: 'We use it for sports, orthopedic and neurological conditions, such as low back pain, joint pain, arthritis and rotator cuff tendinitis. Ask your provider about your condition.' },
            { q: 'Is aqua therapy covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Coverage for aqua therapy depends on your plan, so we review it with you first.' }
        ],
        related: ['physical-therapy-occupational-therapy', 'ims-therapy', 'pelvic-floor-therapy'],
        confirm: [
            'NO se copiaron: efectos del agua fría/caliente sobre los vasos sanguíneos, "anti-gravity property", "detoxifying effects", "no surgery is needed", "minimal risk / no significant risks", "faster recovery", "gets them back into the game in no time", "no matter what their insurance covers", "one of the top practitioners in Brooklyn".',
            'Los resultados neurológicos (ACV, parálisis cerebral, lesión medular) se dejaron solo como condiciones; la web en vivo promete mejorar movilidad sin evidencia. Confirmar con el médico.',
            'La sección "Is aqua therapy safe?" repite lo que dice la web en vivo sobre la piscina y el personal: confirmar que es exacto.',
            'La web en vivo dice "Brooklyn": confirmar en qué sede(s) hay piscina y datos de la piscina (temperatura, profundidad).',
            'La web afirma que es apto para niños y adultos mayores: no se incluyó, falta confirmación.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'ims-therapy',
        name: 'IMS Therapy',
        kicker: 'Rehab & therapy',
        relatedTitle: 'Other rehab & therapy treatments',
        schemaType: 'MedicalTherapy',
        title: 'IMS Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Intramuscular stimulation (IMS) for chronic pain and muscle tightness in Brooklyn. Medicare & Medicaid accepted.',
        h1: 'Intramuscular Stimulation (IMS) Therapy in Brooklyn, NYC',
        lead: 'A non-surgical treatment for chronic pain and musculoskeletal problems linked to nerve dysfunction and muscle tightness, using fine acupuncture-like needles.',
        checks: ['Non-surgical', 'Fine, acupuncture-like needles', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/image-26_converted.avif',
            alt: 'Intramuscular stimulation therapy for pain in Brooklyn'
        },
        what: {
            title: 'What is intramuscular stimulation (IMS)?',
            paras: [
                'Intramuscular stimulation, also known as A-IMS, is a form of dry needling developed by Dr. Chan Gunn. Fine, acupuncture-like needles are placed in tight or shortened muscles to help release tension.',
                'It is used for chronic pain and musculoskeletal problems, especially those linked to nerve dysfunction and muscle tightness.'
            ]
        },
        conditions: {
            title: 'Conditions treated',
            items: ['Sciatica', 'Chronic back pain', 'Chronic neck pain', 'Myofascial pain syndrome', 'Repetitive strain injuries']
        },
        steps: {
            title: 'How IMS works',
            intro: '',
            items: [
                { t: 'Assess', d: 'A practitioner finds tight areas or trigger points through a physical assessment and your history.' },
                { t: 'Insert needles', d: 'Fine needles are placed in tight or shortened muscles.' },
                { t: 'Twitch response', d: 'A twitch indicates the muscle is releasing tension.' }
            ]
        },
        provider: {
            title: 'Meet your A-IMS expert',
            name: 'Anna Ducksoon Lee, MD',
            role: 'A-IMS expert',
            image: {
                src: 'https://paintherapycare.com/wp-content/uploads/2026/04/Anna-Ducksoon-Lee_converted.avif',
                alt: 'Anna Ducksoon Lee, MD'
            }
        },
        faq: [
            { q: 'What is the difference between IMS and dry needling?', a: 'IMS is a form of dry needling. Fine needles are placed in tight or shortened muscles to help release tension.' },
            { q: 'Are there restrictions after IMS treatment?', a: 'There are typically no significant restrictions. Your provider may suggest avoiding intense exercise for 24 to 48 hours, drinking plenty of water, doing gentle stretching or light activity, and minimizing alcohol right after treatment. Most patients resume normal activities shortly after.' },
            { q: 'Which conditions can IMS help with?', a: 'IMS is used for sciatica, chronic back and neck pain, myofascial pain syndrome and repetitive strain injuries.' },
            { q: 'Is IMS covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Call your nearest location and we will review your coverage for this treatment.' }
        ],
        related: ['physical-therapy-occupational-therapy', 'aqua-therapy', 'pelvic-floor-therapy'],
        confirm: [
            'NO se copiaron: "highly effective", "significant improvements after just a few sessions", "targets the root cause", "restores nerve function", "flush out toxins", "revolutionary", "pioneer", "life-changing".',
            'Médico: la web en vivo presenta a "Anna Lee, MD" como experta en A-IMS con bio (pionera, más de 15 años, certificada en Cresskill, NJ). Solo se dejó nombre y rol. Confirmar nombre exacto y bio.',
            'La web en vivo pregunta "Will I feel any pain after the treatment?" (dos veces) y NO la responde: pedir la respuesta al médico.',
            'Faltan: número de sesiones, duración y contraindicaciones.',
            'Nombre del tratamiento: la web usa "IMS", "AIMS" y "A-IMS®" de forma inconsistente; confirmar el nombre oficial.',
            'Las restricciones posteriores (24-48 h sin ejercicio intenso, etc.) vienen de la web en vivo: confirmar con el médico.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'tmj-therapy',
        name: 'TMJ Therapy',
        kicker: 'Rehab & therapy',
        relatedTitle: 'Related treatments',
        schemaType: 'MedicalTherapy',
        title: 'TMJ Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Jaw pain, clicking or locking? Learn about TMJ disorder causes, symptoms and treatment options at Pain Therapy Medical Care in Brooklyn.',
        h1: 'TMJ Disorder: Jaw Pain Treatment in Brooklyn, NYC',
        lead: 'The temporomandibular joints connect your jaw to your skull. When they, or the muscles that control them, stop working well, you can feel pain when you talk, chew or yawn.',
        checks: ['Treatment based on cause and severity', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/04/TMJ-photo.avif',
            alt: 'Temporomandibular joint (TMJ) disorder jaw pain'
        },
        what: {
            title: 'What is TMJ disorder?',
            paras: [
                'TMJ disorder refers to a group of conditions affecting the joints that connect the jaw to the skull. These joints let you talk, chew and yawn. Pain occurs when the joints or the muscles that control them are not working properly.',
                'Treatment aims to relieve pain and improve jaw function. The options depend on the cause and severity of your symptoms.',
                '[TMJ TREATMENT AT OUR CLINIC: TO CONFIRM]'
            ],
            cardGroups: [
                {
                    title: 'General treatment options',
                    items: [
                        { t: 'Conservative therapies', d: 'Jaw rest, heat or cold packs, and physical therapy for mobility and muscle tension.' },
                        { t: 'Behavioral therapy', d: 'Stress management, relaxation and biofeedback to control muscle tension and clenching.' },
                        { t: 'Oral devices', d: 'Nightguards worn during sleep to prevent grinding, or devices that reposition the jaw.' },
                        { t: 'Injections', d: 'Corticosteroid injections for significant inflammation.' }
                    ]
                }
            ]
        },
        conditions: {
            title: 'Common symptoms',
            items: ['Pain or tenderness in the jaw, ear, face or neck', 'Popping, clicking or locking of the jaw', 'Difficulty or pain when chewing', 'Frequent headaches or migraines', 'Facial pain when touching certain areas', 'Tinnitus (ringing in the ears)']
        },
        extras: [
            {
                id: 'causes',
                title: 'Common causes',
                type: 'checks',
                items: [
                    'Jaw or head injuries',
                    'Tension or spasm in the chewing muscles',
                    'Dental misalignment, such as bruxism (teeth grinding) or an improper bite',
                    'Arthritis, rheumatoid or osteoarthritis',
                    'Emotional stress',
                    'Hereditary factors'
                ]
            },
            {
                id: 'prevention',
                title: 'Prevention and recommendations',
                type: 'checks',
                items: [
                    'Avoid bruxism and repetitive movements that overload the joint',
                    'Maintain good posture to reduce head and neck strain',
                    'Practice relaxation exercises to manage stress',
                    'Avoid chewing hard foods or gum',
                    'Consult a dentist or healthcare provider if symptoms persist or become painful'
                ]
            }
        ],
        faq: [
            { q: 'What are the symptoms of TMJ disorder?', a: 'Common symptoms include pain or tenderness in the jaw, ear, face or neck; popping, clicking or locking of the jaw; difficulty or pain when chewing; frequent headaches; and ringing in the ears.' },
            { q: 'What causes TMJ disorder?', a: 'Common causes include jaw or head injuries, tension in the chewing muscles, dental misalignment or teeth grinding, arthritis, emotional stress and hereditary factors.' },
            { q: 'When should I see a provider?', a: 'If your symptoms persist or become painful, consult a dentist or healthcare provider.' },
            { q: 'Is TMJ treatment covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Call your nearest location and we will review your coverage for this treatment.' }
        ],
        related: ['physical-therapy-occupational-therapy', 'steroid-injection', 'ims-therapy'],
        confirm: [
            'Esta página es educativa: la web en vivo describe TMJ en general y NO dice qué trata la clínica ni cómo. Por eso la sección principal termina con el marcador visible [TMJ TREATMENT AT OUR CLINIC: TO CONFIRM].',
            'NO se copiaron: medicamentos (NSAIDs, relajantes musculares), Botox y las opciones quirúrgicas (artroscopia, cirugía abierta, reemplazo de articulación): confirmar con el médico qué ofrece realmente la clínica.',
            'La web en vivo dice "Drug-Free Relief" y "Non-Surgical" pero lista medicamentos y cirugía en la misma página: contradicción a resolver.',
            'La web en vivo no nombra ningún médico en el cuerpo de la página.',
            'NO se copiaron afirmaciones sin respaldo: biofeedback "previene" el bruxismo, la fisioterapia "mejora" la movilidad, los dispositivos orales "alivian" la presión.',
            'La web en vivo no tiene FAQ ni meta description: las preguntas salen de datos de esa misma página; revisar el texto.',
            'Confirmar en qué sedes se ofrece.'
        ]
    },

    /* ------------------------------------------------------- */
    {
        slug: 'pelvic-floor-therapy',
        name: 'Pelvic Floor Therapy',
        kicker: 'Rehab & therapy',
        relatedTitle: 'Other rehab & therapy treatments',
        schemaType: 'PhysicalTherapy',
        title: 'Pelvic Floor Therapy in Brooklyn | Pain Therapy Medical Care',
        desc: 'Pelvic floor therapy in Brooklyn for a tight, painful pelvic floor: hands-on rehab with shockwave, EMTT and laser. Medicare & Medicaid accepted.',
        h1: 'Pelvic Floor Therapy in Brooklyn, NYC',
        lead: 'Hands-on rehabilitation combined with shockwave, EMTT and laser therapy for a tight, painful pelvic floor. Drug-free and non-surgical, for women and men.',
        checks: ['Hands-on rehabilitation', 'For women and men', 'Medicare & Medicaid accepted'],
        image: {
            src: 'https://paintherapycare.com/wp-content/uploads/2026/07/pelvic-floor-therapy-consultation-brooklyn-1024x683.jpg',
            alt: 'Pelvic floor therapy consultation in Brooklyn with a dedicated provider'
        },
        what: {
            title: 'What is pelvic floor therapy?',
            paras: [
                'The pelvic floor is a group of muscles, ligaments and nerves that support the bladder, bowel and reproductive organs. When it does not work well it can cause pain, leakage, urgency, constipation or radiating discomfort.',
                'Kegels and standard stretching do not help everyone. For some people the problem is a tight, overactive (hypertonic) pelvic floor rather than a weak one, so effective therapy starts by identifying what is driving the problem: a tight muscle, a weak muscle, nerve sensitization, or a mix.',
                'Pelvic floor care is provided by Yelena Shats, FNP-BC, at our Williamsburg location.'
            ],
            cardGroups: [
                {
                    title: 'Technology and hands-on care',
                    items: [
                        { t: 'Shockwave (ESWT)', d: 'Applied mostly externally, with no surgery, needles or medication. Used to ease spasm and calm sensitive trigger points and fascia.' },
                        { t: 'EMTT', d: 'Pulsed magnetic energy with no contact and no medication.' },
                        { t: 'Laser', d: 'High-intensity and low-level laser (photobiomodulation) to support tissue recovery.' },
                        { t: 'Hands-on physical therapy', d: 'Myofascial release, trigger point work and down-training.' }
                    ]
                }
            ]
        },
        conditions: {
            title: 'Conditions we treat',
            groups: [
                {
                    title: 'For everyone',
                    items: ['Hypertonic pelvic floor and spasm', 'Chronic pelvic pain and pressure', 'Pain worsened by prolonged sitting or cycling', 'Urinary and bowel urgency, frequency and leakage', 'Post-surgical pelvic pain and scar restriction', 'Tailbone (coccyx) pain']
                },
                {
                    title: 'For women',
                    items: ['Painful intercourse (dyspareunia) and vaginismus', 'Vulvodynia and provoked vestibulodynia', 'Postpartum pelvic pain and weakness', 'Endometriosis-related pelvic pain (muscular guarding)']
                },
                {
                    title: 'For men',
                    items: ['Chronic pelvic pain syndrome (CPPS)', 'Chronic non-bacterial prostatitis', 'Post-prostatectomy pelvic pain and dysfunction']
                }
            ]
        },
        steps: {
            title: 'Our clinical approach',
            intro: '',
            items: [
                { t: 'Evaluation', d: 'A comprehensive evaluation of muscle tone, trigger points, coordination, posture and nerve sensitivity.' },
                { t: 'Shockwave', d: 'Shockwave therapy for hypertonic tissue and nerve-driven pain.' },
                { t: 'Hands-on rehab', d: 'Myofascial release and down-training.' },
                { t: 'EMTT and laser', d: 'Added where appropriate.' },
                { t: 'Education', d: 'Education and a home program.' }
            ]
        },
        combine: {
            title: 'Part of a combined approach',
            intro: 'Pelvic floor therapy can be paired with other treatments we offer:',
            items: [
                { label: 'Shockwave therapy', slug: 'shock-wave-therapy' },
                { label: 'EMTT', slug: 'emtt-therapy' },
                { label: 'Laser therapy', slug: 'laser-therapy' },
                { label: 'Physical and occupational therapy', slug: 'physical-therapy-occupational-therapy' }
            ]
        },
        faq: [
            { q: "Why is my pelvic floor tight, and why don't Kegels help?", a: 'A tight (hypertonic) pelvic floor is already contracted, so adding more contraction may not help. Your provider will evaluate what is driving your symptoms before recommending a plan.' },
            { q: 'Can shockwave help with pelvic floor pain?', a: 'Shockwave is one of the tools we use for hypertonic tissue and nerve-driven pain. Whether it is right for you depends on your evaluation.' },
            { q: 'Is pelvic floor therapy only for women?', a: 'No. We treat both women and men.' },
            { q: 'Do you do internal exams?', a: 'Only with your full consent. They are not required, and shockwave is mostly applied externally.' },
            { q: 'How long until I notice improvement?', a: 'It varies from person to person and by condition. Your provider will discuss what to expect after your evaluation.' },
            { q: 'Is pelvic floor therapy covered by insurance?', a: 'We accept Medicare, Medicaid and most major plans. Coverage for pelvic floor therapy depends on your plan, so we review it with you first.' }
        ],
        related: ['physical-therapy-occupational-therapy', 'aqua-therapy', 'ims-therapy'],
        confirm: [
            'NO se copiaron: "a growing body of published research supports shockwave for CPPS and chronic non-bacterial prostatitis" (sin citas), "supports remodeling of fibrotic tissue", EMTT "reaches deeper tissue", "Kegels can worsen pain", "antibiotics do not resolve the cause", "the typical clinic does not lead with this technology", "many people notice change within a handful of sessions", "20 years of experience", "more than 15,000 patients treated".',
            'Proveedor: la web en vivo nombra a Yelena Shats, FNP-BC, en Williamsburg. Confirmar nombre, credencial y sede. "Dr. Henry Sardar" no aparece en el texto.',
            'La web en vivo dice que se atiende en "Brooklyn and beyond" (Five Towns, Monsey): confirmar en qué sedes se ofrece.',
            'La web en vivo tiene un FAQ de 8 preguntas: se usaron 6, reescritas más cortas. Revisar con el cliente.',
            'La web en vivo usa una imagen de dolor de espalda (2023) en esta página: no se usó.',
            'No hay página /conditions/pelvic-floor-pain/: el menú de condiciones enlaza a esta página (según la corrección acordada).',
            'Faltan riesgos / contraindicaciones de cada tecnología.',
            'La web en vivo no tiene meta description.'
        ]
    }
];
