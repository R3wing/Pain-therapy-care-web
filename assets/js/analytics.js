/* =========================================================
   PAIN THERAPY MEDICAL CARE — analytics.js
   Vanilla JS, cargado con defer. Un solo contenedor GTM:
   todos los eventos se envían a window.dataLayer.

   Eventos
     call_click        {location}   clic en cualquier enlace tel:
     directions_click  {location}   clic en "Directions" (Google Maps)
     coverage_check                 envío válido del formulario de /insurance/
     generate_lead                  solicitud de cita enviada (schedule.js)
     form_start        {form}       primer contacto con un formulario
     form_step         {form,step}  paso completado en un formulario multi-paso

   PRIVACIDAD (HIPAA): jamás se envían nombre, teléfono, email, mensaje,
   síntomas ni nada que identifique a la persona. Solo claves de sede
   (williamsburg, flatbush, inwood, monsey) y nombres de formulario.
   track() descarta cualquier parámetro cuya clave parezca un dato personal.

   Uso desde otros scripts:
     if (window.ptAnalytics) window.ptAnalytics.track('form_step', { form: 'schedule', step: 2 });
========================================================= */

(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    /* Sedes: clave, teléfono (tel:) y calle tal como aparece en los enlaces de Maps */
    var LOCATIONS = [
        { key: 'williamsburg', tel: '+13473954008', street: '16 sumner place' },
        { key: 'flatbush',     tel: '+17187154484', street: '2577 nostrand ave' },
        { key: 'inwood',       tel: '+15162762889', street: '233 doughty blvd' },
        { key: 'monsey',       tel: '+18454143711', street: '40 main st' }
    ];

    var PII_KEY = /name|phone|tel$|email|mail|message|msg|dob|birth|address|zip|insurance|plan|pain|symptom/i;

    function track(event, params) {
        var payload = { event: event };
        if (params) {
            Object.keys(params).forEach(function (k) {
                if (PII_KEY.test(k) || params[k] === undefined || params[k] === null) return;
                payload[k] = params[k];
            });
        }
        window.dataLayer.push(payload);
    }

    function byTel(href) {
        var digits = href.replace(/^tel:/i, '').replace(/[^\d+]/g, '');
        for (var i = 0; i < LOCATIONS.length; i++) {
            if (LOCATIONS[i].tel === digits) return LOCATIONS[i].key;
        }
        return 'unknown';
    }

    function byMapsUrl(href) {
        var text = href;
        try { text = decodeURIComponent(href); } catch (e) { /* se usa tal cual */ }
        text = text.replace(/\+/g, ' ').toLowerCase();
        for (var i = 0; i < LOCATIONS.length; i++) {
            if (text.indexOf(LOCATIONS[i].street) !== -1) return LOCATIONS[i].key;
        }
        return 'unknown';
    }

    /* Un solo listener delegado: funciona también con contenido inyectado */
    document.addEventListener('click', function (e) {
        var link = e.target.closest ? e.target.closest('a[href]') : null;
        if (!link) return;
        var href = link.getAttribute('href') || '';

        if (/^tel:/i.test(href)) {
            track('call_click', { location: link.getAttribute('data-analytics-location') || byTel(href) });
        } else if (/google\.[a-z.]+\/maps\/dir\//i.test(href) || /[?&]destination=/.test(href)) {
            track('directions_click', { location: link.getAttribute('data-analytics-location') || byMapsUrl(href) });
        }
    });

    window.ptAnalytics = { track: track };
})();
