# Verificación — 001 Autorizaciones

## Automática

`node src/tests.js` o abrir `src/tests.html`. Cubre CA1–CA6 sobre `logic.js`.

## Manual (abrir `src/index.html`)

| # | Pasos | Resultado esperado | CA |
|---|---|---|---|
| 1 | Cargar el panel | Total = Pendientes + Autorizadas + No autorizadas; hay al menos una vencida | CA1 |
| 2 | Buscar "lu" | Solo alumnos cuyo nombre contiene "lu" | CA2 |
| 3 | Filtrar "Vencida" y combinar con búsqueda | Solo vencidas que coinciden; contadores sin cambios | CA2 |
| 4 | Nueva solicitud para 1.º A con título y fecha | Aparecen filas pendientes de 1.º A; Total sube | CA3 |
| 4b | Elegir categoría "Evento escolar" al crear | La fila muestra "Evento escolar" bajo el título | CA3 |
| 4c | Crear con "Alumnos específicos" y marcar 2 | Se crean exactamente 2 filas; con ninguno marcado, mensaje de error | CA3 |
| 4d | En la fila de un evento mirar los botones | Dicen "Confirma" / "No asiste"; el estado queda Confirmada / No asiste | CA4 |
| 5 | Nueva solicitud con título vacío | Mensaje de error; no se crea nada | CA3 |
| 6 | En una pendiente pulsar "Autoriza" | Estado Autorizada; contadores actualizados | CA4 |
| 7 | En esa fila pulsar "No autoriza" | Estado No autorizada; contadores corregidos | CA4 |
| 8 | Registrar respuesta en una vencida | Deja de estar vencida; Vencidas baja | CA5 |
| 9 | Pulsar "Enviar por WhatsApp" en una pendiente | Aparece fecha en Enviado; sigue Pendiente; contadores iguales | CA6 |
| 9b | Pulsar de nuevo el envío en la misma fila | Botón "Enviar recordatorio"; Enviado muestra "(2 envíos)" | CA6 |
| 10 | Reducir la ventana a 360 px | Filas en tarjetas, sin scroll horizontal | brand |

## Si una prueba falla

Primero revisar si el comportamiento está bien definido en [spec.md](spec.md). Si la spec es incorrecta o incompleta, corregirla y después ajustar el código.
