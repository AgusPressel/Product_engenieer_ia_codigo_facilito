# Spec 001: Solicitudes de autorización (base común) y seguimiento

- **Usuaria:** Sofía, coordinadora escolar
- **Principios:** [constitution](../../.specify/memory/constitution.md) · **Contexto:** [AGENTS.md](../../AGENTS.md)
- **Documentos relacionados:** [plan](plan.md) · [data-model](data-model.md) · [tasks](tasks.md) · [tests](tests.md)

## 1. Problema

Las autorizaciones se piden en papel: se pierden, no se sabe quién respondió y Sofía pierde tiempo preguntando familia por familia. Necesita un lugar único donde ver respuestas y pendientes.

## 2. Usuaria y objetivo

Sofía quiere saber en segundos qué familias faltan por responder y registrar cada respuesta con pocos clics, muchas veces desde el celular.

## 3. Comportamiento esperado

Un panel web donde Sofía:
1. Crea una **solicitud** (título, categoría y fecha límite) dirigida a un salón completo o a alumnos específicos.
2. **Envía** a cada familia un enlace por WhatsApp (simulado en el prototipo).
3. **Registra** la respuesta de la familia: *Autoriza* o *No autoriza*.
4. Consulta el resumen y busca o filtra para encontrar pendientes y vencidas.

Interfaz:
- **Resumen:** Total, Pendientes, Autorizadas, No autorizadas, Vencidas.
- **Barra de herramientas:** búsqueda por nombre, filtro por estado (Todos, Pendiente, Autorizada, No autorizada, Vencida), botón "Nueva solicitud".
- **Tabla:** Alumno, Salón, Solicitud (con categoría y destinatarios), Fecha límite, Estado, Enviado, Acciones.
- **Resumen:** "Autorizadas" y "No autorizadas" agrupan las respuestas afirmativas y negativas de cualquier categoría.
- **Estado vacío:** "No encontramos alumnos con esos filtros".
- Estética según la skill [brand-design](../../.agents/skills/brand-design/SKILL.md).

## 4. Reglas funcionales

Modelo de datos en [data-model.md](data-model.md).

- **RN1.** Simular el envío solo escribe `enviadaEn`. Nunca modifica `estado`.
- **RN2.** Registrar una respuesta fija `estado` y `respondidaEn`.
- **RN3.** Una respuesta puede corregirse (Autoriza ↔ No autoriza). No se vuelve a `pendiente`.
- **RN4.** Una autorización con respuesta nunca se considera vencida.
- **RN5.** Fecha límite igual a hoy **no** está vencida; vence al día siguiente.
- **RN6.** No se crea una solicitud sin título, fecha límite o destinatarios (un salón con alumnos, o al menos un alumno existente). Los alumnos repetidos se cuentan una sola vez.
- **RN7.** Los contadores del resumen reflejan todos los datos, no el filtro aplicado.
- **RN8.** Hay exactamente una autorización por par (solicitud, alumno).
- **RN9.** Toda solicitud tiene una categoría: `salida`, `vacunacion`, `evento`, `foto` u `otra`. Todas se responden con sí / no, pero el texto cambia: `evento` usa *Confirma / No asiste* (estados *Confirmada / No asiste*); las demás usan *Autoriza / No autoriza* (*Autorizada / No autorizada*). Internamente el estado es el mismo. Categorías con otra forma de respuesta (adjuntar archivo, alta de personas) quedan fuera de este spec.
- **RN10.** Enviar, entregar y responder son eventos distintos. Este spec modela *enviado* (simulado) y *respondido*; *entregado* queda para el spec de notificaciones.
- **RN11.** Una misma autorización puede tener varios envíos: el primero es `inicial` y los siguientes `recordatorio`. Cada envío queda registrado y ninguno cambia el estado.

## 5. Criterios de aceptación

Datos iniciales: salones "1.º A", "1.º B", "2.º A" con alumnos ficticios y solicitudes de ejemplo (al menos una vencida con pendientes).

| ID | Dado / Cuando / Entonces |
|---|---|
| **CA1 Resumen** | Dado el panel cargado, Total = Pendientes + Autorizadas + No autorizadas, y Vencidas ≤ Pendientes. |
| **CA2 Búsqueda y filtros** | Al escribir parte de un nombre, solo aparecen coincidencias (sin distinguir mayúsculas ni tildes). Al elegir un estado, solo filas de ese estado. Búsqueda y filtro se combinan. Los contadores no cambian. |
| **CA3 Crear solicitud** | Al crear una solicitud para "1.º A" con título, categoría y fecha límite, aparece una fila `pendiente` por alumno de 1.º A y el Total aumenta en esa cantidad. Al elegir alumnos específicos, se crea una fila por cada alumno marcado. Con un campo vacío o sin alumnos marcados no se crea y se muestra un mensaje. |
| **CA4 Registrar respuesta** | Al registrar la respuesta (los botones muestran el texto de la categoría, p. ej. "Confirma" / "No asiste" en eventos), la fila cambia de estado, se guarda la fecha de respuesta y los contadores se actualizan. Corregir la respuesta actualiza ambos contadores. |
| **CA5 Vencimientos** | Una fila pendiente con fecha límite anterior a hoy se muestra **Vencida** y cuenta en Vencidas. Al registrar respuesta deja de ser vencida. Fecha límite igual a hoy no es vencida. |
| **CA6 Enviar ≠ autorizar** | Al simular el envío por WhatsApp a una fila pendiente, Enviado muestra fecha/hora, el estado sigue `pendiente` y los contadores no cambian. Un segundo envío se registra como recordatorio ("2 envíos"). |

Casos de prueba que verifican cada criterio: [tests.md](tests.md).

## 6. Fuera de alcance

Categorías con respuestas que no sean sí / no, personas autorizadas a retirar alumnos, notificaciones reales con entrega y recordatorios (ver [hoja de ruta](../README.md)), WhatsApp real, persistencia, autenticación, edición/eliminación de solicitudes, enlaces públicos para familias.
