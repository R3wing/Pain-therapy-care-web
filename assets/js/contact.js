/* =========================================================
   PAIN THERAPY MEDICAL CARE — contact.js
   Vanilla JS, cargado con defer después de main.js y analytics.js.
   Página: /contact-us/

   - Validación accesible (nombre, teléfono, email): al salir del campo y al enviar;
     errores con texto + ícono + aria-describedby; foco al primer error.
   - El consentimiento SMS (#sms-consent) es opcional y NO bloquea el envío; al enviar se añaden
     sms_consent (yes/no), sms_consent_text_version, sms_consent_timestamp y form_source
     (prueba de opt-in 10DLC), igual que /schedule/.
   - Envío: mismo adaptador que /schedule/. Sin data-endpoint NO se envía nada (solo redirige a
     /thank-you-contact-page/). El formulario final será el de WordPress.
   - Analítica: form_start (una vez) y generate_lead {form:"contact"}; sin datos personales.

   PRIVACIDAD (HIPAA): nada de lo que escribe la persona se guarda en localStorage / cookies / URL
   ni se escribe en la consola.
========================================================= */

(function () {
    'use strict';

    var THANK_YOU_URL = '/thank-you-contact-page/';

    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var statusEl = form.querySelector('[data-form-status]');
    var started = false;

    function track(event, params) {
        if (window.ptAnalytics) window.ptAnalytics.track(event, params);
    }

    var rules = {
        name: function (el) { return el.value.trim() ? '' : 'Enter your full name.'; },
        phone: function (el) {
            var digits = el.value.replace(/\D/g, '');
            if (!digits) return 'Enter your phone number.';
            if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
            return digits.length === 10 ? '' : 'Enter a 10-digit phone number, for example (347) 395-4008.';
        },
        email: function (el) {
            var v = el.value.trim();
            if (!v) return 'Enter your email address.';
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, for example name@example.com.';
        }
    };

    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));

    function setError(el, message) {
        var error = document.getElementById(el.id + '-error');
        if (!error) return;
        if (message) {
            error.querySelector('[data-error-text]').textContent = message;
            error.hidden = false;
            el.setAttribute('aria-invalid', 'true');
            el.setAttribute('aria-describedby', error.id);
        } else {
            error.hidden = true;
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
        }
    }

    function validate(el) {
        var rule = rules[el.getAttribute('data-validate')];
        var message = rule ? rule(el) : '';
        setError(el, message);
        return !message;
    }

    fields.forEach(function (el) {
        el.addEventListener('blur', function () { if (el.value !== '' || el.hasAttribute('data-dirty')) validate(el); });
        el.addEventListener('input', function () {
            el.setAttribute('data-dirty', '');
            if (el.getAttribute('aria-invalid') === 'true') validate(el);
        });
    });

    function markStarted() {
        if (started) return;
        started = true;
        track('form_start', { form: 'contact' });
    }
    form.addEventListener('focusin', markStarted);
    form.addEventListener('change', markStarted);

    function announce(msg) { if (statusEl) statusEl.textContent = msg; }

    function smsOptIn() {
        var box = form.querySelector('#sms-consent');
        return !!(box && box.checked);
    }

    function collect() {
        var data = {};
        new FormData(form).forEach(function (value, key) { data[key] = value; });
        data.sms_consent = smsOptIn() ? 'yes' : 'no';   /* un checkbox sin marcar no viaja en FormData */
        data.sms_consent_timestamp = new Date().toISOString();
        return data;
    }

    function onSent() {
        track('generate_lead', { form: 'contact', sms_opt_in: smsOptIn() });   /* booleano: sin datos personales */
        window.setTimeout(function () { window.location.href = THANK_YOU_URL; }, 200);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var bad = fields.filter(function (el) { return !validate(el); });
        if (bad.length) {
            announce('Please correct the highlighted fields before sending.');
            bad[0].focus();
            return;
        }

        var endpoint = form.getAttribute('data-endpoint');
        if (!endpoint) {
            /* TODO: endpoint compatible con HIPAA (BAA). Sin endpoint, NO se envía nada. */
            console.warn('[contact] data-endpoint vacío: el mensaje NO se envía a ningún servidor.');
            onSent();
            return;
        }

        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.disabled = true;
        window.fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            body: JSON.stringify(collect())
        }).then(function (res) {
            if (!res.ok) throw new Error('http');
            onSent();
        }).catch(function () {
            if (btn) btn.disabled = false;
            announce('We could not send your message. Please try again, or call the location you prefer.');
        });
    });
})();
