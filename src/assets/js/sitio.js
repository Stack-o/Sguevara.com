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

// ¿Sergio o no? — juego del inicio. Las frases viven en src/_data/juego.json
(function () {
  var caja = document.querySelector("[data-juego]");
  var datos = document.getElementById("juego-datos");
  if (!caja || !datos) return;
  var preguntas = [];
  try { preguntas = JSON.parse(datos.textContent); } catch (e) { return; }
  if (!preguntas.length) return;
  var $ = function (s) { return caja.querySelector(s); };
  var i = 0, puntos = 0, respondida = false;
  var mostrar = function () {
    var q = preguntas[i];
    $("[data-frase]").textContent = q.frase;
    $("[data-progreso]").textContent = (i + 1) + " de " + preguntas.length;
    $("[data-botones]").hidden = false;
    $("[data-respuesta]").hidden = true;
    respondida = false;
  };
  var elegir = function (esSergio) {
    if (respondida) return;
    respondida = true;
    var q = preguntas[i];
    var ok = esSergio === q.sergio;
    if (ok) puntos++;
    var r = $("[data-respuesta]");
    r.classList.toggle("fallo", !ok);
    $("[data-veredicto]").textContent = ok ? "Correcto." : "No.";
    $("[data-explicacion]").textContent = (q.sergio ? "Eso sí es Sergio. " : "Eso no es Sergio. ") + q.porque;
    $("[data-siguiente-pregunta]").textContent = i + 1 >= preguntas.length ? "Ver resultado →" : "Siguiente →";
    $("[data-botones]").hidden = true;
    r.hidden = false;
    $("[data-siguiente-pregunta]").focus();
  };
  var terminar = function () {
    var total = preguntas.length;
    $("[data-jugando]").hidden = true;
    $("[data-final]").hidden = false;
    $("[data-puntaje]").textContent = "Acertaste " + puntos + " de " + total;
    $("[data-mensaje]").textContent = puntos === total
      ? "Distingues como yo. Ya tenemos de qué hablar."
      : (puntos >= total - 1 ? "Ya ves el sistema detrás de las respuestas. Falta poco."
      : "El sentido común te jugó en contra. Para eso existe Tanmayo.");
  };
  caja.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-elegir")) elegir(b.getAttribute("data-elegir") === "si");
    else if (b.hasAttribute("data-siguiente-pregunta")) { i++; if (i >= preguntas.length) terminar(); else mostrar(); }
    else if (b.hasAttribute("data-reiniciar")) { i = 0; puntos = 0; $("[data-final]").hidden = true; $("[data-jugando]").hidden = false; mostrar(); }
  });
  mostrar();
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
