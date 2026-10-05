import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const pruebas = sequelize.define('pruebas', {
  idpruebas: {
  type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true     
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resultado: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true 
});