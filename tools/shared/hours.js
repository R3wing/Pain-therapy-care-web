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
    return time12(slot.opens) + ' – ' + time12(slot.closes);
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
    return loc.hours.map(function (s) { return { label: dayLabel(s.days), range: range(s) }; });
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
            const slot = loc.hours.filter(function (s) { return s.days.indexOf(d) !== -1; })[0];
            cell = slot ? range(slot) : 'Closed';
        }
        return '<tr data-day="' + d + '"><th scope="row">' + FULL[d] + '</th><td>' + cell + '</td></tr>';
    }).join('\n');
}

/* schema.org: openingHoursSpecification (vacío si no hay horarios) */
function schemaSpec(loc) {
    if (!loc.hours || !loc.hours.length) return [];
    return loc.hours.map(function (s) {
        return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: s.days.map(function (d) { return FULL[d]; }),
            opens: s.opens,
            closes: s.closes
        };
    });
}

module.exports = { DAYS, FULL, MARKER, time12, range, check, dayLabel, groups, summaryHtml, tableRows, schemaSpec };
