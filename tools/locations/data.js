/* =========================================================
   Datos de las sedes (hoy 5). ÚNICA fuente para generar las páginas.
   NAP: debe coincidir carácter por carácter con Google Business Profile.
   Lo que aún no se conoce va como [MARCADOR] visible.

   hours  → horarios CONFIRMADOS por el cliente (formato en tools/shared/hours.js).
            Un día sin tramo = cerrado.
   floor  → piso / suite: nota de acceso, SEPARADA de la dirección (el NAP no cambia).
   accessLine → frase de piso / elevador para "Accessibility" y la FAQ (vacío si no aplica).
   languages → idiomas de atención (fuente: página en vivo /new-patients/).
   shortAddr    → dirección corta para menús, Call ▾, hoja Call y selectores.
   scheduleNote → aviso en /schedule/ al elegir la sede (opcional; el cierre -45 min se añade solo).
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
        hours: [
            { days: ['Tue'], opens: '09:00', closes: '17:00' }
        ],
        languages: [],                             // [CONFIRM: idiomas] → no se afirma ninguno
        geo: { lat: 40.666568, lng: -73.942810 },
        scheduleNote: 'Crown Heights is open on Tuesdays only.',
        hoursFaqNote: ' To book another day, call or visit one of our other Brooklyn locations.',
        custom: {
            metaDesc: 'Pain management in Crown Heights, Brooklyn at 358 Kingston Ave. Non-surgical care for back, neck, joint and nerve pain. Open Tuesdays. Call (347) 384-5630.',
            /* Texto del cliente, literal */
            heroText: 'Evaluation and non-surgical management of back pain, neck pain, joint pain, leg and foot pain, neuropathic pain, and other musculoskeletal conditions.',
            hoursText: 'Tuesdays only, 9:00 AM–5:00 PM',
            badge: 'Open Tuesdays only',
            gallery: 'facade+3',
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
        accessLine: 'Our office is on the 2nd floor, accessible by elevator.',
        hours: [
            { days: ['Mon'], opens: '08:30', closes: '16:30' }
        ],
        languages: ['English', 'Spanish', 'Yiddish'],
        geo: { lat: 40.618158, lng: -73.747115 },
        scheduleNote: 'Inwood is open on Mondays only.',
        hoursFaqNote: ' To book another day, call or visit one of our other locations.',
        legacyUrl: '/locations/brooklyn-ny-inwood/'
    },
    {
        key: 'monsey',
        shortAddr: '40 Main St, Monsey',
        slug: 'monsey-ny',
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
        hours: [
            { days: ['Mon', 'Tue', 'Thu'], opens: '09:00', closes: '16:00' }
        ],
        languages: ['English', 'Yiddish'],
        scheduleNote: 'Open Mon, Tue and Thu.',
        geo: { lat: 41.111256, lng: -74.068546 },
    }
];
