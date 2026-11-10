import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const tipoDelito = sequelize.define('tipoDelito', {
  codigoTD: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true   
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true 
});