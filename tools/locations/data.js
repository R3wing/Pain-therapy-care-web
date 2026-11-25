/* =========================================================
   Datos de las sedes (hoy 5). ÚNICA fuente para generar las páginas.
   NAP: debe coincidir carácter por carácter con Google Business Profile.
   Lo que aún no se conoce va como [MARCADOR] visible.

   hours  → horarios CONFIRMADOS por el cliente (formato en tools/shared/hours.js).
            Un día sin tramo = cerrado.
   gallery → (opcional) [{ src, alt }] ×3: fotos reales de "Our <sede> clinic" (hoy Williamsburg y Flatbush; sin fotos se ven los placeholders).
   floor  → piso / suite: nota de acceso, SEPARADA de la dirección (el NAP no cambia).
   accessLine → frase de piso / elevador para "Accessibility" y la FAQ (vacío si no aplica).
   languages → idiomas de atención (fuente: página en vivo /new-patients/).
   shortAddr    → dirección corta para menús, Call ▾, hoja Call y selectores.
   scheduleNote → aviso en /schedule/ al elegir la sede (opcional; el cierre -45 min se añade solo).
   winterFriday → (opcional) { close, lastNewPatient, active }: viernes de invierno (cierra antes y último paciente nuevo fijo).
   hoursFaqNote → frase final de la FAQ de horario (opcional).
   custom       → (opcional) textos propios de la página de la sede: heroText, venue,
                  hoursText, badge, metaDesc, conditions[], gallery:'facade+3'. Los providers de cada sede salen de tools/providers/data.js (locations).

   ORDEN del array = orden en menús, footer, Home, Schedule… (las 3 de Brooklyn juntas).
   geo          → { lat, lng } (6 decimales) solo para mapas y schema; NO cambia la dirección.

   AÑADIR UNA SEDE = agregar un objeto aquí y ejecutar: node tools/build-all.js
========================================================= */

