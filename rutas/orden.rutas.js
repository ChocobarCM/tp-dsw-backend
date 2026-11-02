import { Router } from 'express';
import { orden } from '../clases/orden.js'; 
import { casos } from '../clases/casos.js';
import { pruebas } from '../clases/pruebas.js';
import { auditoria } from '../clases/auditoria.js';
import { fiscalia } from '../clases/fiscalia.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

enrutador.get('/ordenes', async (req, res) => {
  try {
    const { estadoOrden } = req.query;
    const condicion = {};
    
    if (estadoOrden) {
      condicion.estadoOrden = estadoOrden;
    }

    const ordenes = await orden.findAll({
      where: condicion,
      include: [
        { model: casos },
        { model: fiscalia }
      ]
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las ordenes', error: error.message });
  }
});

enrutador.get('/ordenes/:id', async (req, res) => {
  try {
    const unaOrden = await orden.findByPk(req.params.id, {
      include: [
        { model: casos },
        { model: fiscalia }
      ]
    });
    if (!unaOrden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    res.json(unaOrden); // Corregido: antes decía res.json(orden)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la orden', error: error.message });
  }
});


enrutador.post('/ordenes', soloAdmin,async (req, res) => {
  try {
    const nuevaOrden = await orden.create(req.body);
    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la orden', error });
  }
});


enrutador.put('/ordenes/:id', soloAdmin,async (req, res) => {
  try {
    const ordenActualizada = await orden.update(req.body, {
      where: { idOrden: req.params.id } 
    });
    
    if (ordenActualizada[0] === 0) {
      return res.status(404).json({ mensaje: 'Orden no encontrada o sin cambios' });
    }
    res.json({ mensaje: 'Orden actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});


enrutador.delete('/ordenes/:id', soloAdmin,async (req, res) => {
  try {
    const borrados = await orden.destroy({
      where: { idOrden: req.params.id }
    });
    
    if (borrados === 0) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
  }
});

enrutador.post('/ordenes/solicitar', async (req, res) => {
  try {
    const { codCaso, idFiscalia, tipoOrden, descripcion, dniUsuario } = req.body;

    const casoActual = await casos.findByPk(codCaso);
    if (!casoActual || casoActual.estado !== 'ABIERTO') {
      return res.status(400).json({ error: 'El caso debe existir y estar ABIERTO para pedir una orden.' });
    }

    const cantPruebas = await pruebas.count({ where: { casoIdCasos: codCaso } });
    if (cantPruebas === 0) {
      return res.status(400).json({ error: 'Sustento insuficiente: Se requiere al menos 1 prueba cargada.' });
    }

    const nuevaOrden = await orden.create({
      tipoOrden,
      descripcion,
      fechaSolicitud: new Date(),
      estadoOrden: 'PENDIENTE',
      casoIdCasos: codCaso,
      fiscaliumIdFiscalia: idFiscalia
    });

    const estadoViejo = casoActual.estado;
    casoActual.estado = 'PENDIENTE_ORDEN';
    await casoActual.save();

    await auditoria.create({
      codCaso: codCaso,
      accion: `SOLICITUD DE ORDEN (${tipoOrden})`,
      estadoAnterior: estadoViejo,
      estadoNuevo: 'PENDIENTE_ORDEN',
      dniUsuario: dniUsuario
    });

    res.status(201).json({ mensaje: 'Orden solicitada a Fiscalía. Caso en espera.', orden: nuevaOrden });
  } catch (error) {
    console.error("🔥 Error al solicitar orden:", error);
    res.status(500).json({ error: 'Error al procesar solicitud de orden', detalle: error.message });
  }
});

// PASO B: FISCAL aprueba o rechaza la orden
enrutador.put('/ordenes/:idOrden/evaluar', async (req, res) => {
  try {
    const { resolucion, dniFiscal, motivo } = req.body; 
    
    const ordenActual = await orden.findByPk(req.params.idOrden);
    if (!ordenActual || ordenActual.estadoOrden !== 'PENDIENTE') {
      return res.status(400).json({ error: 'La orden no existe o ya fue evaluada.' });
    }

    const casoActual = await casos.findByPk(ordenActual.casoIdCasos);

    ordenActual.estadoOrden = resolucion;
    ordenActual.fechaAdmision = new Date();
    await ordenActual.save();

    const estadoViejo = casoActual.estado;
    casoActual.estado = 'ABIERTO';
    await casoActual.save();

    await auditoria.create({
      codCaso: casoActual.idCasos || casoActual.codCaso,
      accion: `ORDEN ${resolucion}: ${motivo || 'Sin observaciones'}`,
      estadoAnterior: estadoViejo,
      estadoNuevo: 'ABIERTO',
      dniUsuario: dniFiscal
    });

    res.json({ mensaje: `Orden ${resolucion}. El expediente vuelve a estar ABIERTO.` });
  } catch (error) {
    console.error("🔥 Error al evaluar orden:", error);
    res.status(500).json({ error: 'Error al evaluar la orden', detalle: error.message });
  }
});

export default enrutador;