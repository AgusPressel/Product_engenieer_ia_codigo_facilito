---
name: brand-design
description: Identidad visual y de lenguaje de "Escuela Clara". Usar al crear o modificar cualquier pantalla, componente o texto de interfaz de la aplicación.
---

# Brand design — Escuela Clara

Estética **profesional y cercana**: clara como un cuaderno ordenado, amable sin ser infantil.

## Paleta (definir como variables CSS)

| Token | Valor | Uso |
|---|---|---|
| `--tinta` | `#1F2A44` | Texto principal, títulos |
| `--papel` | `#F7F6F2` | Fondo de página |
| `--superficie` | `#FFFFFF` | Tarjetas, tabla |
| `--primario` | `#2F5D9E` | Botones principales, enlaces, foco |
| `--ok` | `#1E7A4C` / fondo `#E3F3EA` | Autorizada |
| `--no` | `#A12D3A` / fondo `#FBE6E8` | No autorizada |
| `--pendiente` | `#8A5A00` / fondo `#FFF1D0` | Pendiente |
| `--vencida` | `#FFFFFF` sobre `#B3261E` | Vencida (el más fuerte) |
| `--borde` | `#D9D6CC` | Divisiones |

## Accesibilidad

- Contraste mínimo 4.5:1 en texto. Verificá cada par texto/fondo.
- **Nunca usar solo color** para el estado: cada estado lleva etiqueta de texto y un símbolo (✓ ✕ ⏳ ⚠).
- Foco visible (contorno de 3 px `--primario`) en todo elemento interactivo.
- Objetivos táctiles de al menos 44×44 px; diseño usable a 360 px de ancho.
- Fuente de sistema, 16 px mínimo en cuerpo. Etiquetas `<label>` en todos los campos. Respetar `prefers-reduced-motion`.

## Lenguaje

- Español rioplatense, voseo, frases cortas y directas ("Registrá la respuesta", "Faltan 4 familias").
- Verbos concretos en botones: *Autoriza*, *No autoriza*, *Enviar por WhatsApp*, *Crear solicitud*.
- Mensajes de error que dicen cómo resolver ("Completá el título para crear la solicitud").
- Sin jerga técnica (nada de "ID", "estado nulo", "payload").

## Representar estados

| Estado | Etiqueta | Símbolo | Estilo |
|---|---|---|---|
| Pendiente | Pendiente | ⏳ | ámbar suave |
| Autorizada | Autorizada | ✓ | verde suave |
| No autorizada | No autorizada | ✕ | rojo suave |
| Vencida | Vencida | ⚠ | rojo sólido, texto blanco |

- Mostrar **"Enviado"** como columna aparte, nunca mezclada con el estado de autorización.
- En fechas límite, mostrar la fecha y, si venció, "venció hace N días".
- En el resumen, "Vencidas" va destacada porque requiere acción.

## Evitar

- Más de un color de acento primario; gradientes, sombras pesadas, animaciones llamativas.
- Íconos sin texto como único indicador.
- Tablas con scroll horizontal en celular: en pantallas angostas, cada fila pasa a tarjeta.
- Usar rojo para "pendiente" (el rojo es para no autorizada y vencida).
- Mostrar datos personales más allá de nombre y salón.
