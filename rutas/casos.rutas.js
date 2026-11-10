import { Router } from 'express';
import { casos } from '../clases/casos.js';
import { auditoria } from '../clases/auditoria.js';
import { zona } from '../clases/zona.js'; 
import { tipoDelito } from '../clases/tipoDelitos.js'; 
import { soloAdmin, soloDetective } from '../middlewares/auth.middleware.js';
import { usuarios } from '../clases/usuarios.js';
import { sequelize } from '../basedatos.js';
import { Op } from 'sequelize';

const enrutador = Router();

// ==========================================
// RUTAS ESTÁNDAR (SANTIAGO)
// ==========================================

enrutador.get('/casos', soloDetective, async (req, res) => {
  const dniUsuario = Number(req.headers['x-dni']);
  try {
    const listaCasos = await casos.findAll({
      where: {
        codDetective: dniUsuario
      },
      include: [
        { model: zona },
        { model: tipoDelito }
      ]
    });
    res.json(listaCasos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los casos', error });
  }
});

enrutador.get('/casos/verificarActivo', soloDetective, async (req, res) => {
  const dniUsuario = Number(req.headers['x-dni']);
  try {
    const listaCasos = await casos.findAll({
      where: {
        estado: { 
          [Op.in]: ['ACTIVO','PENDIENTE'] 
        },
        codDetective: dniUsuario
      },
      include: [
        { model: zona },
        { model: tipoDelito }
      ]
    });
    res.json(listaCasos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los casos', error: error.message });
  }
});

enrutador.get('/casos/pendientes', soloAdmin, async (req, res) => {
  try {
    const pendientes = await casos.findAll({
      where: {
        estado: {
          [Op.in]: ['PENDIENTE', 'CIERRE_PENDIENTE']
        }
      },
      include: [{ model: tipoDelito }]
    });

    res.json(pendientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pendientes', error });
  }
});

enrutador.post('/casos/:id/solicitar-cierre', soloDetective, async (req, res) => {
  try {
    const dniDetective = Number(req.headers['x-dni']);

    if (!Number.isInteger(dniDetective) || dniDetective < 1) {
      return res.status(400).json({ mensaje: 'No se identificó un DNI de detective válido.' });
    }

    const casoActual = await casos.findOne({
      where: {
        idCasos: req.params.id,
        codDetective: dniDetective,
        estado: 'ACTIVO'
      }
    });

    if (!casoActual) {
      return res.status(409).json({
        mensaje: 'El caso no existe, no te pertenece o no está activo.'
      });
    }

    casoActual.estado = 'CIERRE_PENDIENTE';
    await casoActual.save();

    res.json({ mensaje: 'Solicitud de cierre enviada a Administración.' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al solicitar el cierre del caso.',
      error: error.message
    });
  }
});

enrutador.put('/casos/:id/resolucion', soloAdmin, async (req, res) => {
  const { decision } = req.body;

  if (!['ACEPTAR', 'RECHAZAR'].includes(decision)) {
    return res.status(400).json({ mensaje: 'Decisión inválida' });
  }

  try {
    const casoActual = await casos.findOne({
      where: {
        idCasos: req.params.id,
        estado: {
          [Op.in]: ['PENDIENTE', 'CIERRE_PENDIENTE']
        }
      }
    });

    if (!casoActual) {
      return res.status(409).json({
        mensaje: 'El caso no existe o ya fue revisado.'
      });
    }

    const esSolicitudCierre = casoActual.estado === 'CIERRE_PENDIENTE';

    let nuevoEstado;
    if (esSolicitudCierre) {
      nuevoEstado = decision === 'ACEPTAR' ? 'CERRADO' : 'ACTIVO';
    } else {
      nuevoEstado = decision === 'ACEPTAR' ? 'ACTIVO' : 'RECHAZADO';
    }

    casoActual.estado = nuevoEstado;
    await casoActual.save();

    const dniDetective =
      casoActual.codDetective ||
      casoActual.dniDetective ||
      casoActual.usuarioDni;

    if (dniDetective) {
      await usuarios.update(
        { estado: nuevoEstado === 'ACTIVO' ? 'ocupado' : 'disponible' },
        { where: { dni: dniDetective } }
      );
    }

    res.json({
      mensaje: esSolicitudCierre
        ? `Solicitud de cierre ${decision === 'ACEPTAR' ? 'aceptada' : 'rechazada'}. El caso quedó ${nuevoEstado}.`
        : `Caso ${nuevoEstado.toLowerCase()} correctamente.`
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al resolver la solicitud del caso.', error });
  }
});

enrutador.get('/casos/listado', soloAdmin, async (req, res) => {
  try {
    const { zonaId } = req.query;
    const includeZona = { model: zona };

    if (zonaId) {
      const idNumerico = Number(zonaId);
      if (!Number.isInteger(idNumerico) || idNumerico < 1) {
        return res.status(400).json({ mensaje: 'Zona inválida' });
      }
      includeZona.where = { codZona: idNumerico };
      includeZona.required = true;
    }

    const listaCasos = await casos.findAll({
      include: [includeZona, { model: tipoDelito }],
      order: [['idCasos', 'DESC']]
    });
    res.json(listaCasos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener listado', error });
  }
});

enrutador.get('/casos/:id', soloDetective, async (req, res) => {
  try {
    const unCaso = await casos.findByPk(req.params.id, {
      include: [{ model: zona }, { model: tipoDelito }]
    });
    if (!unCaso) return res.status(404).json({ mensaje: 'Caso no encontrado' });
    res.json(unCaso);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el caso', error });
  }
});

enrutador.delete('/casos/:id', soloDetective, async (req, res) => {
  try {
    const borrados = await casos.destroy({ where: { idCasos: req.params.id } });
    if (borrados === 0) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
  }
});

// NUEVO POST CON CAPTURA DEL DNI DEL DETECTIVE
enrutador.post('/casos', soloDetective, async (req, res) => {
  try {
    const dniDetective = Number(req.headers['x-dni']);

    if (!Number.isInteger(dniDetective) || dniDetective < 1) {
      return res.status(400).json({
        mensaje: 'No se recibió un DNI de detective válido.'
      });
    }

    const detective = await usuarios.findOne({
      where: { dni: dniDetective, rol: 'DETECTIVE' }
    });

    if (!detective) {
      return res.status(400).json({
        mensaje: 'El DNI recibido no corresponde a un detective.'
      });
    }

    const {
      descripcion,
      direccion,
      fechaInicio,
      tipoDelitoId,
      zonaCodZona
    } = req.body;

    const nuevoCaso = await casos.create({
      descripcion,
      direccion,
      fechaInicio,
      tipoDelitoId,
      zonaCodZona,
      estado: 'PENDIENTE',
      codDetective: detective.dni
    });

    res.status(201).json(nuevoCaso);
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al crear el caso.',
      error: error.message
    });
  }
});

// ==========================================
// TUS RUTAS DE NEGOCIO Y AUDITORÍA
// ==========================================

enrutador.post('/confeccionar', async (req, res) => {
  try {
    const preCaso = await casos.create({
      ...req.body,
      estado: 'EN_VALORACION'
    });

    await auditoria.create({
      codCaso: preCaso.idCasos || preCaso.codCaso,
      accion: 'CONFECCIÓN INICIAL',
      estadoAnterior: 'INEXISTENTE',
      estadoNuevo: 'EN_VALORACION',
      dniUsuario: req.body.dniUsuario
    });

    res.status(201).json({ mensaje: 'Pre-caso enviado a valoración', caso: preCaso });
  } catch (error) {
    res.status(400).json({ error: 'Error al confeccionar' });
  }
});

enrutador.put('/:id/transicion', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nuevoEstado, dniUsuarioAuditoria, dniUsuario, motivo } = req.body;
    
    const casoActual = await casos.findByPk(req.params.id, { transaction: t });
    
    if (!casoActual) {
      await t.rollback();
      return res.status(404).json({ error: 'Caso no encontrado en la base de datos' });
    }

    const estadoViejo = casoActual.estado;
    casoActual.estado = nuevoEstado;
    await casoActual.save({ transaction: t });

    const fkDetective = casoActual.dniDetective || casoActual.codDetective || casoActual.usuarioDni;
    
    if (fkDetective) { 
      if (['EN_CURSO', 'ABIERTO', 'ACTIVO'].includes(nuevoEstado)) {
        await usuarios.update(
          { estado: 'ocupado' },
          { where: { dni: fkDetective }, transaction: t }
        );
      } 
      else if (['CERRADO', 'FINALIZADO', 'RECHAZADO'].includes(nuevoEstado)) {
        await usuarios.update(
          { estado: 'disponible' },
          { where: { dni: fkDetective }, transaction: t }
        );
      }
    }

    await auditoria.create({
      codCaso: req.params.id,
      accion: motivo || 'Cambio de estado',
      estadoAnterior: estadoViejo,
      estadoNuevo: nuevoEstado,
      dniUsuario: dniUsuarioAuditoria || dniUsuario
    }, { transaction: t });

    await t.commit();
    res.json({ mensaje: `Expediente pasó de ${estadoViejo} a ${nuevoEstado}. Detective actualizado.` });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error en la transición', detalle: error.message });
  }
});


export default enrutador;