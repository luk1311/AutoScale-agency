# AutoScale — Guía de marca

Concepto: **Módulos** — sistemas que escalan sumando piezas. El módulo celeste representa la nueva capacidad que se agrega al sistema.

## Archivos

### SVG (fuente escalable — usar siempre que se pueda)
| Archivo | Uso |
|---|---|
| `svg/autoscale-logo-light.svg` | Logo horizontal para fondo claro (principal) |
| `svg/autoscale-logo-dark.svg` | Logo horizontal para fondo oscuro |
| `svg/autoscale-symbol.svg` | Símbolo squircle (app, avatar) |
| `svg/autoscale-symbol-circle.svg` | Símbolo en círculo (foto de perfil redonda) |
| `svg/autoscale-symbol-plain.svg` | Solo módulos, sin contenedor |
| `svg/autoscale-symbol-mono-black.svg` | Monocromo negro (1 tinta) |
| `svg/autoscale-symbol-mono-white.svg` | Monocromo blanco (sobre oscuro) |
| `svg/favicon.svg` | Favicon del sitio |

### PNG (transparentes, alta resolución)
- Logo: `png/autoscale-logo-light-1600.png`, `-800.png` y versiones `-dark-`
- Símbolo: `png/autoscale-symbol-1024/512/256.png`, círculo, plano y monocromos
- Íconos web: `png/favicon-32.png`, `favicon-48.png`, `apple-touch-icon-180.png`, `icon-512.png`

> Nota: el texto de los PNG usa una tipografía de respaldo casi idéntica. El SVG lleva **Inter** exacta y se renderiza perfecto en tu sitio (que ya carga Inter).

## Colores

| Rol | HEX |
|---|---|
| Azul señal (principal) | `#2563EB` |
| Azul hover / oscuro | `#1D4ED8` |
| Módulo nuevo (acento) | `#AFC7F7` |
| Tinta (texto títulos) | `#0E1220` |
| Gris texto | `#64748B` |
| Blanco | `#FFFFFF` |
| Azul claro (texto sobre oscuro) | `#5B8BFF` |

## Tipografía

**Inter** (la misma de tu sitio).
- Wordmark: "Auto" en tinta `#0E1220` + "Scale" en azul `#2563EB`, peso 700, tracking −4%.
- Sobre fondo oscuro: "Auto" en blanco, "Scale" en `#5B8BFF`.

## Reglas de uso

- **Área de protección:** margen libre alrededor del logo ≥ la altura de un módulo (≈ ¼ del símbolo).
- **Tamaño mínimo:** símbolo 16 px; logo horizontal 110 px de ancho.
- **No hacer:** no estirar, no rotar, no cambiar los colores, no agregar sombras ni degradados, no poner el logo sobre fondos que no den contraste.

## Reemplazar el favicon del sitio

El favicon actual (`agency/public/favicon.svg`) es morado y no coincide con la marca. Para actualizarlo, reemplazá ese archivo por `brand/svg/favicon.svg`.
