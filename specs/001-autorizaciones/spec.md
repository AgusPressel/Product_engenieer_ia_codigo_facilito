# Spec 001: Gestión y seguimiento de autorizaciones

- **Usuaria:** Sofía, coordinadora escolar
- **Principios:** [constitution](../../.specify/memory/constitution.md) · **Contexto:** [AGENTS.md](../../AGENTS.md)
- **Documentos relacionados:** [plan](plan.md) · [data-model](data-model.md) · [tasks](tasks.md) · [tests](tests.md)

## 1. Problema

Las autorizaciones se piden en papel: se pierden, no se sabe quién respondió y Sofía pierde tiempo preguntando familia por familia. Necesita un lugar único donde ver respuestas y pendientes.

## 2. Usuaria y objetivo

Sofía quiere saber en segundos qué familias faltan por responder y registrar cada respuesta con pocos clics, muchas veces desde el celular.

## 3. Comportamiento esperado

Un panel web donde Sofía:
1. Crea una **solicitud** de autorización para un salón (título + fecha límite).
2. **Envía** a cada familia un enlace por WhatsApp (simulado en el prototipo).
3. **Registra** la respuesta de la familia: *Autoriza* o *No autoriza*.
4. Consulta el resumen y busca o filtra para encontrar pendientes y vencidas.

Interfaz:
- **Resumen:** Total, Pendientes, Autorizadas, No autorizadas, Vencidas.
- **Barra de herramientas:** búsqueda por nombre, filtro por estado (Todos, Pendiente, Autorizada, No autorizada, Vencida), botón "Nueva solicitud".
- **Tabla:** Alumno, Salón, Solicitud, Fecha límite, Estado, Enviado, Acciones.
- **Estado vacío:** "No encontramos alumnos con esos filtros".
- Estética según la skill [brand-design](../../.agents/skills/brand-design/SKILL.md).

## 4. Reglas funcionales

Modelo de datos en [data-model.md](data-model.md).

- **RN1.** Simular el envío solo escribe `enviadaEn`. Nunca modifica `estado`.
- **RN2.** Registrar una respuesta fija `estado` y `respondidaEn`.
- **RN3.** Una respuesta puede corregirse (Autoriza ↔ No autoriza). No se vuelve a `pendiente`.
- **RN4.** Una autorización con respuesta nunca se considera vencida.
- **RN5.** Fecha límite igual a hoy **no** está vencida; vence al día siguiente.
- **RN6.** No se crea una solicitud sin título, salón o fecha límite.
- **RN7.** Los contadores del resumen reflejan todos los datos, no el filtro aplicado.
- **RN8.** Hay exactamente una autorización por par (solicitud, alumno).

## 5. Criterios de aceptación

Datos iniciales: salones "1.º A", "1.º B", "2.º A" con alumnos ficticios y solicitudes de ejemplo (al menos una vencida con pendientes).

| ID | Dado / Cuando / Entonces |
|---|---|
| **CA1 Resumen** | Dado el panel cargado, Total = Pendientes + Autorizadas + No autorizadas, y Vencidas ≤ Pendientes. |
| **CA2 Búsqueda y filtros** | Al escribir parte de un nombre, solo aparecen coincidencias (sin distinguir mayúsculas ni tildes). Al elegir un estado, solo filas de ese estado. Búsqueda y filtro se combinan. Los contadores no cambian. |
| **CA3 Crear solicitud** | Al crear una solicitud para "1.º A" con título y fecha límite, aparece una fila `pendiente` por alumno de 1.º A y el Total aumenta en esa cantidad. Con un campo vacío no se crea y se muestra un mensaje. |
| **CA4 Registrar respuesta** | Al registrar "Autoriza" o "No autoriza", la fila cambia de estado, se guarda la fecha de respuesta y los contadores se actualizan. Corregir la respuesta actualiza ambos contadores. |
| **CA5 Vencimientos** | Una fila pendiente con fecha límite anterior a hoy se muestra **Vencida** y cuenta en Vencidas. Al registrar respuesta deja de ser vencida. Fecha límite igual a hoy no es vencida. |
| **CA6 Enviar ≠ autorizar** | Al simular el envío por WhatsApp a una fila pendiente, Enviado muestra fecha/hora, el estado sigue `pendiente` y los contadores no cambian. |

Casos de prueba que verifican cada criterio: [tests.md](tests.md).

## 6. Fuera de alcance

Personas autorizadas a retirar alumnos (feature 002), WhatsApp real, persistencia, autenticación, edición/eliminación de solicitudes, enlaces públicos para familias.
