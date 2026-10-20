import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  // Archivos que se copian tal cual
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Feed RSS/Atom de Anotaciones → /feed.xml
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "anotaciones", limit: 30 },
    metadata: {
      language: "es",
      title: "Anotaciones — Sergio Guevara",
      subtitle: "Sistemas, complejidad, tiempo y ser.",
      base: "https://sguevara.com/",
      author: { name: "Sergio Guevara Guitán" },
    },
  });

  // Fecha en español: "19 oct 2026"
  eleventyConfig.addFilter("fecha", (d) =>
    new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(d))
  );
  eleventyConfig.addFilter("fechaISO", (d) => new Date(d).toISOString().slice(0, 10));

  // N° de la nota según su orden de publicación (la primera es N°01)
  eleventyConfig.addFilter("numero", (coleccion, url) => {
    const i = (coleccion || []).findIndex((p) => p.url === url);
    return i < 0 ? "" : "N°" + String(i + 1).padStart(2, "0");
  });

  // Minutos de lectura (~200 palabras por minuto)
  eleventyConfig.addFilter("lectura", (html) => {
    const palabras = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(palabras / 200));
  });

  // "Sistemas" → "sistemas" para clases CSS
  eleventyConfig.addFilter("slugTema", (t) => String(t || "").toLowerCase());

  eleventyConfig.addFilter("recientes", (arr, n) => (arr || []).slice().reverse().slice(0, n));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
