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
    });
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
