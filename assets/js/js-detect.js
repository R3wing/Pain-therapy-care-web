/* =========================================================
   PAIN THERAPY MEDICAL CARE — js-detect.js
   Marca "JS disponible" (<html class="js">) ANTES del primer
   pintado: evita el parpadeo del navbar transparente.
   Se carga en el <head> SIN defer ni async (a propósito):
   debe ejecutarse antes de que se pinte la página.
========================================================= */
document.documentElement.classList.add('js');
