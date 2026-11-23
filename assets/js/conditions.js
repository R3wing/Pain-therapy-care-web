/* =========================================================
   PAIN THERAPY MEDICAL CARE — conditions.js  (/conditions/)
   Buscador de condiciones: patrón combobox de ARIA (editable, lista de opciones).

   - Filtra mientras se escribe las condiciones que ya están en la página
     ([data-cond-item]: nombre, zona y ruta); no duplica datos.
   - Teclado: ↓ ↑ Inicio Fin mueven la opción activa · Enter abre la condición ·
     Esc limpia (y cierra la lista).
   - El resultado se anuncia en una región aria-live (data-cond-search-status).
   - Sin JS: el buscador está oculto (.js) y se ve la lista completa de abajo.
========================================================= */

(function () {
    'use strict';

    var root = document.querySelector('[data-cond-search]');
    if (!root) return;

    var input = root.querySelector('[role="combobox"]');
    var list = root.querySelector('[role="listbox"]');
    var status = root.querySelector('[data-cond-search-status]');
    if (!input || !list || !status) return;

    /* Condiciones leídas de las tarjetas de la página */
    var items = Array.prototype.map.call(document.querySelectorAll('[data-cond-item]'), function (el) {
        return { name: el.getAttribute('data-name'), zone: el.getAttribute('data-zone'), href: el.getAttribute('data-href') };
    });

    var shown = [];      // resultados visibles
    var active = -1;     // índice de la opción activa

    function norm(s) {
        return String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function setOpen(open) {
        list.hidden = !open;
        input.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) {
            active = -1;
            input.removeAttribute('aria-activedescendant');
        }
    }

    function setActive(i) {
        var opts = list.children;
        if (active > -1 && opts[active]) opts[active].setAttribute('aria-selected', 'false');
        active = i;
        if (i > -1 && opts[i]) {
            opts[i].setAttribute('aria-selected', 'true');
            input.setAttribute('aria-activedescendant', opts[i].id);
            opts[i].scrollIntoView({ block: 'nearest' });
        } else {
            input.removeAttribute('aria-activedescendant');
        }
    }

    function announce(text) {
        status.textContent = '';
        window.setTimeout(function () { status.textContent = text; }, 50);
    }

    function render(query, showAll) {
        var q = norm(query);
        shown = items.filter(function (it) {
            return showAll || !q || norm(it.name + ' ' + it.zone).indexOf(q) !== -1;
        });

        list.innerHTML = '';
        shown.forEach(function (it, i) {
            var li = document.createElement('li');
            li.id = 'cond-opt-' + i;
            li.className = 'cond-search__option';
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            li.setAttribute('data-href', it.href);
            var name = document.createElement('span');
            name.className = 'cond-search__name';
            name.textContent = it.name;
            var zone = document.createElement('span');
            zone.className = 'cond-search__zone';
            zone.textContent = it.zone;
            li.appendChild(name);
            li.appendChild(zone);
            /* mousedown (no click) para ganar al blur del input */
            li.addEventListener('mousedown', function (e) { e.preventDefault(); go(it.href); });
            list.appendChild(li);
        });

        if (!shown.length && q) {
            var none = document.createElement('li');
            none.className = 'cond-search__none';
            none.setAttribute('role', 'presentation');
            none.textContent = 'No conditions found. Try another word or book an evaluation.';
            list.appendChild(none);
        }

        setOpen(!!shown.length || !!q);
        active = -1;
        announce(shown.length
            ? shown.length + (shown.length === 1 ? ' condition found.' : ' conditions found.') + ' Use the arrow keys to choose.'
            : 'No conditions found.');
    }

    function go(href) {
        if (href) window.location.href = href;
    }

    input.addEventListener('input', function () { render(input.value, false); });

    input.addEventListener('focus', function () {
        if (input.value) render(input.value, false);
    });

    input.addEventListener('keydown', function (e) {
        var open = !list.hidden && shown.length > 0;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!open) { render(input.value, !input.value); setActive(0); }
                else setActive(active < shown.length - 1 ? active + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!open) { render(input.value, !input.value); setActive(shown.length - 1); }
                else setActive(active > 0 ? active - 1 : shown.length - 1);
                break;
            case 'Home':
                if (open) { e.preventDefault(); setActive(0); }
                break;
            case 'End':
                if (open) { e.preventDefault(); setActive(shown.length - 1); }
                break;
            case 'Enter':
                if (open && active > -1) { e.preventDefault(); go(shown[active].href); }
                else if (open && shown.length === 1) { e.preventDefault(); go(shown[0].href); }
                break;
            case 'Escape':
                /* Esc limpia el campo y cierra la lista */
                if (input.value || !list.hidden) {
                    e.preventDefault();
                    input.value = '';
                    setOpen(false);
                    announce('Search cleared.');
                }
                break;
            default:
        }
    });

    input.addEventListener('blur', function () {
        window.setTimeout(function () { setOpen(false); }, 120);
    });
})();
