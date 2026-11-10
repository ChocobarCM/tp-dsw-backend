import express from 'express';
import cors from 'cors';
import { sequelize } from './basedatos.js';
import { configurarRelaciones } from './clases/relaciones.js';
import { usuarios } from './clases/usuarios.js';
import rutasAuth from './rutas/auth.rutas.js';
import zonarutas from './rutas/zona.rutas.js';
import rutasTipoDelitos from './rutas/tipoDelitos.rutas.js';
import rutasUsuarios from './rutas/usuarios.rutas.js';
import rutaPruebas from './rutas/pruebas.rutas.js';
import rutasCasos from './rutas/casos.rutas.js';
import rutasOrden from './rutas/orden.rutas.js';
import rutasFiscalia from './rutas/fiscalia.rutas.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', zonarutas);
app.use('/api', rutasTipoDelitos);
app.use('/api', rutasUsuarios);
app.use('/api', rutasAuth);
app.use('/api', rutaPruebas);
// Dejamos ambos prefijos como tenía tu compañero para que funcionen tanto '/api/casos' como '/api/casos/:id/transicion'
app.use('/api', rutasCasos);
app.use('/api/casos', rutasCasos);
app.use('/api', rutasOrden);
app.use('/api', rutasFiscalia);

configurarRelaciones();

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log('🕵️‍♂️ ¡Conexión a la base de datos establecida!');
    
    // Actualiza la estructura de las tablas automáticamente sin borrar datos
    await sequelize.sync({ alter: true });
    console.log('🚧 ¡Tablas y relaciones sincronizadas con éxito!');

    const cantidadUsuarios = await usuarios.count();
    
    if (cantidadUsuarios === 0) {
      await usuarios.bulkCreate([
        { dni: 11111111, nombre: 'Carlos Máximo', apellido: 'Chocobar', rol: 'ADMIN', password: 'admin123', estado: 'disponible' },
        { dni: 22222222, nombre: 'Vince', apellido: 'Masuka', rol: 'FORENSE', password: 'blood', estado: 'disponible' },
        { dni: 33333333, nombre: 'James', apellido: 'Doakes', rol: 'DETECTIVE', password: 'surprise', estado: 'disponible' }
      ]);
      console.log('🌱 Semillas plantadas: Usuarios por defecto creados exitosamente.');
    } 

    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar:', error);
  }
};

iniciarServidor();