# Mounjaro de Chía — Quiz (ES)

Réplica en español del funnel de quiz de `mounajrodechia.online`, construida con Next.js 14 + Tailwind.
Todos los textos fueron traducidos del portugués al español y se reutilizan exactamente las mismas
imágenes del sitio original (descargadas en `public/`).

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Estructura del funnel (idéntica al original)

1. **Quiz 1 (5 pasos)** — kilos a perder, género, edad, cuerpo actual, zona a reducir.
2. **VSL 1** — video con botón (CTA) oculto que se libera tras un delay.
3. **Quiz 2 (11 pasos)** — peso, altura, objetivo, impacto, satisfacción, bloqueo,
   agua, sueño, rutina, cuerpo deseado, nombre.
4. **Página final** — VSL 2 + 2 planes con botón de checkout.

### Bifurcación por género
En el paso de "género", elegir **Hombre** o **Mujer** cambia las imágenes de los pasos
"cuerpo actual" y "zona a reducir" (masculinas vs. femeninas) y la concordancia de la
etiqueta *Flácido/Flácida*. La lógica vive en `app/components/steps/OptionsStep.tsx`
y las rutas de imágenes en `app/lib/content.ts` (`IMAGES`).

## ⚠️ Ajustes obligatorios antes de publicar (`app/lib/content.ts`)

- **`CHECKOUT.completo` / `CHECKOUT.premium`** — están en `"#"`. Pon **tus** enlaces de pago.
  (No se copiaron los del sitio original a propósito, para no enviarle tus ventas.)
- **`VIDEO`** — usa los IDs del reproductor VTurb/ConverteAI del sitio original (video en
  portugués). Sustitúyelos por los de **tu** VSL en español.
- **`CTA_DELAY.vsl1` / `CTA_DELAY.vsl2`** — segundos hasta liberar el botón sobre cada video
  (por defecto 5 s). Ajusta al "pitch" real de tu VSL. `0` = liberar al instante.
- **`FB_PIXEL_ID`** (en `app/layout.tsx`) — vacío. Agrega tu propio Pixel de Facebook.

## Contenido

Todo el texto y el flujo están centralizados en `app/lib/content.ts`.
Las tarjetas de planes se reconstruyeron como HTML/CSS en español (`app/components/PlanCards.tsx`)
en lugar de imágenes con texto en portugués.
