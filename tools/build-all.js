/* =========================================================
   build-all.js — regenera TODO lo que se genera
   Uso (desde la raíz del proyecto):   node tools/build-all.js

   1) Ejecuta cada generador  tools/<sección>/build.js
      (hoy: locations; se irán sumando services, conditions, …).
   2) Rellena los marcadores de partials en las páginas hechas a mano
      (index.html, insurance/index.html, …):

         <!-- @partial header mode=top call=#locations -->
         <!-- @end header -->

      El contenido entre marcadores se reemplaza con tools/shared/*.html.
      NO edites a mano lo que hay entre los marcadores.

   Opciones:   --check   no escribe; sale con error si algo quedaría distinto
========================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const lib = require('./shared/lib.js');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const SKIP_DIRS = new Set(['tools', 'node_modules', 'assets', '.git']);

/* ---------- 1) generadores ---------- */

const generators = fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(function (d) { return d.isDirectory() && d.name !== 'shared' && fs.existsSync(path.join(__dirname, d.name, 'build.js')); })
    .map(function (d) { return d.name; })
    .sort();

generators.forEach(function (name) {
    console.log('\n› tools/' + name + '/build.js');
    execFileSync(process.execPath, [path.join(__dirname, name, 'build.js')], { stdio: 'inherit', cwd: ROOT });
});

/* ---------- 2) partials en páginas con marcadores ---------- */

function htmlFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).reduce(function (acc, d) {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) {
            if (!SKIP_DIRS.has(d.name)) acc.push.apply(acc, htmlFiles(p));
        } else if (d.name.endsWith('.html')) {
            acc.push(p);
        }
        return acc;
    }, []);
}

console.log('\n› Partials en páginas con marcadores');
let changed = 0;
htmlFiles(ROOT).forEach(function (file) {
    const raw = fs.readFileSync(file, 'utf8');
    if (!raw.includes('<!-- @partial ')) return;

    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const rel = path.relative(ROOT, file).split(path.sep);
    const depth = rel.length - 1;                       // index.html → 0, insurance/index.html → 1
    const out = lib.inject(raw.replace(/\r\n/g, '\n'), depth).replace(/\n/g, eol);

    const same = out === raw;
    if (!same) changed++;
    if (!same && !CHECK) fs.writeFileSync(file, out, 'utf8');
    console.log('  ' + (same ? '=' : (CHECK ? '≠' : '✓')) + ' ' + rel.join('/'));
});

/* ---------- 2b) tablas de sedes dentro de assets/js (generadas desde data.js) ---------- */

console.log('\n› JS con tabla de sedes');
(function jsTables() {
    const locations = require('./locations/data.js');
    const q = function (v) { return "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; };
    const blocks = {
        analytics: function () {
            return '    var LOCATIONS = [\n' + locations.map(function (l) {
                return '        { key: ' + q(l.key) + ', tel: ' + q(l.tel) + ', street: ' + q(l.street.toLowerCase()) + ' }';
            }).join(',\n') + '\n    ];';
        },
        schedule: function () {
            return '    var LOCATIONS = {\n' + locations.map(function (l) {
                return '        ' + q(l.key) + ': { name: ' + q(l.listName) + ', slug: ' + q(l.slug) + ', tel: ' + q(l.tel) + ', phone: ' + q(l.phone) + ' }';
            }).join(',\n') + '\n    };';
        },
        /* Aviso por sede: días (scheduleNote) + "New patients are seen until …" (cierre − 45 min) */
        notes: function () {
            const closing = function (l) {
                const ends = [];
                l.hours.forEach(function (s) { if (ends.indexOf(s.closes) === -1) ends.push(s.closes); });
                if (ends.length !== 1) return 'New patients are seen until 45 minutes before closing.';
                const m = /^(\d{1,2}):(\d{2})$/.exec(ends[0]);
                const total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) - 45;
                const h = Math.floor(total / 60), mm = total % 60;
                return 'New patients are seen until ' + (((h % 12) || 12) + ':' + (mm < 10 ? '0' : '') + mm + ' ' + (h >= 12 ? 'pm' : 'am')) + '.';
            };
            return '        var LOCATION_NOTES = {\n' + locations.map(function (l) {
                return '            ' + q(l.key) + ': ' + q((l.scheduleNote ? l.scheduleNote + ' ' : '') + closing(l));
            }).join(',\n') + '\n        };';
        },
        providers: function () {
            const active = require('./providers/data.js').filter(function (p) { return (p.status || 'active') === 'active'; });
            return '    var PROVIDERS = {\n' + active.map(function (p) {
                return '        ' + q(p.slug) + ': ' + q(p.name);
            }).join(',\n') + '\n    };';
        }
    };
    [['assets/js/analytics.js', ['analytics']], ['assets/js/schedule.js', ['schedule', 'notes', 'providers']]].forEach(function (pair) {
        const file = path.join(ROOT, pair[0]);
        const raw = fs.readFileSync(file, 'utf8');
        const eol = raw.includes('\r\n') ? '\r\n' : '\n';
        let out = raw.replace(/\r\n/g, '\n');
        pair[1].forEach(function (name) {
            const re = new RegExp('(/\\* @locations:' + name + ' \\*/\\n)[\\s\\S]*?(\\n[ \\t]*/\\* @end locations:' + name + ' \\*/)');
            if (!re.test(out)) throw new Error(pair[0] + ': faltan los marcadores @locations:' + name);
            out = out.replace(re, function (m, a, b) { return a + blocks[name]() + b; });
        });
        out = out.replace(/\n/g, eol);
        const same = out === raw;
        if (!same) changed++;
        if (!same && !CHECK) fs.writeFileSync(file, out, 'utf8');
        console.log('  ' + (same ? '=' : (CHECK ? '≠' : '✓')) + ' ' + pair[0]);
    });
})();

