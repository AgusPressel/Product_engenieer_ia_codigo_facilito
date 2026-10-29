# Specs de Escuela Clara

## Jerarquía

- **Sistema:** Escuela Clara.
- **Módulos:** alumnos y familias · solicitudes · notificaciones · seguimiento · administración.
- **Funcionalidades:** crear solicitud, registrar respuesta, consultar pendientes, enviar por WhatsApp.
- **Reglas de negocio:** viven dentro del spec de cada funcionalidad.

Un spec define **una funcionalidad coherente y verificable**, no un módulo entero ni un botón. Define el *qué* y cómo se comprueba; el *cómo* va en `plan.md` y `tasks.md`.

Solicitud y notificación son conceptos distintos: la solicitud es lo que la escuela necesita de la familia; la notificación es uno de los medios para comunicarla (una solicitud puede generar varios mensajes).

## Hoja de ruta

| Spec | Estado | Responsabilidad |
|---|---|---|
| [001-autorizaciones](001-autorizaciones/spec.md) | Implementado (prototipo) | Base común de solicitudes (título, categoría, fecha límite, destinatarios por salón o alumno), respuesta sí / no con textos por categoría, estados pendiente / vencida, seguimiento |
| 002-personas-autorizadas-retiro | Pendiente | Registrar y validar quién puede retirar a cada alumno |
| 003-notificaciones | Pendiente | Envío real por WhatsApp, entrega, recordatorios, control de duplicados |
| 004+ categorías con reglas propias | Pendiente | Documentación con archivo adjunto y otras categorías que no se respondan con sí / no (vacunación y eventos ya funcionan como categorías de 001) |

Las carpetas pendientes **no se crean** hasta que se vaya a trabajar en ellas.

## ¿Ampliar un spec o crear otro?

- **Ampliar** cuando se agrega una variante simple que comparte reglas (ej.: una categoría nueva con respuesta Autoriza / No autoriza).
- **Crear otro** cuando aparecen datos, flujos, permisos o criterios de aceptación significativamente distintos (ej.: personas autorizadas a retirar, adjuntos, recordatorios programados).
