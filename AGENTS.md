# AGENTS.md — Escuela Clara

Este archivo contiene reglas operativas. Los principios duraderos están en la constitución y las instrucciones visuales en la skill `brand-design`.

Contexto persistente para cualquier agente de IA que trabaje en este repositorio. Leelo completo antes de escribir código.

## Propósito

**Escuela Clara** ayuda a una escuela primaria a gestionar autorizaciones de las familias (salidas, fotos, actividades) sin papeles que se pierdan. La coordinadora ve en un panel quién respondió y quién falta. Las familias responden desde un enlace de WhatsApp, sin instalar nada.

## Usuaria principal

**Sofía**, coordinadora de la escuela.
- Poco tiempo, usa la herramienta entre clases, a menudo desde el celular.
- No es técnica: nada de jerga, configuraciones ni pasos ocultos.
- Necesita responder en segundos: *¿qué familias faltan por responder?*

## Reglas de producto (no negociables)

1. **Interfaz simple.** Una pantalla principal con resumen, búsqueda, filtros y tabla. Máximo dos clics para registrar una respuesta.
2. **Enviar ≠ autorizar.** Un mensaje enviado (o simulado) nunca cambia el estado de autorización. Solo una respuesta registrada de la familia lo cambia. El envío se muestra aparte (columna "Enviado").
3. **Las familias no instalan apps.** El canal es un enlace por WhatsApp.
4. **Una autorización = un alumno + una solicitud.** Una solicitud puede dirigirse a un salón completo, y genera una autorización por alumno.
5. **Vencida es un estado derivado:** pendiente + fecha límite anterior a hoy. No se almacena.

## Privacidad (menores de edad)

- Solo datos ficticios en el repositorio, demos y capturas. Nunca datos reales de alumnos.
- Mostrar el mínimo necesario: nombre y salón. Sin DNI, domicilio, fotos ni datos médicos.
- No enviar datos de alumnos a servicios externos. El prototipo no hace llamadas de red.

## Fuera de alcance (este feature)

- Registro de personas autorizadas a retirar alumnos (segundo feature).
- Envío real por WhatsApp, base de datos, autenticación, roles, pagos, notas, asistencia.

## Flujo de trabajo (Spec-Driven Development)

1. Los principios del proyecto están en [.specify/memory/constitution.md](.specify/memory/constitution.md). La fuente de verdad de cada feature es su carpeta en `specs/` (hoy [specs/001-autorizaciones/](specs/001-autorizaciones/): `spec.md`, `plan.md`, `data-model.md`, `tasks.md`, `tests.md`).
2. Si el comportamiento no está en la spec, **corregí la spec primero** y después el código.
3. Cada criterio de aceptación (CA) debe poder comprobarse manualmente; ver `tests.md` del feature.
4. Diseño visual: seguí la skill [.agents/skills/brand-design/SKILL.md](.agents/skills/brand-design/SKILL.md).

## Convenciones técnicas

- Código en `src/`: `index.html` (UI) y `logic.js` (lógica pura, sin DOM, probada por `tests.js`), sin dependencias ni build.
- Toda regla de negocio va en `src/logic.js`; la UI solo la invoca y pinta.
- `src/index.html` debe abrirse con doble clic (sin servidor) y funcionar offline.
- Texto de interfaz en español rioplatense (voseo), tono cercano y claro.
- Los datos viven en memoria y se reinician al recargar.
- Escapar siempre el texto que se inserta en el DOM (usar `textContent` o escape explícito).
