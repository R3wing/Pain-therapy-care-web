/* =========================================================
   Providers — fuente única (Home, páginas de sede, Schedule ?provider=,
   y en el Bloque 4 /providers/ y las páginas de bio).

   slug       → provisional hasta que exista la página de bio
   locations  → claves de tools/locations/data.js (cada sede muestra SOLO sus providers)
   status     → 'active' (por defecto) | 'joining-soon' (tarjeta con badge "Joining soon",
                sin foto, sin enlace y NO seleccionable en /schedule/)
   image      → { media } = placeholder 1:1 · { url, width, height, alt } = foto real · null = inicial
   specialty / bio → [CONFIRM] hasta que el cliente los confirme (los [CONFIRM] no se muestran)

   Providers que ya no trabajan en la práctica: no figuran aquí ni en el sitio; sus URLs antiguas
   se redirigen (301) a /providers/ (ver tools/redirects.json).
========================================================= */

module.exports = [
    { slug: 'henry-sardar-md', name: 'Henry Sardar, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['williamsburg'], bio: '[CONFIRM]',
      image: { media: 'provider-henry-sardar' } },
    { slug: 'lee-trosterman-md', name: 'Lee Trosterman, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['williamsburg'], bio: '[CONFIRM]',
      image: { media: 'provider-lee-trosterman' } },
    { slug: 'jason-hernandez-md', name: 'Jason Hernandez, MD', credential: 'MD',
      specialty: '[CONFIRM]', locations: ['flatbush'], bio: '[CONFIRM]',
      image: { media: 'provider-jason-hernandez' } },
    {
        slug: 'olutimilehin-oyeniran-md',
        name: 'Olutimilehin Oyeniran, MD',
        short: 'Dr. Oyeniran',
        givenName: 'Olutimilehin', familyName: 'Oyeniran',
        credential: 'MD',
        specialty: 'Pain Management',
        locations: ['crown-heights'],
        bio: '[CONFIRM]',                          // sin bio no se crea su página (Bloque 4)
        image: {
            url: 'https://paintherapycare.com/wp-content/uploads/2026/11/Dr.-Olutimilehin-Oyeniran.png',
            width: 1254, height: 1254,             // PNG real (816 KB: conviene subir una versión ~600 px / WebP)
            alt: 'Portrait of Olutimilehin Oyeniran, MD'
        }
    },
    { slug: 'michelle-abraham-pa-c', name: 'Michelle Abraham, PA-C', credential: 'PA-C',
      specialty: '[CONFIRM]', locations: ['monsey'], bio: '[CONFIRM]',
      image: { media: 'provider-michelle-abraham' } },
    {
        slug: 'naveen-sharma-do',
        name: 'Naveen Sharma, DO',
        givenName: 'Naveen', familyName: 'Sharma',
        credential: 'DO',
        status: 'joining-soon',                    // CONFIRMAR fecha de inicio (+ foto y credenciales cuando lleguen)
        specialty: '[CONFIRM]',
        locations: ['inwood'],
        bio: '[CONFIRM]',
        image: null
    }
];
