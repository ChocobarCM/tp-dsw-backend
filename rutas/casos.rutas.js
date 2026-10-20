import { Router } from 'express';
import { caso } from '../clases/casos.js';
import { zona } from '../clases/zona.js';
import { tipoDelito } from '../clases/tipoDelitos.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';

const enrutador = Router();

enrutador.get('/casos', async (req, res) => {
  try {
    const listaCasos = await caso.findAll({
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

enrutador.get('/casos/:id',async (req,res) => {
    try {
        const unCaso = await caso.findByPk(req.params.id, {include: zona});
        if (!unCaso) {
            return res.status(404).json({mensaje: 'Caso no encontrado'});
        }
        res.json(unCaso);
    } catch (error) {
        res.status(500).json({ mensje: 'Error al buscar el Caso'});
    }
});

enrutador.post('/casos', soloAdmin, async (req, res) => {
  try {
    const nuevoCaso = await caso.create(req.body);
    res.status(201).json(nuevoCaso);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el caso', error });
  }
});

enrutador.put('/casos/:id', soloAdmin, async (req, res) => {
  try {
    const casoActualizado = await caso.update(req.body, {
      where: { codCaso: req.params.id }
    });
    if (casoActualizado[0] === 0) return res.status(404).json({ mensaje: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso actualizado con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});

enrutador.delete('/casos/:id', soloAdmin, async (req, res) => {
  try {
    const borrados = await caso.destroy({ where: { codCaso: req.params.id } });
    if (borrados === 0) return res.status(404).json({ mensaje: 'Caso no encontrado' });
    res.json({ mensaje: 'Caso eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar', error });
  }
});

export default enrutador;