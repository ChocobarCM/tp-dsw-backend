import { Router } from 'express';
import { casos } from '../clases/casos.js';
import { auditoria } from '../clases/auditoria.js';

const enrutador = Router();

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
    
    // 1. Buscamos el caso
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