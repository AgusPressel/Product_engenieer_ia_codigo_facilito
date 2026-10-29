// Pruebas de los criterios de aceptación. Node: `node tests.js` · Navegador: abrir tests.html
(function (root) {
  'use strict';

  function ejecutar(A) {
    var resultados = [];
    function t(nombre, fn) {
      try { fn(); resultados.push({ nombre: nombre, ok: true }); }
      catch (e) { resultados.push({ nombre: nombre, ok: false, error: e.message }); }
    }
    function eq(a, b, msg) { if (a !== b) throw new Error((msg || 'Esperado') + ': ' + b + ', obtenido: ' + a); }

    var HOY = '2026-10-29';
    function nuevo() {
      var e = A.crearEstado([
        { id: 'l1', nombre: 'Lucía Fernández', salon: '1.º A' },
        { id: 'l2', nombre: 'Mateo Ríos', salon: '1.º A' },
        { id: 'l3', nombre: 'Sofía Luna', salon: '1.º B' }
      ]);
      A.crearSolicitud(e, { titulo: 'Salida al museo', salon: '1.º A', fechaLimite: '2026-10-20' });
      return e;
    }

    t('CA1 contadores coherentes', function () {
      var e = nuevo(); var r = A.resumen(e, HOY);
      eq(r.total, r.pendientes + r.autorizadas + r.noAutorizadas, 'Total');
      if (r.vencidas > r.pendientes) throw new Error('Vencidas > Pendientes');
    });

    t('CA2 búsqueda sin tildes ni mayúsculas', function () {
      var f = A.filas(nuevo(), { busqueda: 'LUCIA' }, HOY);
      eq(f.length, 1, 'Filas'); eq(f[0].alumno.id, 'l1', 'Alumno');
    });

    t('CA2 filtro por estado y combinación; resumen no cambia', function () {
      var e = nuevo(); var antes = JSON.stringify(A.resumen(e, HOY));
      eq(A.filas(e, { estado: 'vencida' }, HOY).length, 2, 'Vencidas');
      eq(A.filas(e, { estado: 'vencida', busqueda: 'mateo' }, HOY).length, 1, 'Combinado');
      eq(A.filas(e, { estado: 'autorizada' }, HOY).length, 0, 'Autorizadas');
      eq(JSON.stringify(A.resumen(e, HOY)), antes, 'Resumen');
    });

    t('CA3 crear solicitud genera una autorización por alumno', function () {
      var e = nuevo(); var antes = A.resumen(e, HOY).total;
      var r = A.crearSolicitud(e, { titulo: 'Fotos', salon: '1.º B', fechaLimite: '2026-11-10' });
      eq(r.ok, true, 'ok'); eq(A.resumen(e, HOY).total, antes + 1, 'Total');
      var pares = {};
      e.autorizaciones.forEach(function (a) {
        var k = a.solicitudId + '|' + a.alumnoId;
        if (pares[k]) throw new Error('Par duplicado ' + k);
        pares[k] = 1;
      });
    });

    t('CA3 campos vacíos no crean solicitud', function () {
      var e = nuevo(); var n = e.autorizaciones.length;
      eq(A.crearSolicitud(e, { titulo: '  ', salon: '1.º A', fechaLimite: '2026-11-10' }).ok, false, 'sin título');
      eq(A.crearSolicitud(e, { titulo: 'x', salon: '', fechaLimite: '2026-11-10' }).ok, false, 'sin salón');
      eq(A.crearSolicitud(e, { titulo: 'x', salon: '1.º A', fechaLimite: '' }).ok, false, 'sin fecha');
      eq(e.autorizaciones.length, n, 'Cantidad');
    });

    t('CA3 solicitud guarda categoría y rechaza una inválida', function () {
      var e = nuevo();
      eq(e.solicitudes[0].categoria, 'otra', 'Categoría por defecto');
      var r = A.crearSolicitud(e, { titulo: 'Feria', categoria: 'evento', salon: '1.º B', fechaLimite: '2026-11-10' });
      eq(r.solicitud.categoria, 'evento', 'Categoría');
      eq(A.crearSolicitud(e, { titulo: 'x', categoria: 'inventada', salon: '1.º B', fechaLimite: '2026-11-10' }).ok, false, 'inválida');
    });

    t('CA3 destinatarios: alumnos específicos', function () {
      var e = nuevo(); var antes = e.autorizaciones.length;
      var r = A.crearSolicitud(e, { titulo: 'Vacuna', categoria: 'vacunacion', alumnoIds: ['l1', 'l3', 'l1'], fechaLimite: '2026-11-10' });
      eq(r.ok, true, 'ok'); eq(r.cantidad, 2, 'Sin duplicados'); eq(r.solicitud.destinatarios, 'alumnos', 'Tipo');
      eq(e.autorizaciones.length, antes + 2, 'Autorizaciones');
      eq(A.crearSolicitud(e, { titulo: 'x', alumnoIds: [], fechaLimite: '2026-11-10' }).ok, false, 'Vacío');
      eq(A.crearSolicitud(e, { titulo: 'x', alumnoIds: ['zzz'], fechaLimite: '2026-11-10' }).ok, false, 'Inexistente');
    });

    t('RN9 etiquetas de respuesta según categoría', function () {
      var e = nuevo();
      var r = A.crearSolicitud(e, { titulo: 'Feria', categoria: 'evento', salon: '1.º B', fechaLimite: '2026-11-10' });
      eq(A.etiqueta(r.solicitud, 'autorizada'), 'Confirmada', 'Evento sí');
      eq(A.etiqueta(r.solicitud, 'no_autorizada'), 'No asiste', 'Evento no');
      eq(A.etiqueta(e.solicitudes[0], 'autorizada'), 'Autorizada', 'Otra sí');
      eq(A.etiqueta(r.solicitud, 'vencida'), 'Vencida', 'Vencida');
    });

    t('RN1 varios envíos quedan registrados y el estado no cambia', function () {
      var e = nuevo(); var a = e.autorizaciones[0];
      A.simularEnvio(e, a.id); A.simularEnvio(e, a.id);
      eq(a.envios.length, 2, 'Envíos'); eq(a.envios[0].tipo, 'inicial', 'Primero'); eq(a.envios[1].tipo, 'recordatorio', 'Segundo');
      eq(a.estado, 'pendiente', 'Estado');
    });

    t('CA4 registrar y corregir respuesta actualiza contadores', function () {
      var e = nuevo(); var id = e.autorizaciones[0].id;
      A.registrarRespuesta(e, id, 'autorizada');
      var r = A.resumen(e, HOY); eq(r.autorizadas, 1, 'Autorizadas'); eq(r.pendientes, 1, 'Pendientes');
      if (!e.autorizaciones[0].respondidaEn) throw new Error('Falta respondidaEn');
      A.registrarRespuesta(e, id, 'no_autorizada');
      r = A.resumen(e, HOY); eq(r.autorizadas, 0, 'Autorizadas'); eq(r.noAutorizadas, 1, 'No autorizadas');
    });

    t('CA5 vencida, respuesta la quita, hoy no vence', function () {
      var e = nuevo(); var a = e.autorizaciones[0];
      eq(A.estadoVisible(e, a, HOY), 'vencida', 'Visible');
      A.registrarRespuesta(e, a.id, 'autorizada');
      eq(A.estadoVisible(e, a, HOY), 'autorizada', 'Tras responder');
      eq(A.resumen(e, HOY).vencidas, 1, 'Vencidas restantes');
      eq(A.estadoVisible(e, e.autorizaciones[1], '2026-10-20'), 'pendiente', 'Límite = hoy');
    });

    t('CA6 simular envío no cambia el estado', function () {
      var e = nuevo(); var a = e.autorizaciones[0]; var antes = JSON.stringify(A.resumen(e, HOY));
      A.simularEnvio(e, a.id);
      if (!a.enviadaEn) throw new Error('Falta enviadaEn');
      eq(a.estado, 'pendiente', 'Estado'); eq(JSON.stringify(A.resumen(e, HOY)), antes, 'Resumen');
    });

    return resultados;
  }

  root.ejecutarPruebas = ejecutar;
  if (typeof module !== 'undefined' && module.exports && require.main === module) {
    var res = ejecutar(require('./logic.js'));
    res.forEach(function (r) { console.log((r.ok ? 'OK   ' : 'FAIL ') + r.nombre + (r.error ? ' → ' + r.error : '')); });
    var fallos = res.filter(function (r) { return !r.ok; }).length;
    console.log(res.length - fallos + '/' + res.length + ' pruebas pasan');
    process.exit(fallos ? 1 : 0);
  }
})(typeof window !== 'undefined' ? window : globalThis);