/* ---------- 2c) assets/js/locations-data.js: sedes para los mapas (generado desde data.js) ---------- */

console.log('\n› Datos para los mapas');
(function locationsData() {
    const hours = require('./shared/hours.js');
    const locations = require('./locations/data.js');

    /* "Tuesdays only" si abre un solo día; si no, "Mon–Thu · Fri" */
    const daysText = function (l) {
        const open = [];
        (l.hours || []).forEach(function (s) { s.days.forEach(function (d) { if (open.indexOf(d) === -1) open.push(d); }); });
        if (open.length === 1) return hours.FULL[open[0]] + 's only';
        return hours.groups(l).map(function (g) { return g.label; }).join(' · ');
    };

    const rows = locations.map(function (l) {
        if (!l.geo || typeof l.geo.lat !== 'number' || typeof l.geo.lng !== 'number') {
            console.error('  ✗ ' + l.key + ': falta geo { lat, lng } en data.js');
            process.exit(1);
        }
        const address = l.street + ', ' + l.city + ', ' + l.region + ' ' + l.zip;
        return {
            key: l.key, slug: l.slug, name: l.listName, sede: l.sede,
            street: l.street, city: l.city, region: l.region, zip: l.zip,
            phone: l.phone, tel: l.tel,
            lat: l.geo.lat, lng: l.geo.lng,
            days: daysText(l),
            directions: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address)
        };
    });

    const body = [
        '/* =========================================================',
        '   GENERADO por tools/build-all.js desde tools/locations/data.js',
        '   NO editar a mano. Lo lee assets/js/map.js (window.PT_LOCATIONS).',
        '========================================================= */',
        'window.PT_LOCATIONS = ' + JSON.stringify(rows, null, 4) + ';',
        ''
    ].join('\n');

    const file = path.join(ROOT, 'assets', 'js', 'locations-data.js');
    const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const out = body.replace(/\n/g, eol);
    const same = out === raw;
    if (!same) changed++;
    if (!same && !CHECK) fs.writeFileSync(file, out, 'utf8');
    console.log('  ' + (same ? '=' : (CHECK ? '≠' : '✓')) + ' assets/js/locations-data.js');
})();

/* ---------- 3) coherencia de datos (el JSON-LD de la Home es estático) ---------- */

console.log('\n› Coherencia de datos');
let problems = 0;
(function checkHomeHours() {
    const hours = require('./shared/hours.js');
    const locations = require('./locations/data.js');
    const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const m = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(home);
    if (!m) { console.error('  ✗ index.html: no hay JSON-LD'); problems++; return; }
    const graph = JSON.parse(m[1])['@graph'];
    locations.forEach(function (l) {
        const node = graph.filter(function (n) { return n['@id'] === lib.SITE + '/locations/' + l.slug + '/#clinic'; })[0];
        const want = JSON.stringify(hours.schemaSpec(l));
        const got = JSON.stringify((node && node.openingHoursSpecification) || []);
        if (want === got) {
            console.log('  ✓ Home JSON-LD · horarios de ' + l.sede);
        } else {
            console.error('  ✗ Home JSON-LD · horarios de ' + l.sede + ' no coinciden con tools/locations/data.js');
            problems++;
        }
        const wantGeo = JSON.stringify(l.geo ? { latitude: l.geo.lat, longitude: l.geo.lng } : null);
        const gotGeo = JSON.stringify(node && node.geo ? { latitude: node.geo.latitude, longitude: node.geo.longitude } : null);
        if (wantGeo === gotGeo) {
            console.log('  ✓ Home JSON-LD · coordenadas de ' + l.sede);
        } else {
            console.error('  ✗ Home JSON-LD · coordenadas de ' + l.sede + ' no coinciden con tools/locations/data.js');
            problems++;
        }
        const wantLang = JSON.stringify(hours.languageCodes(l));
        const gotLang = JSON.stringify((node && node.knowsLanguage) || []);
        if (wantLang === gotLang) {
            console.log('  ✓ Home JSON-LD · idiomas de ' + l.sede);
        } else {
            console.error('  ✗ Home JSON-LD · idiomas de ' + l.sede + ' no coinciden con tools/locations/data.js');
            problems++;
        }
    });
})();

(function staleCounts() {
    const n = require('./locations/data.js').length;
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    const stale = /\b(\d+) (?:New York )?locations\b|\b(?:all|our) (zero|one|two|three|four|five|six|seven|eight|nine|ten)\b(?: of our)? (?:locations|clinics|offices)\b/gi;
    htmlFiles(ROOT).forEach(function (file) {
        const txt = fs.readFileSync(file, 'utf8');
        let m;
        stale.lastIndex = 0;
        while ((m = stale.exec(txt))) {
            const v = m[1] ? parseInt(m[1], 10) : words.indexOf(m[2].toLowerCase());
            if (v !== n) {
                console.error('  ✗ ' + path.relative(ROOT, file) + ': "' + m[0] + '" pero hay ' + n + ' sedes en data.js');
                problems++;
            }
        }
    });
    if (!problems) console.log('  ✓ Textos "N locations" coinciden con el número de sedes (' + n + ')');
})();

if (CHECK && changed) {
    console.error('\n' + changed + ' página(s) desactualizada(s). Ejecuta: node tools/build-all.js');
    process.exit(1);
}
if (problems) {
    console.error('\n' + problems + ' incoherencia(s) de datos. Corrige index.html (JSON-LD) o data.js.');
    process.exit(1);
}
console.log('\nListo.');
