import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const criminales = sequelize.define('criminales', {
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
    allowNull: true
  },
  tipoSangre: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true 
});