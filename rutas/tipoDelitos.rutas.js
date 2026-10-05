import { Router } from 'express'
import {  tipoDelito } from '../clases/tipoDelitos.js'

const enrutador = Router()

enrutador.get('/tipoDelitos', async(req,res) => {
    try{
        const listaTDelitos = await tipoDelito.findAll();
        res.json(listaTDelitos);
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener Tipo Delitos'});
    }
});

enrutador.get('/tipoDelitos/:id',async (req,res) => {
    try {
        const encontradoTipoDelitos = await tipoDelito.findByPk(req.params.id);
        if (!encontradoTipoDelitos) {
            return res.status(404).json({mensaje: 'Tipo de delito no encontrado'});
        }
        res.json(encontradoTipoDelitos);
    } catch (error) {
        res.status(500).json({ mensje: 'Error al buscar Tipo Delito'});
    }
});

enrutador.post('/tipoDelitos', async(req,res) =>{
    try {
        const nuevoTipoDelito = await tipoDelito.create(req.body);
        res.status(201).json(nuevoTipoDelito);
    } catch (error) {
        res.status(400).json({ mensaje : 'No se pudo crear el tipo delito', error});
    }
});

enrutador.put('/tipoDelitos/:id', async (req, res) => {
    try {
        const tipoDelitosActualizado = await tipoDelito.updates(req.body ,{
            where: {codigoTD: req.params.id }
        });
        if ( tipoDelitosActualizado [0] === 0) {
            return res.status(404).json({ mensaje: 'tipo Delito no encontrado o sin cambios'});
        }
        res.json({mensaje: 'tipo Delito actualizado con exito'});
    } catch(error) {
        res.status(400).json({mensaje:'Error al actualizarlo', error});
    }
});

enrutador.delete('/tipoDelitos/:id', async(req, res) => {
    try {
        const borrados = await tipoDelito.destroy({
            where : { codigoTD: req.params.id}
        });
        
        if( borrados === 0) {
            return  res.status(404).json({mensaje: 'Tipo Delito no ecnontrado'});
        }
        res.json({ mensaje: 'Tipo Delito eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', error });
  }
});

export default enrutador;