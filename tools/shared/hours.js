/* =========================================================
   Horarios: formato compartido (Home, sedes, hub de sedes, schema)
   Fuente de datos: tools/locations/data.js  →  campo `hours`

     hours: [
         { days: ['Mon', 'Tue', 'Wed', 'Thu'], opens: '10:30', closes: '17:00' },
         { days: ['Fri'],                      opens: '09:00', closes: '14:00' }
     ]

   Días: Mon Tue Wed Thu Fri Sat Sun. Horas en 24 h ("HH:MM").
   Un día que no aparece en ningún tramo se considera cerrado.
   Si `hours` falta, todo sale como el marcador [HOURS].
========================================================= */

'use strict';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const MARKER = '[HOURS]';

/* "17:00" → "5:00 pm" */
function time12(t) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(t);
    if (!m) throw new Error('Hora inválida (usa "HH:MM"): ' + t);
    const h = parseInt(m[1], 10);
    return ((h % 12) || 12) + ':' + m[2] + ' ' + (h >= 12 ? 'pm' : 'am');
}

function range(slot) {
    return time12(slot.opens) + ' – ' + time12(slot.closes) + (slot.winter ? ' (winter hours)' : '');
}

/* Tramos efectivos: aplica la regla de viernes de invierno (loc.winterFriday, data.js).
   Si está activa, el viernes que cierra DESPUÉS de winterFriday.close se separa en su propio
   tramo { winter: true } que cierra a winterFriday.close. Si active es false, no cambia nada. */
function slots(loc) {
    const base = loc.hours || [];
    const w = loc.winterFriday;
    if (!w || !w.active) return base;
    const out = [];
    base.forEach(function (s) {
        if (s.days.indexOf('Fri') === -1 || s.closes <= w.close) { out.push(s); return; }
        const rest = s.days.filter(function (d) { return d !== 'Fri'; });
        if (rest.length) out.push({ days: rest, opens: s.opens, closes: s.closes });
        out.push({ days: ['Fri'], opens: s.opens, closes: w.close, winter: true });
    });
    return out;
}

function check(loc) {
    (loc.hours || []).forEach(function (slot) {
        slot.days.forEach(function (d) {
            if (DAYS.indexOf(d) === -1) throw new Error(loc.key + ': día inválido en hours: ' + d);
        });
        time12(slot.opens); time12(slot.closes);
    });
}

/* ["Mon","Tue","Wed","Thu"] → "Mon–Thu" · ["Mon","Tue","Thu"] → "Mon, Tue, Thu" */
function dayLabel(days) {
    const idx = days.map(function (d) { return DAYS.indexOf(d); }).sort(function (a, b) { return a - b; });
    const runs = [];
    idx.forEach(function (i) {
        const last = runs[runs.length - 1];
        if (last && i === last[last.length - 1] + 1) last.push(i); else runs.push([i]);
    });
    return runs.map(function (r) {
        return r.length >= 3 ? DAYS[r[0]] + '–' + DAYS[r[r.length - 1]] : r.map(function (i) { return DAYS[i]; }).join(', ');
    }).join(', ');
}

/* Líneas cortas para tarjetas y hero: [{ label: "Mon–Thu", range: "10:30 am – 5:00 pm" }] */
function groups(loc) {
    if (!loc.hours || !loc.hours.length) return [];
    return slots(loc).map(function (s) { return { label: dayLabel(s.days), range: range(s) }; });
}

/* Días sin ningún tramo = cerrados: "Sat, Sun" · "Wed, Sat, Sun" · '' si abre todos los días */
function closedLabel(loc) {
    if (!loc.hours || !loc.hours.length) return '';
    const open = {};
    loc.hours.forEach(function (s) { s.days.forEach(function (d) { open[d] = true; }); });
    const closed = DAYS.filter(function (d) { return !open[d]; });
    return closed.length ? dayLabel(closed) : '';
}

/* Texto en una o varias líneas (separadas por <br>) */
function summaryHtml(loc) {
    const g = groups(loc);
    if (!g.length) return MARKER;
    return g.map(function (x) { return x.label + ': ' + x.range; }).join('<br>');
}

/* Filas de la tabla semanal (<tr data-day="Mon">…) lista para pegar dentro de <tbody> */
function tableRows(loc) {
    return DAYS.map(function (d) {
        let cell = MARKER;
        if (loc.hours && loc.hours.length) {
            const slot = slots(loc).filter(function (s) { return s.days.indexOf(d) !== -1; })[0];
            cell = slot ? range(slot).replace(' (winter hours)', '<br>(winter hours)') : 'Closed';   // salto de línea: la celda es nowrap y en móvil desbordaría
        }
        return '<tr data-day="' + d + '"><th scope="row">' + FULL[d] + '</th><td>' + cell + '</td></tr>';
    }).join('\n');
}

/* schema.org knowsLanguage: códigos BCP 47 a partir de loc.languages (data.js) */
const LANG_CODES = { English: 'en', Spanish: 'es', Yiddish: 'yi' };
function languageCodes(loc) {
    return (loc.languages || []).map(function (name) {
        if (!LANG_CODES[name]) throw new Error(loc.key + ': idioma sin código BCP 47: ' + name);
        return LANG_CODES[name];
    });
}

/* schema.org: openingHoursSpecification (vacío si no hay horarios) */
function schemaSpec(loc) {
    if (!loc.hours || !loc.hours.length) return [];
    return slots(loc).map(function (s) {
        return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: s.days.map(function (d) { return FULL[d]; }),
            opens: s.opens,
            closes: s.closes
        };
    });
}

module.exports = { slots, DAYS, FULL, MARKER, time12, range, check, dayLabel, closedLabel, groups, summaryHtml, tableRows, languageCodes, schemaSpec };
