/* =========================================================
   PAIN THERAPY MEDICAL CARE — schedule.js
   Vanilla JS, cargado con defer después de main.js y analytics.js.
   Páginas: /schedule/ y /thank-you-schedule/

   1) Parámetros ?location= ?provider= ?service= ?condition=
      → preselección + resumen "Booking at …"
   2) Formulario multi-paso (un solo <form>): stepper, Continue / Back
      sin perder datos, "Step X of 3" en aria-live
   3) Validación por paso (al salir del campo y al pulsar Continue),
      foco al primer error, errores con texto + ícono + aria-describedby
   4) Envío: redirige a /thank-you-schedule/ y dispara generate_lead
      (con sms_opt_in true/false). El checkbox SMS (#sms-consent) es opcional
      y no tiene validación; al enviar se añaden sms_consent (yes/no),
      sms_consent_text_version, sms_consent_timestamp y form_source.
   5) Thank-you: personaliza con ?location=

   Sin JS: los 3 fieldsets se ven seguidos y el formulario usa la
   validación nativa (required). El stepper y Continue/Back se ocultan.

   PRIVACIDAD (HIPAA): nada de lo que escribe la persona se guarda en
   localStorage / cookies / URL ni se escribe en la consola. En la URL
   de gracias solo viaja la clave de sede (p. ej. "williamsburg").
   Los eventos de analítica no llevan datos personales.
========================================================= */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var THANK_YOU_URL = '/thank-you-schedule/';

    /* Listas cerradas: solo se aceptan valores conocidos de la URL
       (evita inyectar texto arbitrario en la página). */
    var LOCATIONS = {
        williamsburg: { name: 'Williamsburg', slug: 'brooklyn-ny-williamsburg', tel: '+13473954008', phone: '(347) 395-4008' },
        flatbush: { name: 'Flatbush', slug: 'brooklyn-ny-flatbush', tel: '+17187154484', phone: '(718) 715-4484' },
        inwood: { name: 'Inwood · Five Towns', slug: 'inwood-ny', tel: '+15162762889', phone: '(516) 276-2889' },
        monsey: { name: 'Monsey', slug: 'monsey-ny', tel: '+18454143711', phone: '(845) 414-3711' }
    };

    var PROVIDERS = {
        'henry-sardar-md': 'Henry Sardar, MD',
        'lee-trosterman-md': 'Lee Trosterman, MD',
        'jason-hernandez-md': 'Jason Hernandez, MD',
        'jennifer-schoenfeld-do': 'Jennifer Schoenfeld, DO',
        'michelle-abraham-pa-c': 'Michelle Abraham, PA-C',
        'anna-ducksoon-lee-md': 'Anna Ducksoon Lee, MD'
    };

    var SERVICES = {
        'shock-wave-therapy': 'Shockwave Therapy',
        'emtt-therapy': 'EMTT Therapy',
        'laser-therapy': 'Laser Therapy',
        'pit-therapy': 'PIT Therapy',
        'tecar-therapy': 'TECAR Therapy',
        'cryotherapy': 'Cryotherapy',
        'steroid-injection': 'Steroid Injection',
        'ha-knee-injection': 'HA Knee Injection',
        'ultrasound-guided-injection': 'Ultrasound Guided Injection',
        'physical-therapy-occupational-therapy': 'Physical Therapy & OT',
        'aqua-therapy': 'Aqua Therapy',
        'ims-therapy': 'IMS Therapy',
        'tmj-therapy': 'TMJ Therapy',
        'pelvic-floor-therapy': 'Pelvic Floor Therapy'
    };

    var CONDITIONS = {
        'lower-back-pain': 'Lower Back Pain',
        'herniated-disk': 'Herniated Disk',
        'sciatica': 'Sciatica',
        'spinal-stenosis': 'Spinal Stenosis',
        'pinched-nerve': 'Pinched Nerve',
        'neck-pain': 'Neck Pain',
        'knee-pain': 'Knee Pain',
        'hip-pain': 'Hip Pain',
        'rotator-cuff-injury': 'Rotator Cuff Injury',
        'arthritis': 'Arthritis',
        'carpal-tunnel-syndrome': 'Carpal Tunnel Syndrome',
        'plantar-fasciitis': 'Plantar Fasciitis',
        'peripheral-neuropathy': 'Peripheral Neuropathy',
        'chronic-pain': 'Chronic Pain',
        'tmj-pain': 'TMJ Pain'
    };

    function has(map, key) {
        return Object.prototype.hasOwnProperty.call(map, key);
    }

    function getParam(name) {
        try {
            return new URLSearchParams(window.location.search).get(name) || '';
        } catch (e) {
            return '';
        }
    }

    function track(event, params) {
        if (window.ptAnalytics) window.ptAnalytics.track(event, params);
    }


    /* =====================================================
       5) THANK-YOU
    ===================================================== */
    function initThankYou() {
        var key = getParam('location');
        if (!has(LOCATIONS, key)) return;
        var loc = LOCATIONS[key];

        var place = document.querySelector('[data-ty-place]');
        var name = document.querySelector('[data-ty-name]');
        var link = document.querySelector('[data-ty-link]');
        var phone = document.querySelector('[data-ty-phone]');
        var pill = document.querySelector('[data-ty-location-link]');

        if (place && name) {
            name.textContent = loc.name;
            if (link) link.setAttribute('href', '/locations/' + loc.slug + '/');
            if (phone) {
                phone.setAttribute('href', 'tel:' + loc.tel);
                phone.textContent = 'Call ' + loc.phone;
            }
            place.hidden = false;
        }
        if (pill) {
            pill.setAttribute('href', '/locations/' + loc.slug + '/');
            pill.textContent = 'Our ' + loc.name + ' location';
        }
    }


    /* =====================================================
       FORMULARIO
    ===================================================== */
    function initForm(form) {
        var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
        var stepperItems = Array.prototype.slice.call(document.querySelectorAll('[data-stepper]'));
        var statusEl = document.querySelector('[data-step-status]');
        var formStatus = form.querySelector('[data-form-status]');
        var wizardTop = document.querySelector('[data-wizard-top]');
        var backBtn = form.querySelector('[data-step-back]');
        var nextBtn = form.querySelector('[data-step-next]');
        var submitBtn = form.querySelector('[data-step-submit]');
        var summary = document.querySelector('[data-booking-summary]');
        var summaryText = document.querySelector('[data-booking-text]');

        var STEP_NAMES = ['Your pain', 'Insurance', 'Contact'];
        var last = steps.length - 1;
        var current = 0;
        var started = false;
        var reported = {};   /* cada paso se reporta una sola vez (aunque la persona use Back) */

        form.noValidate = true;   /* JS toma el control; sin JS actúa "required" nativo */


        /* ---------- 1) Parámetros de la URL ---------- */
        var pLocation = getParam('location');
        var pProvider = getParam('provider');
        var pService = getParam('service');
        var pCondition = getParam('condition');

        if (!has(LOCATIONS, pLocation)) pLocation = '';
        if (!has(PROVIDERS, pProvider)) pProvider = '';
        if (!has(SERVICES, pService)) pService = '';
        if (!has(CONDITIONS, pCondition)) pCondition = '';

        function setHidden(name, value) {
            var input = form.querySelector('[data-param="' + name + '"]');
            if (input) input.value = value;
        }
        setHidden('service', pService);
        setHidden('provider', pProvider);
        setHidden('condition', pCondition);

        function locationRadios() {
            return form.querySelectorAll('input[name="location"]');
        }

        function selectedLocation() {
            var checked = form.querySelector('input[name="location"]:checked');
            return checked ? checked.value : '';
        }

        if (pLocation) {
            Array.prototype.forEach.call(locationRadios(), function (r) {
                if (r.value === pLocation) r.checked = true;
            });
        }

        function renderSummary() {
            if (!summary || !summaryText) return;
            if (!(pLocation || pProvider || pService || pCondition)) return;

            var loc = selectedLocation();
            var text = has(LOCATIONS, loc) ? 'Booking at ' + LOCATIONS[loc].name : 'Booking an appointment';
            if (pProvider) text += ' with ' + PROVIDERS[pProvider];
            if (pService) text += ' · ' + SERVICES[pService];
            if (pCondition) text += ' · For ' + CONDITIONS[pCondition];

            summaryText.textContent = text;
            summary.hidden = false;
        }
        renderSummary();
        form.addEventListener('change', function (e) {
            if (e.target.name === 'location') renderSummary();
        });


        /* ---------- 3) Validación ---------- */
        var rules = {
            first: function (el) { return el.value.trim() ? '' : 'Enter your first name.'; },
            last: function (el) { return el.value.trim() ? '' : 'Enter your last name.'; },
            phone: function (el) {
                var digits = el.value.replace(/\D/g, '');
                if (!digits) return 'Enter your mobile phone number.';
                if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
                return digits.length === 10 ? '' : 'Enter a 10-digit phone number, for example (347) 395-4008.';
            },
            email: function (el) {
                var v = el.value.trim();
                if (!v) return '';   /* opcional */
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address, for example name@example.com.';
            },
            consent: function (el) {
                return el.checked ? '' : 'Check this box so we can contact you about your request.';
            },
            pain: function (el) {
                return el.querySelector('input:checked') ? '' : 'Select where you feel pain, or choose “Other”.';
            },
            duration: function (el) {
                return el.querySelector('input:checked') ? '' : 'Select how long you have had pain.';
            },
            location: function (el) {
                return el.querySelector('input:checked') ? '' : 'Select the location you prefer.';
            },
            insurance: function (el) {
                return el.querySelector('input:checked') ? '' : 'Select your insurance type, or choose “Not sure”.';
            }
        };

        function ruleFor(el) {
            return rules[el.getAttribute('data-validate') || el.getAttribute('data-group-validate')];
        }

        function isGroup(el) {
            return el.hasAttribute('data-group-validate');
        }

        /* Guarda el aria-describedby original (pistas) para restaurarlo */
        Array.prototype.forEach.call(form.querySelectorAll('[data-validate], [data-group-validate]'), function (el) {
            el.setAttribute('data-describedby', el.getAttribute('aria-describedby') || '');
        });

        function setError(el, message) {
            var error = document.getElementById(el.id + '-error');
            var base = el.getAttribute('data-describedby') || '';
            if (!error) return;

            if (message) {
                error.querySelector('[data-error-text]').textContent = message;
                error.hidden = false;
                if (isGroup(el)) {
                    el.setAttribute('data-invalid', 'true');
                    if (el.getAttribute('role') === 'radiogroup') el.setAttribute('aria-invalid', 'true');
                } else {
                    el.setAttribute('aria-invalid', 'true');
                }
                /* El error se lee primero, luego la pista */
                el.setAttribute('aria-describedby', (error.id + ' ' + base).trim());
            } else {
                error.hidden = true;
                el.removeAttribute('aria-invalid');
                el.removeAttribute('data-invalid');
                if (base) el.setAttribute('aria-describedby', base);
                else el.removeAttribute('aria-describedby');
            }
        }

        function validate(el) {
            var rule = ruleFor(el);
            var message = rule ? rule(el) : '';
            setError(el, message);
            return !message;
        }

        function fieldsIn(step) {
            return Array.prototype.slice.call(step.querySelectorAll('[data-validate], [data-group-validate]'));
        }

        function firstFocusable(el) {
            return isGroup(el) ? el.querySelector('input') : el;
        }

        function announceForm(message) {
            if (!formStatus) return;
            formStatus.textContent = '';
            /* Vaciar y volver a escribir para que se repita el anuncio */
            window.setTimeout(function () { formStatus.textContent = message; }, 50);
        }

        /* Valida un paso; devuelve true si está completo */
        function validateStep(index) {
            var invalid = fieldsIn(steps[index]).filter(function (el) { return !validate(el); });
            if (invalid.length) {
                announceForm(invalid.length === 1
                    ? 'Please fix 1 field before continuing.'
                    : 'Please fix ' + invalid.length + ' fields before continuing.');
                var target = firstFocusable(invalid[0]);
                if (target) target.focus();
                return false;
            }
            return true;
        }

        /* Campos de texto: solo se validan al salir si ya se tocaron */
        form.addEventListener('input', function (e) {
            if (e.target.hasAttribute('data-validate')) e.target.setAttribute('data-dirty', '');
        });

        form.addEventListener('focusout', function (e) {
            var el = e.target;
            if (el.hasAttribute('data-validate')) {
                if (el.hasAttribute('data-dirty') || el.getAttribute('aria-invalid') === 'true') validate(el);
                return;
            }
            /* Grupos: al salir del grupo (no entre sus propias opciones) */
            var group = el.closest ? el.closest('[data-group-validate]') : null;
            if (group && group.hasAttribute('data-touched') &&
                !(e.relatedTarget && group.contains(e.relatedTarget))) {
                validate(group);
            }
        });

        form.addEventListener('focusin', function (e) {
            var group = e.target.closest ? e.target.closest('[data-group-validate]') : null;
            if (group) group.setAttribute('data-touched', '');
        });

        /* Opciones y casillas: se revalida de inmediato (no es "escribir") */
        form.addEventListener('change', function (e) {
            var el = e.target;
            var group = el.closest ? el.closest('[data-group-validate]') : null;
            if (group) {
                group.setAttribute('data-touched', '');
                validate(group);
            } else if (el.type === 'checkbox' && el.hasAttribute('data-validate') && el.getAttribute('aria-invalid') === 'true') {
                validate(el);
            }
        });


        /* ---------- Analítica: form_start (una vez, sin datos) ---------- */
        function markStarted() {
            if (started) return;
            started = true;
            track('form_start', { form: 'schedule' });
        }
        form.addEventListener('focusin', markStarted);
        form.addEventListener('change', markStarted);


        function reportStep(n) {
            if (reported[n]) return;
            reported[n] = true;
            track('form_step', { form: 'schedule', step: n });
        }


        /* ---------- 2) Pasos ---------- */
        function showStep(index, moveFocus) {
            current = index;

            steps.forEach(function (step, i) { step.hidden = i !== index; });

            stepperItems.forEach(function (item, i) {
                if (i === index) item.setAttribute('aria-current', 'step');
                else item.removeAttribute('aria-current');
                item.classList.toggle('is-done', i < index);
            });

            if (statusEl) statusEl.textContent = 'Step ' + (index + 1) + ' of ' + steps.length + ' · ' + STEP_NAMES[index];

            if (backBtn) backBtn.hidden = index === 0;
            if (nextBtn) nextBtn.hidden = index === last;
            if (submitBtn) submitBtn.hidden = index !== last;

            if (moveFocus) {
                if (wizardTop && wizardTop.scrollIntoView) {
                    wizardTop.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
                }
                var title = steps[index].querySelector('[data-step-title]');
                if (title) title.focus({ preventScroll: true });
            }
        }

        function goNext() {
            if (!validateStep(current)) return;
            reportStep(current + 1);
            showStep(current + 1, true);
        }

        function goBack() {
            if (current > 0) showStep(current - 1, true);   /* los datos siguen en el DOM */
        }

        if (nextBtn) nextBtn.addEventListener('click', goNext);
        if (backBtn) backBtn.addEventListener('click', goBack);

        showStep(0, false);


        /* ---------- 4) Envío ---------- */
        function smsOptIn() {
            var box = form.querySelector('#sms-consent');
            return !!(box && box.checked);
        }

        function collect() {
            var data = {};
            new FormData(form).forEach(function (value, key) {
                if (key === 'pain_area') {
                    (data[key] = data[key] || []).push(value);
                } else {
                    data[key] = value;
                }
            });
            /* Prueba de opt-in SMS (10DLC): un checkbox sin marcar no viaja en FormData,
               por eso se fija explícitamente "yes" / "no". La versión del texto y
               form_source son campos ocultos del formulario. */
            data.sms_consent = smsOptIn() ? 'yes' : 'no';
            data.sms_consent_timestamp = new Date().toISOString();
            return data;
        }

        function redirect() {
            var key = selectedLocation();
            var url = THANK_YOU_URL + (has(LOCATIONS, key) ? '?location=' + encodeURIComponent(key) : '');
            window.location.href = url;
        }

        function onSent() {
            reportStep(steps.length);
            track('generate_lead', {
                form: 'schedule',
                location: has(LOCATIONS, selectedLocation()) ? selectedLocation() : undefined,
                sms_opt_in: smsOptIn()   /* booleano: sin teléfono ni datos personales */
            });
            /* Pequeña espera para que GTM procese el evento antes de salir */
            window.setTimeout(redirect, 200);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            /* Enter dentro de un paso intermedio = Continue */
            if (current < last) {
                goNext();
                return;
            }

            /* Último paso: se revisan todos, empezando por el primero con errores */
            for (var i = 0; i <= last; i++) {
                if (i !== current) {
                    var bad = fieldsIn(steps[i]).filter(function (el) { return !validate(el); });
                    if (bad.length) {
                        showStep(i, true);
                        announceForm('Please complete step ' + (i + 1) + ' before sending.');
                        var t = firstFocusable(bad[0]);
                        if (t) window.setTimeout(function () { t.focus(); }, 0);
                        return;
                    }
                } else if (!validateStep(i)) {
                    return;
                }
            }

            var endpoint = form.getAttribute('data-endpoint');

            if (!endpoint) {
                /* TODO: endpoint compatible con HIPAA (BAA). Sin endpoint, NO se envía nada. */
                console.warn('[schedule] data-endpoint vacío: la solicitud NO se envía a ningún servidor.');
                onSent();
                return;
            }

            submitBtn.disabled = true;
            window.fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'omit',
                body: JSON.stringify(collect())
            }).then(function (res) {
                if (!res.ok) throw new Error('http');
                onSent();
            }).catch(function () {
                submitBtn.disabled = false;
                announceForm('We could not send your request. Please try again, or call the location you prefer.');
            });
        });
    }


    /* ---------- arranque ---------- */
    var form = document.querySelector('[data-schedule-form]');
    if (form) initForm(form);
    if (document.querySelector('[data-thankyou]')) initThankYou();
})();
