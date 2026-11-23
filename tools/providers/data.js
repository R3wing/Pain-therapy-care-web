/* =========================================================
   Providers — fuente única (Home, páginas de sede, Schedule ?provider=,
   /about-us/, /providers/ y las páginas de bio).

   slug       → URL de la bio: /providers/<slug>/ (coincide con la web en vivo; NO se cambia)
   locations  → claves de tools/locations/data.js (cada sede muestra SOLO sus providers)
   status     → 'active' (por defecto) | 'joining-soon' (badge "Joining soon", sin enlace,
                NO seleccionable en /schedule/ y sin página de bio).
                Para activar a Naveen Sharma: status 'active' (o quitar el campo) → su bio
                se genera sola en el siguiente build (necesita bio / headline).
   image      → { media } = placeholder 1:1 · { url, width, height, alt } = foto real · null = inicial
   specialty / bio → [CONFIRM] hasta que el cliente los confirme (los [CONFIRM] no se muestran)

   Campos de las páginas /about-us/, /providers/ y /providers/<slug>/ (tools/providers/build.js):
     short       → forma corta en texto corrido ("Dr. Sardar")
     bookLabel   → texto del botón de la bio ("Book with Dr. Sardar")
     role        → línea bajo el nombre en las tarjetas de /providers/ (NO cambia las tarjetas de Home / sedes)
     headline    → subtítulo del hero de la bio
     bio[]       → párrafos de la biografía (texto de la bio en vivo, sin añadir nada)
     focusLabel  → título de la lista "specialties" (se respeta el de la web en vivo)
     specialties[]    → lista con checks
     certifications[] → pills + hasCredential del schema (SOLO lo que figura en la web en vivo)
     treats[]    → slugs de /conditions/<slug>/ (enlace solo si la página existe)
     reviews[]   → { quote, author }: SOLO reseñas reales que mencionan al provider
     languages · education · residency · fellowship → solo si están en vivo; si no, se omiten
   Sin datos personales (dirección, teléfono, email): el único contacto es el de cada sede.

   Providers que ya no trabajan en la práctica: no figuran aquí ni en el sitio; sus URLs antiguas
   se redirigen (301) a /providers/ (ver tools/redirects.json).
========================================================= */

const IMG = 'https://paintherapycare.com/wp-content/uploads/2026/11/';

