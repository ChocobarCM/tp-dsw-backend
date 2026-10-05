import express from 'express';
import cors from 'cors';
import { sequelize } from './basedatos.js';
import { configurarRelaciones } from './clases/relaciones.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 2. Ejecutás las relaciones antes de prender el motor
configurarRelaciones();

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('🕵️‍♂️ ¡Conexión a la base de datos establecida!');
    
    // 3. Esto va a crear las tablas y las claves foráneas en Workbench
    await sequelize.sync({ alter: true }); 
    console.log('🏗️ ¡Tablas y relaciones sincronizadas con éxito!');

    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar:', error);
  }
};

iniciarServidor();