import { Router } from 'express';
import { orden } from '../clases/orden.js'; 
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

enrutador.get('/ordenes', async (req, res) => {
  try {
    const ordenes = await orden.findAll();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las ordenes', error });
  }
});

enrutador.get('/ordenes/:id',async (req, res) => {
  try {
    const unaOrden = await orden.findByPk(req.params.id);
    if (!unaOrden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la orden', error });
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

export default enrutador;