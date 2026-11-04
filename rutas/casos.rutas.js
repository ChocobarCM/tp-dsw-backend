import { Router } from 'express';
import { casos } from '../clases/casos.js';
import { auditoria } from '../clases/auditoria.js';
import { zona } from '../clases/zona.js'; 
import { tipoDelito } from '../clases/tipoDelitos.js'; 
import { soloAdmin, soloDetective } from '../middlewares/auth.middleware.js';

const enrutador = Router();

// ==========================================
// RUTAS ESTÁNDAR (SANTIAGO)
// ==========================================

enrutador.get('/casos', soloDetective , async (req, res) => {
  try {
    const listaCasos = await casos.findAll({
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

enrutador.get('/casos/pendientes', soloAdmin, async (req, res) => {
  try {
    const pendientes = await casos.findAll({
      where: { estado: 'PENDIENTE' },
      include: [{ model: tipoDelito }]
    });

    res.json(pendientes);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener los casos pendientes',
      error
    });
  }
});

enrutador.put('/casos/:id/resolucion', soloAdmin, async (req, res) => {
  const { decision } = req.body;

  if (!['ACEPTAR', 'RECHAZAR'].includes(decision)) {
    return res.status(400).json({
      mensaje: 'La decisión debe ser ACEPTAR o RECHAZAR'
    });
  }

  try {
    const nuevoEstado = decision === 'ACEPTAR' ? 'ACTIVO' : 'RECHAZADO';

    const [actualizados] = await casos.update(
      { estado: nuevoEstado },
      {
        where: {
          idCasos: req.params.id,
          estado: 'PENDIENTE'
        }
      }
    );

    if (actualizados === 0) {
      return res.status(409).json({
        mensaje: 'El caso no existe o ya fue revisado'
      });
    }

    res.json({ mensaje: `Caso ${nuevoEstado.toLowerCase()} correctamente` });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al resolver el caso',
      error
    });
  }
});

enrutador.get('/casos/:id', soloDetective, async (req, res) => {
  try {
    const unCaso = await casos.findByPk(req.params.id, {
      include: [
        { model: zona },
        { model: tipoDelito }
      ]
    });

    if (!unCaso) {
      return res.status(404).json({ mensaje: 'Caso no encontrado' });
    }

    res.json(unCaso);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el caso', error });
  }
});

enrutador.post('/casos', soloDetective , async (req, res) => {
  try {
    const nuevoCaso = await casos.create({ ...req.body, estado: 'PENDIENTE' });
    res.status(201).json(nuevoCaso);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear' });
  }
});

enrutador.put('/casos/:id', soloDetective , async (req, res) => {
  try {
    const { descripcion, direccion, fechaInicio, tipoDelitoId } = req.body;
    const casoActualizado = await casos.update( { descripcion, direccion, fechaInicio, tipoDelitoId }, {
      where: { idCasos: req.params.id }
    });
    if (casoActualizado[0] === 0) return res.status(404).json({ mensaje: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso actualizado con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});

enrutador.delete('/casos/:id', soloDetective , async (req, res) => {
  try {
    const borrados = await casos.destroy({ where: { idCasos: req.params.id } });
    if (borrados === 0) return res.status(404).json({ mensaje: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
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
      codCaso: preCaso.codCaso,
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
  try {
    const { nuevoEstado, dniUsuario, motivo } = req.body;
    
    const casoActual = await casos.findByPk(req.params.id);
    
    if (!casoActual) {
      return res.status(404).json({ error: 'Caso no encontrado en la base de datos' });
    }

    const estadoViejo = casoActual.estado;

    casoActual.estado = nuevoEstado;
    await casoActual.save();

    await auditoria.create({
      codCaso: req.params.id,
      accion: motivo || 'Cambio de estado',
      estadoAnterior: estadoViejo,
      estadoNuevo: nuevoEstado,
      dniUsuario: dniUsuario
    });

    res.json({ mensaje: `Expediente pasó de ${estadoViejo} a ${nuevoEstado}` });
  } catch (error) {
    console.error("🔥 Error real de Sequelize:", error); 
    res.status(500).json({ error: 'Error en la transición', detalle: error.message });
  }
});

export default enrutador;