/* =========================================================
   PAIN THERAPY MEDICAL CARE — main.js
   Vanilla JS, cargado con defer. Sin dependencias.
   1) Navbar: estado al hacer scroll (.is-scrolled / .is-top)
   2) Menú móvil (bloqueo de scroll, trap de foco, Esc)
   3) Desplegables Conditions / Treatments / Locations / Call ▾
   4) Hoja inferior "Call a location" (<dialog>)
   5) FAQ → se usa <details>/<summary> nativo (no requiere JS)
   6) Video del hero: pausa/play + prefers-reduced-motion
   7) Aparición de secciones con IntersectionObserver
========================================================= */

(function () {
    'use strict';

    var root = document.documentElement;
    var body = document.body;
    var header = document.querySelector('[data-header]');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var desktopMQ = window.matchMedia('(min-width: 1200px)');

    var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

    function isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) &&
            getComputedStyle(el).visibility !== 'hidden';
    }

    function addMQListener(mq, fn) {
        if (mq.addEventListener) mq.addEventListener('change', fn);
        else if (mq.addListener) mq.addListener(fn);
    }

    /* Bloqueo de scroll compartido por menú y hoja inferior */
    var locks = 0;
    function lockScroll() { locks++; body.classList.add('is-locked'); }
    function unlockScroll() { locks = Math.max(0, locks - 1); if (!locks) body.classList.remove('is-locked'); }


    /* -----------------------------------------------------
       1) NAVBAR: estado A (top) / B (scrolled)
    ------------------------------------------------------ */
    var menuOpen = false;
    var utilityBar = document.querySelector('[data-utility-bar]');
    /* Páginas internas sin video: [data-header-solid] → nunca estado A (transparente) */
    var solidHeader = !!(header && header.hasAttribute('data-header-solid'));
    /* [data-header-scrolled] → .is-scrolled fijo (páginas de sede: sin utility bar) */
    var lockedScrolled = !!(header && header.hasAttribute('data-header-scrolled'));

    function updateHeaderState() {
        if (!header) return;
        var scrolled = window.scrollY > 80 || lockedScrolled;
        header.classList.toggle('is-scrolled', scrolled);
        header.classList.toggle('is-top', !scrolled && !menuOpen && !solidHeader);
    }

    /* Alto total del header en estado A → padding superior del hero */
    function measureHeader() {
        if (!utilityBar) return;
        var navTop = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h-top')) || 88;
        root.style.setProperty('--header-h', (utilityBar.scrollHeight + navTop) + 'px');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
            updateHeaderState();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', measureHeader);
    updateHeaderState();
    measureHeader();


    /* -----------------------------------------------------
       3) DESPLEGABLES (nav + Call ▾)
       Markup: [data-dropdown] > button[aria-expanded][aria-controls]
       El botón nativo ya responde a clic, Enter y Espacio.
    ------------------------------------------------------ */
    var dropdowns = Array.prototype.map.call(
        document.querySelectorAll('[data-dropdown]'),
        function (wrapper) {
            return {
                wrapper: wrapper,
                type: wrapper.getAttribute('data-dropdown'),
                trigger: wrapper.querySelector('button[aria-controls]')
            };
        }
    ).filter(function (d) { return d.trigger; });

    function setDropdown(d, open) {
        d.wrapper.classList.toggle('is-open', open);
        d.trigger.setAttribute('aria-expanded', String(open));
    }

    function closeDropdowns(except) {
        dropdowns.forEach(function (d) {
            if (d !== except && d.wrapper.classList.contains('is-open')) setDropdown(d, false);
        });
    }

    /* En el menú móvil los submenús son acordeón (pueden convivir abiertos) */
    function isAccordion(d) {
        return d.type === 'nav' && !desktopMQ.matches;
    }

    dropdowns.forEach(function (d) {
        d.trigger.addEventListener('click', function () {
            var open = !d.wrapper.classList.contains('is-open');
            if (open && !isAccordion(d)) closeDropdowns(d);
            setDropdown(d, open);
        });

        /* Al salir con Tab de un desplegable flotante, se cierra */
        d.wrapper.addEventListener('focusout', function (e) {
            if (isAccordion(d)) return;
            if (e.relatedTarget && !d.wrapper.contains(e.relatedTarget)) setDropdown(d, false);
        });
    });

    /* Clic fuera */
    document.addEventListener('click', function (e) {
        dropdowns.forEach(function (d) {
            if (isAccordion(d)) return;
            if (d.wrapper.classList.contains('is-open') && !d.wrapper.contains(e.target)) setDropdown(d, false);
        });
    });


    /* -----------------------------------------------------
       2) MENÚ MÓVIL / TABLET (pantalla completa)
    ------------------------------------------------------ */
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var menuPanel = document.querySelector('[data-menu]');

    function menuFocusables() {
        var items = Array.prototype.filter.call(menuPanel.querySelectorAll(FOCUSABLE), isVisible);
        return [menuToggle].concat(items);
    }

    function openMenu() {
        menuOpen = true;
        menuPanel.classList.add('is-open');
        header.classList.add('is-menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
        lockScroll();
        updateHeaderState();
        var first = menuFocusables()[1];
        if (first) window.requestAnimationFrame(function () { first.focus(); });
    }

    function closeMenu(returnFocus) {
        if (!menuOpen) return;
        menuOpen = false;
        menuPanel.classList.remove('is-open');
        header.classList.remove('is-menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        unlockScroll();
        updateHeaderState();
        if (returnFocus) menuToggle.focus();
    }

    if (menuToggle && menuPanel) {
        menuToggle.addEventListener('click', function () {
            if (menuOpen) closeMenu(true); else openMenu();
        });

        /* Navegar a un ancla cierra el menú */
        menuPanel.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (link && menuOpen && !link.hasAttribute('data-call-sheet-open')) closeMenu(false);
        });

        /* Al pasar a desktop el menú deja de ser modal */
        addMQListener(desktopMQ, function () {
            closeMenu(false);
            closeDropdowns();
        });
    }

    /* Trap de foco dentro del menú abierto */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !menuOpen) return;
        var list = menuFocusables();
        var idx = list.indexOf(document.activeElement);
        var next;
        if (e.shiftKey) next = idx <= 0 ? list[list.length - 1] : list[idx - 1];
        else next = idx === -1 || idx === list.length - 1 ? list[0] : list[idx + 1];
        e.preventDefault();
        next.focus();
    });


    /* -----------------------------------------------------
       Esc: cierra el desplegable abierto o el menú,
       y devuelve el foco al botón que lo abrió.
    ------------------------------------------------------ */
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' && e.key !== 'Esc') return;

        var openDd = dropdowns.filter(function (d) { return d.wrapper.classList.contains('is-open'); });
        var active = document.activeElement;
        var target = openDd.filter(function (d) { return d.wrapper.contains(active); })[0] ||
            openDd.filter(function (d) { return !isAccordion(d); })[0];

        if (target) {
            setDropdown(target, false);
            target.trigger.focus();
            return;
        }
        if (menuOpen) closeMenu(true);
    });


    /* -----------------------------------------------------
       4) HOJA INFERIOR "CALL A LOCATION"
       <dialog> nativo: trap de foco, Esc e inert del fondo.
       Sin JS, los disparadores son enlaces a #locations.
    ------------------------------------------------------ */
    var sheet = document.getElementById('call-sheet');
    var sheetOpener = null;

    if (sheet && typeof sheet.showModal === 'function') {
        document.addEventListener('click', function (e) {
            var opener = e.target.closest('[data-call-sheet-open]');
            if (!opener) return;
            e.preventDefault();
            closeDropdowns();
            sheetOpener = opener;
            if (menuOpen) {
                closeMenu(false);
                sheetOpener = menuToggle;
            }
            sheet.showModal();
            lockScroll();
        });

        sheet.addEventListener('close', function () {
            unlockScroll();
            if (sheetOpener && isVisible(sheetOpener)) sheetOpener.focus();
            sheetOpener = null;
        });

        /* Botón cerrar y clic en el fondo */
        sheet.addEventListener('click', function (e) {
            if (e.target === sheet || e.target.closest('[data-call-sheet-close]')) sheet.close();
        });
    }


    /* -----------------------------------------------------
       6) VIDEO DEL HERO
    ------------------------------------------------------ */
    var video = document.querySelector('[data-hero-video]');
    var videoToggle = document.querySelector('[data-video-toggle]');

    function setVideoState(playing) {
        if (!videoToggle) return;
        videoToggle.setAttribute('data-state', playing ? 'playing' : 'paused');
        videoToggle.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    }

    if (video && videoToggle) {
        videoToggle.hidden = false;

        var applyMotionPreference = function () {
            if (reduceMotion.matches) {
                video.removeAttribute('autoplay');
                video.pause();
                setVideoState(false);
            }
        };

        applyMotionPreference();
        addMQListener(reduceMotion, applyMotionPreference);

        video.addEventListener('play', function () { setVideoState(true); });
        video.addEventListener('pause', function () { setVideoState(false); });

        videoToggle.addEventListener('click', function () {
            if (video.paused) {
                var p = video.play();
                if (p && p.catch) p.catch(function () { setVideoState(false); });
            } else {
                video.pause();
            }
        });

        setVideoState(!video.paused || (video.autoplay && !reduceMotion.matches));
    } else if (videoToggle) {
        /* Aún no hay <video> (placeholder): no se muestra un control inútil */
        videoToggle.hidden = true;
    }


    /* -----------------------------------------------------
       7) APARICIÓN DE SECCIONES
       Solo se ocultan si JS + IO están disponibles y no hay
       reduced-motion: sin JS el contenido siempre es visible.
    ------------------------------------------------------ */
    var revealEls = document.querySelectorAll('[data-reveal]');

    if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
        root.classList.add('reveal-ready');

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

        Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
    }
})();
