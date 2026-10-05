import { Router } from 'express'
import {  tipoDelitos } from '../clases/tipoDelitos.js'

const enrutador = Router()

enrutador.get('/tipoDelitos', async(req,res) => {
    try{
        const tipoDelitos = await tipoDelitos.findAll();
        res.json(tipoDelitos);
    } catch (error){
        res.status(500).json({mensaje: 'Error al obtener Tipo Delitos'})
    }
});

enrutador.get('/tipoDelitos/:id',async (req,res) => {
    try {
        const tipoDelitos = await tipoDelitos.findByPk(req.params.id)
        if (!tipoDelitos) {
            return res.status(404).json({mensaje: 'Tipo de delito no encontrado'})
        }
        res.json(tipoDelitos);
    } catch (error) {
        res.status(500).json({ mensje: 'Error al buscar Tipo Delito'})
    }
});
