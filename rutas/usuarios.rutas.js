import { Router } from 'express';
import { usuarios} from '../clases/usuarios.js'; 

const enrutador = Router();

enrutador.get('/usuarios', async (req, res) => {
  try {
    const listaUsuarios = await usuarios.findAll();
    res.json(listaUsuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
  }
});

enrutador.get('/usuarios/:id', async (req, res) => {
  try {
    // findByPk busca por la Primary Key (tu codZona)
    const usuariosEncontrado = await usuarios.findByPk(req.params.id);
    if (!usuariosEncontrado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrada' });
    }
    res.json(usuariosEncontrado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar al usuario', error });
  }
});


enrutador.post('/usuarios', async (req, res) => {
  try {
    const nuevousuario = await usuarios.create(req.body);
    res.status(201).json(nuevousuario);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el usuario', error });
  }
});


enrutador.put('/usuarios/:id', async (req, res) => {
  try {
    const usuarioActualizado = await usuarios.update(req.body, {
      where: { dni: req.params.id } 
    });
    
    if (usuarioActualizado[0] === 0) {
      return res.status(404).json({ mensaje: 'Zona no encontrada o sin cambios' });
    }
    res.json({ mensaje: 'Zona actualizada con éxito' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar', error });
  }
});


enrutador.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuarioBorrados = await usuarios.destroy({
      where: { dni: req.params.id }
    });
    
    if (usuarioBorrados === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrada' });
    }
    res.json({ mensaje: 'Usuario eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar al usuario', error });
  }
});

export default enrutador;