/* =========================================================
   Providers — fuente única (Bloque 4 la usará para /providers/ y las páginas de bio).
   Hoy la lee tools/locations/build.js (tarjeta del provider de Crown Heights).

   slug        → provisional hasta que exista la página de bio (credencial incluida en el slug)
   specialty / locations / bio → [CONFIRM] hasta que el cliente los confirme
   locations   → claves de data.js de las sedes (tools/locations/data.js)
   image       → { media } = placeholder .media-placeholder--1x1 · { url, width, height, alt } = foto real
   short       → forma corta para texto corrido ("Dr. Oyeniran")
========================================================= */

module.exports = [
    { slug: 'henry-sardar-md', name: 'Henry Sardar, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-henry-sardar' } },
    { slug: 'lee-trosterman-md', name: 'Lee Trosterman, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-lee-trosterman' } },
    { slug: 'jason-hernandez-md', name: 'Jason Hernandez, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-jason-hernandez' } },
    { slug: 'jennifer-schoenfeld-do', name: 'Jennifer Schoenfeld, DO', credential: 'DO',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-jennifer-schoenfeld' } },
    { slug: 'michelle-abraham-pa-c', name: 'Michelle Abraham, PA-C', credential: 'PA-C',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-michelle-abraham' } },
    { slug: 'anna-ducksoon-lee-md', name: 'Anna Ducksoon Lee, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['[CONFIRM]'], bio: '[CONFIRM]',
      image: { media: 'provider-anna-ducksoon-lee' } },
    {
        slug: 'olutimilehin-oyeniran-md',
        name: 'Olutimilehin Oyeniran, MD',
        short: 'Dr. Oyeniran',
        givenName: 'Olutimilehin', familyName: 'Oyeniran',
        credential: 'MD',                          // confirmada por el cliente
        specialty: 'Pain Management',
        locations: ['crown-heights'],
        bio: '[CONFIRM]',                          // sin bio no se crea su página (Bloque 4)
        image: {
            url: 'https://paintherapycare.com/wp-content/uploads/2026/11/Dr.-Olutimilehin-Oyeniran.png',
            width: 1254, height: 1254,             // PNG real (816 KB: conviene subir una versión ~600 px / WebP)
            alt: 'Portrait of Olutimilehin Oyeniran, MD'
        }
    }
];
