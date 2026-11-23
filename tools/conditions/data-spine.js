/* =========================================================
   Condiciones · zona Spine & Back (6)
   Fuente: https://paintherapycare.com/conditions/<slug>/ (leída vía API de WordPress).
   La web en vivo son artículos largos en 1.ª persona. Aquí se reorganizó el contenido en
   campos, en voz de clínica ("we"), SIN casos de pacientes, cifras sin confirmar, citas de
   estudios ni promesas de resultado. Todo lo no cubierto por el texto en vivo = [CONFIRM].

   treatments          → servicios que la web en vivo presenta como parte del enfoque (slugs de /services/)
   treatmentsProposed  → relaciones PROPUESTAS (<!-- CONFIRMAR relación -->)
   confirm             → campos sin base en el texto en vivo: se muestra [CONFIRM: …] visible
   notes               → solo para el equipo (comentario HTML <!-- CONFIRMAR CON CLIENTE -->)
========================================================= */

module.exports = [
    {
        slug: 'lower-back-pain',
        name: 'Lower Back Pain',
        zone: 'spine-back',
        anatomy: 'Lumbar spine',
        summary: 'Lower back pain can come from discs, joints, muscles or nerves, and each source needs a different approach. We look for what is generating your pain and build a non-surgical, drug-free plan around it.',
        whatIs: 'Lower back pain is one of the most common reasons people visit a pain management clinic. It can come from many different sources, and each one causes a different pain pattern. When no clear structural cause is found, the pain is often called "non-specific", which means the cause has not been identified yet, not that there is none.',
        symptoms: [
            'Pain that makes everyday movements, such as bending or sitting, difficult',
            'Trouble sitting through a meal or a commute',
            'Stiffness, or the feeling that your back could seize up without warning'
        ],
        causes: [
            'Degenerated or herniated discs pressing on nerve roots',
            'Inflammation of the facet joints',
            'Sacroiliac joint dysfunction',
            'Myofascial trigger points in the muscles of the lower back',
            'Spinal stenosis, a gradual narrowing of the spinal canal',
            'Segmental instability, when one vertebra moves excessively on another'
        ],
        whenToSee: 'If your lower back pain lasts more than 12 weeks, it is considered chronic. Getting evaluated early matters: the longer the pain continues, the longer recovery can take.',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: [],
        notes: [
            'La web en vivo incluye "spinal decompression" (no es un servicio del sitio): no se muestra ni se enlaza.',
            'No se copiaron: casos de pacientes, "20 años / 15,000 pacientes", estadísticas y citas de estudios, tiempos de resultado (3-5 semanas, 8-12 semanas).',
            'Relación propuesta con PT/OT: la web en vivo describe un programa de rehabilitación estructurado.'
        ]
    },
    {
        slug: 'herniated-disk',
        name: 'Herniated Disc',
        zone: 'spine-back',
        anatomy: 'Spinal discs',
        summary: 'A herniated disc happens when disc material bulges or extends beyond its normal position and can press on a nearby nerve. We evaluate the cause of your symptoms and offer non-surgical, drug-free care.',
        whatIs: 'Discs sit between the bones of the spine. In a herniated disc, material from the disc bulges or protrudes and can compress a nerve root. On an MRI it may appear as a bulge pressing on a nerve.',
        symptoms: [
            'Back pain',
            'Shooting pain down the leg',
            'Numbness in the foot'
        ],
        causes: [],
        whenToSee: 'Cauda equina syndrome, which involves bowel or bladder dysfunction, is a medical emergency: seek emergency care right away. Weakness in the leg or foot that keeps getting worse also needs prompt evaluation by a physician.',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: ['causes'],
        notes: [
            'La web en vivo dedica el artículo a "los discos herniados pueden sanar" con estudios y porcentajes: no se copió.',
            'La web en vivo incluye "spinal decompression" (no es un servicio del sitio): no se muestra ni se enlaza.',
            'Faltan las causas de la hernia discal en el texto en vivo.'
        ]
    },
    {
        slug: 'sciatica',
        name: 'Sciatica',
        zone: 'spine-back',
        anatomy: 'Sciatic nerve and lower spine',
        summary: 'Sciatica is pain that travels from the lower back through the buttock and down the leg along the sciatic nerve. We work to find what is irritating or compressing the nerve and treat it without drugs or surgery.',
        whatIs: 'Sciatica is not a diagnosis by itself. It describes where the pain travels. The real question is what is irritating or compressing the sciatic nerve, because each cause needs a different treatment approach.',
        symptoms: [
            'Pain that starts in the lower back and shoots down the leg, through the buttock and behind the thigh',
            'Pain that sometimes reaches the foot',
            'Pain that gets worse when sitting or standing',
            'Trouble finding a comfortable position, including at night'
        ],
        causes: [
            'A herniated or bulging lumbar disc pressing on a nerve root, the most common source',
            'Spinal stenosis, a narrowing of the neural canal',
            'Piriformis syndrome, when a deep hip muscle compresses the nerve',
            'Spondylolisthesis, when one vertebra shifts over another',
            'Degenerative changes that reduce the space available for the nerve'
        ],
        whenToSee: '',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: ['whenToSee'],
        notes: [
            'No se copiaron: caso de un paciente, porcentajes de causas, meta-análisis y la sección "la cirugía debe ser el último recurso".',
            'La web en vivo incluye "spinal decompression" (no es un servicio del sitio): no se muestra ni se enlaza.'
        ]
    },
    {
        slug: 'spinal-stenosis',
        name: 'Spinal Stenosis',
        zone: 'spine-back',
        anatomy: 'Lumbar spine',
        summary: 'Spinal stenosis is a narrowing of the spaces within the spine that can compress the nerves going to the legs. We look at the whole picture, including muscles, posture and mobility, and offer non-surgical, drug-free care.',
        whatIs: 'In the lower back, narrowing of the spine can compress the nerves that travel to the legs. This often produces neurogenic claudication: pain, heaviness, numbness or weakness in the buttocks and legs that worsens with standing and walking and improves when you sit down or lean forward.',
        symptoms: [
            'Heaviness, numbness or burning in the legs when walking',
            'Having to stop every few minutes while walking',
            'Relief when you sit down or lean forward, for example on a shopping cart',
            'Difficulty standing for long periods'
        ],
        causes: [
            'A thickened ligamentum flavum',
            'Bulging discs',
            'Enlarged facet joints',
            'Bone spurs',
            'Degenerative spondylolisthesis',
            'A combination of these'
        ],
        whenToSee: 'Severe or progressive neurological symptoms, or debilitating pain that has not improved with comprehensive non-surgical care, should be evaluated by a physician.',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: [],
        notes: [
            'No se copiaron: estudios (NEJM, Cochrane, SPORT), tasas de complicaciones de la cirugía y "la verdad honesta sobre la cirugía".',
            'La web en vivo incluye "spinal decompression" (no es un servicio del sitio): no se muestra ni se enlaza.'
        ]
    },
    {
        slug: 'pinched-nerve',
        name: 'Pinched Nerve',
        zone: 'spine-back',
        anatomy: 'Spinal nerve roots (neck and lower back)',
        summary: 'A pinched nerve means a nerve is being compressed or irritated, most often in the neck or lower back. The cause and location matter more than the symptom, so we start by finding what is compressing the nerve.',
        whatIs: 'People use "pinched nerve" to describe several different conditions, such as cervical radiculopathy in the neck and lumbar radiculopathy in the lower back. Each one compresses the nerve through a different mechanism at a different location, so each needs a different treatment approach.',
        symptoms: [
            'In the neck: pain, numbness, tingling or weakness that travels into the shoulder, arm and hand',
            'In the lower back: pain that travels into the buttock and leg',
            'Symptoms that follow the path of the affected nerve'
        ],
        causes: [
            'A herniated disc',
            'A bone spur narrowing the opening where the nerve exits',
            'Spinal stenosis reducing the space in the spinal canal',
            'Degenerative changes that narrow the openings for the nerve roots'
        ],
        whenToSee: '',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: ['whenToSee'],
        notes: [
            'No se copiaron: estudios sobre radiculopatía cervical, cronogramas de mejoría ("2-4 semanas") ni comparaciones con la cirugía.',
            'La web en vivo incluye "spinal decompression" (no es un servicio del sitio): no se muestra ni se enlaza.'
        ]
    },
    {
        slug: 'neck-pain',
        name: 'Neck Pain',
        zone: 'spine-back',
        anatomy: 'Cervical spine',
        summary: 'Neck pain often builds from chronic overload of the cervical spine, such as long hours at a computer, on a phone or driving. We look for the source and treat it with a non-surgical, drug-free plan.',
        whatIs: 'The cervical spine is made of seven vertebrae that support the weight of your head. When your head sits forward of your shoulders, the load on the neck increases. Over time, this overload can weaken the deep stabilizing muscles, tighten the muscles of the upper neck and shoulders, and irritate the facet joints.',
        symptoms: [
            'A neck that will not turn, especially when you wake up',
            'A dull ache from the base of the skull down between the shoulder blades',
            'Pain referred into the head, shoulder or arm'
        ],
        causes: [
            'Forward head posture from computer work, phone use or driving',
            'Weakness of the deep neck flexor muscles',
            'Overworked upper trapezius, levator scapulae and sternocleidomastoid muscles with trigger points',
            'Compression and inflammation of the facet joints'
        ],
        whenToSee: 'Pain, numbness or weakness that spreads into the arm and hand can mean a compressed nerve root, and progressive weakness or loss of hand dexterity needs close monitoring. Balance difficulties, clumsiness in the hands or changes in how you walk can point to spinal cord compression and need prompt evaluation.',
        treatments: ['laser-therapy', 'shock-wave-therapy'],
        treatmentsProposed: [],
        confirm: [],
        notes: [
            'No se copiaron: afirmaciones sobre la investigación de láser ("the research is clear") ni casos de pacientes.'
        ]
    }
];
