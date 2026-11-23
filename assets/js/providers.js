/* =========================================================
   PAIN THERAPY MEDICAL CARE — providers.js  (/providers/ y /providers/<slug>/)

   1) Filtros de /providers/ ([data-prov-filters]):
      - <select> de sede y de tipo (físicos MD/DO · Physician Assistants).
      - Filtra las tarjetas que ya están en la página ([data-prov-item]: data-loc y data-type).
      - El resultado se anuncia en una región aria-live ([data-prov-status]), p. ej.
        "2 providers in Williamsburg".
      - "Clear filters" solo aparece con filtros activos.
      - Sin resultados: mensaje + "Call a location".
      - Sin JS: el bloque de filtros queda oculto (CSS .js) y se ven todos los providers.

   2) Carrusel de "Meet the rest of our team" ([data-carousel]):
      - scroll-snap nativo + botones anterior/siguiente (aria-label, disabled en los extremos).
      - Sin autoplay. Con prefers-reduced-motion el desplazamiento no se anima.
      - En escritorio (≥ 1200px) se ve como cuadrícula y los botones se ocultan (CSS).
========================================================= */

(function () {
    'use strict';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1) Filtros ---------- */

    var filters = document.querySelector('[data-prov-filters]');
    var grid = document.querySelector('[data-prov-grid]');
    if (filters && grid) {
        var selLoc = filters.querySelector('[data-prov-filter="loc"]');
        var selType = filters.querySelector('[data-prov-filter="type"]');
        var clearBtn = filters.querySelector('[data-prov-clear]');
        var status = document.querySelector('[data-prov-status]');
        var empty = document.querySelector('[data-prov-empty]');
        var items = Array.prototype.slice.call(grid.querySelectorAll('[data-prov-item]'));

        var TYPE_LABEL = { physician: 'physicians (MD/DO)', pa: 'physician assistants' };

        var apply = function (announce) {
            var loc = selLoc.value, type = selType.value, shown = 0;
            items.forEach(function (li) {
                var okLoc = !loc || (' ' + li.getAttribute('data-loc') + ' ').indexOf(' ' + loc + ' ') !== -1;
                var okType = !type || li.getAttribute('data-type') === type;
                var show = okLoc && okType;
                li.hidden = !show;
                if (show) shown++;
            });
            var active = !!(loc || type);
            clearBtn.hidden = !active;
            grid.hidden = shown === 0;
            if (empty) empty.hidden = shown !== 0;
            if (!status || !announce) return;

            var where = loc ? ' in ' + selLoc.options[selLoc.selectedIndex].text : '';
            var kind = type ? ' (' + TYPE_LABEL[type] + ')' : '';
            if (!shown) status.textContent = 'No providers found' + where + kind + '.';
            else if (!active) status.textContent = 'Showing all ' + shown + ' providers.';
            else status.textContent = shown + (shown === 1 ? ' provider' : ' providers') + where + kind;
        };

        selLoc.addEventListener('change', function () { apply(true); });
        selType.addEventListener('change', function () { apply(true); });
        clearBtn.addEventListener('click', function () {
            selLoc.value = '';
            selType.value = '';
            apply(true);
            selLoc.focus();
        });
        apply(false);
    }

    /* ---------- 2) Carrusel ---------- */

    Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (root) {
        var track = root.querySelector('[data-carousel-track]');
        var prev = root.querySelector('[data-carousel-prev]');
        var next = root.querySelector('[data-carousel-next]');
        if (!track || !prev || !next) return;

        var update = function () {
            var max = track.scrollWidth - track.clientWidth;
            prev.disabled = track.scrollLeft <= 1;
            next.disabled = track.scrollLeft >= max - 1;
        };

        var step = function () {
            var li = track.querySelector('li:not([hidden])');
            if (!li) return track.clientWidth;
            var second = li.nextElementSibling;
            return second ? second.offsetLeft - li.offsetLeft : li.offsetWidth;
        };

        var go = function (dir) {
            track.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });
        };

        prev.addEventListener('click', function () { go(-1); });
        next.addEventListener('click', function () { go(1); });

        var ticking = false;
        track.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () { ticking = false; update(); });
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    });
})();
