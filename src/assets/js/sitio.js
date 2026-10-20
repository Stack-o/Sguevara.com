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

  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tarjetas que rotan (cómo trabajo, principios del Compás)
  document.querySelectorAll("[data-rota]").forEach(function (lista, k) {
    var items = lista.querySelectorAll("li");
    var puntos = lista.parentElement.querySelectorAll(".rota-puntos span");
    if (items.length < 2) return;
    var i = 0;
    var marcar = function () {
      items.forEach(function (li, j) { li.classList.toggle("activo", j === i); });
      puntos.forEach(function (p, j) { p.classList.toggle("on", j === i); });
    };
    marcar();
    if (quieto) return;
    setInterval(function () { i = (i + 1) % items.length; marcar(); }, k === 0 ? 3200 : 4600);
  });

  // Contador que sube al aparecer
  document.querySelectorAll(".contador").forEach(function (el) {
    var hasta = parseInt(el.getAttribute("data-hasta"), 10) || 0;
    if (quieto || !("IntersectionObserver" in window)) return;
    el.textContent = "0";
    var obs = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      obs.disconnect();
      var t0 = null;
      var paso = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1400);
        el.textContent = Math.round(hasta * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
    obs.observe(el);
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
