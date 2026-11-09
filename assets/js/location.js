/* =========================================================
   PAIN THERAPY MEDICAL CARE — location.js  (/locations/<sede>/)
   Vanilla JS, cargado con defer después de main.js.
   1) Horario: resalta el día actual (hora de Nueva York)
   2) Call ▾ y hoja "Call a location": la sede actual va
      primero y se marca como "You are here"
   Sin JS: el horario se ve completo y las listas de llamada
   funcionan igual (en el orden de la Home).
========================================================= */

(function () {
    'use strict';

    /* -----------------------------------------------------
       1) DÍA ACTUAL EN EL HORARIO
       Se usa la zona horaria de la clínica, no la del visitante.
    ------------------------------------------------------ */
    var hours = document.querySelector('[data-location-hours]');

    if (hours) {
        var today;
        try {
            today = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/New_York' }).format(new Date());
        } catch (e) {
            today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
        }

        var row = hours.querySelector('tr[data-day="' + today + '"]');
        if (row) {
            row.classList.add('is-today');
            var dayCell = row.querySelector('th');
            if (dayCell) {
                var tag = document.createElement('span');
                tag.className = 'location-hours__today';
                tag.textContent = 'Today';
                dayCell.appendChild(document.createTextNode(' '));
                dayCell.appendChild(tag);
            }
        }
    }


    /* -----------------------------------------------------
       2) SEDE ACTUAL PRIMERO EN LAS LISTAS DE LLAMADA
       <body data-location-tel="tel:+1…"> identifica la sede.
    ------------------------------------------------------ */
    var currentTel = document.body.getAttribute('data-location-tel');

    if (currentTel) {
        Array.prototype.forEach.call(document.querySelectorAll('.call-list'), function (list) {
            var link = list.querySelector('a.call-list__link[href="' + currentTel + '"]');
            if (!link) return;

            var item = link.closest('li');
            if (item && item !== list.firstElementChild) list.insertBefore(item, list.firstElementChild);

            link.classList.add('location-call--current');

            var name = link.querySelector('.call-list__name');
            if (name && !name.querySelector('.location-call-here')) {
                var here = document.createElement('span');
                here.className = 'location-call-here';
                here.textContent = 'You are here';
                name.appendChild(document.createTextNode(' '));
                name.appendChild(here);
            }
        });
    }
})();
