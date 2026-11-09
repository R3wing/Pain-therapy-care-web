/* =========================================================
   Datos de las 4 sedes. ÚNICA fuente para generar las páginas.
   NAP: debe coincidir carácter por carácter con Google Business Profile.
   Lo que aún no se conoce va como [MARCADOR] visible.

   hours  → horarios (formato en tools/shared/hours.js). Fuente: tabla de horarios
            enviada por el cliente. Un día sin tramo = cerrado.
   floor  → piso / suite (solo se muestra en el hero de la sede; NO forma parte
            del NAP hasta confirmar cómo está en Google Business Profile).
========================================================= */

module.exports = [
    {
        key: 'williamsburg',                       // ?location= en /schedule/ (igual que la Home)
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
        hasSubway: true,
        floor: '3rd floor',
        hours: [
            { days: ['Mon', 'Tue', 'Wed', 'Thu'], opens: '10:30', closes: '17:00' },
            { days: ['Fri'], opens: '09:00', closes: '14:00' }
        ]
    },
    {
        key: 'flatbush',
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
        hasSubway: true,
        floor: 'Ground floor, Suite C',
        hours: [
            { days: ['Mon', 'Tue', 'Wed', 'Thu'], opens: '10:30', closes: '17:00' },
            { days: ['Fri'], opens: '09:00', closes: '14:00' }
        ]
    },
    {
        key: 'inwood',
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
        hasSubway: false,
        floor: '2nd floor',
        hours: [
            { days: ['Mon'], opens: '08:30', closes: '16:30' }
        ],
        legacyUrl: '/locations/brooklyn-ny-inwood/'
    },
    {
        key: 'monsey',
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
        hasSubway: false,
        floor: '',
        hours: [
            { days: ['Mon', 'Tue', 'Thu'], opens: '09:00', closes: '16:00' }
        ]
    }
];
