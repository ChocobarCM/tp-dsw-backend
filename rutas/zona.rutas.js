import { Router } from 'express';
import { Zona } from '../clases/zona.js'; 

const enrutador = Router();

enrutador.get('/zonas', async (req, res) => {
  try {
    const zonas = await Zona.findAll();
    res.json(zonas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las zonas', error });
  }
});

enrutador.get('/zonas/:id', async (req, res) => {
  try {
    // findByPk busca por la Primary Key (tu codZona)
    const zona = await Zona.findByPk(req.params.id);
    if (!zona) {
      return res.status(404).json({ mensaje: 'Zona no encontrada' });
    }
    res.json(zona);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la zona', error });
  }
});


enrutador.post('/zonas', async (req, res) => {
  try {
    const nuevaZona = await Zona.create(req.body);
    res.status(201).json(nuevaZona);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la zona', error });
  }
});


enrutador.put('/zonas/:id', async (req, res) => {
  try {
    const zonaActualizada = await Zona.update(req.body, {
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


enrutador.delete('/zonas/:id', async (req, res) => {
  try {
    const borrados = await Zona.destroy({
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