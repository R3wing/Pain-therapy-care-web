/* =========================================================
   PAIN THERAPY MEDICAL CARE — blog.js  (/blog/ y /blog/category/…)
   Búsqueda del blog.

   - Busca en assets/data/blog-index.json (título, TL;DR, categoría). Es un índice liviano
     (sin el contenido de los posts) y se descarga SOLO al enfocar el campo.
   - Los resultados salen en una lista accesible dentro de una región aria-live.
   - Esc limpia el campo y los resultados.
   - Sin JS: el buscador está oculto (.js) y se ve la paginación normal.
========================================================= */

(function () {
    'use strict';

    var root = document.querySelector('[data-blog-search]');
    if (!root) return;

    var input = root.querySelector('input');
    var out = root.querySelector('[data-blog-search-results]');
    if (!input || !out) return;

    var script = document.currentScript;
    var indexUrl = 'assets/data/blog-index.json';
    try { if (script && script.src) indexUrl = new URL('../data/blog-index.json', script.src).href; } catch (e) { /* ruta por defecto */ }

    var data = null;
    var loading = null;
    var timer = 0;
    var MAX = 12;

    function norm(s) {
        return String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function load() {
        if (data) return Promise.resolve(data);
        if (loading) return loading;
        loading = fetch(indexUrl).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        }).then(function (j) {
            data = j.map(function (p) {
                p._t = norm(p.t); p._c = norm(p.c); p._s = norm(p.s);
                return p;
            });
            return data;
        }).catch(function () {
            loading = null;
            return null;
        });
        return loading;
    }

    function clear() {
        out.textContent = '';
    }

    function fmt(iso) {
        try {
            return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
        } catch (e) { return iso; }
    }

    function render(list, q) {
        out.textContent = '';
        var count = document.createElement('p');
        count.className = 'blog-search__count';
        if (!list.length) {
            count.textContent = 'No articles found for "' + q + '". Try another word or browse the categories below.';
            out.appendChild(count);
            return;
        }
        count.textContent = list.length >= MAX ? 'Showing the top ' + MAX + ' results for "' + q + '".' : list.length + (list.length === 1 ? ' result' : ' results') + ' for "' + q + '".';
        out.appendChild(count);

        var ul = document.createElement('ul');
        ul.className = 'blog-search__list';
        list.forEach(function (p) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.className = 'blog-search__item';
            a.href = p.u;
            var t = document.createElement('span');
            t.className = 'blog-search__title';
            t.textContent = p.t;
            var m = document.createElement('span');
            m.className = 'blog-search__meta';
            m.textContent = p.c + ' · ' + fmt(p.d) + ' · ' + p.r + ' min read';
            a.appendChild(t);
            a.appendChild(m);
            li.appendChild(a);
            ul.appendChild(li);
        });
        out.appendChild(ul);
    }

    function run() {
        var q = norm(input.value);
        if (q.length < 2) { clear(); return; }
        load().then(function (items) {
            if (!items) {
                out.textContent = '';
                var p = document.createElement('p');
                p.className = 'blog-search__count';
                p.textContent = 'Search is not available right now. Use the categories below or the page numbers.';
                out.appendChild(p);
                return;
            }
            if (norm(input.value) !== q) return;   // el usuario siguió escribiendo
            var tokens = q.split(' ');
            var res = items.map(function (p) {
                var score = 0, ok = true;
                tokens.forEach(function (tk) {
                    var s = 0;
                    if (p._t.indexOf(tk) !== -1) s += 3;
                    if (p._c.indexOf(tk) !== -1) s += 2;
                    if (p._s.indexOf(tk) !== -1) s += 1;
                    if (!s) ok = false;
                    score += s;
                });
                return ok ? { p: p, score: score } : null;
            }).filter(Boolean).sort(function (a, b) {
                return (b.score - a.score) || (a.p.d < b.p.d ? 1 : -1);
            }).slice(0, MAX).map(function (x) { return x.p; });
            render(res, input.value.trim());
        });
    }

    input.addEventListener('focus', function () { load(); }, { once: true });

    input.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(run, 150);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && (input.value || out.textContent)) {
            input.value = '';
            clear();
        }
    });
})();
