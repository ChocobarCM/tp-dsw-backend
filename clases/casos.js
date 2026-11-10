import { DataTypes } from 'sequelize';
import { sequelize } from '../basedatos.js';

export const casos = sequelize.define('casos', {
  idCasos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true    
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true 
});