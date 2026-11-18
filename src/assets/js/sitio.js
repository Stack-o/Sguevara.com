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

  // Secciones del inicio: flecha para bajar y animaciones al aparecer
  var pantallas = Array.prototype.slice.call(document.querySelectorAll("[data-pantalla]"));
  if (pantallas.length) {
    var flotante = document.querySelector("[data-siguiente]");
    var pie = document.querySelector(".pie");
    var destinos = pie ? pantallas.concat([pie]) : pantallas;
    var siguiente = function () {
      var y = window.scrollY + 8;
      for (var i = 0; i < destinos.length; i++) {
        if (destinos[i].getBoundingClientRect().top + window.scrollY > y + 4) return destinos[i];
      }
      return null;
    };
    var ir = function (el) {
      if (!el) { window.scrollTo({ top: 0, behavior: quieto ? "auto" : "smooth" }); return; }
      el.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" });
    };
    document.querySelectorAll("[data-bajar]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); ir(pantallas[1]); });
    });
    if (flotante) {
      flotante.addEventListener("click", function () { ir(siguiente()); });
      var actualizarFlecha = function () {
        var pasoInicio = window.scrollY > window.innerHeight * 0.5;
        var alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
        flotante.classList.toggle("mostrar", pasoInicio);
        flotante.classList.toggle("arriba", alFinal);
        flotante.setAttribute("aria-label", alFinal ? "Volver arriba" : "Ir a la siguiente sección");
        var compas = document.getElementById("compas");
        if (compas) {
          var r = compas.getBoundingClientRect();
          document.body.classList.toggle("en-tierra", r.top < window.innerHeight - 60 && r.bottom > window.innerHeight - 20);
        }
      };
      window.addEventListener("scroll", actualizarFlecha, { passive: true });
      actualizarFlecha();
    }
    if ("IntersectionObserver" in window) {
      var obsV = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); obsV.unobserve(e.target); } });
      }, { threshold: 0.35 });
      pantallas.forEach(function (p) { obsV.observe(p); });
    } else {
      pantallas.forEach(function (p) { p.classList.add("visible"); });
    }
  }

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

// Página Tanmayo: palabras doradas que se abren
(function () {
  document.querySelectorAll("[data-capitulo]").forEach(function (cap) {
    var caja = cap.querySelector("[data-frase-abierta]");
    cap.addEventListener("click", function (e) {
      var chip = e.target.closest(".t-chip");
      if (!chip) return;
      var abierto = chip.getAttribute("aria-pressed") === "true";
      cap.querySelectorAll(".t-chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      if (abierto) { caja.hidden = true; return; }
      chip.setAttribute("aria-pressed", "true");
      caja.textContent = chip.getAttribute("data-frase");
      caja.hidden = false;
    });
  });
})();

// Inicio: el menú marca la sección que se está leyendo
(function () {
  var enlaces = Array.prototype.slice.call(document.querySelectorAll(".menu [data-seccion]"));
  if (!enlaces.length || !("IntersectionObserver" in window)) return;
  var secciones = enlaces.map(function (a) { return document.getElementById(a.getAttribute("data-seccion")); }).filter(Boolean);
  if (!secciones.length) return;
  var actual = null;
  var marcar = function (id) {
    actual = id;
    enlaces.forEach(function (a) {
      if (a.getAttribute("data-seccion") === id) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  };
  var obs = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) marcar(e.target.id);
      else if (e.target.id === actual) marcar(null);
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secciones.forEach(function (s) { obs.observe(s); });
})();

// Inicio: arquitectura simple / extendida
(function () {
  var caja = document.querySelector("[data-arquitectura]");
  if (!caja) return;
  var botones = caja.querySelectorAll("[data-nivel-boton]");
  var mostrar = function (nivel) {
    botones.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-nivel-boton") === nivel ? "true" : "false"); });
    caja.querySelectorAll("[data-nivel]").forEach(function (el) { el.hidden = el.getAttribute("data-nivel") !== nivel; });
    caja.setAttribute("data-mostrando", nivel);
  };
  caja.querySelector(".niveles").hidden = false;
  botones.forEach(function (b) { b.addEventListener("click", function () { mostrar(b.getAttribute("data-nivel-boton")); }); });
  mostrar("1");
})();

// Inicio: el compás de los 20 principios
(function () {
  var caja = document.querySelector("[data-rosa]");
  var datos = document.getElementById("principios-datos");
  if (!caja || !datos) return;
  var principios = JSON.parse(datos.textContent);
  var aguja = caja.querySelector("[data-aguja]");
  var panel = caja.querySelector("[data-principio]");
  var guia = caja.querySelector(".rosa-guia");
  var girar = caja.querySelector("[data-girar]");
  var nota = caja.querySelector("[data-p-nota]");
  var angulo = 0, actual = 0;
  var elegir = function (n, vueltas) {
    var p = principios.filter(function (x) { return x.n === n; })[0];
    if (!p) return;
    var destino = (n - 1) * 18;
    angulo = angulo + (vueltas ? 720 : 0) + (((destino - angulo) % 360) + 360) % 360;
    aguja.style.transform = "rotate(" + angulo + "deg)";
    caja.querySelectorAll(".rosa-nodo").forEach(function (a) {
      if (+a.getAttribute("data-n") === n) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    caja.querySelector("[data-p-n]").textContent = n;
    caja.querySelector("[data-p-titulo]").textContent = p.titulo;
    caja.querySelector("[data-p-frase]").textContent = p.frase;
    caja.querySelector("[data-p-libro]").href = "/compas-animico/libro/#p-" + n;
    if (p.nota) { nota.href = p.nota; nota.hidden = false; } else { nota.hidden = true; }
    guia.hidden = true; panel.hidden = false; actual = n;
  };
  caja.addEventListener("click", function (e) {
    var a = e.target.closest(".rosa-nodo");
    if (!a) return;
    e.preventDefault();
    elegir(+a.getAttribute("data-n"), false);
  });
  girar.hidden = false;
  girar.addEventListener("click", function () {
    var n;
    do { n = 1 + Math.floor(Math.random() * principios.length); } while (n === actual && principios.length > 1);
    elegir(n, true);
  });
})();
