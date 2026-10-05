import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const usuarios = sequelize.define('usuarios', {
  dni: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    // ENUM significa que solo puede aceptar uno de estos valores exactos
    type: DataTypes.ENUM('ADMIN', 'DETECTIVE', 'FORENSE', 'JUEZ_FISCAL'),
    allowNull: false
  }
}, {
  timestamps: true
});