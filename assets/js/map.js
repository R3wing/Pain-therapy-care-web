/* =========================================================
   PAIN THERAPY MEDICAL CARE — map.js
   Mapa reutilizable (Leaflet 1.9.4 autoalojado en assets/vendor/leaflet/).

   Uso declarativo (el HTML lo genera el partial "map" de tools/shared/lib.js):
     <div class="map" data-map="all">                          → las sedes de PT_LOCATIONS
     <div class="map" data-map="brooklyn-ny-crown-heights">    → una sede (zoom 16, popup abierto)

   Datos: window.PT_LOCATIONS (assets/js/locations-data.js, GENERADO desde
   tools/locations/data.js por build-all). No se escriben a mano.

   - Leaflet (CSS + JS) se carga SOLO cuando el mapa está por entrar en pantalla.
     Antes, el contenedor reserva su alto (aspect-ratio): sin layout shift ni LCP.
   - Mapa base: OpenStreetMap (atribución visible, obligatoria).
   - scrollWheelZoom desactivado; en móvil, un dedo desplaza la página y dos dedos
     mueven/amplían el mapa.
   - Pins operables con teclado (Tab → Enter/Espacio abre el popup).
   - Sin JS o si el mapa falla: queda la lista de sedes del HTML con enlaces
     "Open in Google Maps" (.map__fallback).
   - Analítica: "Get directions" → directions_click {location}; teléfono → call_click.
     Lo registra el listener global de analytics.js (enlaces maps/dir y tel:) gracias a
     data-analytics-location; aquí NO se vuelve a contar.
   - Tarjetas de sede [data-location="<slug>"] (o [data-map-card] en la Home) del mismo grupo
     ([data-map-group] o la <section> más cercana): hover / foco / primer toque resalta su pin y abre
     su tooltip; hover o clic en un pin resalta la tarjeta (.is-active). Sin scroll automático.
========================================================= */

