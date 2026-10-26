# sguevara.com — Anotaciones

El sitio de Sergio Guevara. Notas y ensayos en archivos de texto simples (Markdown); GitHub construye y publica el sitio solo, gratis, cada vez que guardas un cambio.

---

## Publicar una nota (lo que harás casi siempre)

1. En GitHub, abre la carpeta `src/anotaciones/`.
2. **Add file → Create new file**.
3. Nombre del archivo: `AAAA-MM-DD-titulo-corto.md` → por ejemplo `2026-10-20-silos.md`.
   La fecha del nombre es la fecha de la nota; el resto será su dirección: `sguevara.com/anotaciones/silos/`.
4. Pega la plantilla de `plantillas/nueva-nota.md`, cambia el título y escribe.
5. **Commit changes**. En ~1 minuto está en línea.

```markdown
---
title: Título de la nota
tipo: Nota        # Nota o Ensayo
tema: Sistemas    # Sistemas, Tiempo o Ser
extracto: Una o dos frases para la lista de Anotaciones.
etiquetas: [silos, decisiones]   # opcional
destacada: false                 # opcional: true = primero en el inicio
---

Tu texto. Párrafos separados por una línea en blanco.

> Una cita destacada.
```

**`etiquetas`** (opcional): palabras clave de la nota, en minúscula, entre corchetes y separadas por coma. Hoy se muestran al pie de la nota; más adelante servirán para el buscador, las "notas relacionadas" y las páginas por tema. Conviene ponerlas desde ahora.

**`destacada`** (opcional): con `true`, la nota aparece primero en el inicio (con ★), antes que las más recientes. Úsalo para tus 2–3 notas fundacionales.

El número (N°05, N°06…), el tiempo de lectura, el feed RSS, el mapa del sitio y los archivos para IA (`/llms.txt`, `/llms-full.txt`) se actualizan solos.

**Para corregir** una nota: ábrela en GitHub → ícono del lápiz → edita → Commit.
**Para despublicar**: bórrala (o muévela fuera de `src/anotaciones/`).

---

## Ajustes rápidos

| Quiero cambiar… | Dónde |
|---|---|
| Correo, enlace para comprar el libro, foto | `src/_data/site.json` (`correo`, `libroEnlace`, `foto`) |
| Mi foto | Sube la imagen a `src/assets/img/` y pon su ruta en `foto`, ej. `"/assets/img/sergio.jpg"` |
| Colores (cian ↔ violeta del logo) | Primeras líneas de `src/assets/css/site.css` (`--sistemas`) |
| Textos del inicio | `src/index.njk` |
| Los 20 principios | `src/_data/principios.json` |
| Las frases del juego "¿Sergio o no?" | `src/_data/juego.json` (`sergio: true` o `false`) |
| Preguntas y palabras doradas de la página Tanmayo | `src/_data/tanmayo.json` |
| La nota que se resalta en el inicio | en la nota, `destacada: true` (el inicio muestra la más reciente + la destacada) |
| La T con los tres puntos | `src/_includes/marca.njk` (si tienes el logo original en SVG, reemplaza los trazos ahí) |

---

## Puesta en marcha (una sola vez)

### 1. Crear el repositorio
- En GitHub: **New repository**.
- Nombre recomendado: **`TU-USUARIO.github.io`** (ej. `sguevara.github.io`).
  Así, si algún día dejas de pagar el dominio, el sitio sigue vivo y gratis en `https://TU-USUARIO.github.io`.
- Público. Sin README (ya viene uno).

### 2. Subir los archivos
La forma más fácil: **GitHub Desktop** (app gratuita) → *Add existing repository* → elige esta carpeta → *Publish*.

> Ojo: si arrastras archivos en la web de GitHub, la carpeta oculta `.github/` (la que publica el sitio) puede quedar fuera. Si pasa, créala a mano: **Add file → Create new file**, nombre `.github/workflows/publicar.yml`, y pega el contenido de ese archivo.

### 3. Activar GitHub Pages
- Repositorio → **Settings → Pages** → *Build and deployment* → *Source*: **GitHub Actions**.
- En la pestaña **Actions** verás "Publicar sitio" corriendo. Al terminar (verde), el sitio está en línea.

### 4. Conectar sguevara.com
1. **Settings → Pages → Custom domain**: escribe `sguevara.com` → Save.
2. En el panel de tu dominio (donde lo pagas), en los registros DNS:
   - Quita los registros que apuntan a Google Sites.
   - Agrega 4 registros **A** para `@` (raíz):
     `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`
   - Agrega un **CNAME** para `www` → `TU-USUARIO.github.io`
3. Espera (de minutos a unas horas) y marca **Enforce HTTPS** en Settings → Pages.
4. En Google Sites, desconecta el dominio personalizado.

---

## Ver el sitio en tu computadora (opcional)
Requiere Node.js 22.
```
npm install
npm start
```
Abre http://localhost:8080 — se recarga al guardar.

## Estructura
```
src/
  anotaciones/            ← tus notas (.md)
  _data/site.json      ← datos generales
  _data/principios.json
  _includes/           ← plantillas (base, nota, marca, lista)
  assets/              ← css, js, fuentes, imágenes
  index.njk            ← inicio
  compas-animico.njk   ← página del libro
plantillas/nueva-nota.md
.github/workflows/publicar.yml  ← construye y publica
```

Fuentes: Anton, Newsreader e IBM Plex Mono, alojadas en el sitio (licencia SIL OFL, ver `src/assets/fonts/`).
