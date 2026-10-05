import { Router } from 'express';
import { usuarios } from '../clases/usuarios.js';

const enrutador = Router();

enrutador.post('/login', async (req, res) => {
  // Extraemos lo que el usuario manda en el JSON
  const { dni, password } = req.body;

  try {
    // 1. Buscamos si existe alguien con ese DNI en la base de datos
    const usuarioEncontrado = await usuarios.findByPk(dni);

    // Si no lo encuentra, cortamos acá
    if (!usuarioEncontrado) {
      return res.status(404).json({ mensaje: 'Credenciales incorrectas (DNI no existe)' });
    }

    // 2. Comparamos la contraseña (por ahora en texto plano, luego la encriptamos)
    if (usuarioEncontrado.password !== password) {
      // 401 significa "No Autorizado"
      return res.status(401).json({ mensaje: 'Credenciales incorrectas (Mala contraseña)' }); 
    }

    // 3. ¡Login exitoso! Devolvemos los datos útiles (nunca devolvemos la contraseña al front)
    res.json({
      mensaje: '¡Acceso concedido a la Intranet Forense!',
      usuario: {
        dni: usuarioEncontrado.dni,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor', error });
  }
});

export default enrutador;