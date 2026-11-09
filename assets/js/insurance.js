/* =========================================================
   PAIN THERAPY MEDICAL CARE — insurance.js  (/insurance/)
   Vanilla JS, cargado con defer después de main.js.
   1) Filtro de planes en tiempo real + anuncio aria-live
   2) Formulario "coverage check": validación y estado de éxito
   Sin JS: la lista se ve completa y el formulario se envía
   de forma nativa (con validación HTML "required").
========================================================= */

(function () {
    'use strict';

    /* Minúsculas, sin acentos ni signos: "Blue-Cross" → "bluecross" */
    function normalize(str) {
        str = String(str || '').toLowerCase();
        if (str.normalize) str = str.normalize('NFD').replace(/[̀-ͯ]/g, '');
        return str.replace(/[^a-z0-9]+/g, '');
    }


    /* -----------------------------------------------------
       1) FILTRO DE PLANES
    ------------------------------------------------------ */
    var search = document.getElementById('plan-search');
    var list = document.querySelector('[data-plan-list]');
    var status = document.getElementById('plan-search-status');
    var emptyCta = document.querySelector('[data-plan-empty]');

    if (search && list && status) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-plan]'));
        var total = cards.length;

        /* Índice de búsqueda: nombre visible + alias (data-keywords) */
        var index = cards.map(function (card) {
            var name = card.querySelector('[data-plan-name]');
            return normalize((name ? name.textContent : '') + ' ' + (card.getAttribute('data-keywords') || ''));
        });

        var announceTimer = null;
        var lastShown = total;

        var filterPlans = function () {
            var q = normalize(search.value);
            var shown = 0;

            cards.forEach(function (card, i) {
                var match = !q || index[i].indexOf(q) !== -1;
                card.hidden = !match;
                if (match) shown++;
            });

            if (emptyCta) emptyCta.hidden = shown !== 0;
            lastShown = shown;
        };

        /* Se anuncia con retardo para no interrumpir en cada tecla */
        var announce = function () {
            var msg;
            if (!normalize(search.value)) msg = 'Showing all ' + total + ' plans';
            else if (lastShown === 0) msg = 'No plans found — call us and we’ll check yours';
            else msg = lastShown + (lastShown === 1 ? ' plan' : ' plans') + ' found';
            status.textContent = msg;
        };

        search.addEventListener('input', function () {
            filterPlans();
            window.clearTimeout(announceTimer);
            announceTimer = window.setTimeout(announce, 400);
        });

        /* Enter no debe hacer nada inesperado */
        search.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') e.preventDefault();
        });

        /* Valor restaurado por el navegador (atrás/adelante) */
        if (search.value) {
            filterPlans();
            announce();
        }
    }


    /* -----------------------------------------------------
       2) FORMULARIO "CHECK MY COVERAGE"
       - Valida al salir del campo (no mientras se escribe)
       - Errores con ícono + texto, aria-invalid y aria-describedby
       - Al enviar: foco al primer campo con error
       - Éxito: reemplaza el formulario y mueve el foco al mensaje
    ------------------------------------------------------ */
    var form = document.querySelector('[data-coverage-form]');
    var success = document.querySelector('[data-coverage-success]');

    if (!form || !success) return;

    form.noValidate = true; /* JS toma el control; sin JS actúa "required" nativo */

    var formStatus = form.querySelector('[data-form-status]');
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));

    var rules = {
        name: function (el) {
            return el.value.trim().length >= 2 ? '' : 'Enter your full name.';
        },
        phone: function (el) {
            var digits = el.value.replace(/\D/g, '');
            if (!digits) return 'Enter your phone number.';
            if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
            return digits.length === 10 ? '' : 'Enter a 10-digit phone number, for example (347) 395-4008.';
        },
        plan: function (el) {
            return el.value ? '' : 'Select your insurance plan, or choose “Other / not sure”.';
        },
        consent: function (el) {
            return el.checked ? '' : 'Check this box so we can contact you about your coverage.';
        }
    };

    /* Guarda el aria-describedby original (pistas) para restaurarlo */
    fields.forEach(function (el) {
        el.setAttribute('data-describedby', el.getAttribute('aria-describedby') || '');
    });

    function setError(el, message) {
        var error = document.getElementById(el.id + '-error');
        var base = el.getAttribute('data-describedby');
        if (!error) return;

        if (message) {
            error.querySelector('[data-error-text]').textContent = message;
            error.hidden = false;
            el.setAttribute('aria-invalid', 'true');
            /* El error se lee primero, luego la pista */
            el.setAttribute('aria-describedby', (error.id + ' ' + base).trim());
        } else {
            error.hidden = true;
            el.removeAttribute('aria-invalid');
            if (base) el.setAttribute('aria-describedby', base);
            else el.removeAttribute('aria-describedby');
        }
    }

    function validate(el) {
        var rule = rules[el.getAttribute('data-validate')];
        var message = rule ? rule(el) : '';
        setError(el, message);
        return !message;
    }

    /* Campos que el usuario ya tocó: solo esos se validan al salir */
    function markDirty(e) {
        if (e.target.hasAttribute('data-validate')) e.target.setAttribute('data-dirty', '');
    }
    form.addEventListener('input', markDirty);
    form.addEventListener('change', markDirty);

    form.addEventListener('focusout', function (e) {
        var el = e.target;
        if (!el.hasAttribute('data-validate')) return;
        if (el.hasAttribute('data-dirty') || el.getAttribute('aria-invalid') === 'true') validate(el);
    });

    /* Checkbox: al marcarlo se quita el error de inmediato (no es "escribir") */
    form.addEventListener('change', function (e) {
        var el = e.target;
        if (el.type === 'checkbox' && el.getAttribute('aria-invalid') === 'true') validate(el);
    });

    function announceForm(message) {
        if (!formStatus) return;
        formStatus.textContent = '';
        /* Vaciar y volver a escribir para que se repita el anuncio */
        window.setTimeout(function () { formStatus.textContent = message; }, 50);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var invalid = fields.filter(function (el) { return !validate(el); });

        if (invalid.length) {
            announceForm(invalid.length === 1
                ? 'Please fix 1 field before sending.'
                : 'Please fix ' + invalid.length + ' fields before sending.');
            invalid[0].focus();
            return;
        }

        /*
         * TODO: enviar a un endpoint compatible con HIPAA (con BAA firmado),
         * por HTTPS (fetch POST). No enviar a un email común, no guardar los
         * datos en localStorage/cookies y no escribirlos en la consola.
         * Mostrar el estado de éxito solo cuando el servidor responda OK.
         */
        showSuccess();
    });

    function showSuccess() {
        /* Evento sin datos personales (ver analytics.js) */
        if (window.ptAnalytics) window.ptAnalytics.track('coverage_check');
        form.reset();          /* no dejar datos personales en el DOM */
        form.hidden = true;
        success.hidden = false;
        success.focus();
    }
})();
