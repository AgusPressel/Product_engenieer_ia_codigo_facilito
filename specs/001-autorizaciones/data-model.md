# Modelo de datos — 001 Autorizaciones

```
Alumno         { id, nombre, salon }
Solicitud      { id, titulo, categoria, destinatarios, salon | null, fechaLimite (YYYY-MM-DD), creadaEn }
Autorizacion   { id, solicitudId, alumnoId, estado, enviadaEn | null, envios[], respondidaEn | null }
Envio          { en, tipo: inicial | recordatorio }
```

## Relaciones

- Un **Salón** tiene muchos **Alumnos**.
- Una **Solicitud** se dirige a un salón completo o a alumnos específicos y genera una **Autorizacion** por cada destinatario.
- Una **Autorizacion** pertenece a un único alumno y a una única solicitud.
- Restricción: único `(solicitudId, alumnoId)`.

- `categoria` ∈ `salida | vacunacion | evento | foto | otra`; define los textos de respuesta (RN9), no el modelo.
- `destinatarios` ∈ `salon | alumnos`. Con `salon`, el campo `salon` indica el salón; con `alumnos` es `null`.
- `enviadaEn` es la fecha del último envío de `envios`.

## Estados

- `estado` ∈ `pendiente | autorizada | no_autorizada`. Inicia en `pendiente`.
- **Vencida** es derivado, no se almacena: `estado = pendiente` y `fechaLimite < hoy`.
- `enviadaEn` es independiente de `estado` (enviar ≠ autorizar).

## Privacidad

Solo se guardan nombre y salón del alumno. Datos ficticios (ver constitución).

## Futuro

Al agregar persistencia, estas entidades pasan a tablas con la misma restricción única. El feature 002 (personas autorizadas a retirar) sumará la entidad `PersonaAutorizada` relacionada con `Alumno`.
