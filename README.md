# Velvet Salon & Spa

Propuesta web comercial desarrollada con React, Vite y Tailwind CSS para Velvet Salon & Spa, Trujillo.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run lint
npm run build
npm run preview
```

Los datos editables están en `src/data/`:

- `business.js`: contacto, dirección, horarios y WhatsApp.
- `services.js`: categorías, servicios y precios.
- `promotions.js`: promociones mensuales y destacados.

Las fotografías maestras están en `public/images/velvet/`. Las variantes AVIF/WebP para móvil, tablet y Retina se regeneran con:

```bash
npm run images:responsive
```

Pueden reemplazarse conservando sus nombres y volviendo a ejecutar ese comando.

## Rutas

- `/`: portada editorial, accesos rápidos y explorador progresivo de servicios.
- `/servicios/:categoria`: catálogo y precios por categoría, con detalles desplegables.
- `/promociones`: promociones filtrables en carrusel responsive.
- `/velvet`: información, reseñas, contacto y ubicación.

Las páginas originales del catálogo están en `public/referencias/`. Los recortes web optimizados se regeneran con `npm run extract:catalog`.

## Despliegue

El proyecto fija Node.js 22 mediante `.nvmrc`, compila con `npm run build` y genera el sitio estático en `dist/`. El archivo `public/_redirects` conserva las rutas internas de React Router al recargar una página.

### Netlify

Conecta el repositorio desde Netlify. El archivo `netlify.toml` ya define:

- Comando de compilación: `npm run build`
- Directorio de publicación: `dist`

### Cloudflare Pages

Conecta el repositorio desde **Workers & Pages** y usa:

- Framework preset: React (Vite)
- Comando de compilación: `npm run build`
- Directorio de salida: `dist`

También puedes hacer una carga directa, después de compilar, con:

```bash
npx wrangler pages deploy dist
```

La configuración base para esa carga está en `wrangler.jsonc`.
