import { Router } from 'express';
import { fiscalia } from '../clases/fiscalia.js'; 
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

enrutador.get('/fiscalias', async (req, res) => {
  try {
    const fiscalias = await fiscalia.findAll();
    res.json(fiscalias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las fiscalias', error });
  }
});

enrutador.get('/fiscalias/:id',async (req, res) => {
  try {
    const unaFiscalia = await fiscalia.findByPk(req.params.id);
    if (!unaFiscalia) {
      return res.status(404).json({ mensaje: 'Fiscalia no encontrada' });
    }
    res.json(fiscalia);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la fiscalia', error });
  }
});


enrutador.post('/fiscalias', soloAdmin,async (req, res) => {
  try {
    const nuevaFiscalia = await fiscalia.create(req.body);
    res.status(201).json(nuevaFiscalia);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la fiscalia', error });
  }
});


enrutador.put('/fiscalias/:id', soloAdmin,async (req, res) => {
  try {
    const fiscaliaActualizada = await fiscalia.update(req.body, {
      where: { idFiscalia: req.params.id } 
    });
    
    if (fiscaliaActualizada[0] === 0) {
      return res.status(404).json({ mensaje: 'Fiscalia no encontrada o sin cambios' });
    }
    res.json({ mensaje: 'Fiscalia actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});


enrutador.delete('/fiscalias/:id', soloAdmin,async (req, res) => {
  try {
    const borrados = await fiscalia.destroy({
      where: { idFiscalia: req.params.id }
    });
    
    if (borrados === 0) {
      return res.status(404).json({ mensaje: 'Fiscalia no encontrada' });
    }
    res.json({ mensaje: 'Fiscalia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
  }
});

export default enrutador;