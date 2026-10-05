import { Router } from 'express';
import { zona } from '../clases/zona.js'; 
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

enrutador.get('/zonas', async (req, res) => {
  try {
    const zonas = await zona.findAll();
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las zonas', error });
  }
});

enrutador.get('/zonas/:id', soloAdmin,async (req, res) => {
  try {
    // findByPk busca por la Primary Key (tu codZona)
    const zona = await zona.findByPk(req.params.id);
    if (!zona) {
      return res.status(404).json({ mensaje: 'Zona no encontrada' });
    }
    res.json(zona);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la zona', error });
  }
});


enrutador.post('/zonas', soloAdmin,async (req, res) => {
  try {
    const nuevaZona = await zona.create(req.body);
    res.status(201).json(nuevaZona);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la zona', error });
  }
});


enrutador.put('/zonas/:id', soloAdmin,async (req, res) => {
  try {
    const zonaActualizada = await zona.update(req.body, {
      where: { codZona: req.params.id } 
    });
    
    if (zonaActualizada[0] === 0) {
      return res.status(404).json({ mensaje: 'Zona no encontrada o sin cambios' });
    }
    res.json({ mensaje: 'Zona actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});


enrutador.delete('/zonas/:id', soloAdmin,async (req, res) => {
  try {
    const borrados = await zona.destroy({
      where: { codZona: req.params.id }
    });
    
    if (borrados === 0) {
      return res.status(404).json({ mensaje: 'Zona no encontrada' });
    }
    res.json({ mensaje: 'Zona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
  }
});

export default enrutador;