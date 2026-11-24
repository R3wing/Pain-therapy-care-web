/* =========================================================
   Reseñas de pacientes: ÚNICA fuente de /reviews/ (tools/reviews/build.js) y del bloque de reseñas
   de las bios de /providers/ (se filtra por provider).

   { id, name, text, lang, provider, treatments[], location, source }
   - text: copia LITERAL de https://paintherapycare.com/reviews/ (API de WordPress, modificado 2026-08-25):
     sin resumir, corregir ni traducir (incluye errores como "Dr. Sadar"). Párrafos separados por línea en blanco.
   - name: tal como aparece en la web en vivo.
   - provider: "henry-sardar-md" solo si el texto nombra al Dr. Sardar (también con la grafía "Sadar" / "Sr. Sadar").
   - treatments[]: SOLO tratamientos que la reseña menciona textualmente (shockwave, laser, emtt, cryotherapy, injections).
   - location: null (ninguna reseña nombra una sede).
   - lang: "es" para la reseña en español (se marca lang="es" en el HTML).
   - SIN promedio, SIN número de estrellas y SIN schema Review / AggregateRating.

   NO PUBLICADAS (no están en "reviews"; ver pendiente #33 en la lista del proyecto):
   · Wendy G. — Posible empleada (pendiente #33). OJO: en la web en vivo su tarjeta trae 3 párrafos juntos; los 2 primeros (los que parecían "la reseña sin nombre") NO tienen nombre propio en el HTML en vivo: se leen como parte de esta misma tarjeta. Si el cliente confirma que son una reseña aparte de un paciente, mover los 2 primeros párrafos a "reviews" con name "Verified patient".
       texto: I’m beyond grateful to receive a lidocaine treatment that is natural and helpful to my body. I can finally say goodbye to my pain without having to undergo surgery or invasive treatments that would keep me in bed or out of work. ¶ Shockwave therapy, EMTT, K-Laser, and much more have helped me so much over the last three years. The pain management options the doctor provides in his office help his patients naturally. Please go check this doctor out! He really cares about all his patients who are dealing with pain. Good work, 5 stars! LOVE! ¶ Great pain management doctor with a warm and friendly staff. He’s the best Brooklyn pain management doctor. If you have pain, come see him!
   · Ryan K. — Parece reseña de un empleado (pendiente #33).
       texto: I would like to say that the work environment is amazing. It is happy, informative, and light-hearted. They leave their drama at home and are there to work and make you feel good. This is hospitality at its best! ¶ The treatments I received were K-Laser Therapy, CryoPolarBear Therapy, and Piezowave (shockwave) Therapy. I have received about three treatments of each so far. I was skeptical at first, but it does work if you work with it! Don’t give up, people; persevere and push yourself toward betterment. I highly recommend them and hope you receive the same exceptional service that I received. May peace, blessings, and mercy find you all.
   · Carmen B. — Decisión previa: no se publica.
       texto: I’ve been to other medical places but Ahava is one of the best. Dr Sardar is very efficient and the staff is very friendly, I would recommend my friends and family to visit there anytime.
========================================================= */

module.exports = [
    {
        id: "j-h",
        name: "J. H",
        text: "Dr. Sardar, his assistant Wendy and Theresa are absolutely WONDERFUL! I’ve been treated with lidocaine injections in conjunction with shockwave and laser therapy treatments which has helped with my severe lower back pain. Dr. Sadar and his team took the time to explain the different treatments plans with me. I am definitely going to continue my treatments. I can’t wait to get back to a normal life!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: ["shockwave","laser","injections"],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "marjorie-m",
        name: "Marjorie M.",
        text: "I love coming to pain management to see Dr. Henry Sardar. He is very caring and so informative about a treatment plan that helps me naturally. I’m very happy to say he walks into his office with a smile and says hi to all his patients. He is the best Brooklyn pain management doctor! Come see him; his technology is so advanced and effective. Shockwave therapy, K-Laser, EMTT, and cryotherapy are just some of the many treatments he has! Wendy is the best.",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: ["shockwave","laser","emtt","cryotherapy"],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "violet",
        name: "Violet",
        text: "Truly a great experience, I’ve been seeing Dr. Sardar for the past couple months to help with my ankle pain. He used the shockwave therapy to help with the inflammation in my ankle. Let me tell ya, I use to have so much pain getting up in the morning. Now I feel like I can jump out of bed with ease and not be afraid of walking long distances. Thank you so much Dr. Sardar and the wonderful staff for helping me with my pain! Special kudos to Wendy she is always so nice and makes you feel comfortable while getting the treatments!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: ["shockwave"],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "porsha",
        name: "Porsha",
        text: "I have struggled with chronic pain for 20 years or more from a severely herniated disc, but thank God I discovered Dr. Sardar from a simple Google search!! Just one visit erased so much tension and I’m looking forward to weekly visits. I am confidant that Sr. Sadar’s exceptional hand at giving Trigger Point injections, and Shockwave Therapy will finally heal me. Dr. Sardar is not only skilled at alleviating chronic pain but his bedside manner is the best as he really cares about his patients! He gets 5 stars!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: ["shockwave","injections"],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "gloria-r",
        name: "Gloria R.",
        text: "For the BEST PAIN MANAGEMENT with CARE and quick RESULTS, offered through excellent TREATMENT and RECOVERY. This is by far the best team and service I’ve ever received! Thank you, Dr. Sardar and Ms. Wendy, for your service and treatment!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "lourdes-v",
        name: "Lourdes V.",
        text: "Since I started seeing Dr. Henry Sardar in the Clinic Pain Management to treat my condition of pain in different areas of my body. I have improved from 60 to 70% out of pain. His recommendations and treatments helping me a lot. I recommend him to some of my friends and are very happy with him.",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "iris-a",
        name: "Iris A.",
        text: "The best physician out there especially with the new technologies that he have in his office.",
        lang: "en",
        provider: null,
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "maria-p",
        name: "Maria P.",
        text: "En la mejor experiencia que he tenido en esta clínica gracias a Dios llegado el sitio bueno.",
        lang: "es",
        provider: null,
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "rose-r",
        name: "Rose R.",
        text: "I used the machine for my back since I have scoliosis and it helped me with the discomfort I had. It relieved my pain and I was able to function better.",
        lang: "en",
        provider: null,
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "hilma-s",
        name: "Hilma S.",
        text: "I must say i have been receiving excellent care. Dr Sadar is an experience yet warm person. He provides state of the art treatment. The staff is warm and friendly. This is definitely the time of experience and service you need especially when dealing with PAIN…such and environment in itself helps with the pain.. I recommend Dr Sadar highly and his professional team!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "mordechai-l",
        name: "Mordechai l.",
        text: "Dr. Sardar informs me of available treatment options, including benefits and risks, and respected the choices I made. Dr. Sardar does not “push” specific treatments when I have been reluctant to pursue recommended protocols. To me, Dr. Sardar is a caring and competent professional who makes every effort to see me at the time scheduled.",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
    {
        id: "himal-p",
        name: "Himal P.",
        text: "Ever since starting treatment for my chronic low back pain with Dr. Henry Sardar, my pain has significantly improved. I cannot thank Dr. Sardar and his team enough!",
        lang: "en",
        provider: "henry-sardar-md",
        treatments: [],
        location: null,
        source: "paintherapycare.com/reviews"
    },
];
