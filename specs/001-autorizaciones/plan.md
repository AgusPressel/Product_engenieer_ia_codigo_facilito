# Plan de implementación — 001 Autorizaciones

## Decisiones técnicas

- **Sin build ni dependencias:** HTML + CSS + JavaScript plano, se abre con doble clic y funciona offline.
- **Separación de responsabilidades:**
  - `src/logic.js`: reglas de negocio puras (sin DOM), expuestas como `window.Autorizaciones` y `module.exports`.
  - `src/index.html`: interfaz; solo invoca la lógica y pinta.
  - `src/tests.js`: pruebas de los criterios de aceptación, ejecutables en Node y en `src/tests.html`.
- **Datos en memoria** con semillas ficticias relativas a la fecha actual (para que siempre haya una vencida).
- **Seguridad de DOM:** construir nodos con `textContent`; nunca `innerHTML` con datos.
- **Envío simulado:** modal con el texto del mensaje; sin llamadas de red.

## Mapeo reglas → código

| Regla | Función en `logic.js` |
|---|---|
| RN1 | `simularEnvio` |
| RN2, RN3 | `registrarRespuesta` |
| RN4, RN5 | `estaVencida`, `estadoVisible` |
| RN6, RN8 | `crearSolicitud` |
| RN7 | `resumen` (independiente de `filas`) |
| CA2 | `filas`, `normalizar` |

## Evolución hacia producción (fuera de este feature)

Persistencia (base de datos), autenticación de Sofía, enlaces únicos para familias, integración real con la API de WhatsApp.