(function () {
    'use strict';

    var els = document.querySelectorAll('[data-map]');
    if (!els.length) return;

    var DATA = window.PT_LOCATIONS || [];
    var script = document.currentScript;
    var base = '/assets/vendor/leaflet/';
    try { if (script && script.src) base = new URL('../vendor/leaflet/', script.src).href; } catch (e) { /* ruta por defecto */ }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ---------- carga diferida de Leaflet ---------- */
    var leafletPromise = null;

    function loadLeaflet() {
        if (window.L && window.L.map) return Promise.resolve();
        if (leafletPromise) return leafletPromise;
        leafletPromise = new Promise(function (resolve, reject) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = base + 'leaflet.css';
            var js = document.createElement('script');
            js.src = base + 'leaflet.js';
            js.async = true;
            js.onload = function () { if (window.L && window.L.map) resolve(); else reject(new Error('Leaflet no disponible')); };
            js.onerror = function () { reject(new Error('No se pudo cargar Leaflet')); };
            document.head.appendChild(css);
            document.head.appendChild(js);
        });
        return leafletPromise;
    }


    /* ---------- utilidades ---------- */
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text) n.textContent = text;
        return n;
    }

    /* Pin de marca: navy #0F3343 + punto Action Blue #1B6F96. El estado activo se
       pinta por CSS (.map-pin--active) para no recrear el marcador (se perdería el foco). */
    function pinIcon() {
        var html = '<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true" focusable="false">' +
            '<path class="map-pin__body" d="M16 1C8.3 1 2 7.2 2 14.8 2 25.4 16 41 16 41s14-15.6 14-26.2C30 7.2 23.7 1 16 1z" stroke="#fff" stroke-width="2"/>' +
            '<circle class="map-pin__dot" cx="16" cy="15" r="6"/></svg>';
        return L.divIcon({ className: 'map-pin', html: html, iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -38] });
    }

    function popupContent(loc) {
        var box = el('div', 'map-popup');

        var h = el('h3', 'map-popup__name');
        var a = el('a', '', loc.name);
        a.href = '/locations/' + loc.slug + '/';
        h.appendChild(a);
        box.appendChild(h);

        box.appendChild(el('p', 'map-popup__days badge', loc.days));

        var addr = el('address', 'map-popup__address');
        addr.appendChild(document.createTextNode(loc.street));
        addr.appendChild(document.createElement('br'));
        addr.appendChild(document.createTextNode(loc.city + ', ' + loc.region + ' ' + loc.zip));
        box.appendChild(addr);

        var tel = el('a', 'map-popup__phone', loc.phone);
        tel.href = 'tel:' + loc.tel;
        tel.setAttribute('aria-label', 'Call Pain Therapy ' + loc.sede + ' at ' + loc.phone);
        tel.setAttribute('data-analytics-location', loc.key);
        var p = el('p', 'map-popup__row');
        p.appendChild(tel);
        box.appendChild(p);

        var dir = el('a', 'btn btn--primary btn--md map-popup__directions', 'Get directions');
        dir.href = loc.directions;
        dir.target = '_blank';
        dir.rel = 'noopener';
        dir.setAttribute('data-analytics-location', loc.key);
        dir.appendChild(el('span', 'visually-hidden', ' to ' + loc.sede + ' (opens in a new tab)'));
        box.appendChild(dir);

        return box;
    }


    /* ---------- un mapa ---------- */
    function init(container) {
        var key = container.getAttribute('data-map');
        var list = key === 'all' ? DATA : DATA.filter(function (l) { return l.slug === key; });
        if (!list.length) throw new Error('map: sin sedes para "' + key + '"');
        var single = list.length === 1;

        var canvas = el('div', 'map__canvas');
        container.appendChild(canvas);

        /* Tarjetas de sede vinculadas a este mapa: las [data-location="<slug>"] (o [data-map-card="<key>"], atributo
           anterior de la Home) de su grupo = [data-map-group] o la <section> más cercana. Cualquier página sirve. */
        var group = container.closest('[data-map-group]') || container.closest('section') || document;
        var cards = [];
        Array.prototype.forEach.call(group.querySelectorAll('[data-location], [data-map-card]'), function (card) {
            var v = card.getAttribute('data-location') || card.getAttribute('data-map-card');
            var hit = list.filter(function (l) { return l.key === v || l.slug === v; })[0];
            if (hit) cards.push({ el: card, key: hit.key });
        });

        var touch = L.Browser.mobile;
        var map = L.map(canvas, {
            scrollWheelZoom: false,
            dragging: !touch,
            keyboard: true,
            zoomControl: true,
            zoomAnimation: !reduceMotion,
            fadeAnimation: !reduceMotion,
            markerZoomAnimation: !reduceMotion
        });
        map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');

        var loaded = false;
        var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
        }).addTo(map);
        tiles.on('tileload', function () { loaded = true; });
        /* Sin ningún tile en 10 s → se muestra la lista de sedes */
        setTimeout(function () { if (!loaded) container.classList.add('map--failed'); }, 10000);

        /* Móvil: un dedo = scroll de la página; dos dedos = mueve el mapa */
        if (touch) {
            var hint = el('p', 'map__hint', 'Use two fingers to move the map');
            hint.setAttribute('aria-hidden', 'true');
            container.appendChild(hint);
            var hintTimer = 0;
            canvas.addEventListener('touchstart', function (e) {
                if (e.touches.length > 1) {
                    map.dragging.enable();
                    hint.classList.remove('is-visible');
                } else {
                    map.dragging.disable();
                    hint.classList.add('is-visible');
                    clearTimeout(hintTimer);
                    hintTimer = setTimeout(function () { hint.classList.remove('is-visible'); }, 1600);
                }
            }, { passive: true });
            canvas.addEventListener('touchend', function () { map.dragging.disable(); }, { passive: true });
        }

        /* Pins */
        var markers = {};
        var selected = null;

        function highlight(k) {
            Object.keys(markers).forEach(function (id) {
                var m = markers[id];
                var on = id === k;
                var icon = m.getElement();
                if (icon) icon.classList.toggle('map-pin--active', on);
                m.setZIndexOffset(on ? 1000 : 0);
                /* Tooltip con el nombre (solo con varias sedes; con prefers-reduced-motion no se anima) */
                if (!single) { if (on) m.openTooltip(); else m.closeTooltip(); }
            });
            cards.forEach(function (c) {
                var on = c.key === k;
                c.el.classList.toggle('is-map-active', on);   /* estilo existente (borde azul) */
                c.el.classList.toggle('is-active', on);
            });
        }

        list.forEach(function (loc) {
            var m = L.marker([loc.lat, loc.lng], {
                icon: pinIcon(),
                title: single ? loc.name : undefined,   /* varias sedes: el nombre sale en el tooltip de Leaflet */
                keyboard: true,
                riseOnHover: true
            }).addTo(map);
            m.bindPopup(popupContent(loc), { maxWidth: 280, minWidth: 220, autoPanPadding: [24, 24] });
            if (!single) {
                m.bindTooltip(loc.name, { direction: 'top', offset: [0, -34], opacity: 1, className: 'map-tooltip' });
                /* Pin ↔ tarjeta: pasar el mouse por un pin resalta su tarjeta (sin scroll automático) */
                m.on('mouseover', function () { highlight(loc.key); });
                m.on('mouseout', function () { highlight(selected); });
            }
            markers[loc.key] = m;

            /* El <div> del marcador solo existe cuando el mapa ya tiene vista: se configura en 'add' */
            var decorate = function () {
                var icon = m.getElement();
                if (!icon || icon.__ptDecorated) return;
                icon.__ptDecorated = true;
                icon.setAttribute('role', 'button');
                icon.setAttribute('aria-label', loc.name + ': open location details');
                /* Patrón de botón: Enter y Espacio abren el popup. Se usa keydown (con preventDefault,
                   que evita el 'keypress' deprecado en el que se apoya Leaflet y un doble disparo) */
                icon.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); m.openPopup(); }
                });
            };
            m.on('add', decorate);
            decorate();

            m.on('popupopen', function () { selected = loc.key; highlight(selected); });
            m.on('popupclose', function () { if (selected === loc.key) { selected = single ? loc.key : null; highlight(selected); } });
        });

        if (single) {
            var only = list[0];
            map.setView([only.lat, only.lng], 16);
            highlight(only.key);
            selected = only.key;
            map.whenReady(function () { markers[only.key].openPopup(); });
        } else {
            map.fitBounds(L.latLngBounds(list.map(function (l) { return [l.lat, l.lng]; })), { paddingTopLeft: [48, 72], paddingBottomRight: [48, 32] });

            /* Tarjetas de sede del grupo: hover/foco ↔ pin. En touch, el primer toque resalta el pin
               (touchstart pasivo: no bloquea los enlaces "Get directions" ni "Call") */
            cards.forEach(function (c) {
                var k = c.key;
                var on = function () { highlight(k); };
                var off = function () { highlight(selected); };
                c.el.addEventListener('mouseenter', on);
                c.el.addEventListener('mouseleave', off);
                c.el.addEventListener('focusin', on);
                c.el.addEventListener('focusout', off);
                c.el.addEventListener('touchstart', function () { selected = k; highlight(k); }, { passive: true });
            });
        }

        container.classList.add('map--ready');
        map.invalidateSize();
    }

    function start(container) {
        if (container.__ptMapStarted) return;
        container.__ptMapStarted = true;
        loadLeaflet().then(function () {
            try { init(container); } catch (e) { container.classList.add('map--failed'); }
        }).catch(function () { container.classList.add('map--failed'); });
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { io.unobserve(entry.target); start(entry.target); }
            });
        }, { rootMargin: '300px 0px' });
        Array.prototype.forEach.call(els, function (c) { io.observe(c); });
    } else {
        Array.prototype.forEach.call(els, start);
    }
})();
