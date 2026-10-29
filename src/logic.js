// Lógica pura de autorizaciones (sin DOM). Ver specs/001-autorizaciones/spec.md
(function (root) {
  'use strict';

  // Categorías: todas responden sí / no, pero con palabras distintas (RN9)
  function cat(nombre, si, no, siEtq, noEtq) { return { nombre: nombre, si: si, no: no, siEtq: siEtq, noEtq: noEtq }; }
  var CATEGORIAS = {
    salida: cat('Salida escolar', 'Autoriza', 'No autoriza', 'Autorizada', 'No autorizada'),
    vacunacion: cat('Vacunación', 'Autoriza', 'No autoriza', 'Autorizada', 'No autorizada'),
    evento: cat('Evento escolar', 'Confirma', 'No asiste', 'Confirmada', 'No asiste'),
    foto: cat('Uso de fotos', 'Autoriza', 'No autoriza', 'Autorizada', 'No autorizada'),
    otra: cat('Otra', 'Autoriza', 'No autoriza', 'Autorizada', 'No autorizada')
  };

  function categoriaDe(sol) { return CATEGORIAS[sol.categoria] || CATEGORIAS.otra; }

  // Texto del estado según la categoría de la solicitud
  function etiqueta(sol, visible) {
    var c = categoriaDe(sol);
    if (visible === 'autorizada') return c.siEtq;
    if (visible === 'no_autorizada') return c.noEtq;
    return visible === 'vencida' ? 'Vencida' : 'Pendiente';
  }

  function hoyISO(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function normalizar(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  // Días entre dos fechas YYYY-MM-DD (b - a)
  function diasEntre(a, b) {
    var pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }

  function solicitudDe(estado, aut) {
    return estado.solicitudes.find(function (s) { return s.id === aut.solicitudId; });
  }

  // RN4, RN5: vencida = pendiente y fechaLimite < hoy
  function estaVencida(estado, aut, hoy) {
    var sol = solicitudDe(estado, aut);
    return aut.estado === 'pendiente' && !!sol && sol.fechaLimite < hoy;
  }

  function estadoVisible(estado, aut, hoy) {
    return estaVencida(estado, aut, hoy) ? 'vencida' : aut.estado;
  }

  function crearEstado(alumnos) {
    return { alumnos: alumnos, solicitudes: [], autorizaciones: [], siguienteId: 1 };
  }

  // RN6 + una autorización por (solicitud, alumno)
  function crearSolicitud(estado, datos, ahora) {
    var titulo = (datos.titulo || '').trim();
    if (!titulo) return { ok: false, error: 'Completá el título para crear la solicitud.' };
    var categoria = datos.categoria || 'otra';
    if (!Object.prototype.hasOwnProperty.call(CATEGORIAS, categoria)) return { ok: false, error: 'Elegí una categoría válida.' };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fechaLimite || '')) {
      return { ok: false, error: 'Elegí la fecha límite de respuesta.' };
    }
    // Destinatarios: alumnos específicos (alumnoIds) o un salón completo
    var alumnos, destinatarios;
    if (Array.isArray(datos.alumnoIds)) {
      destinatarios = 'alumnos';
      var ids = datos.alumnoIds.filter(function (id, i, arr) { return arr.indexOf(id) === i; });
      if (!ids.length) return { ok: false, error: 'Marcá al menos un alumno.' };
      alumnos = ids.map(function (id) { return estado.alumnos.find(function (a) { return a.id === id; }); });
      if (alumnos.some(function (a) { return !a; })) return { ok: false, error: 'Hay alumnos que no existen.' };
    } else {
      destinatarios = 'salon';
      if (!datos.salon) return { ok: false, error: 'Elegí el salón al que va dirigida la solicitud.' };
      alumnos = estado.alumnos.filter(function (a) { return a.salon === datos.salon; });
      if (!alumnos.length) return { ok: false, error: 'Ese salón no tiene alumnos cargados.' };
    }

    var sol = {
      id: 's' + estado.siguienteId++,
      titulo: titulo,
      categoria: categoria,
      destinatarios: destinatarios,
      salon: destinatarios === 'salon' ? datos.salon : null,
      fechaLimite: datos.fechaLimite,
      creadaEn: ahora || new Date().toISOString()
    };
    estado.solicitudes.push(sol);
    alumnos.forEach(function (al) {
      estado.autorizaciones.push({
        id: 'a' + estado.siguienteId++,
        solicitudId: sol.id,
        alumnoId: al.id,
        estado: 'pendiente',
        enviadaEn: null,
        envios: [],
        respondidaEn: null
      });
    });
    return { ok: true, solicitud: sol, cantidad: alumnos.length };
  }

  function buscarAut(estado, id) {
    return estado.autorizaciones.find(function (a) { return a.id === id; });
  }

  // RN1: solo registra el envío (enviadaEn y envios); un envío posterior es un recordatorio
  function simularEnvio(estado, autId, ahora) {
    var aut = buscarAut(estado, autId);
    if (!aut) return { ok: false, error: 'No encontramos esa autorización.' };
    var en = ahora || new Date().toISOString();
    aut.envios.push({ en: en, tipo: aut.envios.length ? 'recordatorio' : 'inicial' });
    aut.enviadaEn = en;
    return { ok: true, autorizacion: aut };
  }

  // RN2, RN3: fija estado y respondidaEn; nunca vuelve a pendiente
  function registrarRespuesta(estado, autId, respuesta, ahora) {
    var aut = buscarAut(estado, autId);
    if (!aut) return { ok: false, error: 'No encontramos esa autorización.' };
    if (respuesta !== 'autorizada' && respuesta !== 'no_autorizada') {
      return { ok: false, error: 'La respuesta debe ser "Autoriza" o "No autoriza".' };
    }
    aut.estado = respuesta;
    aut.respondidaEn = ahora || new Date().toISOString();
    return { ok: true, autorizacion: aut };
  }

  // RN7: el resumen no depende de filtros
  function resumen(estado, hoy) {
    var r = { total: 0, pendientes: 0, autorizadas: 0, noAutorizadas: 0, vencidas: 0 };
    estado.autorizaciones.forEach(function (a) {
      r.total++;
      if (a.estado === 'pendiente') r.pendientes++;
      else if (a.estado === 'autorizada') r.autorizadas++;
      else r.noAutorizadas++;
      if (estaVencida(estado, a, hoy)) r.vencidas++;
    });
    return r;
  }

  // Filas combinadas para la tabla, con búsqueda y filtro
  function filas(estado, filtros, hoy) {
    var q = normalizar(filtros && filtros.busqueda);
    var st = (filtros && filtros.estado) || 'todos';
    var out = [];
    estado.autorizaciones.forEach(function (a) {
      var al = estado.alumnos.find(function (x) { return x.id === a.alumnoId; });
      var sol = solicitudDe(estado, a);
      var vis = estadoVisible(estado, a, hoy);
      if (q && normalizar(al.nombre).indexOf(q) === -1) return;
      if (st !== 'todos' && vis !== st) return;
      out.push({ aut: a, alumno: al, solicitud: sol, visible: vis });
    });
    return out;
  }

  var api = {
    CATEGORIAS: CATEGORIAS, categoriaDe: categoriaDe, etiqueta: etiqueta,
    hoyISO: hoyISO, normalizar: normalizar, diasEntre: diasEntre,
    estaVencida: estaVencida, estadoVisible: estadoVisible,
    crearEstado: crearEstado, crearSolicitud: crearSolicitud,
    simularEnvio: simularEnvio, registrarRespuesta: registrarRespuesta,
    resumen: resumen, filas: filas
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Autorizaciones = api;
})(typeof window !== 'undefined' ? window : globalThis);