module.exports = [
    {
        slug: 'henry-sardar-md',                  // URL de la web en vivo (se conserva aunque ahora sea DO)
        name: 'Henry Sardar, DO', credential: 'DO',
        short: 'Dr. Sardar', bookLabel: 'Book with Dr. Sardar',
        specialty: '[CONFIRM]', locations: ['williamsburg'],
        role: 'Board Certified Pain Management Specialist',
        headline: 'Board Certified Pain Management Specialist in NYC',
        bio: [
            'Dr. Henry Sardar, D.O., specializes in advanced European, drug-free pain therapies such as EMTT (Magnet), Laser Therapy, and Shockwave Therapy; delivering POWERFUL, non-invasive solutions for pain relief. He is Double Board-certified in Pain Management and Physical Medicine & Rehabilitation, with a clinical focus rooted in technologies originally designed for athletic injury recovery.',
            'He treats patients with back pain, neck pain, knee pain, joint pain including shoulder hand and hip and ankle, arthritis, sciatica, nerve pain, and sports-related injuries, with an emphasis on restoring function, mobility, and daily performance. Dr. Sardar’s approach begins with a thorough evaluation to accurately identify the source of pain and guide individualized, conservative treatment plans.',
            'His practice prioritizes technology-assisted, non-invasive therapies, reserving injections only when clinically appropriate and avoiding unnecessary procedures whenever possible. This approach allows many patients to achieve meaningful pain relief without surgery and with minimal disruption to daily life.',
            'Dr. Sardar works closely with a multidisciplinary clinical team to ensure coordinated, patient-centered care. His goal is to deliver effective, thoughtful pain management focused on long-term improvement, functional recovery, and quality of life.'
        ],
        focusLabel: 'Specialties & certifications',
        specialties: ['Osteopathic Manipulation', 'Herbal Medicine', 'Interventional Pain Techniques', 'Chronic Pain Management'],
        certifications: ['Double Board-certified in Pain Management and Physical Medicine & Rehabilitation'],
        treats: ['lower-back-pain', 'neck-pain', 'knee-pain', 'hip-pain', 'arthritis', 'sciatica', 'peripheral-neuropathy'],
        reviews: [{ quote: 'Best pain management with care and quick results… Thank you Dr. Sardar & Ms. Wendy!', author: 'Gloria Ramos' }],
        image: { url: IMG + 'Henry-Sardar-DO.png', width: 1269, height: 1240, alt: 'Portrait of Henry Sardar, DO' }   // PNG 477 KB: conviene una versión ~800 px / WebP
    },
    {
        slug: 'lee-trosterman-md',
        name: 'Lee Trosterman, MD', credential: 'MD',
        short: 'Dr. Trosterman', bookLabel: 'Book with Dr. Trosterman',
        specialty: '[CONFIRM]', locations: ['williamsburg'],
        role: 'Pain Management Specialist',
        headline: 'Pain Management Specialist',
        bio: [
            'Dr. Lee Trosterman is a Pain Management Specialist specializing in advanced, non-surgical pain care. His technology-based approach includes EMTT, Laser Therapy, and Shockwave Therapy to deliver non-opioid solutions for back, joint, nerve, and spinal pain, helping patients return to daily activities with greater comfort.',
            'Dr. Trosterman provides care for patients with chronic pain, spine conditions, joint disorders, nerve pain, carpal tunnel syndrome, muscle pain, and arthritis. His approach begins with a comprehensive clinical evaluation to identify pain generators and develop individualized, conservative care plans.',
            'He prioritizes non-invasive therapies as the primary course of treatment, using injections selectively and only when clinically appropriate. When patients present with multiple pain concerns, Dr. Trosterman tailors treatment plans to address them comprehensively, supporting improved mobility and functional outcomes.'
        ],
        focusLabel: 'Clinical focus',
        specialties: ['Lower Back & Neck Injections', 'Brain, Nerves & Spine', 'Bones, Muscles & Joints', 'Ligaments & Tendons'],
        certifications: [],
        treats: ['chronic-pain', 'spine-back', 'joints', 'peripheral-neuropathy', 'carpal-tunnel-syndrome', 'arthritis'],
        image: { url: IMG + 'Lee-Trosterman-MD.png', width: 1254, height: 1254, alt: 'Portrait of Lee Trosterman, MD' }   // PNG 593 KB
    },
    {
        slug: 'jason-hernandez-md',
        name: 'Jason Hernandez, MD', credential: 'MD',
        short: 'Dr. Hernandez', bookLabel: 'Book with Dr. Hernandez',
        specialty: '[CONFIRM]', locations: ['flatbush'],
        role: 'Sports Medicine & Rehabilitation Specialist',
        headline: 'Sports Medicine & Rehabilitation Specialist',
        bio: [
            'Dr. Jason Hernandez, M.D. is known for his modern, technology-based approach to pain relief. By combining NEW advanced treatments like Laser Therapy, Shockwave Therapy, and Electromagnetic Transduction Therapy (EMTT), he provides POWERFUL, non-surgical and non-opioid solutions that help patients move better, feel stronger, and reclaim their daily lives.',
            'Dr. Hernandez treats a wide range of chronic pain and musculoskeletal conditions, including back pain, neck pain, joint pain, arthritis, nerve pain, and sports-related or overuse injuries. His approach focuses on identifying the underlying cause of pain through careful evaluation and developing personalized, evidence-based treatment plans tailored to each patient.',
            'He emphasizes non-invasive, technology-assisted therapies as the foundation of care, helping patients improve function, mobility, and daily activity without surgery whenever possible.',
            'Known for his compassionate, patient-centered approach, Dr. Hernandez takes the time to listen and guide patients throughout their care. He welcomes new patients and is committed to helping individuals regain control of their health, movement, and overall well-being.'
        ],
        focusLabel: 'Treatment philosophy',
        specialties: ['Non-invasive Treatments', 'Medication-free Solutions', 'Movement Restoration', 'Active Lifestyle Promotion'],
        certifications: [],
        treats: ['lower-back-pain', 'neck-pain', 'joints', 'arthritis', 'peripheral-neuropathy', 'chronic-pain'],
        image: { url: IMG + 'DRJASONHERNANDEZ5-scaled.jpg', width: 2560, height: 1707, alt: 'Portrait of Jason Hernandez, MD' }   // JPG 50 KB, 3:2 (se recorta a 1:1)
    },
    {
        slug: 'olutimilehin-oyeniran-md',
        name: 'Olutimilehin Oyeniran, MD',
        short: 'Dr. Oyeniran', bookLabel: 'Book with Dr. Oyeniran',
        givenName: 'Olutimilehin', familyName: 'Oyeniran',
        credential: 'MD',
        specialty: 'Pain Management',
        locations: ['crown-heights'],
        role: 'Pain Management',
        headline: 'Pain Management Physician in Crown Heights, Brooklyn',
        bio: [
            'Dr. Olutimilehin Oyeniran is a physician with experience in clinical practice, sports medicine and community health. Dr. Oyeniran is dedicated to health equity and accessibility, and to improving health outcomes for underserved communities.',
            'At Pain Therapy Medical Care, Dr. Oyeniran provides evaluation and non-surgical management of back pain, neck pain, joint pain, leg and foot pain, neuropathic pain and other musculoskeletal conditions at our Crown Heights office, open on Tuesdays.'
        ],
        focusLabel: 'Areas of focus',                // NO son certificaciones
        specialties: ['Pain Management', 'Sports Medicine', 'Community Health'],
        certifications: [],
        treats: ['lower-back-pain', 'neck-pain', 'knee-pain', 'hip-pain', 'sciatica', 'plantar-fasciitis', 'peripheral-neuropathy'],
        image: { url: IMG + 'Dr.-Olutimilehin-Oyeniran.png', width: 1254, height: 1254, alt: 'Portrait of Olutimilehin Oyeniran, MD' }   // PNG 797 KB
    },
    {
        slug: 'michelle-abraham-pa-c',
        name: 'Michelle Abraham, PA-C', credential: 'PA-C',
        short: 'Michelle', bookLabel: 'Book with Michelle',
        specialty: '[CONFIRM]', locations: ['monsey'],
        role: 'Certified Physician Assistant',
        headline: 'Certified Physician Assistant',
        bio: [
            'Michelle Abraham, PA-C, is a certified Physician Assistant specializing in non-surgical pain management and musculoskeletal care. Her technology-based approach includes EMTT, Laser Therapy, and Shockwave Therapy to deliver non-opioid solutions for back, joint, nerve, and spinal pain, helping patients return to daily activities with greater comfort.',
            'Many patients seek care for knee pain, shoulder pain, hip pain, carpal tunnel symptoms, and muscle pain that interferes with daily activities. Michelle begins every visit with a comprehensive evaluation to identify the source of pain and develop a personalized, conservative treatment plan focused on restoring function and improving mobility.',
            'Patients appreciate her thorough assessments, clear explanations, and practical treatment plans aimed at helping them return to work, activity, and daily life safely.'
        ],
        focusLabel: 'Specialties & certifications',
        specialties: ['Non-Surgical Pain Management', 'Musculoskeletal Care'],
        certifications: [],
        treats: ['knee-pain', 'rotator-cuff-injury', 'hip-pain', 'carpal-tunnel-syndrome'],
        image: { url: IMG + 'Michelle-Abraham-PA-C.png', width: 1206, height: 1304, alt: 'Portrait of Michelle Abraham, PA-C' }   // PNG 748 KB
    },
    {
        slug: 'naveen-sharma-do',
        name: 'Naveen Sharma, DO',
        short: 'Dr. Sharma', bookLabel: 'Book with Dr. Sharma',
        givenName: 'Naveen', familyName: 'Sharma',
        credential: 'DO',
        // Activo (sin badge "Joining soon"). Sin bio todavía: su tarjeta no enlaza a ninguna página.
        // CONFIRMAR CON CLIENTE: headline + bio[] (con eso su página /providers/naveen-sharma-do/ se genera sola).
        specialty: '[CONFIRM]',
        locations: ['inwood'],
        bio: '[CONFIRM]',
        image: { url: IMG + 'Naveen-Sharma-DO.jpeg', width: 702, height: 760, alt: 'Portrait of Naveen Sharma, DO' }   // JPG 46 KB
    }
];
