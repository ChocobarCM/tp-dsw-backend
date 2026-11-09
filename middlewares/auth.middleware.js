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



//Este middleware es para que solo los fiscales puedan acceder a la pantalla de pruebas, en V2 es el detective el que accede a las pruebas, esto esta sin uso por ahora
export const soloFiscal = (req, res, next) => {
  const rolUsuario = req.headers['x-rol'];

  if (!rolUsuario) {
    return res.status(401).json({ mensaje: 'Acceso denegado: No se identificó tu rol' });
  }

  if (rolUsuario !== 'FISCAL') {
    return res.status(403).json({ mensaje: 'Acceso denegado: Área exclusiva para Fiscales' });
  }

  next();
};

//Este middleware es para que solo los detectives puedan acceder a gestion de casos y gestion de pruebas
export const soloDetective = (req, res, next) => {
  const rolUsuario = req.headers['x-rol'];

  if (!rolUsuario) {
    return res.status(401).json({ mensaje: 'Acceso denegado: No se identificó tu rol' });
  }

  if (rolUsuario !== 'DETECTIVE') {
    return res.status(403).json({ mensaje: 'Acceso denegado: Área exclusiva para Detectives' });
  }

  next();
};