/* =========================================================
   Condiciones · zona Joints (4)
   Misma metodología que data-spine.js (ver cabecera de ese archivo).
========================================================= */

module.exports = [
    {
        slug: 'knee-pain',
        name: 'Knee Pain',
        zone: 'joints',
        anatomy: 'Knee',
        summary: 'The knee is a complex joint, and pain can come from cartilage, menisci, ligaments, tendons or the muscles around it. We look at the whole joint and offer non-surgical, drug-free care.',
        whatIs: 'The knee is not a simple hinge. It depends on cartilage, menisci, ligaments, the joint capsule, synovial fluid, and muscles and tendons working in coordination. When one part breaks down, the rest compensates, and the original problem can get worse.',
        symptoms: [
            'Grinding, catching or aching in the knee',
            'Difficulty with stairs'
        ],
        causes: [
            'Osteoarthritis',
            'Meniscus tear',
            'Bursitis',
            'Tendinopathy',
            'Ligament strain'
        ],
        whenToSee: '',
        treatments: ['shock-wave-therapy', 'laser-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy', 'ha-knee-injection'],
        confirm: ['whenToSee'],
        notes: [
            'No se copiaron: crítica a la cirugía/cortisona, "the evidence your surgeon has not mentioned" ni porcentajes.',
            'Relaciones propuestas: PT/OT (la web en vivo habla de rehabilitación) y HA Knee Injection (existe como servicio; la web en vivo no lo vincula).'
        ]
    },
    {
        slug: 'hip-pain',
        name: 'Hip Pain',
        zone: 'joints',
        anatomy: 'Hip',
        summary: 'Hip pain does not always come from the hip joint itself, so finding its true source is the first step. We offer non-surgical, drug-free care based on what is actually causing your pain.',
        whatIs: 'The hip is the largest weight-bearing joint in the body and absorbs several times your body weight with every step. Hip pain can come from the joint, from the tendons around it, or from the lower spine and sacroiliac joint, and many people have more than one source at the same time.',
        symptoms: [
            'A deep ache in the groin or along the outside of the hip',
            'Pain with stairs',
            'Deep groin pain that worsens with weight-bearing and rotation',
            'Sharp groin pain with deep squatting, prolonged sitting or rotation'
        ],
        causes: [
            'Hip osteoarthritis, degeneration of the cartilage in the joint',
            'Hip bursitis and greater trochanteric pain syndrome, often linked to degeneration of the gluteal tendons',
            'Hip impingement (femoroacetabular impingement)',
            'Referred pain from the lower spine and the sacroiliac joint'
        ],
        whenToSee: '',
        treatments: ['shock-wave-therapy', 'laser-therapy'],
        treatmentsProposed: [],
        confirm: ['whenToSee'],
        notes: [
            'La web en vivo habla de "cinco categorías" de causas; en el texto revisado figuran cuatro. Confirmar la quinta.',
            'No se copiaron: críticas a la cirugía de cadera, estudios y porcentajes de respuesta.'
        ]
    },
    {
        slug: 'rotator-cuff-injury',
        name: 'Rotator Cuff Injury',
        zone: 'joints',
        anatomy: 'Shoulder',
        summary: 'The rotator cuff is a group of four muscles and their tendons that stabilize the shoulder. We look at the whole shoulder system and offer non-surgical, drug-free care.',
        whatIs: 'The rotator cuff is not a single structure. It is four muscles and their tendons that work together to stabilize the shoulder through a wide range of motion. When a tendon is partially torn, frayed or degenerating, the whole system compensates: the shoulder blade moves differently, posture shifts, and other muscles take on work they were not designed for.',
        symptoms: [
            'Pain when reaching overhead',
            'Difficulty sleeping, because every position hurts the shoulder',
            'Trouble with everyday tasks such as buttoning a shirt or reaching for a shelf'
        ],
        causes: [
            'A partially torn tendon',
            'Fraying or degeneration of a rotator cuff tendon',
            'Instability that develops when the surrounding muscles compensate'
        ],
        whenToSee: '',
        treatments: ['shock-wave-therapy', 'laser-therapy'],
        treatmentsProposed: ['physical-therapy-occupational-therapy'],
        confirm: ['whenToSee'],
        notes: [
            'No se copiaron: caso de un paciente, estudios (JBJS) ni la pregunta "can my rotator cuff heal without surgery".',
            'Relación propuesta con PT/OT: la web en vivo habla de rehabilitación estructurada.'
        ]
    },
    {
        slug: 'arthritis',
        name: 'Arthritis',
        zone: 'joints',
        anatomy: 'Joints (knee, hip, shoulder, elbow, hand, wrist, foot and ankle)',
        summary: 'Arthritis is more than wear and tear: it involves the cartilage, the bone, the joint lining and the muscles around the joint. We treat arthritis in the knee, hip, shoulder, elbow, hand, wrist, and foot and ankle with non-surgical, drug-free care.',
        whatIs: 'Osteoarthritis, the most common form we treat, is an active biological process. Cartilage breaks down, the bone beneath it remodels, the joint lining becomes inflamed, and the joint capsule, ligaments and surrounding muscles change. These processes feed on each other, so we look at the muscles, tendons and biomechanics around the joint, not only the joint itself.',
        symptoms: [
            'Morning stiffness that takes about twenty minutes to loosen',
            'Difficulty with everyday tasks such as opening jars or climbing stairs',
            'Aching when reaching for a high shelf'
        ],
        causes: [
            'Breakdown of the cartilage',
            'Remodeling of the bone beneath the cartilage',
            'Chronic low-grade inflammation of the joint lining',
            'Changes in the joint capsule, the ligaments and the surrounding muscles'
        ],
        whenToSee: '',
        treatments: ['shock-wave-therapy', 'laser-therapy'],
        treatmentsProposed: [],
        confirm: ['whenToSee'],
        notes: [
            'No se copiaron: críticas al enfoque convencional ("accelerates it") ni afirmaciones de protección del cartílago.',
            'La web en vivo critica los corticoides: no se relaciona con Steroid Injection.'
        ]
    }
];