module.exports = [
    {
        key: 'williamsburg',                       // ?location= en /schedule/ (igual que la Home)
        shortAddr: '16 Sumner Pl, Brooklyn',
        slug: 'brooklyn-ny-williamsburg',
        heroImage: 'https://paintherapycare.com/wp-content/uploads/2026/11/Fachada-de-Ahava-Medical-con-furgoneta-azul.png',   // imagen de fondo del hero (decorativa, con velo)
        sede: 'Williamsburg',                      // nombre corto en botones y títulos
        listName: 'Williamsburg',                  // como aparece en menús / Call ▾
        schemaName: 'Pain Therapy Medical Care – Williamsburg',
        street: '16 Sumner Place',
        city: 'Brooklyn',
        region: 'NY',
        zip: '11206',
        phone: '(347) 395-4008',
        tel: '+13473954008',
        schemaTel: '+1-347-395-4008',
        h1: 'Pain Management in Williamsburg, Brooklyn',
        kicker: 'Brooklyn, NY',
        titleArea: 'Williamsburg, Brooklyn',
        placeLabel: 'Williamsburg, Brooklyn',      // para textos alt
        floor: '3rd floor',
        /* Galería "Our Williamsburg clinic": fotos reales de la Media Library de WordPress (1200×900). Sin gallery = placeholder. */
        gallery: [
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Fachada-de-Ahava-Medical-con-furgoneta-azul.png', alt: 'Clinic entrance with the Ahava Medical sign and a blue van parked outside the Williamsburg clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/brooklyn-ny-williamsburg-interior-1.webp', alt: 'Reception desk and front office at the Williamsburg clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/brooklyn-ny-williamsburg-interior-3.webp', alt: 'Hallway with numbered exam rooms at the Williamsburg clinic' }
        ],
        accessLine: 'Our office is on the 3rd floor, accessible by elevator.',
        hours: [
            { days: ['Mon', 'Tue', 'Wed', 'Thu'], opens: '10:30', closes: '17:00' },
            { days: ['Fri'], opens: '09:00', closes: '14:00' }
        ],
        languages: ['English', 'Spanish', 'Yiddish'],
        geo: { lat: 40.700762, lng: -73.940555 },
    },
    {
        key: 'flatbush',
        shortAddr: '2577 Nostrand Ave, Brooklyn',
        slug: 'brooklyn-ny-flatbush',
        heroImage: 'https://paintherapycare.com/wp-content/uploads/2026/11/Fachada-moderna-de-Ahava-Medical.png',   // imagen de fondo del hero (decorativa, con velo)
        sede: 'Flatbush',
        listName: 'Flatbush',
        schemaName: 'Pain Therapy Medical Care – Flatbush',
        street: '2577 Nostrand Ave',
        city: 'Brooklyn',
        region: 'NY',
        zip: '11210',
        phone: '(718) 715-4484',
        tel: '+17187154484',
        schemaTel: '+1-718-715-4484',
        h1: 'Pain Management in Flatbush, Brooklyn',
        kicker: 'Brooklyn, NY',
        titleArea: 'Flatbush, Brooklyn',
        placeLabel: 'Flatbush, Brooklyn',
        floor: 'Ground floor, Suite C',
        /* Galería "Our Flatbush clinic": fotos reales de la Media Library de WordPress (PNG 1448×1086, 4:3; pesan ~800–960 KB: conviene subir versiones .webp). */
        gallery: [
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Fachada-moderna-de-Ahava-Medical.png', alt: 'Entrance doors and glass storefront at the Flatbush clinic, 2577 Nostrand Ave' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Clinica-Ahava-bajo-el-sol-otonal.png', alt: 'Building exterior with trees and banners at the Flatbush clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Clinica-medica-moderna-Ahava-al-amanecer.png', alt: 'Front of the Flatbush clinic seen from the sidewalk on Nostrand Ave' }
        ],
        accessLine: 'Ground floor, Suite C.',
        hours: [
            { days: ['Mon', 'Tue', 'Wed', 'Thu'], opens: '10:30', closes: '17:00' },
            { days: ['Fri'], opens: '09:00', closes: '14:00' }
        ],
        languages: ['English', 'Spanish', 'Yiddish'],
        geo: { lat: 40.621630, lng: -73.945686 },
    },
    {
        key: 'crown-heights',                      // ?location= en /schedule/ (también acepta el slug largo)
        shortAddr: '358 Kingston Ave, Brooklyn',
        slug: 'brooklyn-ny-crown-heights',
        sede: 'Crown Heights',
        listName: 'Crown Heights',
        /* NAP: nombre decidido por el cliente (no es el de Ahava). Verificar contra Google Business Profile. */
        schemaName: 'Pain Therapy Medical Care – Crown Heights',
        venue: 'Ahava Medical Center',             // centro donde está la sede (línea "at …")
        openedOn: '2026-11-10',
        street: '358 Kingston Ave',
        city: 'Brooklyn',
        region: 'NY',
        zip: '11213',
        phone: '(347) 384-5630',
        tel: '+13473845630',
        schemaTel: '+1-347-384-5630',
        h1: 'Pain Management in Crown Heights, Brooklyn',
        kicker: 'Brooklyn, NY',
        titleArea: 'Crown Heights, Brooklyn',
        placeLabel: 'Crown Heights, Brooklyn',
        floor: '',                                 // sin nota de piso
        heroImage: 'https://paintherapycare.com/wp-content/uploads/2026/11/entrada-de-clinica-ahava-v2.png',   // imagen de fondo del hero (decorativa, con velo)
        /* Galería "Our Crown Heights clinic": fotos reales de la Media Library (PNG 1448×1086, 4:3; ~0,7–1,1 MB: conviene subir versiones .webp).
           "interiror" (2.ª foto) está así en WordPress: se copia tal cual. La entrada muestra un toldo con "596 Albany Ave" (la dirección de la sede es 358 Kingston Ave): por eso el alt no menciona calle. */
        gallery: [
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/entrada-de-clinica-ahava-v2.png', alt: 'Clinic entrance with a blue awning and two Ahava Medical banners at the Crown Heights clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/imagen-interiror-clinica-ahava-v2.png', alt: 'Waiting area with green upholstered chairs and a wall mirror at the Crown Heights clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/imagen-interior-con-exit.png', alt: 'Interior hallway with an exit sign and exam room doors at the Crown Heights clinic' }
        ],
        hours: [
            // Antes: Tue 9–5. Cambio a jueves con el mismo horario, confirmado por el cliente el 25-nov-2026.
            { days: ['Thu'], opens: '09:00', closes: '17:00' }
        ],
        languages: [],                             // [CONFIRM: idiomas] → no se afirma ninguno
        geo: { lat: 40.666568, lng: -73.942810 },
        scheduleNote: 'Open Thursdays only.',
        hoursFaqNote: ' To book another day, call or visit one of our other Brooklyn locations.',
        custom: {
            metaDesc: 'Pain management in Crown Heights, Brooklyn at 358 Kingston Ave. Non-surgical care for back, neck, joint & nerve pain. Open Thursdays. Call (347) 384-5630.',
            /* Texto del cliente, literal */
            heroText: 'Evaluation and non-surgical management of back pain, neck pain, joint pain, leg and foot pain, neuropathic pain, and other musculoskeletal conditions.',
            hoursText: 'Thursdays only, 9:00 AM–5:00 PM',
            badge: 'Open Thursdays only',
            conditions: [
                { title: 'Back pain',          links: [['Lower back pain', 'lower-back-pain']] },
                { title: 'Neck pain',          links: [['Neck pain', 'neck-pain']] },
                { title: 'Joint pain',         links: [['Knee pain', 'knee-pain'], ['Hip pain', 'hip-pain']] },
                { title: 'Leg and foot pain',  links: [['Sciatica', 'sciatica'], ['Plantar fasciitis', 'plantar-fasciitis']] },
                { title: 'Neuropathic pain',   links: [['Peripheral neuropathy', 'peripheral-neuropathy']] }
            ],
        }
    },
    {
        key: 'inwood',
        shortAddr: '233 Doughty Blvd, Inwood',
        slug: 'inwood-ny',
        heroImage: 'https://paintherapycare.com/wp-content/uploads/2026/11/Edificio-medico-moderno-Ahava-233.png',   // imagen de fondo del hero (decorativa, con velo)
        sede: 'Inwood',
        listName: 'Inwood · Five Towns',
        schemaName: 'Pain Therapy Medical Care – Inwood (Five Towns)',
        street: '233 Doughty Blvd',
        city: 'Inwood',
        region: 'NY',
        zip: '11096',
        phone: '(516) 276-2889',
        tel: '+15162762889',
        schemaTel: '+1-516-276-2889',
        h1: 'Pain Management in Inwood &amp; the Five Towns',
        kicker: 'Five Towns, Nassau County, NY',
        titleArea: 'Inwood, Five Towns',
        placeLabel: 'Inwood, Five Towns',
        floor: '2nd floor',
        /* Galería "Our Inwood clinic": fotos reales de la Media Library de WordPress (PNG ~1590×990, ~780–850 KB: conviene subir versiones .webp 1200×900). */
        gallery: [
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Edificio-medico-moderno-Ahava-233.png', alt: 'Three-story clinic building with the number 233 and its parking lot at the Inwood clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Edificio-medico-moderno-con-fachada-233.png', alt: 'Side view of the clinic building and its entrance canopy at the Inwood clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Fachada-moderna-de-Ahava-Medical-1.png', alt: 'Entrance with the Ahava Medical sign at the Inwood clinic, 233 Doughty Blvd' }
        ],
        accessLine: 'Our office is on the 2nd floor, accessible by elevator.',
        hours: [
            { days: ['Mon', 'Wed', 'Fri'], opens: '09:00', closes: '17:00' }
        ],
        languages: ['English', 'Spanish', 'Yiddish'],
        geo: { lat: 40.618158, lng: -73.747115 },
        // Temporada de invierno: poner active:false cuando el cliente lo indique
        winterFriday: { close: "16:45", lastNewPatient: "15:40", active: true },
        scheduleNote: 'Open Mon, Wed and Fri.',
        hoursFaqNote: ' To book another day, call or visit one of our other locations.',
        legacyUrl: '/locations/brooklyn-ny-inwood/'
    },
    {
        key: 'monsey',
        shortAddr: '40 Main St, Monsey',
        slug: 'monsey-ny',
        heroImage: 'https://paintherapycare.com/wp-content/uploads/2026/11/Complejo-comercial-moderno-en-otono.png',   // imagen de fondo del hero (decorativa, con velo)
        sede: 'Monsey',
        listName: 'Monsey',
        schemaName: 'Pain Therapy Medical Care – Monsey',
        street: '40 Main St',
        city: 'Monsey',
        region: 'NY',
        zip: '10952',
        phone: '(845) 414-3711',
        tel: '+18454143711',
        schemaTel: '+1-845-414-3711',
        h1: 'Pain Management in Monsey, NY',
        kicker: 'Rockland County, NY',
        titleArea: 'Monsey, Rockland County',
        placeLabel: 'Monsey, NY',
        floor: '',
        /* Galería "Our Monsey clinic": fotos reales de la Media Library de WordPress (PNG 1448×1086, 4:3; ~810–920 KB: conviene subir versiones .webp).
           Las 3 muestran el letrero de OTRO negocio (LOADIO) y la 2.ª también un cartel de "Ahava Vision": NO se mencionan en los alt. */
        gallery: [
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Edificio-moderno-con-entrada-de-baja-altura.png', alt: 'Two-story building with a wood-paneled facade and a covered driveway at the Monsey clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Complejo-comercial-moderno-en-otono.png', alt: 'Corner of the building with a stone-clad entrance tower at the Monsey clinic' },
            { src: 'https://paintherapycare.com/wp-content/uploads/2026/11/Mercado-moderno-LOADIO-bajo-cielo-nublado.png', alt: 'Stone-clad building corner and covered driveway seen from the sidewalk at the Monsey clinic' }
        ],
        hours: [
            { days: ['Mon', 'Thu'], opens: '09:00', closes: '16:00' }
        ],
        languages: ['English', 'Yiddish'],
        scheduleNote: 'Open Mon and Thu.',
        geo: { lat: 41.111256, lng: -74.068546 },
    }
];
