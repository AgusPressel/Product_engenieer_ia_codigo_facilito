# Modelo de datos — 001 Autorizaciones

```
Alumno         { id, nombre, salon }
Solicitud      { id, titulo, salon, fechaLimite (YYYY-MM-DD), creadaEn }
Autorizacion   { id, solicitudId, alumnoId, estado, enviadaEn | null, respondidaEn | null }
```

## Relaciones

- Un **Salón** tiene muchos **Alumnos**.
- Una **Solicitud** se dirige a un salón y genera una **Autorizacion** por cada alumno de ese salón.
- Una **Autorizacion** pertenece a un único alumno y a una única solicitud.
- Restricción: único `(solicitudId, alumnoId)`.

## Estados

- `estado` ∈ `pendiente | autorizada | no_autorizada`. Inicia en `pendiente`.
- **Vencida** es derivado, no se almacena: `estado = pendiente` y `fechaLimite < hoy`.
- `enviadaEn` es independiente de `estado` (enviar ≠ autorizar).

## Privacidad

Solo se guardan nombre y salón del alumno. Datos ficticios (ver constitución).

## Futuro

Al agregar persistencia, estas entidades pasan a tablas con la misma restricción única. El feature 002 (personas autorizadas a retirar) sumará la entidad `PersonaAutorizada` relacionada con `Alumno`.
