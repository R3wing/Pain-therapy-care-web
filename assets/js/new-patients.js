/* =========================================================
   PAIN THERAPY MEDICAL CARE — new-patients.js  (/new-patients/)
   Vanilla JS, cargado con defer después de main.js y analytics.js.

   1) "Share this page": usa navigator.share si existe; si no, copia
      el enlace al portapapeles y anuncia "Link copied" (aria-live).
   2) "Print this checklist": window.print(). El CSS @media print
      deja solo la checklist y las sedes (ver styles.css, PAGE: NEW PATIENTS).

   Mejora progresiva: ambos botones nacen con [hidden] y solo se
   muestran con JS (sin JS no harían nada).

   Analítica (sin datos personales):
     share_click     {method: "native" | "copy"}
     print_checklist
========================================================= */

(function () {
    'use strict';

    function track(event, params) {
        if (window.ptAnalytics) window.ptAnalytics.track(event, params);
    }

    /* ---------- 1) Compartir ---------- */
    var shareBtn = document.querySelector('[data-share]');
    var statusEl = document.querySelector('[data-share-status]');
    var statusTimer;

    function say(message) {
        if (!statusEl) return;
        statusEl.textContent = message;
        window.clearTimeout(statusTimer);
        statusTimer = window.setTimeout(function () { statusEl.textContent = ''; }, 4000);
    }

    function pageUrl() {
        var canonical = document.querySelector('link[rel="canonical"]');
        return (canonical && canonical.href) || window.location.href.split('#')[0];
    }

    /* Portapapeles: API moderna y, si no está disponible, respaldo con textarea */
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            document.body.removeChild(area);
            if (ok) resolve(); else reject(new Error('copy'));
        });
    }

    function copyLink() {
        copyText(pageUrl()).then(function () {
            say('Link copied');
            track('share_click', { method: 'copy' });
        }).catch(function () {
            say('We could not copy the link. You can copy it from the address bar.');
        });
    }

    if (shareBtn) {
        shareBtn.hidden = false;
        shareBtn.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({ title: document.title, url: pageUrl() }).then(function () {
                    track('share_click', { method: 'native' });
                }).catch(function (err) {
                    /* Cerrar el panel de compartir no es un error: no se hace nada */
                    if (err && err.name === 'AbortError') return;
                    copyLink();
                });
            } else {
                copyLink();
            }
        });
    }


    /* ---------- 2) Imprimir la checklist ---------- */
    var printBtn = document.querySelector('[data-print]');
    if (printBtn) {
        printBtn.hidden = false;
        printBtn.addEventListener('click', function () {
            track('print_checklist');
            window.print();
        });
    }
})();
