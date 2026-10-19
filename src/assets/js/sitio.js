// Filtros del Cuaderno y barra de progreso de lectura. Sin dependencias.
(function () {
  document.querySelectorAll(".filtros").forEach(function (grupo) {
    var lista = grupo.nextElementSibling;
    var vacio = lista && lista.nextElementSibling;
    grupo.addEventListener("click", function (e) {
      var boton = e.target.closest("[data-filtro]");
      if (!boton) return;
      var f = boton.getAttribute("data-filtro");
      grupo.querySelectorAll("[data-filtro]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === boton ? "true" : "false");
      });
      var visibles = 0;
      lista.querySelectorAll(".nota").forEach(function (n) {
        var ok = f === "todo" || n.dataset.tipo === f || n.dataset.tema === f;
        n.hidden = !ok;
        if (ok) visibles++;
      });
      if (vacio && vacio.classList.contains("sin-resultados")) vacio.hidden = visibles > 0;
    });
  });

  var barra = document.querySelector(".progreso-barra");
  var articulo = document.querySelector(".articulo");
  if (barra && articulo) {
    var actualizar = function () {
      var r = articulo.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      barra.style.width = (p * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    actualizar();
  }
})();
