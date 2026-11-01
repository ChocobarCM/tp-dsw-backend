import { Router } from 'express';
import { pruebas } from '../clases/pruebas.js';
import { casos } from '../clases/casos.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

// 1. Obtener todas las pruebas (incluye el Caso asociado)
enrutador.get('/pruebas', async (req, res) => {
  try {
    const listaPruebas = await pruebas.findAll({
      include: [{ model: casos }
        
      ]
    });
    res.json(listaPruebas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las pruebas', error });
  }
});

// 2. Obtener una prueba por ID
enrutador.get('/pruebas/:id', async (req, res) => {
  try {
    const unaPrueba = await pruebas.findByPk(req.params.id, {
      include: [{ model: casos }]
    });
    if (!unaPrueba) {
      return res.status(404).json({ mensaje: 'Prueba no encontrada' });
    }
    res.json(unaPrueba);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la prueba', error });
  }
});

// 3. Crear una nueva prueba vinculada a un caso
enrutador.post('/pruebas', soloAdmin, async (req, res) => {
  try {
    const nuevaPrueba = await pruebas.create(req.body);
    res.status(201).json(nuevaPrueba);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear la prueba', error });
  }
});

// 4. Actualizar una prueba por ID (e.j. agregar resultado)
enrutador.put('/pruebas/:id', soloAdmin, async (req, res) => {
  try {
    const pruebaActualizada = await pruebas.update(req.body, {
      where: { idpruebas: req.params.id }
    });
    if (pruebaActualizada[0] === 0) {
      return res.status(404).json({ mensaje: 'Prueba no encontrada' });
    }
    res.json({ mensaje: 'Prueba actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la prueba', error });
  }
});

// 5. Eliminar una prueba por ID
enrutador.delete('/pruebas/:id', soloAdmin, async (req, res) => {
  try {
    const borradas = await pruebas.destroy({
      where: { idpruebas: req.params.id }
    });
    if (borradas === 0) {
      return res.status(404).json({ mensaje: 'Prueba no encontrada' });
    }
    res.json({ mensaje: 'Prueba eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar la prueba', error });
  }
});

export default enrutador;