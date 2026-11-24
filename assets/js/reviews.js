/* =========================================================
   PAIN THERAPY MEDICAL CARE — reviews.js
   Vanilla JS, cargado con defer. Página: /reviews/

   Filtro por tratamiento (píldoras con aria-pressed) sin recargar la página.
   Sin JS: el filtro no se ve y se muestran todas las reseñas.
   Cada reseña lleva data-treatments="shockwave laser …" (solo lo que su texto menciona).
========================================================= */

(function () {
    'use strict';

    var root = document.querySelector('[data-reviews-filter]');
    var list = document.querySelector('[data-reviews-list]');
    if (!root || !list) return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-review-filter]'));
    var items = Array.prototype.slice.call(list.querySelectorAll('[data-review]'));
    var status = root.querySelector('[data-reviews-status]');

    function apply(key, announce) {
        var shown = 0;
        items.forEach(function (li) {
            var treatments = (li.getAttribute('data-treatments') || '').split(' ');
            var show = key === 'all' || treatments.indexOf(key) !== -1;
            li.hidden = !show;
            if (show) shown++;
        });
        buttons.forEach(function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-review-filter') === key ? 'true' : 'false');
        });
        if (status && announce) {
            var label = buttons.filter(function (b) { return b.getAttribute('data-review-filter') === key; })[0];
            status.textContent = 'Showing ' + shown + (shown === 1 ? ' review' : ' reviews') +
                (key === 'all' ? '' : ' mentioning ' + (label ? label.firstChild.textContent.trim() : key)) + '.';
        }
    }

    buttons.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.getAttribute('data-review-filter'), true); });
    });
})();
