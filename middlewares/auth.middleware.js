export const soloAdmin = (req, res, next) => {
  // Capturamos el rol que el frontend mandará oculto en las cabeceras
  const rolUsuario = req.headers['x-rol'];

  if (!rolUsuario) {
    return res.status(401).json({ mensaje: 'Acceso denegado: No se identificó tu rol' });
  }

  if (rolUsuario !== 'ADMIN') {
    return res.status(403).json({ mensaje: 'Acceso denegado: Área exclusiva para Administradores' });
  }

  // Si tiene el header y es ADMIN, la función next() le abre la puerta hacia la ruta original
  next();
};