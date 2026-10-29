# Escuela Clara — autorizaciones (SDD)

Primera iteración de una aplicación escolar construida con **Spec-Driven Development**. Resuelve un único feature: **gestionar y hacer seguimiento de las autorizaciones** de las familias, para que Sofía (coordinadora) vea quién respondió y quién falta.

## Estructura

```
AGENTS.md                                  Reglas operativas para el agente
.specify/memory/constitution.md            Principios del proyecto
.agents/skills/brand-design/SKILL.md       Skill de identidad visual y lenguaje
specs/001-autorizaciones/
  spec.md                                  Problema, comportamiento, reglas, criterios de aceptación
  plan.md                                  Decisiones técnicas
  data-model.md                            Alumnos, solicitudes, autorizaciones
  tasks.md                                 Tareas
  tests.md                                 Verificación automática y manual
src/
  index.html                               Prototipo (interfaz)
  logic.js                                 Lógica pura
  tests.js / tests.html                    Pruebas de los criterios de aceptación
```

Cadena SDD: **Constitución + AGENTS.md → Spec → Plan → Tareas → Implementación validada.**

## Cómo ejecutarlo

- Abrí `src/index.html` con doble clic (sin servidor ni internet).
- Pruebas automáticas: `src/tests.html` o `node src/tests.js`.
- Pruebas manuales: [specs/001-autorizaciones/tests.md](specs/001-autorizaciones/tests.md).

## Alcance y límites

Prototipo con datos ficticios en memoria (se reinician al recargar), sin WhatsApp real, base de datos ni autenticación. El registro de personas autorizadas a retirar alumnos queda para un segundo feature.

Principio clave: **enviar un mensaje no equivale a recibir una autorización.**
